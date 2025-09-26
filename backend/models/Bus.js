const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  driver: {
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    phone: { type: String, required: true },
    experience: Number // years
  },
  conductor: {
    name: { type: String, required: true },
    employeeId: { type: String, required: true },
    phone: { type: String, required: true }
  },
  busType: {
    type: String,
    enum: ['standard', 'ac', 'deluxe', 'sleeper'],
    required: true
  },
  capacity: {
    total: { type: Number, required: true },
    seats: { type: Number, required: true },
    standing: { type: Number, default: 0 }
  },
  currentLocation: {
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    address: String,
    lastUpdated: { type: Date, default: Date.now }
  },
  currentStatus: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'breakdown'],
    default: 'active'
  },
  operationalStatus: {
    type: String,
    enum: ['on-time', 'delayed', 'early', 'not-started', 'completed'],
    default: 'not-started'
  },
  currentTrip: {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    startTime: Date,
    expectedEndTime: Date,
    currentStop: {
      stopId: mongoose.Schema.Types.ObjectId,
      name: String,
      sequence: Number
    },
    nextStop: {
      stopId: mongoose.Schema.Types.ObjectId,
      name: String,
      sequence: Number,
      eta: Number // minutes
    },
    passengers: {
      current: { type: Number, default: 0 },
      boarded: { type: Number, default: 0 },
      alighted: { type: Number, default: 0 }
    },
    speed: { type: Number, default: 0 }, // km/h
    direction: { type: String, enum: ['forward', 'reverse'] },
    occupancy: { type: Number, default: 0 } // percentage
  },
  amenities: {
    wifi: { type: Boolean, default: false },
    ac: { type: Boolean, default: false },
    chargingPoints: { type: Boolean, default: false },
    wheelchairAccessible: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false },
    gps: { type: Boolean, default: true }
  },
  maintenance: {
    lastService: Date,
    nextService: Date,
    mileage: Number,
    fuelLevel: { type: Number, min: 0, max: 100 }, // percentage
    engineStatus: { type: String, enum: ['good', 'warning', 'critical'] },
    tireCondition: { type: String, enum: ['good', 'warning', 'critical'] }
  },
  performance: {
    onTimeRate: { type: Number, default: 0 }, // percentage
    averageSpeed: { type: Number, default: 0 },
    fuelEfficiency: { type: Number, default: 0 }, // km/liter
    passengerSatisfaction: { type: Number, default: 0 }
  },
  tracking: {
    isLive: { type: Boolean, default: false },
    lastUpdate: { type: Date, default: Date.now },
    updateFrequency: { type: Number, default: 30 } // seconds
  },
  schedule: {
    startTime: String, // HH:MM format
    endTime: String, // HH:MM format
    frequency: { type: Number, default: 30 }, // minutes
    operatingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for geospatial queries
busSchema.index({ 'currentLocation.coordinates': '2dsphere' });

// Index for route and status queries
busSchema.index({ routeId: 1, currentStatus: 1 });

// Virtual for occupancy percentage
busSchema.virtual('occupancyPercentage').get(function() {
  return Math.round((this.currentTrip.passengers.current / this.capacity.total) * 100);
});

// Method to update location
busSchema.methods.updateLocation = function(latitude, longitude, address) {
  this.currentLocation.coordinates.latitude = latitude;
  this.currentLocation.coordinates.longitude = longitude;
  this.currentLocation.address = address;
  this.currentLocation.lastUpdated = new Date();
  this.tracking.lastUpdate = new Date();
};

// Method to update passenger count
busSchema.methods.updatePassengers = function(boarding, alighting) {
  this.currentTrip.passengers.current += boarding - alighting;
  this.currentTrip.passengers.boarded += boarding;
  this.currentTrip.passengers.alighted += alighting;
  this.currentTrip.occupancy = this.occupancyPercentage;
};

module.exports = mongoose.model('Bus', busSchema);
