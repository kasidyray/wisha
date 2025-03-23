import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { auth } from '@/lib/mock-db/api';
import type { User } from '@/lib/mock-db/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string, redirectTo?: string) => Promise<void>;
  checkUserExists: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'wisha_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const sessionUser = localStorage.getItem(AUTH_KEY);
        if (sessionUser) {
          setUser(JSON.parse(sessionUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid session data
        localStorage.removeItem(AUTH_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, redirectTo?: string) => {
    try {
      const authenticatedUser = await auth.login(email, password);
      
      // Store user data
      localStorage.setItem(AUTH_KEY, JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      
      toast.success('Welcome back!');
      
      // Only redirect if redirectTo is provided
      if (redirectTo) {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, redirectTo?: string) => {
    try {
      const newUser = await auth.signup({ email, password, name });
      
      // Store user data
      localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success('Account created successfully!');
      
      // Only redirect if redirectTo is provided
      if (redirectTo) {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      if (error instanceof Error && error.message === 'Email already exists') {
        toast.error('This email is already registered');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    navigate('/');
    toast.success('Logged out successfully');
  };

  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      // Just check if an email exists, don't actually authenticate
      const result = await auth.checkUserExists(email);
      return result;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup, checkUserExists }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 