import { useState } from 'react';
import { Ticket, CreditCard, QrCode, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function TicketBooking() {
  const [ticketType, setTicketType] = useState('single');
  const [passengers, setPassengers] = useState('1');

  const ticketTypes = [
    { id: 'single', name: 'Single Journey', price: 8, description: 'One-way ticket' },
    { id: 'return', name: 'Return Journey', price: 14, description: 'Round trip ticket' },
    { id: 'day-pass', name: 'Day Pass', price: 20, description: 'Unlimited rides for 24 hours' },
    { id: 'weekly', name: 'Weekly Pass', price: 65, description: '7 days unlimited travel' },
  ];

  const activeTickets = [
    {
      id: 'TKT-001',
      type: 'Day Pass',
      validUntil: 'Today 11:59 PM',
      ridesUsed: 3,
      status: 'active'
    },
    {
      id: 'TKT-002',
      type: 'Single Journey',
      route: 'Route 15 → Downtown',
      validUntil: 'Used',
      status: 'used'
    }
  ];

  const selectedTicket = ticketTypes.find(t => t.id === ticketType);
  const totalPrice = selectedTicket ? selectedTicket.price * parseInt(passengers) : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>My Tickets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTickets.length > 0 ? (
            <div className="space-y-3">
              {activeTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span>{ticket.type}</span>
                      <Badge 
                        variant={ticket.status === 'active' ? 'default' : 'secondary'}
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-1" />
                      Show
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Valid until: {ticket.validUntil}</p>
                    {ticket.route && <p>Route: {ticket.route}</p>}
                    {ticket.ridesUsed && <p>Rides used today: {ticket.ridesUsed}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Ticket className="h-12 w-12 mx-auto mb-2" />
              <p>No active tickets</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Buy Ticket</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Number of Passengers</Label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Passenger</SelectItem>
                <SelectItem value="2">2 Passengers</SelectItem>
                <SelectItem value="3">3 Passengers</SelectItem>
                <SelectItem value="4">4 Passengers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Ticket Type</Label>
            <RadioGroup 
              value={ticketType} 
              onValueChange={setTicketType}
              className="mt-2"
            >
              {ticketTypes.map((ticket) => (
                <div key={ticket.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value={ticket.id} id={ticket.id} />
                  <Label htmlFor={ticket.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>{ticket.name}</p>
                        <p className="text-sm text-muted-foreground">{ticket.description}</p>
                      </div>
                      <span>${ticket.price}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <span>Total</span>
              <span className="text-lg">${totalPrice}</span>
            </div>
            <Button className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Purchase Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}