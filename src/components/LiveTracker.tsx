import { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Wifi, Navigation, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { busesAPI } from '../services/api';
import { toast } from 'sonner';

export function LiveTracker() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live bus data
  const fetchLiveBuses = async () => {
    try {
      const response = await busesAPI.getAll({ status: 'active' });
      setBuses(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching live buses:', error);
      toast.error('Failed to load live tracking data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLiveBuses();
  }, []);

  // Auto-refresh when live tracking is enabled
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      fetchLiveBuses();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-green-500';
      case 'delayed': return 'bg-red-500';
      case 'early': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <div className="relative">
                <MapPin className="h-5 w-5" />
                {isLive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
              <span>Live Bus Tracking</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-muted-foreground">
                Last update: {lastUpdate.toLocaleTimeString()}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLive(!isLive)}
                className={isLive ? 'text-green-600' : 'text-muted-foreground'}
              >
                {isLive ? <Zap className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p>Interactive Map</p>
              <p className="text-sm">Real-time bus positions</p>
            </div>
            {/* Animated dots to simulate live tracking */}
            {isLive && (
              <>
                <div className="absolute top-4 left-4 w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="absolute top-8 right-6 w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-6 left-1/3 w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
              </>
            )}
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                <p>Loading live tracking data...</p>
              </div>
            ) : buses.length > 0 ? (
              buses.map((bus) => {
                const occupancyPercentage = bus.currentTrip?.occupancy || 0;
                
                return (
                  <div key={bus._id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(bus.operationalStatus)} ${isLive ? 'animate-pulse' : ''}`} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{bus.busNumber}</span>
                            <Badge variant="outline">{bus.routeId?.routeNumber || 'N/A'}</Badge>
                            {bus.operationalStatus === 'delayed' && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {bus.routeId?.name || 'Route not available'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{bus.currentTrip?.eta || 'N/A'}</span>
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">{bus.operationalStatus}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Current Location:</span>
                          <p>{bus.currentLocation?.address || 'Location not available'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Speed:</span>
                          <p className="flex items-center space-x-1">
                            <Navigation className="h-3 w-3" />
                            <span>{bus.currentTrip?.speed || 0} km/h</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{bus.currentTrip?.passengers?.current || 0}/{bus.capacity?.total || 0}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {bus.amenities?.wifi && <Wifi className="h-4 w-4 text-blue-500" title="WiFi Available" />}
                          {bus.amenities?.wheelchairAccessible && <span className="text-blue-500 text-sm">♿</span>}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Occupancy</span>
                          <span>{Math.round(occupancyPercentage)}%</span>
                        </div>
                        <Progress 
                          value={occupancyPercentage} 
                          className={`h-2 ${getOccupancyColor(occupancyPercentage)}`}
                        />
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Track Bus
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Set Alert
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>No active buses found</p>
                <p className="text-sm">Try refreshing or check back later</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}