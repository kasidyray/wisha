import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventsApi, messagesApi } from '@/lib/mock-db/api';
import type { Event, Message } from '@/lib/mock-db/types';
import { X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { eventsService } from '@/services/events';
import { Spinner } from '@/components/ui/spinner';

// Event type options for selection
const eventTypes = [
  { value: 'all', label: 'All Events' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'baby-shower', label: 'Baby Shower' },
  { value: 'networking', label: 'Tech & Networking' },
  { value: 'party', label: 'Parties' },
];

interface EventPreviewProps {
  buttonVariant?: 'outline' | 'airbnb' | 'default'; 
  buttonSize?: 'default' | 'sm' | 'lg';
  className?: string;
}

const EventPreview: React.FC<EventPreviewProps> = ({ 
  buttonVariant = 'outline', 
  buttonSize = 'lg',
  className = ''
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load available events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = await eventsApi.list();
        setEvents(allEvents);
        
        // Set a random event as current by default
        if (allEvents.length > 0) {
          const randomEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
          setCurrentEvent(randomEvent);
          
          // Load messages for this event
          const eventMessages = await messagesApi.list(randomEvent.id);
          setMessages(eventMessages);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading events:', error);
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      loadEvents();
    }
  }, [isOpen]);

  // Handle event type selection
  const handleTypeChange = async (type: string) => {
    setSelectedType(type);
    setIsLoading(true);
    
    try {
      // Get either filtered or all events
      const allEvents = await eventsApi.list();
      const filteredEvents = type === 'all' 
        ? allEvents 
        : allEvents.filter(event => 
            event.type.toLowerCase() === type.toLowerCase()
          );
      
      // If we have events of this type, select a random one
      if (filteredEvents.length > 0) {
        const randomEvent = filteredEvents[Math.floor(Math.random() * filteredEvents.length)];
        setCurrentEvent(randomEvent);
        
        // Load messages for this event
        const eventMessages = await messagesApi.list(randomEvent.id);
        setMessages(eventMessages);
      } else {
        setCurrentEvent(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error filtering events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render message media content
  const renderMediaContent = (media: Message['media']) => {
    if (!media) return null;
    
    switch (media.type) {
      case 'image':
        return (
          <div className="aspect-[4/3] overflow-hidden">
            <img 
              src={media.url} 
              alt="Media attachment"
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'gif':
        return (
          <div className="aspect-[4/3] overflow-hidden">
            <img 
              src={media.url} 
              alt="GIF"
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'video':
        return (
          <div className="aspect-[16/9] overflow-hidden">
            <video 
              src={media.url} 
              controls 
              className="w-full h-auto" 
            />
          </div>
        );
      case 'audio':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <audio controls className="w-full">
              <source src={media.url} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size={buttonSize} 
          className={`rounded-full ${buttonVariant === 'outline' ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50' : ''} ${className}`}
        >
          Preview Events
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-5xl p-0 rounded-xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="flex flex-col h-[80vh]">
          {/* Header with type selector */}
          <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-xl font-bold">Event Preview</DialogTitle>
              
              <div className="w-48">
                <Select 
                  value={selectedType} 
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger className="rounded-lg border-gray-200">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full w-8 h-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Main content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner size="lg" />
              </div>
            ) : !currentEvent ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-32 h-32 mb-6">
                  <img 
                    src="https://illustrations.popsy.co/amber/taking-notes.svg" 
                    alt="No events"
                    className="w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  We couldn't find any events of this type. Try selecting a different category.
                </p>
                <Button 
                  variant="airbnb" 
                  onClick={() => handleTypeChange('all')}
                  className="rounded-full"
                >
                  View All Events
                </Button>
              </div>
            ) : (
              <div className="p-6">
                {/* Event header */}
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{currentEvent.title}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                          {currentEvent.type.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                        <span>•</span>
                        <span>{new Date(currentEvent.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => navigate(`/events/${currentEvent.id}`)}
                      variant="airbnb"
                      className="rounded-full"
                    >
                      Visit Event
                    </Button>
                  </div>
                  
                  <p className="text-gray-700">{currentEvent.description}</p>
                </div>
                
                {/* Messages display */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Messages ({messages.length})</h3>
                  
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-24 h-24 mb-4">
                        <img 
                          src="https://illustrations.popsy.co/amber/message.svg" 
                          alt="No messages"
                          className="w-full h-full"
                        />
                      </div>
                      <h4 className="text-lg font-medium mb-2">No messages yet</h4>
                      <p className="text-gray-500 max-w-md">
                        This event doesn't have any messages yet. Be the first to write one!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          {message.media && renderMediaContent(message.media)}
                          
                          <div className="p-4">
                            <p className="text-gray-800 mb-3">{message.content}</p>
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#FF385C]/10 flex items-center justify-center text-[#FF385C] font-medium">
                                  {message.author.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium">{message.author.name}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t flex justify-between items-center bg-gray-50">
            <div className="text-sm text-gray-500">
              Previewing example events and messages
            </div>
            <Button
              variant="airbnb"
              className="rounded-full"
              onClick={() => navigate('/create-event')}
            >
              Create Your Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventPreview; 