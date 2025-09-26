import { useState, useEffect } from 'react';
import { Clock, MapPin, Ticket, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { routesAPI, busesAPI } from '../services/api';
import { toast } from 'sonner';

export function Dashboard() {
  const [nextBusTime, setNextBusTime] = useState(3);
  const [activeBuses, setActiveBuses] = useState(0);
  const [passengersToday, setPassengersToday] = useState(0);
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [nearbyStops, setNearbyStops] = useState([]);
  const [serviceAlerts, setServiceAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch popular routes
        const routesResponse = await routesAPI.getPopular();
        setPopularRoutes(routesResponse.data);
        
        // Fetch active buses count
        const busesResponse = await busesAPI.getAll({ status: 'active' });
        setActiveBuses(busesResponse.data.length);
        
        // Mock data for other stats (in real app, these would come from analytics API)
        setPassengersToday(12547);
        
        // Mock nearby stops
        setNearbyStops([
          { name: 'Chandigarh Bus Stand', distance: '0.2 km', routes: ['15', '22', '35'] },
          { name: 'Sector 17 Plaza', distance: '0.5 km', routes: ['8', '15', '30', '42'] },
          { name: 'Punjab University', distance: '0.8 km', routes: ['22', '45', '18'] },
          { name: 'ISBT Chandigarh', distance: '1.2 km', routes: ['All Routes'] },
        ]);
        
        // Mock service alerts
        setServiceAlerts([
          {
            type: 'delay',
            title: 'Chandigarh-Amritsar Route Delayed',
            message: 'Approximately 15 minutes due to road construction on GT Road',
            severity: 'medium'
          },
          {
            type: 'info',
            title: 'New AC Buses Added',
            message: 'Premium AC buses now available on Ludhiana-Jalandhar route',
            severity: 'low'
          },
          {
            type: 'maintenance',
            title: 'Weekend Schedule Active',
            message: 'Reduced frequency on city routes. Extra buses on highway routes.',
            severity: 'low'
          }
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickStats = [
    { label: 'Next Bus', value: `${nextBusTime} min`, icon: Clock, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20' },
    { label: 'Active Routes', value: '47', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Valid Passes', value: '2', icon: Ticket, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20' },
    { label: 'On-time Rate', value: '96%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/20' },
  ];


  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-8 bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-950/20 dark:to-green-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
        <div className="space-y-2">
          <div className="text-4xl mb-2">🚌</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
            Welcome to Punjab Bus
          </h2>
          <p className="text-muted-foreground">
            Smart, Safe & Sustainable Public Transportation
          </p>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>47 Routes Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span>{activeBuses} Buses Online</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              <span>{passengersToday.toLocaleString()} Passengers Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Featured Routes */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {popularRoutes.slice(0, 2).map((route, index) => (
              <div key={route._id} className="relative rounded-lg overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold mb-2">{route.name}</h3>
                  <p className="text-sm opacity-90 mb-4">{route.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">₹{route.fare.base}</span>
                    <Button variant="secondary" size="sm">Book Now</Button>
                  </div>
                </div>
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src="https://images.unsplash.com/photo-1681004478577-cb7f8421f78c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdW5qYWIlMjBpbmRpYSUyMGJ1cyUyMHRyYW5zcG9ydHxlbnwxfHx8fDE3NTg5MDQ5ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Punjab Bus" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
            
            {popularRoutes.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>No popular routes available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <MapPin className="h-6 w-6 text-orange-600" />
              <span className="text-sm">Find Routes</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Ticket className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Book Ticket</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Clock className="h-6 w-6 text-green-600" />
              <span className="text-sm">Live Tracking</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Monthly Pass</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Alerts */}
      {serviceAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Service Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {serviceAlerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    alert.severity === 'high' ? 'text-red-500' :
                    alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nearby Stops */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Nearby Stops</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nearbyStops.map((stop, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                <div>
                  <p>{stop.name}</p>
                  <p className="text-sm text-muted-foreground">{stop.distance} away</p>
                </div>
                <div className="flex items-center space-x-2">
                  {stop.routes.map((route) => (
                    <Badge key={route} variant="outline" className="text-xs">
                      {route}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Stops
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full">Plan New Trip</Button>
              <Button variant="outline" className="w-full">Repeat Last Journey</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Travel Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>This Month</span>
                  <span>23 trips</span>
                </div>
                <Progress value={76} className="h-2" />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>CO₂ saved: 15.2 kg</p>
                <p>Money saved: $45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}