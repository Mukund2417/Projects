const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock data - no database needed!
const users = [];
const routes = [
  {
    _id: '1',
    routeNumber: '15',
    name: 'Chandigarh ↔ Amritsar',
    description: 'Direct highway route',
    startLocation: { name: 'Chandigarh Bus Stand' },
    endLocation: { name: 'Amritsar Bus Stand' },
    fare: { base: 250 },
    isPopular: true
  },
  {
    _id: '2', 
    routeNumber: '22',
    name: 'Ludhiana ↔ Jalandhar',
    description: 'City route',
    startLocation: { name: 'Ludhiana Bus Stand' },
    endLocation: { name: 'Jalandhar Bus Stand' },
    fare: { base: 120 },
    isPopular: true
  }
];

const buses = [
  {
    _id: '1',
    busNumber: 'PB15-2847',
    routeId: routes[0],
    currentStatus: 'active',
    operationalStatus: 'on-time',
    currentTrip: { passengers: { current: 12 }, occupancy: 34 },
    amenities: { wifi: true, ac: true }
  }
];

// Quick routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Working!' });
});

app.get('/api/routes/popular', (req, res) => {
  res.json(routes.filter(r => r.isPopular));
});

app.get('/api/routes', (req, res) => {
  res.json({ routes, pagination: { total: routes.length } });
});

app.get('/api/buses', (req, res) => {
  res.json(buses);
});

app.post('/api/auth/register', (req, res) => {
  const { name, email } = req.body;
  const user = { _id: Date.now(), name, email };
  users.push(user);
  res.json({ message: 'Success!', user, token: 'fake-token' });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email) || { _id: 1, name: 'Test User', email };
  res.json({ message: 'Success!', user, token: 'fake-token' });
});

app.post('/api/auth/social-login', (req, res) => {
  const user = { _id: Date.now(), name: 'Social User', email: 'social@test.com' };
  res.json({ message: 'Success!', user, token: 'fake-token' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend: http://localhost:3000`);
  console.log(`✅ Ready to use!`);
});
