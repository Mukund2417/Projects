const mongoose = require('mongoose');
const Route = require('./models/Route');
const Bus = require('./models/Bus');

const sampleRoutes = [
  {
    routeNumber: '15',
    name: 'Chandigarh ↔ Amritsar',
    description: 'Direct highway route connecting Chandigarh to Amritsar',
    startLocation: {
      name: 'Chandigarh Bus Stand',
      coordinates: { latitude: 30.7333, longitude: 76.7794 },
      address: 'Chandigarh Bus Stand, Sector 17, Chandigarh'
    },
    endLocation: {
      name: 'Amritsar Bus Stand',
      coordinates: { latitude: 31.6330, longitude: 74.8723 },
      address: 'Amritsar Bus Stand, Amritsar, Punjab'
    },
    stops: [
      {
        name: 'Chandigarh Bus Stand',
        coordinates: { latitude: 30.7333, longitude: 76.7794 },
        address: 'Chandigarh Bus Stand, Sector 17, Chandigarh',
        sequence: 1,
        estimatedTime: 0,
        facilities: ['shelter', 'bench', 'lighting', 'wifi', 'atm']
      },
      {
        name: 'Ambala City',
        coordinates: { latitude: 30.3782, longitude: 76.7767 },
        address: 'Ambala City Bus Stop',
        sequence: 2,
        estimatedTime: 45,
        facilities: ['shelter', 'bench', 'lighting']
      },
      {
        name: 'Ludhiana',
        coordinates: { latitude: 30.9010, longitude: 75.8573 },
        address: 'Ludhiana Bus Stop',
        sequence: 3,
        estimatedTime: 120,
        facilities: ['shelter', 'bench', 'lighting', 'shop']
      },
      {
        name: 'Jalandhar',
        coordinates: { latitude: 31.3260, longitude: 75.5762 },
        address: 'Jalandhar Bus Stop',
        sequence: 4,
        estimatedTime: 180,
        facilities: ['shelter', 'bench', 'lighting', 'wifi']
      },
      {
        name: 'Amritsar Bus Stand',
        coordinates: { latitude: 31.6330, longitude: 74.8723 },
        address: 'Amritsar Bus Stand, Amritsar, Punjab',
        sequence: 5,
        estimatedTime: 240,
        facilities: ['shelter', 'bench', 'lighting', 'wifi', 'atm', 'shop']
      }
    ],
    distance: 240,
    estimatedDuration: 240,
    fare: {
      base: 250,
      perKm: 1.5,
      maxFare: 400
    },
    schedule: [
      {
        dayOfWeek: 'monday',
        departures: [
          { time: '06:00', frequency: 30, lastBus: '22:00' },
          { time: '06:30', frequency: 30, lastBus: '22:30' }
        ]
      },
      {
        dayOfWeek: 'tuesday',
        departures: [
          { time: '06:00', frequency: 30, lastBus: '22:00' },
          { time: '06:30', frequency: 30, lastBus: '22:30' }
        ]
      },
      {
        dayOfWeek: 'wednesday',
        departures: [
          { time: '06:00', frequency: 30, lastBus: '22:00' },
          { time: '06:30', frequency: 30, lastBus: '22:30' }
        ]
      },
      {
        dayOfWeek: 'thursday',
        departures: [
          { time: '06:00', frequency: 30, lastBus: '22:00' },
          { time: '06:30', frequency: 30, lastBus: '22:30' }
        ]
      },
      {
        dayOfWeek: 'friday',
        departures: [
          { time: '06:00', frequency: 30, lastBus: '22:00' },
          { time: '06:30', frequency: 30, lastBus: '22:30' }
        ]
      },
      {
        dayOfWeek: 'saturday',
        departures: [
          { time: '06:00', frequency: 30, lastBus: '22:00' },
          { time: '06:30', frequency: 30, lastBus: '22:30' }
        ]
      },
      {
        dayOfWeek: 'sunday',
        departures: [
          { time: '06:00', frequency: 30, lastBus: '22:00' },
          { time: '06:30', frequency: 30, lastBus: '22:30' }
        ]
      }
    ],
    busTypes: [
      { type: 'standard', capacity: 40, amenities: ['basic'], fareMultiplier: 1 },
      { type: 'ac', capacity: 35, amenities: ['ac', 'wifi', 'charging'], fareMultiplier: 1.5 }
    ],
    status: 'active',
    popularity: 95,
    rating: { average: 4.5, count: 120 },
    features: {
      wifi: true,
      ac: true,
      wheelchairAccessible: true,
      chargingPoints: true
    },
    isPopular: true
  },
  {
    routeNumber: '22',
    name: 'Ludhiana ↔ Jalandhar',
    description: 'Frequent city route connecting Ludhiana and Jalandhar',
    startLocation: {
      name: 'Ludhiana Bus Stand',
      coordinates: { latitude: 30.9010, longitude: 75.8573 },
      address: 'Ludhiana Bus Stand, Ludhiana, Punjab'
    },
    endLocation: {
      name: 'Jalandhar Bus Stand',
      coordinates: { latitude: 31.3260, longitude: 75.5762 },
      address: 'Jalandhar Bus Stand, Jalandhar, Punjab'
    },
    stops: [
      {
        name: 'Ludhiana Bus Stand',
        coordinates: { latitude: 30.9010, longitude: 75.8573 },
        address: 'Ludhiana Bus Stand, Ludhiana, Punjab',
        sequence: 1,
        estimatedTime: 0,
        facilities: ['shelter', 'bench', 'lighting', 'wifi']
      },
      {
        name: 'Phagwara',
        coordinates: { latitude: 31.2219, longitude: 75.7700 },
        address: 'Phagwara Bus Stop',
        sequence: 2,
        estimatedTime: 30,
        facilities: ['shelter', 'bench', 'lighting']
      },
      {
        name: 'Jalandhar Bus Stand',
        coordinates: { latitude: 31.3260, longitude: 75.5762 },
        address: 'Jalandhar Bus Stand, Jalandhar, Punjab',
        sequence: 3,
        estimatedTime: 60,
        facilities: ['shelter', 'bench', 'lighting', 'wifi', 'atm']
      }
    ],
    distance: 60,
    estimatedDuration: 60,
    fare: {
      base: 120,
      perKm: 2,
      maxFare: 150
    },
    schedule: [
      {
        dayOfWeek: 'monday',
        departures: [
          { time: '05:30', frequency: 15, lastBus: '23:00' }
        ]
      },
      {
        dayOfWeek: 'tuesday',
        departures: [
          { time: '05:30', frequency: 15, lastBus: '23:00' }
        ]
      },
      {
        dayOfWeek: 'wednesday',
        departures: [
          { time: '05:30', frequency: 15, lastBus: '23:00' }
        ]
      },
      {
        dayOfWeek: 'thursday',
        departures: [
          { time: '05:30', frequency: 15, lastBus: '23:00' }
        ]
      },
      {
        dayOfWeek: 'friday',
        departures: [
          { time: '05:30', frequency: 15, lastBus: '23:00' }
        ]
      },
      {
        dayOfWeek: 'saturday',
        departures: [
          { time: '05:30', frequency: 15, lastBus: '23:00' }
        ]
      },
      {
        dayOfWeek: 'sunday',
        departures: [
          { time: '05:30', frequency: 15, lastBus: '23:00' }
        ]
      }
    ],
    busTypes: [
      { type: 'standard', capacity: 40, amenities: ['basic'], fareMultiplier: 1 },
      { type: 'ac', capacity: 35, amenities: ['ac', 'wifi'], fareMultiplier: 1.3 }
    ],
    status: 'active',
    popularity: 85,
    rating: { average: 4.2, count: 95 },
    features: {
      wifi: true,
      ac: true,
      wheelchairAccessible: false,
      chargingPoints: false
    },
    isPopular: true
  }
];

const sampleBuses = [
  {
    busNumber: 'PB15-2847',
    routeId: null, // Will be set after routes are created
    driver: {
      name: 'Rajinder Singh',
      licenseNumber: 'PB123456789',
      phone: '+91-9876543210',
      experience: 8
    },
    conductor: {
      name: 'Gurpreet Kaur',
      employeeId: 'EMP001',
      phone: '+91-9876543211'
    },
    busType: 'ac',
    capacity: {
      total: 35,
      seats: 35,
      standing: 0
    },
    currentLocation: {
      coordinates: {
        latitude: 30.7333,
        longitude: 76.7794
      },
      address: 'Chandigarh Bus Stand',
      lastUpdated: new Date()
    },
    currentStatus: 'active',
    operationalStatus: 'on-time',
    currentTrip: {
      startTime: new Date(),
      passengers: {
        current: 12,
        boarded: 12,
        alighted: 0
      },
      speed: 35,
      direction: 'forward',
      occupancy: 34
    },
    amenities: {
      wifi: true,
      ac: true,
      chargingPoints: true,
      wheelchairAccessible: true,
      cctv: true,
      gps: true
    },
    tracking: {
      isLive: true,
      lastUpdate: new Date(),
      updateFrequency: 30
    },
    schedule: {
      startTime: '06:00',
      endTime: '22:00',
      frequency: 30,
      operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    isActive: true
  },
  {
    busNumber: 'PB22-1534',
    routeId: null, // Will be set after routes are created
    driver: {
      name: 'Amarjit Singh',
      licenseNumber: 'PB987654321',
      phone: '+91-9876543212',
      experience: 12
    },
    conductor: {
      name: 'Balwinder Singh',
      employeeId: 'EMP002',
      phone: '+91-9876543213'
    },
    busType: 'standard',
    capacity: {
      total: 40,
      seats: 40,
      standing: 0
    },
    currentLocation: {
      coordinates: {
        latitude: 30.9010,
        longitude: 75.8573
      },
      address: 'Ludhiana Bus Stand',
      lastUpdated: new Date()
    },
    currentStatus: 'active',
    operationalStatus: 'delayed',
    currentTrip: {
      startTime: new Date(),
      passengers: {
        current: 28,
        boarded: 28,
        alighted: 0
      },
      speed: 0,
      direction: 'forward',
      occupancy: 70
    },
    amenities: {
      wifi: true,
      ac: false,
      chargingPoints: false,
      wheelchairAccessible: false,
      cctv: true,
      gps: true
    },
    tracking: {
      isLive: true,
      lastUpdate: new Date(),
      updateFrequency: 30
    },
    schedule: {
      startTime: '05:30',
      endTime: '23:00',
      frequency: 15,
      operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // Clear existing data
    await Route.deleteMany({});
    await Bus.deleteMany({});
    
    // Insert routes
    const routes = await Route.insertMany(sampleRoutes);
    console.log(`Inserted ${routes.length} routes`);
    
    // Update buses with route IDs
    sampleBuses[0].routeId = routes[0]._id; // PB15-2847 -> Chandigarh-Amritsar
    sampleBuses[1].routeId = routes[1]._id; // PB22-1534 -> Ludhiana-Jalandhar
    
    // Insert buses
    const buses = await Bus.insertMany(sampleBuses);
    console.log(`Inserted ${buses.length} buses`);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = { seedDatabase };
