// Simple test to verify the free database setup
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'database');
const USERS_FILE = path.join(DB_PATH, 'users.json');
const ROUTES_FILE = path.join(DB_PATH, 'routes.json');

// Initialize database
async function initDatabase() {
  try {
    await fs.mkdir(DB_PATH, { recursive: true });
    
    // Create sample routes
    const sampleRoutes = [
      {
        _id: uuidv4(),
        routeNumber: '15',
        name: 'Chandigarh ↔ Amritsar',
        description: 'Direct highway route',
        startLocation: { name: 'Chandigarh Bus Stand' },
        endLocation: { name: 'Amritsar Bus Stand' },
        fare: { base: 250 },
        isPopular: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: uuidv4(),
        routeNumber: '22',
        name: 'Ludhiana ↔ Jalandhar',
        description: 'City route',
        startLocation: { name: 'Ludhiana Bus Stand' },
        endLocation: { name: 'Jalandhar Bus Stand' },
        fare: { base: 120 },
        isPopular: true,
        createdAt: new Date().toISOString()
      }
    ];
    
    await fs.writeFile(ROUTES_FILE, JSON.stringify(sampleRoutes, null, 2));
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
    
    console.log('✅ Database initialized!');
    console.log(`📁 Database location: ${DB_PATH}`);
    return true;
  } catch (error) {
    console.error('❌ Database init error:', error);
    return false;
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Free JSON Database is working!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/routes/popular', async (req, res) => {
  try {
    const routes = JSON.parse(await fs.readFile(ROUTES_FILE, 'utf8'));
    const popularRoutes = routes.filter(route => route.isPopular);
    res.json(popularRoutes);
  } catch (error) {
    res.status(500).json({ message: 'Error reading routes' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = {
      _id: uuidv4(),
      name,
      email,
      password, // In real app, hash this
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    
    const { password: _, ...userResponse } = user;
    res.json({ message: 'User created!', user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Registration error' });
  }
});

// Start server
initDatabase().then(() => {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`🚌 Punjab Bus Backend running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🗄️  Database: JSON Files in ${DB_PATH}`);
    console.log(`\n🌐 Now go to: http://localhost:3000/`);
    console.log(`📝 Register with any email/password to test!`);
  });
});
