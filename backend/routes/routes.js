const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/routes
// @desc    Get all routes with optional filtering
// @access  Public
router.get('/', [
  query('search').optional().trim(),
  query('from').optional().trim(),
  query('to').optional().trim(),
  query('type').optional().isIn(['standard', 'ac', 'deluxe', 'sleeper']),
  query('popular').optional().isBoolean(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      search, 
      from, 
      to, 
      type, 
      popular, 
      limit = 20, 
      page = 1 
    } = req.query;

    let query = { status: 'active' };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Location-based search
    if (from && to) {
      query.$or = [
        {
          'startLocation.name': { $regex: from, $options: 'i' },
          'endLocation.name': { $regex: to, $options: 'i' }
        },
        {
          'startLocation.name': { $regex: to, $options: 'i' },
          'endLocation.name': { $regex: from, $options: 'i' }
        }
      ];
    }

    // Bus type filter
    if (type) {
      query['busTypes.type'] = type;
    }

    // Popular routes filter
    if (popular === 'true') {
      query.isPopular = true;
    }

    const skip = (page - 1) * limit;
    
    const routes = await Route.find(query)
      .sort({ popularity: -1, rating: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('stops', 'name coordinates address');

    const total = await Route.countDocuments(query);

    res.json({
      routes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/routes/:id
// @desc    Get route by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json(route);
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/routes/search/suggestions
// @desc    Get route search suggestions
// @access  Public
router.get('/search/suggestions', [
  query('q').trim().isLength({ min: 2 }).withMessage('Query must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { q } = req.query;
    
    const routes = await Route.find({
      status: 'active',
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { routeNumber: { $regex: q, $options: 'i' } },
        { 'startLocation.name': { $regex: q, $options: 'i' } },
        { 'endLocation.name': { $regex: q, $options: 'i' } },
        { 'stops.name': { $regex: q, $options: 'i' } }
      ]
    })
    .select('routeNumber name startLocation endLocation')
    .limit(10);

    res.json(routes);
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/routes/popular
// @desc    Get popular routes
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const routes = await Route.find({ 
      status: 'active',
      isPopular: true 
    })
    .sort({ popularity: -1 })
    .limit(10)
    .select('routeNumber name startLocation endLocation fare images rating');

    res.json(routes);
  } catch (error) {
    console.error('Get popular routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/routes/nearby
// @desc    Get routes near a location
// @access  Public
router.get('/nearby', [
  query('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  query('lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  query('radius').optional().isFloat({ min: 0.1, max: 50 }).withMessage('Radius must be between 0.1 and 50 km')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { lat, lng, radius = 5 } = req.query;

    const routes = await Route.find({
      status: 'active',
      $or: [
        {
          'startLocation.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
              },
              $maxDistance: radius * 1000 // Convert km to meters
            }
          }
        },
        {
          'endLocation.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
              },
              $maxDistance: radius * 1000
            }
          }
        },
        {
          'stops.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
              },
              $maxDistance: radius * 1000
            }
          }
        }
      ]
    })
    .limit(20);

    res.json(routes);
  } catch (error) {
    console.error('Get nearby routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/routes/:id/rate
// @desc    Rate a route
// @access  Private
router.post('/:id/rate', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Review must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { rating, review } = req.body;
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Update rating
    const newRatingCount = route.rating.count + 1;
    const newAverageRating = ((route.rating.average * route.rating.count) + rating) / newRatingCount;

    route.rating.average = Math.round(newAverageRating * 10) / 10; // Round to 1 decimal
    route.rating.count = newRatingCount;

    await route.save();

    res.json({ 
      message: 'Rating submitted successfully',
      rating: route.rating
    });
  } catch (error) {
    console.error('Rate route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/routes/:id/schedule
// @desc    Get route schedule
// @access  Public
router.get('/:id/schedule', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json({
      routeNumber: route.routeNumber,
      name: route.name,
      schedule: route.schedule,
      busTypes: route.busTypes
    });
  } catch (error) {
    console.error('Get route schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/routes/:id/buses
// @desc    Get buses for a route
// @access  Public
router.get('/:id/buses', async (req, res) => {
  try {
    const buses = await Bus.find({ 
      routeId: req.params.id,
      currentStatus: 'active'
    })
    .select('busNumber busType capacity currentLocation currentStatus amenities')
    .populate('routeId', 'routeNumber name');

    res.json(buses);
  } catch (error) {
    console.error('Get route buses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
