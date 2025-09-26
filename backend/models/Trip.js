const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: true,
    unique: true
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
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  conductorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conductor',
    required: true
  },
  schedule: {
    date: { type: Date, required: true },
    scheduledDeparture: { type: String, required: true }, // HH:MM format
    scheduledArrival: { type: String, required: true }, // HH:MM format
    actualDeparture: String, // HH:MM format
    actualArrival: String, // HH:MM format
    duration: { type: Number, required: true } // minutes
  },
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'departed', 'in-transit', 'arrived', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  progress: {
    currentStop: {
      stopId: mongoose.Schema.Types.ObjectId,
      name: String,
      sequence: Number,
      arrivedAt: Date,
      departedAt: Date
    },
    nextStop: {
      stopId: mongoose.Schema.Types.ObjectId,
      name: String,
      sequence: Number,
      eta: Number // minutes
    },
    completedStops: [{
      stopId: mongoose.Schema.Types.ObjectId,
      name: String,
      sequence: Number,
      scheduledArrival: String,
      actualArrival: String,
      scheduledDeparture: String,
      actualDeparture: String,
      delay: Number // minutes
    }],
    totalDelay: { type: Number, default: 0 } // minutes
  },
  passengers: {
    total: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
    boarded: { type: Number, default: 0 },
    alighted: { type: Number, default: 0 },
    maxOccupancy: { type: Number, default: 0 }
  },
  revenue: {
    total: { type: Number, default: 0 },
    ticketSales: { type: Number, default: 0 },
    passUsage: { type: Number, default: 0 }
  },
  performance: {
    onTimeDeparture: { type: Boolean, default: false },
    onTimeArrival: { type: Boolean, default: false },
    averageSpeed: { type: Number, default: 0 }, // km/h
    fuelConsumption: { type: Number, default: 0 }, // liters
    stopsCompleted: { type: Number, default: 0 },
    totalStops: { type: Number, required: true }
  },
  incidents: [{
    type: { type: String, enum: ['breakdown', 'accident', 'delay', 'medical', 'other'] },
    description: String,
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    reportedAt: { type: Date, default: Date.now },
    resolvedAt: Date,
    impact: {
      delay: Number, // minutes
      passengersAffected: Number
    }
  }],
  tracking: {
    isLive: { type: Boolean, default: false },
    lastUpdate: { type: Date, default: Date.now },
    locations: [{
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      timestamp: { type: Date, default: Date.now },
      speed: Number,
      direction: Number // degrees
    }]
  },
  weather: {
    condition: String,
    temperature: Number,
    visibility: Number,
    impact: String
  },
  maintenance: {
    preTripCheck: {
      completed: { type: Boolean, default: false },
      completedAt: Date,
      issues: [String]
    },
    postTripCheck: {
      completed: { type: Boolean, default: false },
      completedAt: Date,
      issues: [String]
    }
  },
  feedback: [{
    passengerId: mongoose.Schema.Types.ObjectId,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for route and date queries
tripSchema.index({ routeId: 1, 'schedule.date': 1 });

// Index for bus and date queries
tripSchema.index({ busId: 1, 'schedule.date': 1 });

// Index for status queries
tripSchema.index({ status: 1, 'schedule.date': 1 });

// Pre-save middleware to generate trip ID
tripSchema.pre('save', function(next) {
  if (!this.tripId) {
    const { v4: uuidv4 } = require('uuid');
    this.tripId = 'TR' + uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase();
  }
  next();
});

// Method to start trip
tripSchema.methods.startTrip = function() {
  this.status = 'boarding';
  this.tracking.isLive = true;
  this.tracking.lastUpdate = new Date();
};

// Method to depart
tripSchema.methods.depart = function() {
  this.status = 'departed';
  this.schedule.actualDeparture = new Date().toTimeString().substring(0, 5);
  
  // Check if departure was on time
  const scheduledTime = new Date(`2000-01-01T${this.schedule.scheduledDeparture}`);
  const actualTime = new Date(`2000-01-01T${this.schedule.actualDeparture}`);
  const delayMinutes = (actualTime - scheduledTime) / (1000 * 60);
  
  this.progress.totalDelay = delayMinutes;
  this.performance.onTimeDeparture = delayMinutes <= 5; // 5 minutes tolerance
};

// Method to arrive at stop
tripSchema.methods.arriveAtStop = function(stopId, stopName, sequence) {
  const now = new Date();
  
  // Update current stop
  this.progress.currentStop = {
    stopId,
    name: stopName,
    sequence,
    arrivedAt: now
  };
  
  // Add to completed stops
  this.progress.completedStops.push({
    stopId,
    name: stopName,
    sequence,
    actualArrival: now.toTimeString().substring(0, 5)
  });
  
  this.performance.stopsCompleted++;
  this.status = 'in-transit';
};

// Method to depart from stop
tripSchema.methods.departFromStop = function() {
  if (this.progress.currentStop) {
    this.progress.currentStop.departedAt = new Date();
    
    // Update the last completed stop
    const lastStop = this.progress.completedStops[this.progress.completedStops.length - 1];
    if (lastStop) {
      lastStop.actualDeparture = new Date().toTimeString().substring(0, 5);
    }
  }
};

// Method to complete trip
tripSchema.methods.completeTrip = function() {
  this.status = 'completed';
  this.schedule.actualArrival = new Date().toTimeString().substring(0, 5);
  this.tracking.isLive = false;
  
  // Check if arrival was on time
  const scheduledTime = new Date(`2000-01-01T${this.schedule.scheduledArrival}`);
  const actualTime = new Date(`2000-01-01T${this.schedule.actualArrival}`);
  const delayMinutes = (actualTime - scheduledTime) / (1000 * 60);
  
  this.progress.totalDelay = delayMinutes;
  this.performance.onTimeArrival = delayMinutes <= 5; // 5 minutes tolerance
};

// Method to update passenger count
tripSchema.methods.updatePassengers = function(boarding, alighting) {
  this.passengers.current += boarding - alighting;
  this.passengers.boarded += boarding;
  this.passengers.alighted += alighting;
  this.passengers.maxOccupancy = Math.max(this.passengers.maxOccupancy, this.passengers.current);
};

module.exports = mongoose.model('Trip', tripSchema);
