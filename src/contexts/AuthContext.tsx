import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/auth';
import type { User } from '@/lib/mock-db/types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string, redirectTo?: string) => Promise<void>;
  checkUserExists: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const userSession = await authService.getSession();
        
        if (userSession) {
          setSession(userSession);
          
          // Fetch the user profile
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData.profile);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, redirectTo?: string) => {
    try {
      const result = await authService.signIn(email, password);
      
      // Store user data
      setUser(result.profile);
      
      // Fetch and store the session
      const userSession = await authService.getSession();
      setSession(userSession);
      
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
      const result = await authService.signUp({ email, password, name });
      
      // Store user data
      setUser(result.profile);
      
      // Fetch and store the session
      const userSession = await authService.getSession();
      setSession(userSession);
      
      toast.success('Account created successfully!');
      
      // Only redirect if redirectTo is provided
      if (redirectTo) {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        toast.error('This email is already registered');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      return await authService.checkUserExists(email);
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, logout, signup, checkUserExists }}>
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