
import React, { useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import Button from './Button';

interface EventFormProps {
  onSubmit: (eventData: any) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    coupleNames: '',
    email: '',
    password: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center w-full">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= i 
                    ? 'bg-champagne-300 text-foreground' 
                    : 'bg-gray-100 text-muted-foreground'
                }`}
              >
                {i}
              </div>
              {i < 3 && (
                <div 
                  className={`flex-grow h-0.5 mx-2 ${
                    step > i ? 'bg-champagne-300' : 'bg-gray-100'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-xs text-center w-1/3">Event Details</div>
          <div className="text-xs text-center w-1/3">Account Setup</div>
          <div className="text-xs text-center w-1/3">Customize</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm animate-fade-in">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-serif font-medium mb-6">Tell us about your event</h2>
            
            <div>
              <label htmlFor="eventName" className="block mb-1 text-sm font-medium">
                Event Name
              </label>
              <div className="relative">
                <input
                  id="eventName"
                  name="eventName"
                  type="text"
                  placeholder="e.g., Sarah & John's Wedding"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-200 transition-all"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="coupleNames" className="block mb-1 text-sm font-medium">
                Couple's Names
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="coupleNames"
                  name="coupleNames"
                  type="text"
                  placeholder="e.g., Sarah & John"
                  value={formData.coupleNames}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-200 transition-all"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="eventDate" className="block mb-1 text-sm font-medium">
                Event Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-200 transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="button" onClick={handleNext} fullWidth>
                Continue
              </Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-serif font-medium mb-6">Set up your account</h2>
            
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-200 transition-all"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Choose a secure password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-200 transition-all"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 8 characters
              </p>
            </div>
            
            <div className="pt-4 flex space-x-4">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button type="button" onClick={handleNext} fullWidth>
                Continue
              </Button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-serif font-medium mb-6">Customize your event</h2>
            
            <div>
              <label htmlFor="message" className="block mb-1 text-sm font-medium">
                Welcome Message (optional)
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Add a personal message for your guests..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-200 transition-all"
              />
            </div>
            
            <div className="pt-4 flex space-x-4">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" fullWidth>
                Create Event
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EventForm;
