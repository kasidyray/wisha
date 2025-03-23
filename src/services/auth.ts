import { supabase } from '@/lib/supabase';
import { usersService } from './users';
import { toast } from 'sonner';

interface SignUpData {
  email: string;
  password: string;
  name: string;
}

interface UpdateProfileData {
  name?: string;
  avatar?: string | null;
}

export const authService = {
  /**
   * Sign up a new user with email/password
   */
  async signUp({ email, password, name }: SignUpData) {
    try {
      // 1. Create the auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // 2. Create a user profile in our database
      const newUser = await usersService.create({
        name,
        email,
        avatar: null,
      });

      if (!newUser) {
        // Attempt to clean up the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error('Failed to create user profile');
      }

      return {
        authUser: authData.user,
        profile: newUser,
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('User not found');

      // Get user profile from our database
      const profile = await usersService.getByEmail(email);
      if (!profile) {
        throw new Error('User profile not found');
      }

      return {
        authUser: data.user,
        profile,
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  /**
   * Get the current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error: any) {
      console.error('Get session error:', error);
      return null;
    }
  },

  /**
   * Get the current user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (!data.user) return null;

      // Get user profile from our database
      const profile = await usersService.getByEmail(data.user.email || '');
      if (!profile) {
        return null;
      }

      return {
        authUser: data.user,
        profile,
      };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Update the user's password
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  /**
   * Reset password - sends a reset password email
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;
      toast.success('Password reset email sent. Please check your inbox.');
      return true;
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileData) {
    try {
      const updatedProfile = await usersService.update(userId, {
        name: data.name,
        avatar: data.avatar,
      });

      if (!updatedProfile) {
        throw new Error('Failed to update profile');
      }

      return updatedProfile;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Check if a user with given email exists
   */
  async checkUserExists(email: string): Promise<boolean> {
    return await usersService.exists(email);
  },
}; 