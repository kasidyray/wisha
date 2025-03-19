
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import { Copy, Share2, Settings, Download, Eye, Heart, MessageCircle, Image, Video, Mic } from 'lucide-react';
import { toast } from 'sonner';

interface EventData {
  id: string;
  name: string;
  date: string;
  messageCount: number;
  shareLink: string;
  imageCount: number;
  videoCount: number;
  audioCount: number;
}

const Dashboard = () => {
  const [events, setEvents] = useState<EventData[]>([
    {
      id: '1',
      name: "Sarah & John's Wedding",
      date: 'May 15, 2025',
      messageCount: 24,
      shareLink: 'wisha.app/e/sarah-john',
      imageCount: 12,
      videoCount: 5,
      audioCount: 7
    }
  ]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };
  
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-serif font-medium mb-2">Your Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your events and view collected wishes
              </p>
            </div>
            
            <Link to="/create-event">
              <Button className="mt-4 md:mt-0">
                Create New Event
              </Button>
            </Link>
          </div>
          
          {events.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-champagne-200 rounded-full flex items-center justify-center mr-4">
                            <span className="font-serif font-semibold">S&J</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-serif font-medium">{event.name}</h3>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => copyToClipboard(`https://${event.shareLink}`)}
                          className="flex items-center px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Copy className="w-4 h-4 mr-1" /> 
                          Copy Link
                        </button>
                        <button className="flex items-center px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
                          <Share2 className="w-4 h-4 mr-1" /> 
                          Share
                        </button>
                        <button className="flex items-center px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
                          <Settings className="w-4 h-4 mr-1" /> 
                          Settings
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="space-y-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blush-100 rounded-full flex items-center justify-center mr-4">
                            <Heart className="w-6 h-6 text-blush-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Messages Received</h4>
                            <p className="text-2xl font-serif">{event.messageCount}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Media Breakdown</h4>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Image className="w-4 h-4 text-champagne-500 mr-2" />
                              <span className="text-sm">{event.imageCount} Photos</span>
                            </div>
                            <div className="flex items-center">
                              <Video className="w-4 h-4 text-blush-500 mr-2" />
                              <span className="text-sm">{event.videoCount} Videos</span>
                            </div>
                            <div className="flex items-center">
                              <Mic className="w-4 h-4 text-cream-500 mr-2" />
                              <span className="text-sm">{event.audioCount} Audio Messages</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Share Link</h4>
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-50 px-3 py-1.5 rounded-l-md border border-gray-200 text-sm truncate">
                              https://{event.shareLink}
                            </div>
                            <button 
                              onClick={() => copyToClipboard(`https://${event.shareLink}`)}
                              className="px-3 py-1.5 bg-champagne-200 rounded-r-md border border-champagne-300 border-l-0"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-cream-50 rounded-xl p-6">
                        <h4 className="font-medium mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                          <Link to={`/events/${event.id}`}>
                            <Button 
                              variant="outline" 
                              fullWidth 
                              className="justify-start"
                              icon={<Eye className="w-4 h-4" />}
                            >
                              View Event Page
                            </Button>
                          </Link>
                          <Link to={`/events/${event.id}/gallery`}>
                            <Button 
                              variant="outline" 
                              fullWidth 
                              className="justify-start"
                              icon={<MessageCircle className="w-4 h-4" />}
                            >
                              View Messages
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            fullWidth 
                            className="justify-start"
                            icon={<Download className="w-4 h-4" />}
                          >
                            Download All Messages
                          </Button>
                          <Link to={`/events/${event.id}/settings`}>
                            <Button 
                              variant="outline" 
                              fullWidth 
                              className="justify-start"
                              icon={<Settings className="w-4 h-4" />}
                            >
                              Event Settings
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-cream-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Created on April 15, 2025
                      </p>
                      <Link to={`/events/${event.id}`} className="text-sm text-champagne-500 hover:text-champagne-600 transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 animate-fade-in">
              <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-champagne-500" />
              </div>
              <h2 className="text-xl font-serif font-medium mb-2">No Events Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first event to start collecting beautiful wishes from your loved ones.
              </p>
              <Link to="/create-event">
                <Button>
                  Create Your First Event
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
