const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Bus = require('../models/Bus');
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/buses
// @desc    Get all buses with optional filtering
// @access  Public
router.get('/', [
  query('routeId').optional().isMongoId().withMessage('Invalid route ID'),
  query('status').optional().isIn(['active', 'inactive', 'maintenance', 'breakdown']),
  query('type').optional().isIn(['standard', 'ac', 'deluxe', 'sleeper']),
  query('lat').optional().isFloat({ min: -90, max: 90 }),
  query('lng').optional().isFloat({ min: -180, max: 180 }),
  query('radius').optional().isFloat({ min: 0.1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { routeId, status, type, lat, lng, radius } = req.query;
    
    let query = { isActive: true };

    if (routeId) {
      query.routeId = routeId;
    }

    if (status) {
      query.currentStatus = status;
    }

    if (type) {
      query.busType = type;
    }

    // Location-based search
    if (lat && lng && radius) {
      query['currentLocation.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const buses = await Bus.find(query)
      .populate('routeId', 'routeNumber name startLocation endLocation')
      .select('-maintenance -performance')
      .sort({ 'currentLocation.lastUpdated': -1 });

    res.json(buses);
  } catch (error) {
    console.error('Get buses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/buses/:id
// @desc    Get bus by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .populate('routeId', 'routeNumber name startLocation endLocation stops');

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json(bus);
  } catch (error) {
    console.error('Get bus error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/buses/:id/live-tracking
// @desc    Get live tracking data for a bus
// @access  Public
router.get('/:id/live-tracking', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .populate('routeId', 'routeNumber name stops')
      .populate('currentTrip.tripId', 'status progress');

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const trackingData = {
      busId: bus._id,
      busNumber: bus.busNumber,
      route: bus.routeId,
      currentLocation: bus.currentLocation,
      status: bus.currentStatus,
      operationalStatus: bus.operationalStatus,
      currentTrip: bus.currentTrip,
      amenities: bus.amenities,
      lastUpdate: bus.tracking.lastUpdate,
      isLive: bus.tracking.isLive
    };

    res.json(trackingData);
  } catch (error) {
    console.error('Get live tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/buses/:id/location
// @desc    Update bus location (for drivers/admin)
// @access  Private
router.post('/:id/location', [
  auth,
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  body('address').optional().trim(),
  body('speed').optional().isFloat({ min: 0, max: 200 }).withMessage('Speed must be between 0 and 200 km/h'),
  body('direction').optional().isFloat({ min: 0, max: 360 }).withMessage('Direction must be between 0 and 360 degrees')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { latitude, longitude, address, speed, direction } = req.body;
    
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Update location
    bus.updateLocation(latitude, longitude, address);
    
    if (speed !== undefined) {
      bus.currentTrip.speed = speed;
    }
    
    if (direction !== undefined) {
      bus.currentTrip.direction = direction;
    }

    await bus.save();

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    io.to(`route-${bus.routeId}`).emit('bus-location-update', {
      busId: bus._id,
      busNumber: bus.busNumber,
      location: bus.currentLocation,
      speed: bus.currentTrip.speed,
      timestamp: new Date()
    });

    res.json({ 
      message: 'Location updated successfully',
      location: bus.currentLocation
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/buses/:id/passengers
// @desc    Update passenger count (for conductors/admin)
// @access  Private
router.post('/:id/passengers', [
  auth,
  body('boarding').isInt({ min: 0 }).withMessage('Boarding count must be non-negative'),
  body('alighting').isInt({ min: 0 }).withMessage('Alighting count must be non-negative')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { boarding, alighting } = req.body;
    
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Update passenger count
    bus.updatePassengers(boarding, alighting);
    await bus.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`route-${bus.routeId}`).emit('passenger-update', {
      busId: bus._id,
      busNumber: bus.busNumber,
      passengers: bus.currentTrip.passengers,
      occupancy: bus.currentTrip.occupancy,
      timestamp: new Date()
    });

    res.json({ 
      message: 'Passenger count updated successfully',
      passengers: bus.currentTrip.passengers,
      occupancy: bus.currentTrip.occupancy
    });
  } catch (error) {
    console.error('Update passengers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/buses/:id/status
// @desc    Update bus status (for drivers/admin)
// @access  Private
router.post('/:id/status', [
  auth,
  body('status').isIn(['active', 'inactive', 'maintenance', 'breakdown']).withMessage('Invalid status'),
  body('operationalStatus').optional().isIn(['on-time', 'delayed', 'early', 'not-started', 'completed']),
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, operationalStatus, reason } = req.body;
    
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    bus.currentStatus = status;
    
    if (operationalStatus) {
      bus.operationalStatus = operationalStatus;
    }

    await bus.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`route-${bus.routeId}`).emit('bus-status-update', {
      busId: bus._id,
      busNumber: bus.busNumber,
      status: bus.currentStatus,
      operationalStatus: bus.operationalStatus,
      reason,
      timestamp: new Date()
    });

    res.json({ 
      message: 'Status updated successfully',
      status: bus.currentStatus,
      operationalStatus: bus.operationalStatus
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/buses/route/:routeId/live
// @desc    Get all live buses for a route
// @access  Public
router.get('/route/:routeId/live', async (req, res) => {
  try {
    const buses = await Bus.find({
      routeId: req.params.routeId,
      currentStatus: 'active',
      'tracking.isLive': true
    })
    .populate('routeId', 'routeNumber name')
    .select('busNumber currentLocation currentTrip operationalStatus amenities tracking');

    res.json(buses);
  } catch (error) {
    console.error('Get live buses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
