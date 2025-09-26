import { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  Plus,
  QrCode,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function RoutePass() {
  const [activeTab, setActiveTab] = useState('active');
  const [showMonthlyPassModal, setShowMonthlyPassModal] = useState(false);

  const activePasses = [
    {
      id: 'RP001',
      name: 'Chandigarh - Amritsar Monthly Pass',
      route: 'Route 15',
      validity: '30 days',
      validUntil: '2024-02-15',
      price: '₹1,200',
      usedTrips: 12,
      totalTrips: 60,
      status: 'active',
      qrCode: 'QR123456789'
    },
    {
      id: 'RP002',
      name: 'City Circle Weekly Pass',
      route: 'Multiple Routes',
      validity: '7 days',
      validUntil: '2024-01-22',
      price: '₹300',
      usedTrips: 8,
      totalTrips: 20,
      status: 'expiring',
      qrCode: 'QR987654321'
    }
  ];

  const availablePasses = [
    {
      id: 'AP001',
      name: 'Daily Pass - All Routes',
      description: 'Unlimited travel on all Punjab Bus routes for 24 hours',
      price: '₹50',
      validity: '1 day',
      routes: 'All Routes',
      savings: '₹20',
      popular: false
    },
    {
      id: 'AP002',
      name: 'Weekly Pass - City Routes',
      description: 'Unlimited travel within city limits for 7 days',
      price: '₹300',
      validity: '7 days',
      routes: 'City Routes',
      savings: '₹150',
      popular: true
    },
    {
      id: 'AP003',
      name: 'Monthly Pass - Premium',
      description: 'Unlimited travel on all routes including AC buses',
      price: '₹1,500',
      validity: '30 days',
      routes: 'All Routes + AC',
      savings: '₹800',
      popular: true,
      features: ['Unlimited AC bus rides', 'Priority boarding', 'Free WiFi access', 'Mobile app exclusive deals']
    },
    {
      id: 'AP004',
      name: 'Student Monthly Pass',
      description: 'Special discounted pass for students with valid ID',
      price: '₹800',
      validity: '30 days',
      routes: 'All Routes',
      savings: '₹500',
      popular: false,
      badge: 'Student Only'
    },
    {
      id: 'AP005',
      name: 'Senior Citizen Pass',
      description: 'Special pass for senior citizens (60+ years)',
      price: '₹600',
      validity: '30 days',
      routes: 'All Routes',
      savings: '₹600',
      popular: false,
      badge: 'Senior Citizen'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'expired':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'expiring':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Route Passes</h1>
        <p className="text-muted-foreground">Manage your travel passes and save money</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Passes</TabsTrigger>
          <TabsTrigger value="available">Buy New Pass</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activePasses.length > 0 ? (
            <div className="space-y-4">
              {activePasses.map((pass) => {
                const usagePercentage = (pass.usedTrips / pass.totalTrips) * 100;
                
                return (
                  <Card key={pass.id} className="border-l-4 border-l-orange-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{pass.name}</CardTitle>
                          <CardDescription className="flex items-center space-x-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{pass.route}</span>
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(pass.status)}>
                          {getStatusIcon(pass.status)}
                          <span className="ml-1 capitalize">{pass.status}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Pass ID</p>
                          <p className="font-medium">{pass.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Valid Until</p>
                          <p className="font-medium">{pass.validUntil}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Price Paid</p>
                          <p className="font-medium">{pass.price}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Validity</p>
                          <p className="font-medium">{pass.validity}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Usage Progress</span>
                          <span>{pass.usedTrips}/{pass.totalTrips} trips</span>
                        </div>
                        <Progress value={usagePercentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {pass.totalTrips - pass.usedTrips} trips remaining
                        </p>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <QrCode className="h-4 w-4 mr-2" />
                          Show QR Code
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Active Passes</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any active route passes. Buy a pass to save money on your regular trips.
                </p>
                <Button onClick={() => setActiveTab('available')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buy Your First Pass
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4">
            {availablePasses.map((pass) => (
              <Card key={pass.id} className={`relative ${pass.popular ? 'border-orange-500 shadow-md' : ''}`}>
                {pass.popular && (
                  <div className="absolute -top-2 left-4">
                    <Badge className="bg-orange-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{pass.name}</CardTitle>
                        {pass.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {pass.badge}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-1">{pass.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{pass.price}</div>
                      <div className="text-sm text-green-600">Save {pass.savings}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{pass.validity}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{pass.routes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-green-500" />
                      <span>Unlimited Trips</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => {
                      if (pass.id === 'AP003') {
                        setShowMonthlyPassModal(true);
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {pass.id === 'AP003' ? 'Get Monthly Pass' : 'Buy This Pass'}
                  </Button>
                  
                  {pass.features && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Includes:</p>
                      {pass.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Benefits Card */}
      <Card className="bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-950/20 dark:to-green-950/20 border-orange-200 dark:border-orange-800">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center">
            <Star className="h-5 w-5 text-orange-600 mr-2" />
            Pass Benefits
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Unlimited travel within validity</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Skip ticket queues</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Digital QR code access</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Pass Modal */}
      {showMonthlyPassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Monthly Premium Pass</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMonthlyPassModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Choose your monthly pass duration and save more!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">1 Month Pass</h4>
                      <p className="text-sm text-muted-foreground">Valid for 30 days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">₹1,500</p>
                      <p className="text-xs text-green-600">Save ₹800</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-2 border-orange-500 rounded-lg p-4 cursor-pointer bg-orange-50 dark:bg-orange-950/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">3 Month Pass</h4>
                      <p className="text-sm text-muted-foreground">Valid for 90 days</p>
                      <Badge className="mt-1 bg-orange-500 text-white">Most Popular</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">₹4,000</p>
                      <p className="text-xs text-green-600">Save ₹2,500</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">6 Month Pass</h4>
                      <p className="text-sm text-muted-foreground">Valid for 180 days</p>
                      <Badge variant="secondary" className="mt-1">Best Value</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">₹7,500</p>
                      <p className="text-xs text-green-600">Save ₹5,500</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <h5 className="font-medium">Premium Features Included:</h5>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Unlimited AC & Non-AC bus rides</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Priority boarding at all stops</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Free WiFi access on select buses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Mobile app exclusive deals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowMonthlyPassModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Purchase Pass
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}