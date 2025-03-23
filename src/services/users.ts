import { supabase } from '@/lib/supabase';
import type { User } from '@/lib/mock-db/types';
import type { Database } from '@/lib/database.types';

type DbUser = Database['public']['Tables']['users']['Row'];

// Convert Supabase user to app User type
const mapDbUserToUser = (dbUser: DbUser): User => {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    avatar: dbUser.avatar_url,
    createdAt: new Date(dbUser.created_at),
    updatedAt: new Date(dbUser.updated_at)
  };
};

export const usersService = {
  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching user:', error);
      return null;
    }

    return mapDbUserToUser(data);
  },

  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      console.error('Error fetching user by email:', error);
      return null;
    }

    return mapDbUserToUser(data);
  },

  async create(userData: { name: string; email: string; avatar?: string | null }): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: userData.name,
          email: userData.email,
          avatar_url: userData.avatar || null,
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating user:', error);
      return null;
    }

    return mapDbUserToUser(data);
  },

  async update(
    id: string,
    userData: { name?: string; email?: string; avatar?: string | null }
  ): Promise<User | null> {
    const updates: { [key: string]: any } = { updated_at: new Date().toISOString() };

    if (userData.name !== undefined) updates.name = userData.name;
    if (userData.email !== undefined) updates.email = userData.email;
    if (userData.avatar !== undefined) updates.avatar_url = userData.avatar;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating user:', error);
      return null;
    }

    return mapDbUserToUser(data);
  },

  async exists(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned error means the user doesn't exist
        return false;
      }
      console.error('Error checking if user exists:', error);
      return false;
    }

    return !!data;
  }
}; 