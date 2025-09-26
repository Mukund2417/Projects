export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  res.status(200).json(routes);
}
