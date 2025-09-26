# Punjab Bus Transit System

A comprehensive bus transit management system with real-time tracking, booking, and user management features.

## Features

### Frontend (React + TypeScript)
- **Authentication**: Login, registration, and social login
- **Dashboard**: Real-time statistics and popular routes
- **Route Search**: Find routes with suggestions and filtering
- **Live Tracking**: Real-time bus location and status
- **Ticket Booking**: Book tickets with multiple payment options
- **My Trips**: View booking history and manage trips
- **Notifications**: Real-time alerts and updates
- **Profile Management**: User profile and settings

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Complete API for all frontend features
- **Real-time Updates**: Socket.IO for live tracking
- **Authentication**: JWT-based authentication
- **Database**: MongoDB with Mongoose ODM
- **Payment Integration**: Stripe payment gateway
- **Email Notifications**: Automated email alerts

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Bus App Interface Design
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Environment Setup

#### Backend Environment
Create a `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/punjab-bus
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Frontend Environment
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Database Setup

Make sure MongoDB is running on your system:
```bash
# Start MongoDB (if not already running)
mongod
```

The backend will automatically seed the database with sample data on first run.

## Running the Application

### Option 1: Manual Start

#### Start Backend Server
```bash
cd backend
npm run dev
```

#### Start Frontend Development Server
```bash
# In a new terminal
npm run dev
```

### Option 2: Using Startup Scripts

#### Windows
```bash
cd backend
start.bat
```

#### Linux/Mac
```bash
cd backend
chmod +x start.sh
./start.sh
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/social-login` - Social login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route by ID
- `GET /api/routes/popular` - Get popular routes
- `GET /api/routes/nearby` - Get nearby routes
- `POST /api/routes/:id/rate` - Rate a route

### Buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get bus by ID
- `GET /api/buses/:id/live-tracking` - Get live tracking data
- `POST /api/buses/:id/location` - Update bus location
- `POST /api/buses/:id/passengers` - Update passenger count

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/payment` - Process payment

### Tracking
- `GET /api/tracking/live` - Get live tracking data
- `GET /api/tracking/route/:routeId` - Get route tracking
- `POST /api/tracking/alert` - Set tracking alert

## Sample Data

The application comes with pre-seeded sample data:

### Routes
- **Route 15**: Chandigarh ↔ Amritsar (240 km, ₹250)
- **Route 22**: Ludhiana ↔ Jalandhar (60 km, ₹120)

### Buses
- **PB15-2847**: AC bus on Route 15
- **PB22-1534**: Standard bus on Route 22

## Testing the Application

### 1. User Registration/Login
- Register a new account or use social login
- Login with email/password

### 2. Explore Routes
- Use the dashboard to see popular routes
- Search for routes using the search functionality

### 3. Live Tracking
- View real-time bus locations
- Check bus status and occupancy

### 4. Book Tickets
- Select a route and bus
- Complete the booking process
- View booking confirmation

### 5. Manage Trips
- View booking history in "My Trips"
- Cancel upcoming trips
- Rate completed trips

## Development

### Project Structure
```
├── src/
│   ├── components/          # React components
│   ├── services/            # API services
│   ├── stores/              # State management
│   └── styles/              # CSS styles
├── backend/
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/           # Express middleware
│   └── seed.js              # Database seeding
└── public/                  # Static assets
```

### Key Technologies
- **Frontend**: React, TypeScript, Tailwind CSS, Zustand
- **Backend**: Node.js, Express, MongoDB, Socket.IO
- **Authentication**: JWT
- **Payments**: Stripe
- **Real-time**: Socket.IO

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.