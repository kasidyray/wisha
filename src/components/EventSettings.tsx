import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Copy,
  Mail,
  Share2,
  Calendar as CalendarIcon,
  Palette,
  Users,
  Clock,
  Check,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import { toast } from 'sonner';

// Color options with their classes and display colors
const backgroundColors = [
  { name: 'White', class: 'bg-white', color: '#FFFFFF' },
  { name: 'Rose', class: 'bg-rose-50', color: '#FFF1F2' },
  { name: 'Blue', class: 'bg-blue-50', color: '#EFF6FF' },
  { name: 'Green', class: 'bg-green-50', color: '#F0FDF4' },
  { name: 'Purple', class: 'bg-purple-50', color: '#FAF5FF' },
  { name: 'Amber', class: 'bg-amber-50', color: '#FFFBEB' },
];

interface EventSettingsProps {
  eventId: string;
  eventUrl: string;
}

const EventSettings: React.FC<EventSettingsProps> = ({ eventId, eventUrl }) => {
  const [date, setDate] = useState<Date>();
  const [autoDeliver, setAutoDeliver] = useState(false);
  
  // State for settings
  const [bgColor, setBgColor] = useState('bg-white');
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleEmailShare = () => {
    const eventUrl = window.location.href;
    window.location.href = `mailto:?subject=Join%20my%20Wisha%20event!&body=I've%20created%20a%20special%20event%20on%20Wisha.%20Add%20your%20wishes%20here:%20${encodeURIComponent(eventUrl)}`;
  };
  
  const changeBackgroundColor = (colorClass: string) => {
    setBgColor(colorClass);
    
    // Get the event container and apply the background color
    const eventContainer = document.querySelector('.event-page-background');
    if (eventContainer && typeof eventContainer.className === 'string') {
      // Remove existing background classes
      let className = eventContainer.className.replace(/bg-\w+-\d+/g, '').replace(/bg-white/g, '');
      // Add new background class
      eventContainer.className = `${className} ${colorClass}`;
    }
    
    // Save the preference (in a real app, this would make an API call)
    localStorage.setItem(`event_${eventId}_bgcolor`, colorClass);
    toast.success('Background color updated!');
  };

  return (
    <Tabs defaultValue="appearance" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="appearance" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Appearance
        </TabsTrigger>
        <TabsTrigger value="invite" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Invite
        </TabsTrigger>
        <TabsTrigger value="delivery" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Delivery
        </TabsTrigger>
      </TabsList>

      <TabsContent value="appearance">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="grid grid-cols-6 gap-2">
                {backgroundColors.map((color) => (
                  <button
                    key={color.class}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform',
                      color.class,
                      bgColor === color.class ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-primary/50'
                    )}
                    onClick={() => changeBackgroundColor(color.class)}
                    title={color.name}
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Font Style</Label>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-3 border rounded-lg hover:border-primary text-lg">
                  <span className="font-serif">Serif</span>
                </button>
                <button className="p-3 border rounded-lg hover:border-primary text-lg">
                  <span className="font-sans">Sans</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Custom Message</Label>
              <Input placeholder="Add a welcome message for contributors..." />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invite">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={eventUrl} readOnly />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Invite via</Label>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full justify-start" onClick={handleEmailShare}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email Invites
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Facebook className="mr-2 h-4 w-4" />
                  Share on Facebook
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Twitter className="mr-2 h-4 w-4" />
                  Share on Twitter
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Linkedin className="mr-2 h-4 w-4" />
                  Share on LinkedIn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="delivery">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Delivery</Label>
                <p className="text-sm text-muted-foreground">
                  Schedule when to deliver the event to the celebrant
                </p>
              </div>
              <Switch
                checked={autoDeliver}
                onCheckedChange={setAutoDeliver}
              />
            </div>

            {autoDeliver && (
              <div className="space-y-2">
                <Label>Delivery Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {!autoDeliver && (
              <Button className="w-full" variant="default">
                <Check className="mr-2 h-4 w-4" />
                Deliver Now
              </Button>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default EventSettings; 