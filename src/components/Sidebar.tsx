import { Home, Search, MapPin, Clock, Ticket, Settings, HelpCircle, LogOut, CreditCard, User, History } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  user?: { id: string; name: string; email: string; avatar?: string } | null;
  onLogout: () => void;
}

export function Sidebar({ activeTab, onTabChange, isOpen, onClose, user, onLogout }: SidebarProps) {
  const mainNavItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Route Search' },
    { id: 'map', icon: MapPin, label: 'Live Tracking' },
    { id: 'schedule', icon: Clock, label: 'Schedules' },
    { id: 'tickets', icon: Ticket, label: 'My Tickets' },
    { id: 'routepass', icon: CreditCard, label: 'Route Pass' },
    { id: 'mytrips', icon: History, label: 'My Trips' },
  ];

  const secondaryNavItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:block
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                🚌
              </div>
              <h2>BusTracker</h2>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      onTabChange(item.id);
                      onClose();
                    }}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onTabChange(item.id);
                      onClose();
                    }}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            {user && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            )}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}