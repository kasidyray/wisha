import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/auth';
import type { User } from '@/lib/mock-db/types';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: User } | undefined>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{ user: User } | undefined>;
  checkUserExists: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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

  const login = async (email: string, password: string) => {
    try {
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get additional user data
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      // Update local state
      setUser(userData);
      setSession(session);

      return { user: userData };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { data: { user, session }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create user profile
      const { data: userData, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            name,
            email,
          },
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      // Update local state
      setUser(userData);
      setSession(session);

      return { user: userData };
    } catch (error) {
      console.error('Error signing up:', error);
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
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 