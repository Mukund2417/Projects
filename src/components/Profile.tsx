import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Clock, 
  Award,
  Camera,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';

interface ProfileProps {
  user: { id: string; name: string; email: string; avatar?: string };
  onUpdateUser: (user: any) => void;
}

export function Profile({ user, onUpdateUser }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: '+91 98765 43210',
    address: 'Chandigarh, Punjab',
    dateOfBirth: '1990-01-01'
  });

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name: editForm.name,
      email: editForm.email
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: '+91 98765 43210',
      address: 'Chandigarh, Punjab',
      dateOfBirth: '1990-01-01'
    });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Total Trips', value: '47', icon: Clock },
    { label: 'Money Saved', value: '₹2,340', icon: CreditCard },
    { label: 'CO₂ Reduced', value: '23 kg', icon: Award },
    { label: 'Member Since', value: 'Jan 2024', icon: Calendar }
  ];

  const recentTrips = [
    {
      id: 1,
      from: 'Chandigarh',
      to: 'Amritsar',
      date: '2024-01-15',
      amount: '₹250',
      status: 'completed'
    },
    {
      id: 2,
      from: 'Ludhiana',
      to: 'Jalandhar',
      date: '2024-01-10',
      amount: '₹150',
      status: 'completed'
    },
    {
      id: 3,
      from: 'Patiala',
      to: 'Chandigarh',
      date: '2024-01-05',
      amount: '₹180',
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} size="sm">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-orange-200">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{user.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>+91 98765 43210</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Chandigarh, Punjab</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Verified User
                </Badge>
                <Badge variant="outline" className="border-orange-200 text-orange-700">
                  Punjab Resident
                </Badge>
                <Badge variant="secondary">Regular Commuter</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-orange-600" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Your progress and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Eco-Friendly Traveler</span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Take 100 bus trips to unlock this badge</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Regular Commuter</span>
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
              <Progress value={100} className="h-2" />
              <p className="text-xs text-green-600 mt-1">✓ Achievement unlocked!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Trips */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trips</CardTitle>
          <CardDescription>Your travel history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTrips.map((trip, index) => (
              <div key={trip.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <span className="text-xs font-medium text-green-600">✓</span>
                    </div>
                    <div>
                      <p className="font-medium">{trip.from} → {trip.to}</p>
                      <p className="text-sm text-muted-foreground">{trip.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{trip.amount}</p>
                    <Badge variant="secondary" className="text-xs">
                      {trip.status}
                    </Badge>
                  </div>
                </div>
                {index < recentTrips.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Trips
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}