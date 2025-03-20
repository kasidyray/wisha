
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import EventForm from '@/components/EventForm';
import { toast } from 'sonner';

const CreateEvent = () => {
  const navigate = useNavigate();
  
  const handleCreateEvent = (eventData: any) => {
    console.log('Event data submitted:', eventData);
    
    // Simulate API call to create event
    setTimeout(() => {
      toast.success('Event created successfully!');
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto animate-slide-down">
            <div className="inline-block bg-emerald-100 px-4 py-1 rounded-full mb-4">
              <span className="text-sm font-medium">Start collecting memories</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light mb-6">
              Create your event
            </h1>
            <p className="text-lg text-muted-foreground">
              Set up your event to start collecting beautiful messages from your friends and family.
            </p>
          </div>
          
          <EventForm onSubmit={handleCreateEvent} />
        </div>
      </div>
      
      {/* Quick Tips Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-serif">💡</span>
              </div>
              <h3 className="text-lg font-serif font-medium mb-2">Choose a Clear Name</h3>
              <p className="text-sm text-muted-foreground">
                Make your event name descriptive so guests know exactly what it's for.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-serif">📆</span>
              </div>
              <h3 className="text-lg font-serif font-medium mb-2">Set the Right Date</h3>
              <p className="text-sm text-muted-foreground">
                Your event will automatically close 7 days after your event date, but you can change this.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-serif">✉️</span>
              </div>
              <h3 className="text-lg font-serif font-medium mb-2">Personal Welcome</h3>
              <p className="text-sm text-muted-foreground">
                Add a welcome message to personalize the experience for your guests.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateEvent;
