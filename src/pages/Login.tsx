import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const testUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    description: 'Event creator with multiple events'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    description: 'Baby shower event organizer'
  },
  {
    name: 'Alex Chen',
    email: 'alex@example.com',
    password: 'password123',
    description: 'Tech meetup organizer'
  }
];

const guestPreviews = [
  {
    name: 'Birthday Event',
    description: 'Preview John\'s Birthday Celebration',
    eventId: 'e1'
  },
  {
    name: 'Tech Event',
    description: 'Preview Tech Meetup & Networking',
    eventId: 'e4'
  },
  {
    name: 'Wedding Shower',
    description: 'Preview Sarah\'s Wedding Shower',
    eventId: 'e3'
  }
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  const handleTestUserLogin = async (testUser: typeof testUsers[0]) => {
    try {
      await login(testUser.email, testUser.password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
      toast.success(`Welcome back, ${testUser.name}!`);
    } catch (error) {
      console.error('Test user login failed:', error);
    }
  };

  const handleGuestPreview = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#FF385C] flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="text-xl font-bold">Wisha</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">
            Please sign in to your account
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" variant="airbnb">
              Sign In
            </Button>
            
            <p className="text-center text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#FF385C] hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </Card>

        <div className="space-y-6">
          <div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Test Accounts
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {testUsers.map((user) => (
                <Button
                  key={user.email}
                  variant="outline"
                  className="py-6 justify-start gap-3 hover:bg-gray-50"
                  onClick={() => handleTestUserLogin(user)}
                >
                  <div className="w-8 h-8 rounded-full bg-[#FF385C]/10 flex items-center justify-center text-[#FF385C] font-semibold shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-xs text-gray-500">{user.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Guest Preview
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {guestPreviews.map((guest) => (
                <Card
                  key={guest.eventId}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleGuestPreview(guest.eventId)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold">
                      G
                    </div>
                    <div>
                      <h3 className="font-medium">{guest.name}</h3>
                      <p className="text-sm text-gray-500">{guest.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;