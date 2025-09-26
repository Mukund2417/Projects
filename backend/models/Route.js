const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startLocation: {
    name: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    address: String
  },
  endLocation: {
    name: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    address: String
  },
  stops: [{
    name: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    address: String,
    sequence: { type: Number, required: true },
    estimatedTime: Number, // minutes from start
    facilities: [{
      type: String,
      enum: ['shelter', 'bench', 'lighting', 'wifi', 'atm', 'shop']
    }]
  }],
  distance: {
    type: Number, // in kilometers
    required: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true
  },
  fare: {
    base: { type: Number, required: true },
    perKm: { type: Number, default: 0 },
    maxFare: { type: Number, required: true }
  },
  schedule: [{
    dayOfWeek: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    departures: [{
      time: { type: String, required: true }, // HH:MM format
      frequency: { type: Number, default: 30 }, // minutes between buses
      lastBus: { type: String, required: true } // HH:MM format
    }]
  }],
  busTypes: [{
    type: { type: String, enum: ['standard', 'ac', 'deluxe', 'sleeper'] },
    capacity: Number,
    amenities: [String],
    fareMultiplier: { type: Number, default: 1 }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  popularity: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  features: {
    wifi: { type: Boolean, default: false },
    ac: { type: Boolean, default: false },
    wheelchairAccessible: { type: Boolean, default: false },
    chargingPoints: { type: Boolean, default: false }
  },
  images: [String],
  isPopular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for geospatial queries
routeSchema.index({ 
  'startLocation.coordinates': '2dsphere',
  'endLocation.coordinates': '2dsphere',
  'stops.coordinates': '2dsphere'
});

// Index for route search
routeSchema.index({ 
  routeNumber: 'text',
  name: 'text',
  description: 'text'
});

module.exports = mongoose.model('Route', routeSchema);
