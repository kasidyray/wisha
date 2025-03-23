import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface EventFormProps {
  onSubmit: (eventData: any) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit }) => {
  const { user, checkUserExists, login, signup } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'birthday',
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    password: '',
  });
  
  const [userExists, setUserExists] = useState<boolean | null>(user ? true : null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  
  // Reset userExists when email changes
  useEffect(() => {
    if (!formData.email) {
      setUserExists(null);
      return;
    }
  }, [formData.email]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset userExists when email changes
    if (name === 'email') {
      setUserExists(null);
      setIsEditingEmail(true);
    }
  };
  
  const handleEventTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, eventType: value }));
  };
  
  const handleNext = async () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.eventName || !formData.eventType) {
        return;
      }
      
      // If user is already logged in, submit directly
      if (user) {
        onSubmit(formData);
        return;
      }
      
      setStep(2);
    } else if (step === 2) {
      if (!formData.email) return;
      
      // Always check email when Next is clicked in step 2
      if (userExists === null) {
        setIsCheckingUser(true);
        try {
          const exists = await checkUserExists(formData.email);
          setUserExists(exists);
          setIsEditingEmail(false);
          setIsCheckingUser(false);
          // Don't proceed yet - let the UI update first
          return;
        } catch (error) {
          console.error('Error checking user:', error);
          setUserExists(false);
          setIsCheckingUser(false);
          return;
        }
      }
      
      // If already checked and auth fields are filled, submit
      if (userExists !== null && 
         ((userExists === true && formData.password) || 
          (userExists === false && formData.firstName && formData.password))) {
        await handleSubmit();
      }
    }
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async () => {
    // Don't proceed if still checking or if required fields are missing
    if (isCheckingUser || userExists === null) {
      return;
    }
    
    // First authenticate or create user account
    try {
      if (userExists) {
        // Login user with explicit redirect to avoid automatic redirects
        await login(formData.email, formData.password, '/create-event');
      } else {
        // Register user with explicit redirect to avoid automatic redirects
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        await signup(formData.email, formData.password, fullName, '/create-event');
      }
      
      // Add a small delay to ensure auth state is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Then submit event data
      onSubmit(formData);
    } catch (error) {
      console.error('Authentication error:', error);
      // Don't submit if auth fails
    }
  };
  
  // Define event types with their categories and icons
  const eventTypes = [
    // Most Popular category
    { value: 'birthday', label: 'Birthday & Celebrations', icon: '🎂', category: 'Most Popular' },
    { value: 'congrats', label: 'Congrats & Praise', icon: '🎉', category: 'Most Popular' },
    { value: 'farewell', label: 'Farewell', icon: '👋', category: 'Most Popular' },
    { value: 'sympathy', label: 'Sympathy & Get Well', icon: '☀️', category: 'Most Popular' },
    { value: 'thank-you', label: 'Thank You', icon: '😊', category: 'Most Popular' },
    { value: 'welcome', label: 'Welcome & Onboarding', icon: '👋', category: 'Most Popular' },
    { value: 'service-anniversary', label: 'Years of Service Anniversary', icon: '🏆', category: 'Most Popular' },
    { value: 'other', label: 'Other Occasion...', icon: '🎭', category: 'Most Popular' },
    
    // More Occasions category
    { value: 'christmas', label: 'Christmas', icon: '🎄', category: 'More Occasions' },
    { value: 'easter', label: 'Easter', icon: '🥚', category: 'More Occasions' },
    { value: 'fathers-day', label: 'Father\'s Day', icon: '👨', category: 'More Occasions' },
    { value: 'fourth-of-july', label: 'Fourth of July', icon: '🇺🇸', category: 'More Occasions' },
    { value: 'graduation', label: 'Graduation', icon: '🎓', category: 'More Occasions' },
    { value: 'halloween', label: 'Halloween', icon: '🎃', category: 'More Occasions' },
    { value: 'hanukkah', label: 'Hanukkah', icon: '🕎', category: 'More Occasions' },
    { value: 'love', label: 'Love', icon: '❤️', category: 'More Occasions' },
    { value: 'memorial', label: 'Memorial', icon: '🕯️', category: 'More Occasions' },
    { value: 'mothers-day', label: 'Mother\'s Day', icon: '👩', category: 'More Occasions' },
    { value: 'new-baby', label: 'New Baby', icon: '👶', category: 'More Occasions' },
    { value: 'new-years', label: 'New Year\'s', icon: '🎆', category: 'More Occasions' },
    { value: 'retirement', label: 'Retirement', icon: '🏖️', category: 'More Occasions' },
    { value: 'staff-appreciation', label: 'Staff Appreciation Days', icon: '👏', category: 'More Occasions' },
    { value: 'thanksgiving', label: 'Thanksgiving', icon: '🦃', category: 'More Occasions' },
    { value: 'valentines-day', label: 'Valentine\'s Day', icon: '❤️', category: 'More Occasions' },
    { value: 'wedding', label: 'Wedding & Anniversary', icon: '💍', category: 'More Occasions' },
    { value: 'engagement', label: 'Engagement & Culture', icon: '📅', category: 'More Occasions' },
    { value: 'shout-out', label: 'Shout Out Board', icon: '📣', category: 'More Occasions' },
  ];
  
  // Group event types by category for display
  const popularEvents = eventTypes.filter(et => et.category === 'Most Popular');
  const moreEvents = eventTypes.filter(et => et.category === 'More Occasions');
  
  return (
    <div className="w-full">
      {/* Step indicator - horizontal lines */}
      <div className="mb-8 flex">
        <div 
          className={`h-1 w-[200px] rounded-full transition-colors duration-300 ${step === 1 ? 'bg-[#FF385C]' : 'bg-gray-200'}`}
        ></div>
        <div className="mx-2"></div>
        <div 
          className={`h-1 w-[200px] rounded-full transition-colors duration-300 ${step === 2 ? 'bg-[#FF385C]' : 'bg-gray-200'}`}
        ></div>
      </div>
      
      <form className="space-y-6 animate-fade-in">
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="mb-8">
              <div className="inline-block bg-[#FF385C]/10 px-4 py-1.5 rounded-full mb-4">
                <span className="text-sm font-medium text-[#FF385C]">Start collecting memories</span>
              </div>
              <h1 className="text-3xl font-medium mb-2">
                Tell us about your event
              </h1>
              <p className="text-gray-500">
                Set up your event to start collecting beautiful messages from your friends and family.
              </p>
            </div>
            
            <div>
              <label htmlFor="eventName" className="block mb-1.5 text-sm font-medium">
                Event Name
              </label>
              <Input
                id="eventName"
                name="eventName"
                type="text"
                placeholder="e.g., Alex's 30th Birthday"
                value={formData.eventName}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-200 focus-visible:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="eventType" className="block mb-1.5 text-sm font-medium">
                Event Type
              </label>
              <Select
                value={formData.eventType}
                onValueChange={handleEventTypeChange}
              >
                <SelectTrigger className="w-full rounded-xl border-gray-200">
                  <SelectValue placeholder="Select event type..." />
                </SelectTrigger>
                <SelectContent>
                  <div className="py-2 px-2 text-sm font-semibold text-gray-500">Most Popular</div>
                  {popularEvents.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center">
                        <span className="mr-2">{option.icon}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                  
                  <div className="py-2 px-2 text-sm font-semibold text-gray-500 pt-4 border-t">More Occasions</div>
                  {moreEvents.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center">
                        <span className="mr-2">{option.icon}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-6">
              <Button 
                type="button" 
                onClick={handleNext} 
                className="w-full bg-[#FF385C] hover:bg-[#FF385C]/90 text-white rounded-xl py-3 font-medium"
              >
                Continue
              </Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="mb-8">
              <div className="inline-block bg-[#FF385C]/10 px-4 py-1.5 rounded-full mb-4">
                <span className="text-sm font-medium text-[#FF385C]">Almost there</span>
              </div>
              <h1 className="text-3xl font-medium mb-2">
                Enter your email
              </h1>
              <p className="text-gray-500">
                This will allow you to save, invite, and share your event.
              </p>
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-1.5 text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-200 focus-visible:ring-primary"
                required
              />
              {formData.email && (
                <div className="mt-2 flex items-center">
                  {isCheckingUser ? (
                    <div className="flex items-center text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking account...
                    </div>
                  ) : userExists === true ? (
                    <p className="text-green-600 text-sm">Looks like you're already registered with Wisha. Enter your password.</p>
                  ) : userExists === false ? (
                    <p className="text-blue-600 text-sm">Looks like you're new to Wisha. What name should we call you?</p>
                  ) : null}
                </div>
              )}
            </div>
            
            {userExists === true && (
              <div>
                <label htmlFor="password" className="block mb-1.5 text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border-gray-200 focus-visible:ring-primary"
                  required
                />
              </div>
            )}
            
            {userExists === false && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block mb-1.5 text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full rounded-xl border-gray-200 focus-visible:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-1.5 text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full rounded-xl border-gray-200 focus-visible:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block mb-1.5 text-sm font-medium">
                    Set a password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Choose a secure password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border-gray-200 focus-visible:ring-primary"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Must be at least 8 characters
                  </p>
                </div>
              </>
            )}
            
            <div className="pt-6 flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                className="rounded-xl border-gray-200 hover:bg-gray-50"
              >
                Back
              </Button>
              <Button 
                type="button"
                onClick={handleNext}
                className="flex-1 bg-[#FF385C] hover:bg-[#FF385C]/90 text-white rounded-xl py-3 font-medium"
                disabled={
                  !formData.email || 
                  isCheckingUser
                }
              >
                {isCheckingUser ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </div>
                ) : userExists !== null && 
                   ((userExists === true && formData.password) || 
                    (userExists === false && formData.firstName && formData.password)) 
                    ? 'Create Event' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EventForm;
