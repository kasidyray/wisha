import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

interface EventFormProps {
  onSubmit: (eventData: any) => void;
  userLoggedIn?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, userLoggedIn = false }) => {
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
      if (user || userLoggedIn) {
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
  
  const eventTypes = [
    { value: 'birthday', label: 'Birthday & Celebrations', icon: '🎂' },
    { value: 'wedding', label: 'Wedding', icon: '💍' },
    { value: 'graduation', label: 'Graduation', icon: '🎓' },
    { value: 'anniversary', label: 'Anniversary', icon: '💝' },
    { value: 'retirement', label: 'Retirement', icon: '🏖️' },
    { value: 'babyShower', label: 'Baby Shower', icon: '👶' },
    { value: 'farewell', label: 'Farewell', icon: '👋' },
    { value: 'other', label: 'Other Occasion...', icon: '🎭' },
  ];
  
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Step indicator - Only show for non-logged in users */}
      {!userLoggedIn && (
        <div className="mb-8 flex">
          <div 
            className={`h-1 w-[200px] rounded-full transition-colors duration-300 ${step === 1 ? 'bg-[#FF385C]' : 'bg-gray-200'}`}
          ></div>
        </div>
      )}
      
      {/* Form Title */}
      <h1 className="text-2xl font-semibold mb-6">
        {step === 1 ? 'Create Your Event' : 'Set Up Your Account'}
      </h1>
      
      {/* Form Content */}
      <div className="space-y-6">
        {step === 1 ? (
          /* Step 1: Event Details */
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium mb-1">
                  Event Name
                </label>
                <Input
                  id="eventName"
                  name="eventName"
                  placeholder="E.g., John's Birthday, Sarah's Graduation"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium mb-1">
                  Event Type
                </label>
                <Select
                  value={formData.eventType}
                  onValueChange={handleEventTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <span className="mr-2">{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        ) : (
          /* Step 2: Account Info */
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isCheckingUser}
                  required
                />
              </div>
              
              {isCheckingUser && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-[#FF385C]" />
                  <span className="ml-2 text-sm text-gray-500">Checking email...</span>
                </div>
              )}
              
              {!isCheckingUser && userExists === false && !isEditingEmail && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Jane"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              
              {!isCheckingUser && userExists !== null && !isEditingEmail && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={userExists ? "Enter your password" : "Create a password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
          >
            Back
          </Button>
        )}
        
        <Button
          type="button"
          className={`${step > 1 ? 'ml-auto' : 'w-full'} bg-[#FF385C] hover:bg-[#FF385C]/90`}
          onClick={handleNext}
          disabled={
            isCheckingUser ||
            (step === 1 && (!formData.eventName || !formData.eventType)) ||
            (step === 2 && (
              !formData.email ||
              (userExists === false && !formData.firstName) ||
              (userExists !== null && !isEditingEmail && !formData.password)
            ))
          }
        >
          {isCheckingUser ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking
            </>
          ) : step === 1 ? (
            userLoggedIn ? "Create Event" : "Next"
          ) : (
            userExists === null || isEditingEmail ? (
              "Next"
            ) : (
              "Create Event"
            )
          )}
        </Button>
      </div>
    </div>
  );
};

export default EventForm;
