import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  PlusCircle, 
  Calendar, 
  User as UserIcon, 
  Gift, 
  ChevronRight,
  MessageSquare,
  Clock,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { getCurrentUser, getUserEvents, getEventMessages } from '@/lib/data';
import { getEventTypeImage } from '@/lib/event-type-images';
import type { Event, Activity } from '@/lib/mock-db/types';
import type { User } from '@/lib/mock-db/types';
import { Loader } from '@/components/ui/loader';
import { activitiesService } from '@/services/activities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { eventsService } from '@/services/events';
import { messagesService } from '@/services/messages';
import type { Message } from '@/lib/mock-db/types';
import DashboardSkeleton from '@/components/DashboardSkeleton';

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageCountByEvent, setMessageCountByEvent] = useState<{[key: string]: number}>({});
  const [uniqueMessageParticipants, setUniqueMessageParticipants] = useState<number>(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Get current user
        const user = await getCurrentUser();
        setCurrentUser(user);

        if (user) {
          // Load user's events
          const userEvents = await getUserEvents(user.id);
          setEvents(userEvents);

          // Load activities for all the user's events
          let allEventActivities: Activity[] = [];
          await Promise.all(userEvents.map(async (event) => {
            const eventActivities = await activitiesService.list(event.id, 50);
            allEventActivities = [...allEventActivities, ...eventActivities];
          }));
          
          setActivities(allEventActivities);
          
          // Load message counts for each event
          const messageCounts: {[key: string]: number} = {};
          const uniqueParticipants = new Set<string>();
          
          // Get message counts for each event
          await Promise.all(userEvents.map(async (event) => {
            const messages = await getEventMessages(event.id);
            messageCounts[event.id] = messages.length;
            
            // Track unique participants (users who wrote messages)
            messages.forEach(message => {
              uniqueParticipants.add(message.author.id);
            });
          }));
          
          setMessageCountByEvent(messageCounts);
          setUniqueMessageParticipants(uniqueParticipants.size);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Filter activities to get only message-related ones for the user's events
  const messageActivities = activities
    .filter(activity => activity.type === 'new_message')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h1>
          <Link to="/login">
            <Button variant="airbnb">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-2 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#FF385C] flex items-center justify-center text-white font-bold">
                W
              </div>
              <span className="text-xl font-bold">Wisha</span>
            </Link>
          </div>
          <div>
            <UserAvatar user={currentUser} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
              <p className="text-gray-600">
                Manage your events and wishlists all in one place.
              </p>
            </div>
            <Link to="/create-event">
              <Button variant="airbnb" size="lg" className="whitespace-nowrap">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-600">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-[#FF385C]/10 p-3">
                  <Calendar className="h-6 w-6 text-[#FF385C]" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{events.length}</div>
                  <div className="text-sm text-gray-500">
                    Active events
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-600">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-[#FF385C]/10 p-3">
                  <UserIcon className="h-6 w-6 text-[#FF385C]" />
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {uniqueMessageParticipants}
                  </div>
                  <div className="text-sm text-gray-500">
                    Who wrote messages
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-600">Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-[#FF385C]/10 p-3">
                  <Gift className="h-6 w-6 text-[#FF385C]" />
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {events.reduce((sum, event) => sum + (event.itemCount || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    In your wishlists
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Events */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Events</h2>
            {events.length > 5 && (
              <Link to="/dashboard" className="text-[#FF385C] hover:underline text-sm font-medium flex items-center">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? (
              <>
                {events.map((event) => {
                  // Get the appropriate image for this event type
                  const { image: eventImage, alt: eventImageAlt } = getEventTypeImage(event.type);
                  
                  return (
                    <Link to={`/events/${event.id}`} key={event.id}>
                      <Card className="h-full hover:shadow-md transition-all duration-200 overflow-hidden border-none hover:-translate-y-1">
                        <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                          <img 
                            src={event.coverImage || eventImage} 
                            alt={event.title || eventImageAlt}
                            className="w-full h-full object-contain p-4"
                            onError={(e) => {
                              // If event cover image fails, fallback to event type image
                              const target = e.target as HTMLImageElement;
                              if (target.src !== eventImage) {
                                target.src = eventImage;
                              }
                            }}
                          />
                          <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-xs text-capitalize font-medium shadow-sm">
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <p className="text-gray-500 text-sm mb-1">Created {format(new Date(event.createdAt), 'MMMM dd, yyyy')}</p>
                          <h3 className="text-lg font-semibold mb-6 truncate">{event.title}</h3>
                          <div className="flex justify-between text-sm text-gray-600">
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {messageCountByEvent[event.id] || 0} messages
                            </div>
                            {/* <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDistanceToNow(new Date(event.updatedAt || event.createdAt))} ago
                            </div> */}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}

                <Link to="/create-event">
                  <Card className="h-full border-dashed hover:shadow-md transition-all duration-200 flex flex-col justify-center items-center p-8 hover:bg-gray-50 hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-full bg-[#FF385C]/10 flex items-center justify-center mb-4">
                      <PlusCircle className="h-8 w-8 text-[#FF385C]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Create New Event</h3>
                    <p className="text-gray-500 text-sm text-center">
                      Set up your next special occasion
                    </p>
                  </Card>
                </Link>
              </>
            ) : (
              <Card className="col-span-3 p-8 border hover:shadow-md transition-all duration-200">
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">You haven't created any events yet</p>
                  <Link to="/create-event">
                    <Button variant="airbnb">Create Your First Event</Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Activity Section - Vertical Timeline */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              {messageActivities.length > 0 ? (
                <div className="relative">
                  {/* Vertical Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline Items */}
                  <div className="space-y-6">
                    {messageActivities.slice(0, 20).map((activity, index) => {
                      const eventTitle = events.find(e => e.id === activity.eventId)?.title || '';
                      
                      return (
                        <div 
                          key={activity.id} 
                          className="relative pl-14"
                        >
                          {/* Timeline Dot */}
                          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#FF385C]/10 flex items-center justify-center z-10">
                            <MessageCircle className="h-4 w-4 text-[#FF385C]" />
                          </div>
                          
                          {/* Content Box */}
                          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="font-medium text-gray-800">
                              {activity.userName} added a message
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {eventTitle} • {formatDistanceToNow(new Date(activity.createdAt))} ago
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No recent message activities</p>
                </div>
              )}
            </CardContent>
            {messageActivities.length > 20 && (
              <CardFooter className="border-t bg-gray-50 py-3 px-4 rounded-b-xl">
                <Link to="/dashboard" className="text-[#FF385C] hover:underline text-sm font-medium flex items-center">
                  View All Activity
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
