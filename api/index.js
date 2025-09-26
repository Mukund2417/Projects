const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock data for the API
const users = [];
const routes = [
  {
    _id: '1',
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
    distance: 240,
    estimatedDuration: 240,
    fare: { base: 250, perKm: 1.5, maxFare: 400 },
    stops: [
      { id: 's1', name: 'Chandigarh ISBT-17', city: 'Chandigarh', kmFromStart: 0 },
      { id: 's2', name: 'Kharar', city: 'SAS Nagar', kmFromStart: 15 },
      { id: 's3', name: 'Rupnagar', city: 'Ropar', kmFromStart: 42 },
      { id: 's4', name: 'Anandpur Sahib', city: 'Rupnagar', kmFromStart: 82 },
      { id: 's5', name: 'Hoshiarpur Bypass', city: 'Hoshiarpur', kmFromStart: 120 },
      { id: 's6', name: 'Batala', city: 'Gurdaspur', kmFromStart: 200 },
      { id: 's7', name: 'Amritsar ISBT', city: 'Amritsar', kmFromStart: 240 }
    ],
    frequency: 'Every 30 minutes',
    operatingHours: { start: '05:00', end: '22:00' },
    amenities: ['AC', 'WiFi', 'Charging', 'Water'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    routeNumber: '22',
    name: 'Ludhiana ↔ Jalandhar',
    description: 'Frequent city connector between Ludhiana and Jalandhar',
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
    distance: 90,
    estimatedDuration: 120,
    fare: { base: 120, perKm: 1.2, maxFare: 200 },
    stops: [
      { id: 's8', name: 'Ludhiana ISBT', city: 'Ludhiana', kmFromStart: 0 },
      { id: 's9', name: 'Phagwara', city: 'Kapurthala', kmFromStart: 25 },
      { id: 's10', name: 'Nakodar', city: 'Jalandhar', kmFromStart: 60 },
      { id: 's11', name: 'Jalandhar ISBT', city: 'Jalandhar', kmFromStart: 90 }
    ],
    frequency: 'Every 15 minutes',
    operatingHours: { start: '05:30', end: '23:00' },
    amenities: ['AC', 'WiFi', 'Charging'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    routeNumber: '8',
    name: 'Patiala ↔ Bathinda',
    description: 'Cross-state route connecting Patiala to Bathinda',
    startLocation: {
      name: 'Patiala Bus Stand',
      coordinates: { latitude: 30.3398, longitude: 76.3869 },
      address: 'Patiala Bus Stand, Patiala, Punjab'
    },
    endLocation: {
      name: 'Bathinda Bus Stand',
      coordinates: { latitude: 30.2110, longitude: 74.9455 },
      address: 'Bathinda Bus Stand, Bathinda, Punjab'
    },
    distance: 180,
    estimatedDuration: 200,
    fare: { base: 200, perKm: 1.3, maxFare: 350 },
    stops: [
      { id: 's12', name: 'Patiala ISBT', city: 'Patiala', kmFromStart: 0 },
      { id: 's13', name: 'Sangrur', city: 'Sangrur', kmFromStart: 40 },
      { id: 's14', name: 'Barnala', city: 'Barnala', kmFromStart: 80 },
      { id: 's15', name: 'Mansa', city: 'Mansa', kmFromStart: 120 },
      { id: 's16', name: 'Bathinda ISBT', city: 'Bathinda', kmFromStart: 180 }
    ],
    frequency: 'Every 45 minutes',
    operatingHours: { start: '06:00', end: '21:00' },
    amenities: ['AC', 'WiFi', 'Water'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const buses = [
  {
    _id: 'b1',
    routeId: '1',
    busNumber: 'PB-15-001',
    type: 'AC Volvo',
    capacity: 50,
    currentLocation: {
      coordinates: { latitude: 30.7333, longitude: 76.7794 },
      lastUpdated: new Date().toISOString()
    },
    status: 'running',
    driver: {
      name: 'Harbhajan Singh',
      phone: '+91-98765-43210',
      license: 'DL-1234567890'
    },
    conductor: {
      name: 'Gurpreet Kaur',
      phone: '+91-98765-43211'
    },
    amenities: ['AC', 'WiFi', 'Charging', 'Water'],
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-02-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'b2',
    routeId: '2',
    busNumber: 'PB-22-002',
    type: 'AC Semi-Sleeper',
    capacity: 40,
    currentLocation: {
      coordinates: { latitude: 30.9010, longitude: 75.8573 },
      lastUpdated: new Date().toISOString()
    },
    status: 'running',
    driver: {
      name: 'Rajinder Singh',
      phone: '+91-98765-43212',
      license: 'DL-1234567891'
    },
    conductor: {
      name: 'Manpreet Kaur',
      phone: '+91-98765-43213'
    },
    amenities: ['AC', 'WiFi', 'Charging'],
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const bookings = [];

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = {
      _id: Date.now().toString(),
      name,
      email,
      password, // In real app, hash this
      phone,
      wallet: { balance: 1000, currency: 'INR' },
      loyaltyPoints: 0,
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
      message: 'Login successful',
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone },
      token: 'mock-jwt-token-' + user._id
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Routes endpoints
app.get('/api/routes', (req, res) => {
  res.json(routes);
});

app.get('/api/routes/:id', (req, res) => {
  const route = routes.find(r => r._id === req.params.id);
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.json(route);
});

app.get('/api/routes/:id/stops', (req, res) => {
  const route = routes.find(r => r._id === req.params.id);
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.json(route.stops);
});

// Buses endpoints
app.get('/api/buses', (req, res) => {
  res.json(buses);
});

app.get('/api/buses/:id', (req, res) => {
  const bus = buses.find(b => b._id === req.params.id);
  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }
  res.json(bus);
});

// Bookings endpoints
app.post('/api/bookings', (req, res) => {
  try {
    const { userId, routeId, busId, fromStop, toStop, passengers, totalFare } = req.body;
    
    const booking = {
      _id: Date.now().toString(),
      userId,
      routeId,
      busId,
      fromStop,
      toStop,
      passengers,
      totalFare,
      status: 'confirmed',
      qrCode: Buffer.from(`booking-${Date.now()}`).toString('base64'),
      createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Booking failed' });
  }
});

app.get('/api/bookings/user/:userId', (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.params.userId);
  res.json(userBookings);
});

// QR Code endpoint
app.get('/api/qr/:bookingId', (req, res) => {
  const booking = bookings.find(b => b._id === req.params.bookingId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json({ qrCode: booking.qrCode });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;
