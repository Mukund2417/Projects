import { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Download,
  Star,
  Filter,
  Search,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function MyTrips() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const trips = [
    {
      id: 'T001',
      from: 'Chandigarh',
      to: 'Amritsar',
      date: '2024-01-20',
      time: '09:30 AM',
      arrivalTime: '12:45 PM',
      duration: '3h 15m',
      fare: '₹250',
      busNumber: 'PB15-2847',
      seatNumber: 'A12',
      status: 'completed',
      rating: 4,
      bookingId: 'BK123456789',
      passengerCount: 2
    },
    {
      id: 'T002',
      from: 'Ludhiana',
      to: 'Jalandhar',
      date: '2024-01-22',
      time: '02:15 PM',
      arrivalTime: '03:45 PM',
      duration: '1h 30m',
      fare: '₹120',
      busNumber: 'PB22-1534',
      seatNumber: 'B08',
      status: 'upcoming',
      bookingId: 'BK123456790',
      passengerCount: 1
    },
    {
      id: 'T003',
      from: 'Patiala',
      to: 'Chandigarh',
      date: '2024-01-15',
      time: '06:00 PM',
      arrivalTime: '07:30 PM',
      duration: '1h 30m',
      fare: '₹180',
      busNumber: 'PB08-9876',
      seatNumber: 'C05',
      status: 'completed',
      rating: 5,
      bookingId: 'BK123456788',
      passengerCount: 1
    },
    {
      id: 'T004',
      from: 'Amritsar',
      to: 'Chandigarh',
      date: '2024-01-10',
      time: '11:00 AM',
      arrivalTime: '02:15 PM',
      duration: '3h 15m',
      fare: '₹250',
      busNumber: 'PB15-2847',
      seatNumber: 'A15',
      status: 'cancelled',
      refundAmount: '₹225',
      bookingId: 'BK123456787',
      passengerCount: 1
    },
    {
      id: 'T005',
      from: 'Jalandhar',
      to: 'Ludhiana',
      date: '2024-01-25',
      time: '04:30 PM',
      arrivalTime: '06:00 PM',
      duration: '1h 30m',
      fare: '₹120',
      busNumber: 'PB22-1534',
      seatNumber: 'D12',
      status: 'upcoming',
      bookingId: 'BK123456791',
      passengerCount: 1
    }
  ];

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'upcoming':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: MapPin },
    { label: 'Completed', value: trips.filter(t => t.status === 'completed').length, icon: CheckCircle },
    { label: 'Upcoming', value: trips.filter(t => t.status === 'upcoming').length, icon: Clock },
    { label: 'Total Spent', value: '₹920', icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">My Trips</h1>
        <p className="text-muted-foreground">View and manage your travel history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-semibold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trips by route or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trips</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trips List */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredTrips.length > 0 ? (
            <div className="space-y-4">
              {filteredTrips.map((trip) => (
                <Card key={trip.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <Badge className={getStatusColor(trip.status)}>
                            {getStatusIcon(trip.status)}
                            <span className="ml-1 capitalize">{trip.status}</span>
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Booking ID: {trip.bookingId}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{trip.from}</span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{trip.to}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{trip.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{trip.time} - {trip.arrivalTime}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Bus: </span>
                              <span className="font-medium">{trip.busNumber}</span>
                              <span className="text-muted-foreground ml-4">Seat: </span>
                              <span className="font-medium">{trip.seatNumber}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Duration: </span>
                              <span>{trip.duration}</span>
                              <span className="text-muted-foreground ml-4">Passengers: </span>
                              <span>{trip.passengerCount}</span>
                            </div>
                          </div>
                        </div>
                        
                        {trip.status === 'completed' && trip.rating && (
                          <div className="mt-3 flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Your rating:</span>
                            {renderStars(trip.rating)}
                          </div>
                        )}
                      </div>
                      
                      <div className="lg:text-right space-y-2">
                        <div className="text-2xl font-bold text-orange-600">
                          {trip.status === 'cancelled' ? trip.refundAmount : trip.fare}
                        </div>
                        {trip.status === 'cancelled' && (
                          <p className="text-sm text-green-600">Refund Processed</p>
                        )}
                        
                        <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          {trip.status === 'upcoming' && (
                            <Button size="sm">
                              View Details
                            </Button>
                          )}
                          {trip.status === 'completed' && !trip.rating && (
                            <Button size="sm">
                              <Star className="h-4 w-4 mr-2" />
                              Rate Trip
                            </Button>
                          )}
                          {trip.status === 'upcoming' && (
                            <Button variant="destructive" size="sm">
                              Cancel Trip
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Trips Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No trips match your search criteria.'
                    : 'You haven\'t taken any trips yet. Book your first trip now!'
                  }
                </p>
                <Button>Book a Trip</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="relative">
            {filteredTrips.map((trip, index) => (
              <div key={trip.id} className="relative flex items-start space-x-4 pb-8">
                {index < filteredTrips.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-full bg-border"></div>
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  trip.status === 'completed' ? 'bg-green-100 text-green-600' :
                  trip.status === 'upcoming' ? 'bg-blue-100 text-blue-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {getStatusIcon(trip.status)}
                </div>
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{trip.from} → {trip.to}</h4>
                      <Badge className={getStatusColor(trip.status)}>
                        {trip.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {trip.date} • {trip.time} • {trip.fare}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {trip.bookingId} • Bus {trip.busNumber} • Seat {trip.seatNumber}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}