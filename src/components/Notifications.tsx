import { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  X,
  Settings,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'route_update',
      title: 'Bus Arriving Soon',
      message: 'Route 15 bus will arrive at Sector 17 in 3 minutes',
      time: '2 min ago',
      read: false,
      icon: 'bus',
      severity: 'info'
    },
    {
      id: 2,
      type: 'delay',
      title: 'Route Delayed',
      message: 'Chandigarh-Amritsar route delayed by 15 minutes due to traffic',
      time: '10 min ago',
      read: false,
      icon: 'alert',
      severity: 'warning'
    },
    {
      id: 3,
      type: 'pass_expiry',
      title: 'Monthly Pass Expiring',
      message: 'Your monthly pass expires in 3 days. Renew now to avoid interruption.',
      time: '1 hour ago',
      read: true,
      icon: 'card',
      severity: 'warning'
    },
    {
      id: 4,
      type: 'booking_confirmation',
      title: 'Booking Confirmed',
      message: 'Your ticket for Ludhiana to Jalandhar on Jan 20 is confirmed',
      time: '2 hours ago',
      read: true,
      icon: 'check',
      severity: 'success'
    },
    {
      id: 5,
      type: 'maintenance',
      title: 'Service Update',
      message: 'New AC buses added to Route 22. Enhanced comfort for your journey!',
      time: '1 day ago',
      read: true,
      icon: 'info',
      severity: 'info'
    },
    {
      id: 6,
      type: 'promotion',
      title: 'Special Offer',
      message: '20% off on weekly passes this weekend. Limited time offer!',
      time: '2 days ago',
      read: false,
      icon: 'star',
      severity: 'info'
    }
  ]);

  const [settings, setSettings] = useState({
    busArrivals: true,
    routeDelays: true,
    passExpiry: true,
    promotions: false,
    maintenance: true
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (iconType: string, severity: string) => {
    const iconClass = severity === 'warning' ? 'text-yellow-600' : 
                     severity === 'success' ? 'text-green-600' : 
                     severity === 'error' ? 'text-red-600' : 'text-blue-600';
    
    switch (iconType) {
      case 'bus':
        return <MapPin className={`h-5 w-5 ${iconClass}`} />;
      case 'alert':
        return <AlertTriangle className={`h-5 w-5 ${iconClass}`} />;
      case 'card':
        return <Clock className={`h-5 w-5 ${iconClass}`} />;
      case 'check':
        return <CheckCircle className={`h-5 w-5 ${iconClass}`} />;
      case 'info':
        return <Info className={`h-5 w-5 ${iconClass}`} />;
      default:
        return <Bell className={`h-5 w-5 ${iconClass}`} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center space-x-2">
            <BellRing className="h-6 w-6 text-orange-600" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Stay updated with your bus services</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All Read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.icon, notification.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                Mark Read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
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
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Notifications</h3>
                <p className="text-muted-foreground">
                  You're all caught up! Check back later for updates.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {notifications.filter(n => !n.read).length > 0 ? (
            <div className="space-y-3">
              {notifications.filter(n => !n.read).map((notification) => (
                <Card 
                  key={notification.id} 
                  className="border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.icon, notification.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-orange-600 hover:text-orange-700"
                            >
                              Mark Read
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
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
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">
                  No unread notifications. Great job staying updated!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Customize what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Bus Arrivals</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when your bus is approaching
                    </p>
                  </div>
                  <Switch
                    checked={settings.busArrivals}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, busArrivals: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Route Delays</h4>
                    <p className="text-sm text-muted-foreground">
                      Be informed about delays and disruptions
                    </p>
                  </div>
                  <Switch
                    checked={settings.routeDelays}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, routeDelays: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Pass Expiry Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Reminders when your passes are about to expire
                    </p>
                  </div>
                  <Switch
                    checked={settings.passExpiry}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, passExpiry: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Maintenance Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Service improvements and maintenance notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenance}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, maintenance: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Promotions & Offers</h4>
                    <p className="text-sm text-muted-foreground">
                      Special deals and promotional offers
                    </p>
                  </div>
                  <Switch
                    checked={settings.promotions}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, promotions: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}