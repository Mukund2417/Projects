import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  socialLogin: (provider, userData) => api.post('/auth/social-login', { provider, ...userData }),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  logout: () => api.post('/auth/logout'),
};

// Routes API
export const routesAPI = {
  getAll: (params) => api.get('/routes', { params }),
  getById: (id) => api.get(`/routes/${id}`),
  searchSuggestions: (query) => api.get('/routes/search/suggestions', { params: { q: query } }),
  getPopular: () => api.get('/routes/popular'),
  getNearby: (lat, lng, radius) => api.get('/routes/nearby', { params: { lat, lng, radius } }),
  rateRoute: (id, rating, review) => api.post(`/routes/${id}/rate`, { rating, review }),
  getSchedule: (id) => api.get(`/routes/${id}/schedule`),
  getBuses: (id) => api.get(`/routes/${id}/buses`),
};

// Buses API
export const busesAPI = {
  getAll: (params) => api.get('/buses', { params }),
  getById: (id) => api.get(`/buses/${id}`),
  getLiveTracking: (id) => api.get(`/buses/${id}/live-tracking`),
  updateLocation: (id, locationData) => api.post(`/buses/${id}/location`, locationData),
  updatePassengers: (id, passengerData) => api.post(`/buses/${id}/passengers`, passengerData),
  updateStatus: (id, statusData) => api.post(`/buses/${id}/status`, statusData),
  getLiveByRoute: (routeId) => api.get(`/buses/route/${routeId}/live`),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.post(`/bookings/${id}/cancel`, { reason }),
  processPayment: (id, paymentData) => api.post(`/bookings/${id}/payment`, paymentData),
  rateTrip: (id, ratingData) => api.post(`/bookings/${id}/rate`, ratingData),
  getStats: () => api.get('/bookings/stats/summary'),
};

// Tracking API
export const trackingAPI = {
  getLive: () => api.get('/tracking/live'),
  getByRoute: (routeId) => api.get(`/tracking/route/${routeId}`),
  setAlert: (alertData) => api.post('/tracking/alert', alertData),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
};

// Payments API
export const paymentsAPI = {
  createIntent: (paymentData) => api.post('/payments/create-intent', paymentData),
  confirm: (paymentData) => api.post('/payments/confirm', paymentData),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  changePassword: (passwordData) => api.post('/users/change-password', passwordData),
};

export default api;
