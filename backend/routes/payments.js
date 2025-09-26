const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-intent
// @desc    Create payment intent
// @access  Private
router.post('/create-intent', [
  auth,
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount required'),
  body('currency').optional().isIn(['inr', 'usd']).withMessage('Valid currency required'),
  body('bookingId').isMongoId().withMessage('Valid booking ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, currency = 'inr', bookingId } = req.body;

    // Mock payment intent creation
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to paise/cents
      currency,
      status: 'requires_payment_method',
      bookingId
    };

    res.json(paymentIntent);
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private
router.post('/confirm', [
  auth,
  body('paymentIntentId').trim().isLength({ min: 1 }).withMessage('Payment intent ID required'),
  body('bookingId').isMongoId().withMessage('Valid booking ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { paymentIntentId, bookingId } = req.body;

    // Mock payment confirmation
    const payment = {
      id: paymentIntentId,
      status: 'succeeded',
      amount: 25000, // ₹250 in paise
      currency: 'inr',
      transactionId: `txn_${Date.now()}`,
      bookingId,
      paidAt: new Date()
    };

    res.json({
      message: 'Payment confirmed successfully',
      payment
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
