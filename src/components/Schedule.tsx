import { useState } from 'react';
import { Clock, Calendar, MapPin, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function Schedule() {
  const [selectedRoute, setSelectedRoute] = useState('all');
  
  const schedules = [
    {
      route: 'Route 15',
      destination: 'Downtown',
      times: ['7:15 AM', '7:45 AM', '8:15 AM', '8:45 AM', '9:15 AM'],
      frequency: '30 min',
      status: 'normal'
    },
    {
      route: 'Route 22',
      destination: 'Airport',
      times: ['6:30 AM', '7:30 AM', '8:30 AM', '9:30 AM', '10:30 AM'],
      frequency: '60 min',
      status: 'delayed'
    },
    {
      route: 'Route 8',
      destination: 'Shopping Mall',
      times: ['7:00 AM', '7:20 AM', '7:40 AM', '8:00 AM', '8:20 AM'],
      frequency: '20 min',
      status: 'normal'
    }
  ];

  const upcomingDepartures = [
    { route: 'Route 15', time: '8:15 AM', countdown: '12 min', platform: 'A2' },
    { route: 'Route 8', time: '8:20 AM', countdown: '17 min', platform: 'B1' },
    { route: 'Route 22', time: '8:30 AM', countdown: '27 min', platform: 'C3' },
    { route: 'Route 15', time: '8:45 AM', countdown: '42 min', platform: 'A2' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Next Departures</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingDepartures.map((departure, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span>{departure.route}</span>
                      <Badge variant="outline" className="text-xs">
                        Platform {departure.platform}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{departure.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{departure.countdown}</p>
                  <p className="text-xs text-muted-foreground">remaining</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Full Schedule</span>
            </CardTitle>
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                <SelectItem value="route15">Route 15</SelectItem>
                <SelectItem value="route22">Route 22</SelectItem>
                <SelectItem value="route8">Route 8</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span>{schedule.route}</span>
                    <Badge 
                      variant={schedule.status === 'delayed' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {schedule.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Every {schedule.frequency}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  To {schedule.destination}
                </p>
                
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {schedule.times.map((time, timeIndex) => (
                    <Button
                      key={timeIndex}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}