import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  PlusCircle, 
  Calendar, 
  User, 
  Gift, 
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  mockEvents, 
  mockActivities, 
  getCurrentUser,
  type ActivityItem
} from '@/lib/mockData';

const Dashboard = () => {
  const currentUser = getCurrentUser();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
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
                  <div className="text-3xl font-bold">{mockEvents.length}</div>
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
                  <User className="h-6 w-6 text-[#FF385C]" />
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {mockEvents.reduce((sum, event) => sum + event.participantCount, 0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Across all events
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
                    {mockEvents.reduce((sum, event) => sum + event.itemCount, 0)}
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
            <Link to="/create-event" className="text-[#FF385C] hover:underline text-sm font-medium flex items-center">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEvents.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id}>
                <Card className="h-full hover:shadow-md transition-all duration-200 overflow-hidden border-none hover:-translate-y-1">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={event.coverImage || 'https://placehold.co/600x400'} 
                      alt={event.title}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                    <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-xs font-medium shadow-sm">
                      {event.type}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold mb-1 truncate">{event.title}</h3>
                    <p className="text-gray-500 text-sm mb-3">{format(event.date, 'MMMM dd, yyyy')}</p>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {event.participantCount} people
                      </div>
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 mr-1" />
                        {event.itemCount} items
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

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
          </div>
        </div>

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockActivities.slice(0, 3).map((activity) => {
                  const eventTitle = mockEvents.find(e => e.id === activity.eventId)?.title || '';
                  const timeAgo = getTimeAgo(activity.date);
                  
                  return (
                    <div key={activity.id} className="p-4 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#FF385C]/20 flex items-center justify-center mr-4">
                        {activity.type === 'join_event' && <User className="h-5 w-5 text-[#FF385C]" />}
                        {activity.type === 'add_item' && <Gift className="h-5 w-5 text-[#FF385C]" />}
                        {activity.type === 'update_event' && <Calendar className="h-5 w-5 text-[#FF385C]" />}
                      </div>
                      <div>
                        <p className="font-medium">
                          {activity.type === 'join_event' && `${activity.userName} joined your event`}
                          {activity.type === 'add_item' && `New item added to your wishlist`}
                          {activity.type === 'update_event' && `Event ${activity.details || 'updated'}`}
                        </p>
                        <p className="text-sm text-gray-500">{eventTitle} • {timeAgo}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 py-3 px-4 rounded-b-xl">
              <Link to="/activity" className="text-[#FF385C] hover:underline text-sm font-medium flex items-center">
                View All Activity
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'just now';
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

export default Dashboard;
