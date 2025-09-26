import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNavigation } from './components/BottomNavigation';
import { Dashboard } from './components/Dashboard';
import { RouteSearch } from './components/RouteSearch';
import { LiveTracker } from './components/LiveTracker';
import { Schedule } from './components/Schedule';
import { TicketBooking } from './components/TicketBooking';
import { Login } from './components/Login';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { RoutePass } from './components/RoutePass';
import { Notifications } from './components/Notifications';
import { MyTrips } from './components/MyTrips';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; avatar?: string } | null>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
  };

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser);
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
  };

  const handleSettingsClick = () => {
    setActiveTab('settings');
  };

  const handleNotificationsClick = () => {
    setActiveTab('notifications');
  };

  const handleMyTripsClick = () => {
    setActiveTab('mytrips');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'search':
        return <RouteSearch />;
      case 'map':
        return <LiveTracker />;
      case 'schedule':
        return <Schedule />;
      case 'tickets':
        return <TicketBooking />;
      case 'routepass':
        return <RoutePass />;
      case 'settings':
        return <Settings user={user!} onProfileClick={handleProfileClick} />;
      case 'profile':
        return <Profile user={user!} onUpdateUser={handleUpdateUser} />;
      case 'notifications':
        return <Notifications />;
      case 'mytrips':
        return <MyTrips />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-muted-foreground">
              <h3>Feature Coming Soon</h3>
              <p className="text-sm mt-2">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  // Show login screen if user is not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        user={user}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onNotificationsClick={handleNotificationsClick}
        onMyTripsClick={handleMyTripsClick}
      />
      
      <div className="flex">
        {/* Sidebar for desktop */}
        <div className="hidden md:block">
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOpen={true}
            onClose={() => {}}
            user={user}
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile sidebar */}
        <div className="md:hidden">
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            user={user}
            onLogout={handleLogout}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Bottom navigation for mobile */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}