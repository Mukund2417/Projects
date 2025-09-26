import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  MapPin, 
  Moon, 
  Sun, 
  Globe, 
  Smartphone,
  HelpCircle,
  MessageSquare,
  Star,
  Share2,
  Info,
  ChevronRight,
  Toggle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface SettingsProps {
  user: { id: string; name: string; email: string; avatar?: string };
  onProfileClick: () => void;
}

export function Settings({ user, onProfileClick }: SettingsProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile & Account',
          description: 'Manage your personal information',
          action: onProfileClick,
          showArrow: true
        },
        {
          icon: CreditCard,
          label: 'Payment Methods',
          description: 'Cards, wallets & payment options',
          showArrow: true,
          badge: '2 cards'
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Control your data and security',
          showArrow: true
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Push notifications and alerts',
          toggle: notifications,
          onToggle: setNotifications
        },
        {
          icon: darkMode ? Moon : Sun,
          label: 'Dark Mode',
          description: 'Switch between light and dark theme',
          toggle: darkMode,
          onToggle: setDarkMode
        },
        {
          icon: MapPin,
          label: 'Location Services',
          description: 'Allow app to access your location',
          toggle: locationTracking,
          onToggle: setLocationTracking
        },
        {
          icon: Smartphone,
          label: 'Auto Refresh',
          description: 'Automatically update bus timings',
          toggle: autoRefresh,
          onToggle: setAutoRefresh
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          description: 'Get help and contact support',
          showArrow: true
        },
        {
          icon: MessageSquare,
          label: 'Feedback',
          description: 'Share your thoughts with us',
          showArrow: true
        },
        {
          icon: Star,
          label: 'Rate Punjab Bus',
          description: 'Rate us on app store',
          showArrow: true
        }
      ]
    },
    {
      title: 'About',
      items: [
        {
          icon: Share2,
          label: 'Share App',
          description: 'Invite friends to use Punjab Bus',
          showArrow: true
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'Change app language',
          showArrow: true,
          badge: 'English'
        },
        {
          icon: Info,
          label: 'About Punjab Bus',
          description: 'Version 1.0.0 • Punjab Government',
          showArrow: true
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your Punjab Bus experience</p>
      </div>

      {/* User Card */}
      <Card className="bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-950/20 dark:to-green-950/20 border-orange-200 dark:border-orange-800">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-orange-200">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-orange-100 text-orange-700 text-lg">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Active User
                </Badge>
                <Badge variant="outline" className="border-orange-200 text-orange-700">
                  Punjab Resident
                </Badge>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onProfileClick}
              className="border-orange-200 hover:bg-orange-50"
            >
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <Card key={sectionIndex}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div 
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      item.action || item.showArrow ? 'hover:bg-muted cursor-pointer' : ''
                    }`}
                    onClick={item.action}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{item.label}</p>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {item.toggle !== undefined ? (
                        <Switch
                          checked={item.toggle}
                          onCheckedChange={item.onToggle}
                        />
                      ) : item.showArrow ? (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      ) : null}
                    </div>
                  </div>
                  {itemIndex < section.items.length - 1 && (
                    <Separator className="ml-16" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Punjab Government Branding */}
      <Card className="bg-gradient-to-r from-orange-500 to-green-600 text-white">
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <div className="text-2xl">🚌</div>
            <h3 className="font-semibold">Punjab Bus</h3>
            <p className="text-sm opacity-90">
              An initiative by Government of Punjab for better public transportation
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs opacity-75 mt-4">
              <span>Safe • Reliable • Affordable</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}