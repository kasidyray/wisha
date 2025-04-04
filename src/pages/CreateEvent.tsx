import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EventForm from '@/components/EventForm';
import EventIllustration from '@/components/EventIllustration';
import { toast } from 'sonner';
import { UserAvatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { eventsService } from '@/services/events';
import { uploadEventCoverImage } from '@/lib/data';
import { Loader } from '@/components/ui/loader';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreateEvent = async (eventData: any) => {
    console.log('Event data submitted:', eventData);
    
    setIsSubmitting(true);
    
    try {
      // Upload cover image if provided
      let coverImageUrl = null;
      if (eventData.coverImage && eventData.coverImage instanceof File) {
        coverImageUrl = await uploadEventCoverImage(eventData.coverImage);
      }
      
      // Create the event
      const newEvent = await eventsService.create({
        title: eventData.eventName || eventData.title,
        type: eventData.eventType || eventData.type,
        date: eventData.eventDate ? new Date(eventData.eventDate) : new Date(),
        creatorId: currentUser?.id || '00000000-0000-0000-0000-000000000000', // Use guest ID if not logged in
        description: eventData.message || eventData.description || `Welcome to ${eventData.eventName || eventData.title}`,
        instructions: eventData.instructions || null,
        coverImage: coverImageUrl
      });
      
      toast.success('Event created successfully!');
      
      // Navigate to the event detail page
      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left Column - Illustration with brand background */}
      <div className="hidden lg:block w-1/2 bg-[#FF385C] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="white" fillRule="evenodd" opacity="0.2"></path>
            <path d="M0,0 L100,0 L50,100 L0,100 Z" fill="white" fillRule="evenodd" opacity="0.1"></path>
          </svg>
        </div>
        <div className="p-12 flex flex-col justify-center h-full max-w-xl mx-auto text-white">
          <EventIllustration className="mb-12" />
          
          <div className="px-4">
            <h2 className="text-2xl font-medium mb-6 text-white">Create a beautiful memory board</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-xl">💌</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1 text-white">Collect Memories</h3>
                  <p className="text-sm text-white/80">
                    Gather heartfelt messages, photos, and videos from your loved ones.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-xl">🎁</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1 text-white">Create a Gift</h3>
                  <p className="text-sm text-white/80">
                    Turn these messages into a beautiful digital or printed keepsake.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-xl">🎉</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1 text-white">Celebrate Together</h3>
                  <p className="text-sm text-white/80">
                    Share the finished gift with the recipient and make their day special.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-xs border-2 border-[#FF385C]">JD</div>
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-xs border-2 border-[#FF385C]">KM</div>
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-xs border-2 border-[#FF385C]">TR</div>
                </div>
                <p className="text-sm text-white/80">Join 10,000+ users creating meaningful memories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden lg:block w-px bg-gray-200 h-full"></div>
      
      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 px-4 py-12 flex items-start lg:items-center justify-center">
        <div className="w-full max-w-lg space-y-12">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-lg bg-[#FF385C] flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="text-xl font-bold">Wisha</span>
          </button>
          <div>
            {isSubmitting ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader className="h-12 w-12 border-4 border-[#FF385C] mb-4" />
                <p className="text-gray-600">Creating your event...</p>
              </div>
            ) : (
              <EventForm onSubmit={handleCreateEvent} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
