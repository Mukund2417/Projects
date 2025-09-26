const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  passengers: [{
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    seatNumber: String,
    isChild: { type: Boolean, default: false },
    isSenior: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false }
  }],
  journey: {
    from: {
      stopId: mongoose.Schema.Types.ObjectId,
      name: { type: String, required: true },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    to: {
      stopId: mongoose.Schema.Types.ObjectId,
      name: { type: String, required: true },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    date: { type: Date, required: true },
    departureTime: { type: String, required: true }, // HH:MM format
    arrivalTime: { type: String, required: true }, // HH:MM format
    duration: { type: Number, required: true } // minutes
  },
  fare: {
    base: { type: Number, required: true },
    total: { type: Number, required: true },
    breakdown: [{
      type: { type: String, required: true },
      amount: { type: Number, required: true },
      description: String
    }],
    discount: {
      amount: { type: Number, default: 0 },
      type: { type: String, enum: ['percentage', 'fixed'] },
      code: String
    },
    finalAmount: { type: Number, required: true }
  },
  payment: {
    method: { 
      type: String, 
      enum: ['card', 'upi', 'wallet', 'cash', 'netbanking'],
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    gateway: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'confirmed'
  },
  cancellation: {
    requestedAt: Date,
    reason: String,
    refundAmount: Number,
    refundStatus: { 
      type: String, 
      enum: ['pending', 'processed', 'failed'] 
    },
    cancellationFee: { type: Number, default: 0 }
  },
  tickets: [{
    ticketId: { type: String, required: true },
    qrCode: String,
    status: { 
      type: String, 
      enum: ['active', 'used', 'expired', 'cancelled'],
      default: 'active'
    },
    usedAt: Date,
    usedBy: String // conductor ID or validation method
  }],
  notifications: [{
    type: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'failed'] }
  }],
  specialRequests: [{
    type: { type: String, required: true },
    description: String,
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  rating: {
    overall: { type: Number, min: 1, max: 5 },
    punctuality: { type: Number, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 },
    comfort: { type: Number, min: 1, max: 5 },
    driver: { type: Number, min: 1, max: 5 },
    review: String,
    ratedAt: Date
  },
  checkIn: {
    time: Date,
    location: {
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      address: String
    },
    method: { type: String, enum: ['qr', 'manual', 'app'] }
  },
  checkOut: {
    time: Date,
    location: {
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      address: String
    },
    method: { type: String, enum: ['qr', 'manual', 'app'] }
  }
}, {
  timestamps: true
});

// Index for user bookings
bookingSchema.index({ userId: 1, createdAt: -1 });

// Index for route and date queries
bookingSchema.index({ routeId: 1, 'journey.date': 1 });

// Index for booking ID
bookingSchema.index({ bookingId: 1 });

// Pre-save middleware to generate booking ID
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const { v4: uuidv4 } = require('uuid');
    this.bookingId = 'BK' + uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();
  }
  next();
});

// Method to calculate fare
bookingSchema.methods.calculateFare = function() {
  const baseFare = this.fare.base;
  let totalFare = baseFare * this.passengers.length;
  
  // Apply passenger-specific discounts
  this.passengers.forEach(passenger => {
    if (passenger.isChild) {
      totalFare -= baseFare * 0.5; // 50% discount for children
    } else if (passenger.isSenior) {
      totalFare -= baseFare * 0.2; // 20% discount for seniors
    }
  });
  
  // Apply general discount
  if (this.fare.discount.amount > 0) {
    if (this.fare.discount.type === 'percentage') {
      totalFare -= (totalFare * this.fare.discount.amount / 100);
    } else {
      totalFare -= this.fare.discount.amount;
    }
  }
  
  this.fare.total = Math.max(0, totalFare);
  this.fare.finalAmount = this.fare.total;
};

// Method to cancel booking
bookingSchema.methods.cancelBooking = function(reason) {
  this.status = 'cancelled';
  this.cancellation.requestedAt = new Date();
  this.cancellation.reason = reason;
  
  // Calculate refund based on cancellation time
  const hoursUntilDeparture = (this.journey.date.getTime() - Date.now()) / (1000 * 60 * 60);
  
  if (hoursUntilDeparture > 24) {
    this.cancellation.refundAmount = this.fare.finalAmount;
    this.cancellation.cancellationFee = 0;
  } else if (hoursUntilDeparture > 2) {
    this.cancellation.refundAmount = this.fare.finalAmount * 0.8;
    this.cancellation.cancellationFee = this.fare.finalAmount * 0.2;
  } else {
    this.cancellation.refundAmount = this.fare.finalAmount * 0.5;
    this.cancellation.cancellationFee = this.fare.finalAmount * 0.5;
  }
  
  this.payment.refundAmount = this.cancellation.refundAmount;
};

module.exports = mongoose.model('Booking', bookingSchema);
