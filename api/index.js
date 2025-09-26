// Vercel serverless function handler
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse JSON body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      if (body) {
        req.body = JSON.parse(body);
      } else {
        req.body = {};
      }
    } catch (e) {
      req.body = {};
    }

    // Route handling
    const { method, url } = req;
    const path = url.split('?')[0];

    // Mock data
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
      }
    ];

    const bookings = [];

    // Handle different routes
    if (method === 'POST' && path === '/api/auth/register') {
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
        password,
        phone,
        wallet: { balance: 1000, currency: 'INR' },
        loyaltyPoints: 0,
        createdAt: new Date().toISOString()
      };
      
      users.push(user);
      
      return res.status(201).json({
        message: 'User registered successfully',
        user: { _id: user._id, name: user.name, email: user.email, phone: user.phone }
      });
    }

    if (method === 'POST' && path === '/api/auth/login') {
      const { email, password } = req.body;
      
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      return res.json({
        message: 'Login successful',
        user: { _id: user._id, name: user.name, email: user.email, phone: user.phone },
        token: 'mock-jwt-token-' + user._id
      });
    }

    if (method === 'GET' && path === '/api/routes') {
      return res.json(routes);
    }

    if (method === 'GET' && path.startsWith('/api/routes/') && path !== '/api/routes') {
      const routeId = path.split('/')[3];
      const route = routes.find(r => r._id === routeId);
      if (!route) {
        return res.status(404).json({ error: 'Route not found' });
      }
      return res.json(route);
    }

    if (method === 'GET' && path === '/api/buses') {
      return res.json(buses);
    }

    if (method === 'GET' && path.startsWith('/api/buses/')) {
      const busId = path.split('/')[3];
      const bus = buses.find(b => b._id === busId);
      if (!bus) {
        return res.status(404).json({ error: 'Bus not found' });
      }
      return res.json(bus);
    }

    if (method === 'POST' && path === '/api/bookings') {
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
      
      return res.status(201).json(booking);
    }

    if (method === 'GET' && path.startsWith('/api/bookings/user/')) {
      const userId = path.split('/')[4];
      const userBookings = bookings.filter(b => b.userId === userId);
      return res.json(userBookings);
    }

    if (method === 'GET' && path === '/api/health') {
      return res.json({ status: 'OK', timestamp: new Date().toISOString() });
    }

    // Default response
    res.status(404).json({ error: 'Not found' });
  });
};