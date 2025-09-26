const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs').promises;
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// JSON Database
const DB_PATH = path.join(__dirname, 'database');
const USERS_FILE = path.join(DB_PATH, 'users.json');
const ROUTES_FILE = path.join(DB_PATH, 'routes.json');
const BUSES_FILE = path.join(DB_PATH, 'buses.json');
const BOOKINGS_FILE = path.join(DB_PATH, 'bookings.json');

// Initialize database
async function initDatabase() {
  try {
    await fs.mkdir(DB_PATH, { recursive: true });
    
    // Initialize users
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([]));
    }
    
    // Initialize routes
    try {
      await fs.access(ROUTES_FILE);
    } catch {
      const sampleRoutes = [
        {
          _id: uuidv4(),
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
          status: 'active',
          popularity: 95,
          rating: { average: 4.5, count: 120 },
          features: { wifi: true, ac: true, wheelchairAccessible: true },
          isPopular: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: uuidv4(),
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
          status: 'active',
          popularity: 85,
          rating: { average: 4.2, count: 95 },
          features: { wifi: true, ac: true, wheelchairAccessible: false },
          isPopular: true,
          createdAt: new Date().toISOString()
        }
      ];
      await fs.writeFile(ROUTES_FILE, JSON.stringify(sampleRoutes, null, 2));
    }
    
    // Initialize buses
    try {
      await fs.access(BUSES_FILE);
    } catch {
      const routes = JSON.parse(await fs.readFile(ROUTES_FILE, 'utf8'));
      const sampleBuses = [
        {
          _id: uuidv4(),
          busNumber: 'PB15-2847',
          routeId: routes[0]._id,
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
          _id: uuidv4(),
          busNumber: 'PB22-1534',
          routeId: routes[1]._id,
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
        }
      ];
      await fs.writeFile(BUSES_FILE, JSON.stringify(sampleBuses, null, 2));
    }
    
    // Initialize bookings
    try {
      await fs.access(BOOKINGS_FILE);
    } catch {
      await fs.writeFile(BOOKINGS_FILE, JSON.stringify([]));
    }
    
    console.log('✅ JSON Database initialized successfully!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Database helper functions
async function readData(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

async function writeData(filename, data) {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, 'punjab-bus-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const users = await readData(USERS_FILE);
    
    // Check if user exists
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = {
      _id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    await writeData(USERS_FILE, users);
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      'punjab-bus-secret-key',
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const { password: _, ...userResponse } = user;
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const users = await readData(USERS_FILE);
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      'punjab-bus-secret-key',
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userResponse } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.post('/api/auth/social-login', async (req, res) => {
  try {
    const { provider, email, name, socialId } = req.body;
    
    const users = await readData(USERS_FILE);
    let user = users.find(u => u.email === email);
    
    if (!user) {
      user = {
        _id: uuidv4(),
        name,
        email,
        password: socialId,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      await writeData(USERS_FILE, users);
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      'punjab-bus-secret-key',
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userResponse } = user;
    
    res.json({
      message: 'Social login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ message: 'Server error during social login' });
  }
});

app.get('/api/routes/popular', async (req, res) => {
  try {
    const routes = await readData(ROUTES_FILE);
    const popularRoutes = routes.filter(route => route.isPopular);
    res.json(popularRoutes);
  } catch (error) {
    console.error('Get popular routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/routes/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    const routes = await readData(ROUTES_FILE);
    
    const suggestions = routes.filter(route => 
      route.name.toLowerCase().includes(q.toLowerCase()) ||
      route.startLocation.name.toLowerCase().includes(q.toLowerCase()) ||
      route.endLocation.name.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 10);
    
    res.json(suggestions);
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/routes', async (req, res) => {
  try {
    const { from, to } = req.query;
    const routes = await readData(ROUTES_FILE);
    
    let filteredRoutes = routes;
    
    if (from && to) {
      filteredRoutes = routes.filter(route => 
        (route.startLocation.name.toLowerCase().includes(from.toLowerCase()) &&
         route.endLocation.name.toLowerCase().includes(to.toLowerCase())) ||
        (route.startLocation.name.toLowerCase().includes(to.toLowerCase()) &&
         route.endLocation.name.toLowerCase().includes(from.toLowerCase()))
      );
    }
    
    res.json({
      routes: filteredRoutes,
      pagination: {
        current: 1,
        pages: 1,
        total: filteredRoutes.length,
        limit: 20
      }
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/buses', async (req, res) => {
  try {
    const buses = await readData(BUSES_FILE);
    const routes = await readData(ROUTES_FILE);
    
    // Populate route data
    const busesWithRoutes = buses.map(bus => ({
      ...bus,
      routeId: routes.find(route => route._id === bus.routeId)
    }));
    
    res.json(busesWithRoutes);
  } catch (error) {
    console.error('Get buses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'JSON Database (Free)'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Socket.io for real-time tracking
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-route', (routeId) => {
    socket.join(`route-${routeId}`);
    console.log(`Client ${socket.id} joined route ${routeId}`);
  });
  
  socket.on('leave-route', (routeId) => {
    socket.leave(`route-${routeId}`);
    console.log(`Client ${socket.id} left route ${routeId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Initialize database and start server
initDatabase().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚌 Punjab Bus Backend running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database: JSON Files (Free & No Setup Required!)`);
  });
});

module.exports = app;
