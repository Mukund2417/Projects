const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', [
  auth,
  body('routeId').isMongoId().withMessage('Valid route ID required'),
  body('busId').isMongoId().withMessage('Valid bus ID required'),
  body('passengers').isArray({ min: 1 }).withMessage('At least one passenger required'),
  body('passengers.*.name').trim().isLength({ min: 2 }).withMessage('Passenger name must be at least 2 characters'),
  body('passengers.*.age').isInt({ min: 1, max: 120 }).withMessage('Valid age required'),
  body('passengers.*.gender').isIn(['male', 'female', 'other']).withMessage('Valid gender required'),
  body('journey.from.name').trim().isLength({ min: 2 }).withMessage('From location required'),
  body('journey.to.name').trim().isLength({ min: 2 }).withMessage('To location required'),
  body('journey.date').isISO8601().withMessage('Valid date required'),
  body('journey.departureTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required'),
  body('payment.method').isIn(['card', 'upi', 'wallet', 'cash', 'netbanking']).withMessage('Valid payment method required')
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
      routeId,
      busId,
      passengers,
      journey,
      payment
    } = req.body;

    // Verify route exists
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Verify bus exists and is available
    const bus = await Bus.findById(busId);
    if (!bus || bus.currentStatus !== 'active') {
      return res.status(404).json({ message: 'Bus not available' });
    }

    // Create booking
    const booking = new Booking({
      userId: req.user.userId,
      routeId,
      busId,
      passengers,
      journey: {
        ...journey,
        date: new Date(journey.date)
      },
      fare: {
        base: route.fare.base,
        total: 0, // Will be calculated
        finalAmount: 0
      },
      payment: {
        method: payment.method,
        status: 'pending'
      }
    });

    // Calculate fare
    booking.calculateFare();

    // Save booking
    await booking.save();

    // Populate booking details
    await booking.populate([
      { path: 'routeId', select: 'routeNumber name startLocation endLocation' },
      { path: 'busId', select: 'busNumber busType capacity' }
    ]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', [
  auth,
  query('status').optional().isIn(['confirmed', 'cancelled', 'completed', 'no-show']),
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

    const { status, limit = 20, page = 1 } = req.query;
    
    let query = { userId: req.user.userId };
    
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    
    const bookings = await Booking.find(query)
      .populate('routeId', 'routeNumber name startLocation endLocation')
      .populate('busId', 'busNumber busType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId
    })
    .populate('routeId', 'routeNumber name startLocation endLocation stops')
    .populate('busId', 'busNumber busType capacity amenities')
    .populate('tripId', 'status progress');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.post('/:id/cancel', [
  auth,
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason must be less than 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reason } = req.body;
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    // Check if cancellation is allowed (e.g., not too close to departure)
    const hoursUntilDeparture = (booking.journey.date.getTime() - Date.now()) / (1000 * 60 * 60);
    
    if (hoursUntilDeparture < 1) {
      return res.status(400).json({ message: 'Cannot cancel booking less than 1 hour before departure' });
    }

    // Cancel booking
    booking.cancelBooking(reason);
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      refundAmount: booking.cancellation.refundAmount,
      cancellationFee: booking.cancellation.cancellationFee
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings/:id/payment
// @desc    Process payment for booking
// @access  Private
router.post('/:id/payment', [
  auth,
  body('transactionId').trim().isLength({ min: 1 }).withMessage('Transaction ID required'),
  body('gateway').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { transactionId, gateway } = req.body;
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.payment.status === 'completed') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    // Update payment status
    booking.payment.status = 'completed';
    booking.payment.transactionId = transactionId;
    booking.payment.gateway = gateway || 'stripe';
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';

    await booking.save();

    // Generate tickets
    const QRCode = require('qrcode');
    for (let i = 0; i < booking.passengers.length; i++) {
      const ticketId = `TKT-${booking.bookingId}-${i + 1}`;
      const qrCode = await QRCode.toDataURL(ticketId);
      
      booking.tickets.push({
        ticketId,
        qrCode
      });
    }

    await booking.save();

    res.json({
      message: 'Payment processed successfully',
      booking: booking.toJSON()
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings/:id/rate
// @desc    Rate a completed trip
// @access  Private
router.post('/:id/rate', [
  auth,
  body('overall').isInt({ min: 1, max: 5 }).withMessage('Overall rating must be between 1 and 5'),
  body('punctuality').isInt({ min: 1, max: 5 }).withMessage('Punctuality rating must be between 1 and 5'),
  body('cleanliness').isInt({ min: 1, max: 5 }).withMessage('Cleanliness rating must be between 1 and 5'),
  body('comfort').isInt({ min: 1, max: 5 }).withMessage('Comfort rating must be between 1 and 5'),
  body('driver').isInt({ min: 1, max: 5 }).withMessage('Driver rating must be between 1 and 5'),
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

    const { overall, punctuality, cleanliness, comfort, driver, review } = req.body;
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed trips' });
    }

    if (booking.rating.overall) {
      return res.status(400).json({ message: 'Trip already rated' });
    }

    // Update rating
    booking.rating = {
      overall,
      punctuality,
      cleanliness,
      comfort,
      driver,
      review,
      ratedAt: new Date()
    };

    await booking.save();

    res.json({
      message: 'Rating submitted successfully',
      rating: booking.rating
    });
  } catch (error) {
    console.error('Rate trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/stats/summary
// @desc    Get booking statistics for user
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const stats = await Booking.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          completedTrips: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledTrips: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          totalSpent: { $sum: '$fare.finalAmount' },
          averageRating: { $avg: '$rating.overall' }
        }
      }
    ]);

    const result = stats[0] || {
      totalTrips: 0,
      completedTrips: 0,
      cancelledTrips: 0,
      totalSpent: 0,
      averageRating: 0
    };

    res.json(result);
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
