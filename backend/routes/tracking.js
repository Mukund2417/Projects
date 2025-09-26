const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tracking/live
// @desc    Get live tracking data for all buses
// @access  Public
router.get('/live', async (req, res) => {
  try {
    const Bus = require('../models/Bus');
    const buses = await Bus.find({
      currentStatus: 'active',
      'tracking.isLive': true
    })
    .populate('routeId', 'routeNumber name startLocation endLocation')
    .select('busNumber currentLocation currentTrip operationalStatus amenities tracking');

    res.json(buses);
  } catch (error) {
    console.error('Get live tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tracking/route/:routeId
// @desc    Get live tracking for a specific route
// @access  Public
router.get('/route/:routeId', async (req, res) => {
  try {
    const Bus = require('../models/Bus');
    const buses = await Bus.find({
      routeId: req.params.routeId,
      currentStatus: 'active',
      'tracking.isLive': true
    })
    .populate('routeId', 'routeNumber name stops')
    .select('busNumber currentLocation currentTrip operationalStatus amenities tracking');

    res.json(buses);
  } catch (error) {
    console.error('Get route tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tracking/alert
// @desc    Set up tracking alert for a bus
// @access  Private
router.post('/alert', [
  auth,
  body('busId').isMongoId().withMessage('Valid bus ID required'),
  body('stopId').isMongoId().withMessage('Valid stop ID required'),
  body('alertType').isIn(['arrival', 'departure', 'delay']).withMessage('Valid alert type required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { busId, stopId, alertType } = req.body;
    
    // In a real implementation, you would store this alert and notify when conditions are met
    const alert = {
      userId: req.user.userId,
      busId,
      stopId,
      alertType,
      createdAt: new Date(),
      isActive: true
    };

    res.json({
      message: 'Alert set up successfully',
      alert
    });
  } catch (error) {
    console.error('Set tracking alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
