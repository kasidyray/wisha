
import React, { useState } from 'react';
import { Calendar, Users, PartyPopper } from 'lucide-react';
import Button from './Button';

interface EventFormProps {
  onSubmit: (eventData: any) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'birthday',
    eventDate: '',
    hostName: '',
    email: '',
    password: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
  
  const eventTypes = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'babyShower', label: 'Baby Shower' },
    { value: 'farewell', label: 'Farewell' },
    { value: 'other', label: 'Other' },
  ];
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center w-full">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= i 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-100 text-muted-foreground'
                }`}
              >
                {i}
              </div>
              {i < 3 && (
                <div 
                  className={`flex-grow h-0.5 mx-2 ${
                    step > i ? 'bg-indigo-500' : 'bg-gray-100'
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
                  placeholder="e.g., Alex's 30th Birthday"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="eventType" className="block mb-1 text-sm font-medium">
                Event Type
              </label>
              <div className="relative">
                <PartyPopper className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                  required
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="hostName" className="block mb-1 text-sm font-medium">
                Host Name
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="hostName"
                  name="hostName"
                  type="text"
                  placeholder="e.g., Alex Smith"
                  value={formData.hostName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
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
