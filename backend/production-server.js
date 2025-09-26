const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from React build (auto-detect build or dist)
const distDir = path.join(__dirname, '../dist');
const buildDir = path.join(__dirname, '../build');
const staticDir = fs.existsSync(distDir) ? distDir : (fs.existsSync(buildDir) ? buildDir : null);
if (staticDir) {
  app.use(express.static(staticDir));
  console.log(`Serving static assets from: ${staticDir}`);
} else {
  console.warn('No frontend build found. Run: npm run build');
}

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
    fareTable: [
      { fromKm: 0, toKm: 50, price: 120 },
      { fromKm: 51, toKm: 150, price: 220 },
      { fromKm: 151, toKm: 250, price: 300 }
    ],
    status: 'active',
    popularity: 95,
    rating: { average: 4.5, count: 120 },
    features: { wifi: true, ac: true, wheelchairAccessible: true },
    isPopular: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
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
    distance: 60,
    estimatedDuration: 60,
    fare: { base: 120, perKm: 2, maxFare: 150 },
    stops: [
      { id: 's1', name: 'Ludhiana Bus Stand', city: 'Ludhiana', kmFromStart: 0 },
      { id: 's2', name: 'Khanna', city: 'Ludhiana', kmFromStart: 20 },
      { id: 's3', name: 'Phagwara', city: 'Kapurthala', kmFromStart: 45 },
      { id: 's4', name: 'Jalandhar Bus Stand', city: 'Jalandhar', kmFromStart: 60 }
    ],
    fareTable: [
      { fromKm: 0, toKm: 20, price: 40 },
      { fromKm: 21, toKm: 40, price: 80 },
      { fromKm: 41, toKm: 70, price: 120 }
    ],
    status: 'active',
    popularity: 85,
    rating: { average: 4.2, count: 95 },
    features: { wifi: true, ac: true, wheelchairAccessible: false },
    isPopular: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    routeNumber: '8',
    name: 'Patiala ↔ Chandigarh',
    description: 'City to city connection',
    startLocation: { name: 'Patiala Bus Stand' },
    endLocation: { name: 'Chandigarh Bus Stand' },
    distance: 80,
    estimatedDuration: 90,
    fare: { base: 180 },
    stops: [
      { id: 's1', name: 'Patiala Bus Stand', city: 'Patiala', kmFromStart: 0 },
      { id: 's2', name: 'Rajpura', city: 'Patiala', kmFromStart: 25 },
      { id: 's3', name: 'Zirakpur', city: 'Mohali', kmFromStart: 65 },
      { id: 's4', name: 'Chandigarh ISBT-43', city: 'Chandigarh', kmFromStart: 80 }
    ],
    fareTable: [
      { fromKm: 0, toKm: 30, price: 60 },
      { fromKm: 31, toKm: 60, price: 120 },
      { fromKm: 61, toKm: 90, price: 180 }
    ],
    status: 'active',
    popularity: 75,
    rating: { average: 4.0, count: 50 },
    features: { wifi: false, ac: true, wheelchairAccessible: true },
    isPopular: false,
    createdAt: new Date().toISOString()
  }
];

const buses = [
  {
    _id: '1',
    busNumber: 'PB15-2847',
    routeId: routes[0],
    busType: 'ac',
    capacity: { total: 35, seats: 35, standing: 0 },
    currentLocation: {
      coordinates: { latitude: 30.7333, longitude: 76.7794 },
      address: 'Chandigarh Bus Stand',
      lastUpdated: new Date().toISOString()
    },
    currentStatus: 'active',
    operationalStatus: 'on-time',
    currentTrip: {
      passengers: { current: 12, boarded: 12, alighted: 0 },
      speed: 35,
      occupancy: 34
    },
    amenities: { wifi: true, ac: true, chargingPoints: true, wheelchairAccessible: true },
    tracking: { isLive: true, lastUpdate: new Date().toISOString() },
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    busNumber: 'PB22-1534',
    routeId: routes[1],
    busType: 'standard',
    capacity: { total: 40, seats: 40, standing: 0 },
    currentLocation: {
      coordinates: { latitude: 30.9010, longitude: 75.8573 },
      address: 'Ludhiana Bus Stand',
      lastUpdated: new Date().toISOString()
    },
    currentStatus: 'active',
    operationalStatus: 'delayed',
    currentTrip: {
      passengers: { current: 28, boarded: 28, alighted: 0 },
      speed: 0,
      occupancy: 70
    },
    amenities: { wifi: true, ac: false, chargingPoints: false, wheelchairAccessible: false },
    tracking: { isLive: true, lastUpdate: new Date().toISOString() },
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    busNumber: 'PB08-9876',
    routeId: routes[2],
    busType: 'ac',
    capacity: { total: 35, seats: 35, standing: 0 },
    currentLocation: {
      coordinates: { latitude: 30.7333, longitude: 76.7794 },
      address: 'Patiala Bus Stand',
      lastUpdated: new Date().toISOString()
    },
    currentStatus: 'active',
    operationalStatus: 'on-time',
    currentTrip: {
      passengers: { current: 15, boarded: 15, alighted: 0 },
      speed: 28,
      occupancy: 43
    },
    amenities: { wifi: false, ac: true, chargingPoints: true, wheelchairAccessible: true },
    tracking: { isLive: true, lastUpdate: new Date().toISOString() },
    createdAt: new Date().toISOString()
  }
];

const bookings = [];
const trips = [];

// Attempt to load Punjab data from JSON if available
const dataFile = path.join(__dirname, 'data', 'punjab-routes.json');
try {
  if (fs.existsSync(dataFile)) {
    const json = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    if (Array.isArray(json.routes) && json.routes.length) {
      routes.splice(0, routes.length, ...json.routes);
    }
    if (Array.isArray(json.buses) && json.buses.length) {
      buses.splice(0, buses.length, ...json.buses);
    }
  }
} catch (e) {
  console.warn('Failed to load Punjab data:', e.message);
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Punjab Bus API is working!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Admin: reload data from file (no auth for demo)
app.post('/api/seed/reload', (req, res) => {
  try {
    if (!fs.existsSync(dataFile)) {
      return res.status(404).json({ message: 'Data file not found' });
    }
    const json = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    if (Array.isArray(json.routes)) routes.splice(0, routes.length, ...json.routes);
    if (Array.isArray(json.buses)) buses.splice(0, buses.length, ...json.buses);
    return res.json({ message: 'Data reloaded', routes: routes.length, buses: buses.length });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to reload', error: err.message });
  }
});

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Enhanced password validation
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Check if password contains "rs" (as requested)
    if (!password.toLowerCase().includes('rs')) {
      return res.status(400).json({ 
        message: 'Password must contain "rs" for security reasons' 
      });
    }
    
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const user = {
      _id: Date.now().toString(),
      name,
      email,
      password: password, // In production, hash this
      wallet: {
        balance: 1000, // Give new users ₹1000 welcome bonus
        transactions: [{
          type: 'credit',
          amount: 1000,
          description: 'Welcome Bonus',
          timestamp: new Date().toISOString()
        }]
      },
      loyaltyPoints: 100, // Welcome loyalty points
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    
    res.json({
      message: 'Account created successfully! Welcome to Punjab Bus!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        wallet: user.wallet,
        loyaltyPoints: user.loyaltyPoints
      },
      token: 'jwt-token-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    let user = users.find(u => u.email === email);
    
    if (!user) {
      // Create a demo user if not found
      user = {
        _id: Date.now().toString(),
        name: 'Demo User',
        email,
        createdAt: new Date().toISOString()
      };
      users.push(user);
    }
    
    res.json({
      message: 'Login successful',
      user,
      token: 'jwt-token-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.post('/api/auth/social-login', (req, res) => {
  try {
    const { provider, email, name, socialId } = req.body;
    
    const user = {
      _id: Date.now().toString(),
      name: name || 'Social User',
      email: email || `user@${provider}.com`,
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    
    res.json({
      message: 'Social login successful',
      user,
      token: 'jwt-token-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during social login' });
  }
});

// Routes API
app.get('/api/routes/popular', (req, res) => {
  try {
    const popularRoutes = routes.filter(route => route.isPopular);
    res.json(popularRoutes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/routes/search/suggestions', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    const suggestions = routes.filter(route => 
      route.name.toLowerCase().includes(q.toLowerCase()) ||
      route.startLocation.name.toLowerCase().includes(q.toLowerCase()) ||
      route.endLocation.name.toLowerCase().includes(q.toLowerCase()) ||
      route.routeNumber.includes(q)
    ).slice(0, 10);
    
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/routes', (req, res) => {
  try {
    const { from, to, search, limit = 20, page = 1 } = req.query;
    
    let filteredRoutes = routes;
    
    if (search) {
      filteredRoutes = routes.filter(route => 
        route.name.toLowerCase().includes(search.toLowerCase()) ||
        route.startLocation.name.toLowerCase().includes(search.toLowerCase()) ||
        route.endLocation.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (from && to) {
      filteredRoutes = routes.filter(route => 
        (route.startLocation.name.toLowerCase().includes(from.toLowerCase()) &&
         route.endLocation.name.toLowerCase().includes(to.toLowerCase())) ||
        (route.startLocation.name.toLowerCase().includes(to.toLowerCase()) &&
         route.endLocation.name.toLowerCase().includes(from.toLowerCase()))
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedRoutes = filteredRoutes.slice(startIndex, endIndex);
    
    res.json({
      routes: paginatedRoutes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredRoutes.length / limit),
        total: filteredRoutes.length,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/routes/:id', (req, res) => {
  try {
    const route = routes.find(r => r._id === req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new route (simple in-memory)
app.post('/api/routes', (req, res) => {
  try {
    const { routeNumber, name, startLocation, endLocation, distance, fare, stops } = req.body;
    if (!routeNumber || !name || !startLocation || !endLocation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newRoute = {
      _id: String(Date.now()),
      routeNumber,
      name,
      description: req.body.description || '',
      startLocation,
      endLocation,
      distance: distance ?? 0,
      estimatedDuration: req.body.estimatedDuration ?? 0,
      fare: fare || { base: 100 },
      stops: stops || [],
      fareTable: req.body.fareTable || [],
      status: 'active',
      isPopular: !!req.body.isPopular,
      createdAt: new Date().toISOString()
    };
    routes.push(newRoute);
    return res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route stops for a route
app.get('/api/routes/:id/stops', (req, res) => {
  try {
    const route = routes.find(r => r._id === req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json({ routeId: route._id, stops: route.stops || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fare calculation between two stops on a route
app.get('/api/fares', (req, res) => {
  try {
    const { routeId, fromStopId, toStopId } = req.query;
    const route = routes.find(r => r._id === routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    const from = (route.stops || []).find(s => s.id === fromStopId);
    const to = (route.stops || []).find(s => s.id === toStopId);
    if (!from || !to) {
      return res.status(400).json({ message: 'Invalid stop selection' });
    }
    const distanceKm = Math.abs((to.kmFromStart ?? 0) - (from.kmFromStart ?? 0));
    const band = (route.fareTable || []).find(b => distanceKm >= b.fromKm && distanceKm <= b.toKm);
    const price = band ? band.price : Math.min(route.fare.base + Math.ceil(distanceKm * (route.fare.perKm || 1)), route.fare.maxFare || route.fare.base);
    return res.json({ routeId: route._id, from: from.name, to: to.name, distanceKm, price });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Simple QR endpoint for arbitrary payloads (e.g., ticket, stop info)
app.get('/api/qr', (req, res) => {
  try {
    const { text = 'Punjab Bus' } = req.query;
    const base64 = Buffer.from(String(text)).toString('base64');
    // Note: for real QR, integrate a QR library; here we return a base64 placeholder
    res.json({
      payload: text,
      qrCode: `data:image/png;base64,${base64}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Buses API
app.get('/api/buses', (req, res) => {
  try {
    const { routeId, status, type } = req.query;
    
    let filteredBuses = buses;
    
    if (routeId) {
      filteredBuses = buses.filter(bus => bus.routeId._id === routeId);
    }
    
    if (status) {
      filteredBuses = filteredBuses.filter(bus => bus.currentStatus === status);
    }
    
    if (type) {
      filteredBuses = filteredBuses.filter(bus => bus.busType === type);
    }
    
    res.json(filteredBuses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/buses/:id', (req, res) => {
  try {
    const bus = buses.find(b => b._id === req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new bus (simple in-memory)
app.post('/api/buses', (req, res) => {
  try {
    const { busNumber, routeId, busType = 'standard' } = req.body;
    const route = routes.find(r => r._id === routeId);
    if (!busNumber || !route) {
      return res.status(400).json({ message: 'Invalid busNumber or routeId' });
    }
    const newBus = {
      _id: String(Date.now()),
      busNumber,
      routeId: route,
      busType,
      capacity: { total: 40, seats: 40, standing: 0 },
      currentLocation: { coordinates: {}, address: '', lastUpdated: new Date().toISOString() },
      currentStatus: 'active',
      operationalStatus: 'on-time',
      currentTrip: { passengers: { current: 0, boarded: 0, alighted: 0 }, speed: 0, occupancy: 0 },
      amenities: { wifi: true, ac: busType === 'ac', chargingPoints: true, wheelchairAccessible: true },
      tracking: { isLive: true, lastUpdate: new Date().toISOString() },
      createdAt: new Date().toISOString()
    };
    buses.push(newBus);
    return res.status(201).json(newBus);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a trip (schedule) for a bus on a route
app.post('/api/trips', (req, res) => {
  try {
    const { routeId, busId, departureTime, arrivalTime } = req.body;
    const route = routes.find(r => r._id === routeId);
    const bus = buses.find(b => b._id === busId);
    if (!route || !bus) {
      return res.status(400).json({ message: 'Invalid routeId or busId' });
    }
    const trip = {
      _id: 'TR' + Date.now(),
      routeId: route._id,
      busId: bus._id,
      departureTime,
      arrivalTime,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    trips.push(trip);
    return res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookings API
app.post('/api/bookings', (req, res) => {
  try {
    const { routeId, busId, passengers, journey, payment } = req.body;
    
    const route = routes.find(r => r._id === routeId);
    const bus = buses.find(b => b._id === busId);
    
    if (!route || !bus) {
      return res.status(404).json({ message: 'Route or bus not found' });
    }
    
    const booking = {
      _id: 'BK' + Date.now(),
      userId: req.body.userId || 'demo-user',
      routeId: route,
      busId: bus,
      passengers,
      journey,
      fare: {
        base: route.fare.base,
        total: route.fare.base * passengers.length,
        finalAmount: route.fare.base * passengers.length
      },
      payment: {
        method: payment.method,
        status: 'completed',
        transactionId: 'TXN' + Date.now(),
        paidAt: new Date().toISOString()
      },
      status: 'confirmed',
      tickets: passengers.map((p, index) => ({
        ticketId: `TKT-${Date.now()}-${index + 1}`,
        qrCode: `data:image/png;base64,${Buffer.from(`Ticket for ${p.name}`).toString('base64')}`,
        status: 'active'
      })),
      createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/bookings', (req, res) => {
  try {
    const { userId } = req.query;
    const userBookings = bookings.filter(b => b.userId === userId);
    
    res.json({
      bookings: userBookings,
      pagination: {
        current: 1,
        pages: 1,
        total: userBookings.length,
        limit: 20
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enhanced Features API Routes

// Wallet Management
app.get('/api/users/wallet', (req, res) => {
  try {
    const { userId } = req.query;
    const user = users.find(u => u._id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      balance: user.wallet.balance,
      transactions: user.wallet.transactions,
      loyaltyPoints: user.loyaltyPoints || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add money to wallet
app.post('/api/users/wallet/add', (req, res) => {
  try {
    const { userId, amount, method } = req.body;
    const user = users.find(u => u._id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.wallet.balance += amount;
    user.wallet.transactions.push({
      type: 'credit',
      amount: amount,
      description: `Added via ${method}`,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      message: 'Money added successfully!',
      newBalance: user.wallet.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Loyalty Points System
app.get('/api/users/loyalty', (req, res) => {
  try {
    const { userId } = req.query;
    const user = users.find(u => u._id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const loyaltyTier = user.loyaltyPoints >= 1000 ? 'Gold' : 
                       user.loyaltyPoints >= 500 ? 'Silver' : 'Bronze';
    
    res.json({
      points: user.loyaltyPoints || 0,
      tier: loyaltyTier,
      nextTier: loyaltyTier === 'Bronze' ? 'Silver (500 points)' :
                loyaltyTier === 'Silver' ? 'Gold (1000 points)' : 'Max Tier',
      benefits: loyaltyTier === 'Gold' ? ['20% discount', 'Priority booking', 'Free WiFi'] :
                loyaltyTier === 'Silver' ? ['10% discount', 'Priority booking'] : ['5% discount']
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Special Offers and Promotions
app.get('/api/offers', (req, res) => {
  try {
    const offers = [
      {
        id: '1',
        title: '🎉 New User Special',
        description: 'Get ₹100 off your first booking!',
        code: 'WELCOME100',
        discount: 100,
        type: 'fixed',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        conditions: 'First booking only'
      },
      {
        id: '2',
        title: '🚌 Weekend Special',
        description: '20% off on all weekend bookings',
        code: 'WEEKEND20',
        discount: 20,
        type: 'percentage',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        conditions: 'Weekend bookings only'
      },
      {
        id: '3',
        title: '👥 Group Booking',
        description: 'Book 4+ tickets and get 15% off',
        code: 'GROUP15',
        discount: 15,
        type: 'percentage',
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        conditions: 'Minimum 4 passengers'
      },
      {
        id: '4',
        title: '🎯 Loyalty Reward',
        description: 'Double loyalty points this month',
        code: 'DOUBLEPOINTS',
        discount: 0,
        type: 'loyalty',
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        conditions: 'All bookings this month'
      }
    ];
    
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Bus Amenities and Features
app.get('/api/buses/amenities', (req, res) => {
  try {
    const amenities = [
      {
        name: 'WiFi',
        icon: '📶',
        description: 'Free high-speed internet',
        available: buses.filter(b => b.amenities.wifi).length
      },
      {
        name: 'Air Conditioning',
        icon: '❄️',
        description: 'Climate controlled comfort',
        available: buses.filter(b => b.amenities.ac).length
      },
      {
        name: 'Charging Points',
        icon: '🔌',
        description: 'USB and power outlets',
        available: buses.filter(b => b.amenities.chargingPoints).length
      },
      {
        name: 'Wheelchair Access',
        icon: '♿',
        description: 'Accessible for all passengers',
        available: buses.filter(b => b.amenities.wheelchairAccessible).length
      },
      {
        name: 'Live Tracking',
        icon: '📍',
        description: 'Real-time bus location',
        available: buses.filter(b => b.tracking.isLive).length
      }
    ];
    
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route Statistics
app.get('/api/routes/stats', (req, res) => {
  try {
    const stats = {
      totalRoutes: routes.length,
      activeRoutes: routes.filter(r => r.status === 'active').length,
      popularRoutes: routes.filter(r => r.isPopular).length,
      totalDistance: routes.reduce((sum, r) => sum + r.distance, 0),
      averageFare: Math.round(routes.reduce((sum, r) => sum + r.fare.base, 0) / routes.length),
      totalBuses: buses.length,
      activeBuses: buses.filter(b => b.currentStatus === 'active').length,
      totalPassengers: buses.reduce((sum, b) => sum + b.currentTrip.passengers.current, 0),
      averageOccupancy: Math.round(buses.reduce((sum, b) => sum + b.currentTrip.occupancy, 0) / buses.length)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Emergency Contacts
app.get('/api/emergency', (req, res) => {
  try {
    const contacts = [
      {
        name: 'Emergency Helpline',
        number: '1800-180-1234',
        type: 'emergency',
        available: '24/7'
      },
      {
        name: 'Customer Support',
        number: '1800-180-5678',
        type: 'support',
        available: '6 AM - 10 PM'
      },
      {
        name: 'Lost & Found',
        number: '1800-180-9999',
        type: 'lostfound',
        available: '8 AM - 8 PM'
      },
      {
        name: 'Complaint Desk',
        number: '1800-180-0000',
        type: 'complaint',
        available: '9 AM - 6 PM'
      }
    ];
    
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Weather and Travel Tips
app.get('/api/travel-tips', (req, res) => {
  try {
    const tips = [
      {
        id: '1',
        title: '🌧️ Weather Update',
        content: 'Light rain expected in Chandigarh. Carry an umbrella!',
        type: 'weather',
        priority: 'high'
      },
      {
        id: '2',
        title: '🚧 Road Construction',
        content: 'GT Road construction near Ambala. Expect 15 min delays.',
        type: 'traffic',
        priority: 'medium'
      },
      {
        id: '3',
        title: '🎒 Travel Tips',
        content: 'Book tickets 2 hours in advance for better seat selection.',
        type: 'tip',
        priority: 'low'
      },
      {
        id: '4',
        title: '💰 Payment Options',
        content: 'Use UPI for instant booking confirmation and cashback!',
        type: 'payment',
        priority: 'low'
      }
    ];
    
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enhanced Notifications API
app.get('/api/notifications', (req, res) => {
  try {
    const notifications = [
      {
        id: '1',
        type: 'booking',
        title: '🎫 Booking Confirmed',
        message: 'Your booking has been confirmed for Route 15 - Chandigarh to Amritsar',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'high',
        action: 'View Ticket'
      },
      {
        id: '2',
        type: 'route',
        title: '⚠️ Route Update',
        message: 'Route 22 is experiencing 15 min delays due to traffic',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'medium',
        action: 'Track Bus'
      },
      {
        id: '3',
        type: 'promotion',
        title: '🎉 Special Offer',
        message: 'Get ₹100 off your next booking! Use code: WELCOME100',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'low',
        action: 'Apply Code'
      },
      {
        id: '4',
        type: 'loyalty',
        title: '⭐ Loyalty Points',
        message: 'You earned 50 loyalty points! You are now Silver tier!',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'medium',
        action: 'View Benefits'
      },
      {
        id: '5',
        type: 'wallet',
        title: '💰 Wallet Credit',
        message: '₹1000 welcome bonus added to your wallet!',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'high',
        action: 'View Wallet'
      }
    ];
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Catch all handler - serve React app for any non-API routes
app.get('*', (req, res) => {
  if (staticDir) {
    return res.sendFile(path.join(staticDir, 'index.html'));
  }
  res.status(404).send('Frontend not built. Run: npm run build');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚌 Punjab Bus Website running on port ${PORT}`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`✅ Ready for deployment!`);
  console.log(`\n📊 Sample Data:`);
  console.log(`   - ${routes.length} Routes`);
  console.log(`   - ${buses.length} Buses`);
  console.log(`   - ${users.length} Users`);
  console.log(`   - ${bookings.length} Bookings`);
  console.log(`   - ${trips.length} Trips`);
});
