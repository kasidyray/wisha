import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar';
import { messagesApi } from '@/lib/mock-db/api';
import type { Message } from '@/lib/mock-db/types';
import { eventsService } from '@/services/events';
import { Loader } from '@/components/ui/loader';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';

// Colorful, event-themed images with minimalistic backgrounds
const eventImages = [
  // Birthday theme
  "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Colorful balloons
  "https://images.unsplash.com/photo-1514845505178-849cebf1a91d?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Birthday cake
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Party hat
  
  // Wedding theme
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Wedding couple
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Wedding rings
  
  // Graduation theme
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Graduation cap
  "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Graduation celebration
  
  // Tech event theme
  "https://images.unsplash.com/photo-1573164713712-03790a178651?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Colorful code
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Tech gadgets
  
  // Travel theme
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Travel scene
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Mountain landscape
  
  // Music event
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Music concert
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3", // Vinyl records
];

// Shape variations for the avatar display
const avatarShapes = [
  "rounded-t-[32px]", // rounded top, flat bottom
  "rounded-t-full", // fully rounded top, flat bottom
  "rounded-t-xl", // medium rounded top, flat bottom
  "rounded-t-lg", // slightly rounded top, flat bottom
  "rounded-t-[24px]", // rounded top, flat bottom
  "rounded-t-md", // small rounded top, flat bottom
];

// Avatar animation component
const AvatarScroller = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!scrollerRef.current) return;
    
    // For infinite scroll, we need to detect when scroll is near the end
    const handleScroll = () => {
      if (scrollerRef.current) {
        scrollerRef.current.scrollLeft += 0.5; // Slightly faster for smoother scroll
        
        // Reset scroll position when halfway through duplicate content for seamless loop
        if (scrollerRef.current.scrollLeft >= scrollerRef.current.scrollWidth / 2) {
          // Use a small timeout to avoid visible jump
          scrollerRef.current.scrollLeft = 1;
        }
      }
    };
    
    const animationId = setInterval(handleScroll, 16); // ~60fps
    
    return () => clearInterval(animationId);
  }, []);
  
  // Calculate the number of images needed based on viewport width
  // Wider images with minimal spacing between them
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full overflow-hidden h-[220px] md:h-[250px] bg-gradient-to-t from-white/95 via-white/90 to-transparent z-10">
      <div ref={scrollerRef} className="flex overflow-x-hidden py-0 w-full absolute bottom-[-40px] md:bottom-0 left-0 scrollbar-hide">
        <div className="flex space-x-3 whitespace-nowrap px-2">
          {/* First set of images */}
          {eventImages.map((imageUrl, index) => (
            <div 
              key={`event-${index}`} 
              className={`avatar-container inline-block ${
                avatarShapes[index % avatarShapes.length]
              } shadow-md overflow-hidden w-[250px] md:w-[280px] h-[200px] md:h-[220px]`}
              style={{
                transform: `translateY(${(index % 2) * 8}px)`
              }}
            >
              <img 
                src={imageUrl} 
                alt={`Event theme ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                style={{
                  filter: "grayscale(100%) contrast(1.1)",
                  transition: "filter 0.3s ease"
                }}
              />
            </div>
          ))}
          
          {/* Duplicate set for seamless looping */}
          {eventImages.map((imageUrl, index) => (
            <div 
              key={`event-dup-${index}`} 
              className={`avatar-container inline-block ${
                avatarShapes[index % avatarShapes.length]
              } shadow-md overflow-hidden w-[250px] md:w-[280px] h-[200px] md:h-[220px]`}
              style={{
                transform: `translateY(${(index % 2) * 8}px)`
              }}
            >
              <img 
                src={imageUrl} 
                alt={`Event theme ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                style={{
                  filter: "grayscale(100%) contrast(1.1)",
                  transition: "filter 0.3s ease"
                }}
              />
            </div>
          ))}
          
          {/* Third set to ensure no gaps in transition */}
          {eventImages.slice(0, 5).map((imageUrl, index) => (
            <div 
              key={`event-dup2-${index}`} 
              className={`avatar-container inline-block ${
                avatarShapes[index % avatarShapes.length]
              } shadow-md overflow-hidden w-[250px] md:w-[280px] h-[200px] md:h-[220px]`}
              style={{
                transform: `translateY(${(index % 2) * 8}px)`
              }}
            >
              <img 
                src={imageUrl} 
                alt={`Event theme ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                style={{
                  filter: "grayscale(100%) contrast(1.1)",
                  transition: "filter 0.3s ease"
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const { user: currentUser, isLoading } = useAuth();
  const [randomMessages, setRandomMessages] = useState<Message[]>([]);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);

  useEffect(() => {
    // Load messages for potential future use
    const loadMessages = async () => {
      try {
        // Get messages from the birthday event
        const birthdayMessages = await messagesApi.list('e1');
        // Get messages from the tech event
        const techMessages = await messagesApi.list('e4');
        
        // Combine and shuffle messages
        const allMessages = [...birthdayMessages, ...techMessages];
        const shuffled = allMessages.sort(() => 0.5 - Math.random());
        
        setRandomMessages(shuffled);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadMessages();
  }, []);

  // Function to navigate to a random event
  const handlePreviewEvents = async () => {
    setIsLoadingEvent(true);
    try {
      // Get all events with their message counts using Supabase
      const { data: eventsWithCounts, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          messages:messages(count)
        `)
        .not('messages', 'is', null);

      if (error) throw error;

      // Filter events with 6 or more messages
      const qualifiedEvents = eventsWithCounts.filter(event => 
        event.messages[0]?.count >= 6
      );
      
      // If there are qualified events, select a random one and navigate to it
      if (qualifiedEvents && qualifiedEvents.length > 0) {
        const randomEvent = qualifiedEvents[Math.floor(Math.random() * qualifiedEvents.length)];
        navigate(`/events/${randomEvent.id}`);
      } else {
        console.error('No events found with 6 or more messages');
        // Could add a toast notification here
      }
    } catch (error) {
      console.error('Error fetching random event:', error);
    } finally {
      setIsLoadingEvent(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col bg-gradient-to-br from-[#FAFAFA] via-white to-[#F0F4F8] text-gray-900 font-quicklnk relative">
      {/* Minimal soft gradients for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full opacity-40 blur-3xl bg-gradient-to-br from-[#FFE1E7] to-[#FFC7D5]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full opacity-30 blur-3xl bg-gradient-to-tr from-[#E1EBFF] to-[#C7D5FF]"></div>
              </div>
      
      {/* Header */}
      <header className="py-2 md:py-4 px-4 z-20 relative">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#FF385C] flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="text-xl font-bold">Wisha</span>
          </Link>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Spinner size="sm" />
            ) : currentUser ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost" className="rounded-full text-gray-700 hover:bg-gray-100">Dashboard</Button>
                </Link>
                <UserAvatar user={currentUser} />
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="rounded-full text-gray-700 hover:bg-gray-100">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="airbnb" className="rounded-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center relative pb-[240px] md:pb-[260px] my-8 md:my-0">
        {/* Centered Hero Text */}
        <div className="container max-w-6xl mx-auto px-4 text-center z-10 relative">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-quicklnk-heading leading-[1.1] mb-6">
              Share Moments <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF385C] via-[#FF6B81] to-[#FF8A9A]">Beyond Time</span>
            </h1>
            
            <p className="text-gray-600 text-xl md:text-2xl font-light mt-6 mx-auto max-w-2xl">
              Create a beautiful space for friends and family to share messages, memories, and media for your special occasions.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-10 justify-center">
              <Link to="/create-event">
                <Button 
                  variant="airbnb" 
                  size="lg" 
                  className="rounded-full px-8 text-base py-6 shadow-lg hover:shadow-xl"
                >
                  Create Event — It's Free
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 text-base py-6 border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                onClick={handlePreviewEvents}
                disabled={isLoadingEvent}
              >
                {isLoadingEvent ? (
                  <div className="flex items-center justify-center">
                    <Spinner size="sm" className="mr-2" />
                    <span>Loading...</span>
                  </div>
                ) : 'Preview Events'}
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-16 text-center max-w-xl mx-auto">
                    <div>
                <div className="text-3xl font-bold text-[#FF385C]">300+</div>
                <div className="text-gray-600 text-sm mt-1">Events Created</div>
                    </div>
                    <div>
                <div className="text-3xl font-bold text-[#FF385C]">5K+</div>
                <div className="text-gray-600 text-sm mt-1">Messages Shared</div>
              </div>
                    <div>
                <div className="text-3xl font-bold text-[#FF385C]">50K+</div>
                <div className="text-gray-600 text-sm mt-1">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Avatar Scroller with predefined event images */}
        <AvatarScroller />
        </div>
    </div>
  );
};

export default Index;
