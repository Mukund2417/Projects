// Mock data for the frontend
const mockUsers = [];
const mockRoutes = [
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

const mockBuses = [
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

const mockBookings = [];

// API functions with backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API call failed');
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return { data: response };
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData: any) => {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      return { data: response };
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { data: { message: 'Logged out successfully' } };
  }
};

// Routes API
export const routesAPI = {
  getAll: async () => {
    try {
      const response = await apiCall('/routes');
      return { data: response };
    } catch (error) {
      // Fallback to mock data if API fails
      return { data: mockRoutes };
    }
  },
  
  getById: async (id: string) => {
    await delay(200);
    const route = mockRoutes.find(r => r._id === id);
    if (!route) {
      throw new Error('Route not found');
    }
    return { data: route };
  },
  
  searchSuggestions: async (query: string) => {
    await delay(200);
    const suggestions = mockRoutes.filter(route => 
      route.name.toLowerCase().includes(query.toLowerCase()) ||
      route.startLocation.name.toLowerCase().includes(query.toLowerCase()) ||
      route.endLocation.name.toLowerCase().includes(query.toLowerCase())
    );
    return { data: suggestions };
  }
};

// Buses API
export const busesAPI = {
  getAll: async () => {
    await delay(300);
    return { data: mockBuses };
  },
  
  getById: async (id: string) => {
    await delay(200);
    const bus = mockBuses.find(b => b._id === id);
    if (!bus) {
      throw new Error('Bus not found');
    }
    return { data: bus };
  },
  
  getLiveByRoute: async (routeId: string) => {
    await delay(200);
    const buses = mockBuses.filter(b => b.routeId === routeId);
    return { data: buses };
  }
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData: any) => {
    await delay(500);
    
    const booking = {
      _id: Date.now().toString(),
      ...bookingData,
      status: 'confirmed',
      qrCode: btoa(`booking-${Date.now()}`),
      createdAt: new Date().toISOString()
    };
    
    mockBookings.push(booking);
    return { data: booking };
  },
  
  getAll: async () => {
    await delay(300);
    return { data: mockBookings };
  }
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => {
    await delay(200);
    return { 
      data: [
        {
          _id: '1',
          title: 'Welcome to Punjab Bus!',
          message: 'Get ₹1000 welcome bonus in your wallet',
          type: 'info',
          read: false,
          createdAt: new Date().toISOString()
        }
      ]
    };
  }
};

// Mock API for other services
export const trackingAPI = {
  getLive: async () => ({ data: mockBuses }),
  getByRoute: async (routeId: string) => ({ data: mockBuses.filter(b => b.routeId === routeId) })
};

export const paymentsAPI = {
  createIntent: async () => ({ data: { clientSecret: 'mock-secret' } }),
  confirm: async () => ({ data: { success: true } })
};

export const usersAPI = {
  getProfile: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return { data: user };
  }
};

export default {
  authAPI,
  routesAPI,
  busesAPI,
  bookingsAPI,
  trackingAPI,
  notificationsAPI,
  paymentsAPI,
  usersAPI
};