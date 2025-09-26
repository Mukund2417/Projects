const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Mock routes
app.get('/api/routes/popular', (req, res) => {
  res.json([
    {
      _id: '1',
      routeNumber: '15',
      name: 'Chandigarh ↔ Amritsar',
      description: 'Direct highway route',
      startLocation: { name: 'Chandigarh Bus Stand' },
      endLocation: { name: 'Amritsar Bus Stand' },
      fare: { base: 250 },
      isPopular: true
    }
  ]);
});

app.get('/api/routes', (req, res) => {
  res.json({
    routes: [
      {
        _id: '1',
        routeNumber: '15',
        name: 'Chandigarh ↔ Amritsar',
        startLocation: { name: 'Chandigarh Bus Stand' },
        endLocation: { name: 'Amritsar Bus Stand' },
        fare: { base: 250 }
      }
    ],
    pagination: { total: 1 }
  });
});

app.get('/api/buses', (req, res) => {
  res.json([
    {
      _id: '1',
      busNumber: 'PB15-2847',
      currentStatus: 'active',
      operationalStatus: 'on-time'
    }
  ]);
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { name, email } = req.body;
  res.json({ 
    message: 'Account created successfully!', 
    user: { _id: Date.now(), name, email }, 
    token: 'fake-token' 
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  res.json({ 
    message: 'Login successful!', 
    user: { _id: 1, name: 'Test User', email }, 
    token: 'fake-token' 
  });
});

app.post('/api/auth/social-login', (req, res) => {
  res.json({ 
    message: 'Social login successful!', 
    user: { _id: Date.now(), name: 'Social User', email: 'social@test.com' }, 
    token: 'fake-token' 
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend: http://localhost:3000`);
  console.log(`✅ Ready! You can now register an account!`);
});
