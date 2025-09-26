import { useState, useEffect } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { routesAPI } from '../services/api';
import { toast } from 'sonner';

export function RouteSearch() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (from.length > 2) {
        try {
          const response = await routesAPI.searchSuggestions(from);
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [from]);

  const handleSearch = async () => {
    if (!from.trim() || !to.trim()) {
      toast.error('Please enter both from and to locations');
      return;
    }

    setIsSearching(true);
    try {
      const response = await routesAPI.getAll({
        from: from.trim(),
        to: to.trim(),
        limit: 10
      });
      setSearchResults(response.data.routes);
      
      if (response.data.routes.length === 0) {
        toast.info('No routes found for the selected locations');
      }
    } catch (error) {
      console.error('Error searching routes:', error);
      toast.error('Failed to search routes');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Plan Your Trip</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="From"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="To"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button className="w-full" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Find Routes'}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((route) => (
                <div
                  key={route._id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{route.startLocation.name}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-sm font-medium">{route.endLocation.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Route {route.routeNumber} • {route.estimatedDuration} min • ₹{route.fare.base}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {route.description}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((route) => (
                <div
                  key={route._id}
                  className="p-2 rounded border cursor-pointer hover:bg-accent"
                  onClick={() => setFrom(route.startLocation.name)}
                >
                  <div className="text-sm font-medium">{route.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {route.startLocation.name} → {route.endLocation.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}