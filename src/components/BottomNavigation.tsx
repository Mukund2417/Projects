import { Home, Search, MapPin, Clock, Ticket } from 'lucide-react';
import { Button } from './ui/button';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'map', icon: MapPin, label: 'Map' },
    { id: 'schedule', icon: Clock, label: 'Schedule' },
    { id: 'tickets', icon: Ticket, label: 'Tickets' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex flex-col items-center justify-center h-full space-y-1 rounded-none ${
                isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}