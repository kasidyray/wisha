import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import { usersService } from './users';

// Define our activity types
export interface Activity {
  id: string;
  type: 'join_event' | 'add_item' | 'update_event' | 'new_message';
  eventId: string;
  userId: string;
  userName: string;
  details?: string;
  createdAt: Date;
}

type DbActivity = Database['public']['Tables']['activities']['Row'];

// Convert Supabase activity to app Activity type
const mapDbActivityToActivity = async (dbActivity: DbActivity): Promise<Activity> => {
  // Get user info
  const user = await usersService.getById(dbActivity.user_id);
  
  return {
    id: dbActivity.id,
    type: dbActivity.type,
    eventId: dbActivity.event_id,
    userId: dbActivity.user_id,
    userName: user?.name || 'Unknown User',
    details: dbActivity.details || undefined,
    createdAt: new Date(dbActivity.created_at)
  };
};

export const activitiesService = {
  async list(eventId: string, limit = 10): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activities:', error);
      return [];
    }

    // Map all activities and populate with user info
    const activities = await Promise.all(
      (data || []).map(async (dbActivity) => await mapDbActivityToActivity(dbActivity))
    );

    return activities;
  },

  async create(activityData: {
    type: 'join_event' | 'add_item' | 'update_event' | 'new_message';
    eventId: string;
    userId: string;
    details?: string;
  }): Promise<Activity | null> {
    const { data, error } = await supabase
      .from('activities')
      .insert([
        {
          type: activityData.type,
          event_id: activityData.eventId,
          user_id: activityData.userId,
          details: activityData.details || null
        }
      ])
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating activity:', error);
      return null;
    }

    return await mapDbActivityToActivity(data);
  },

  async getRecentByUser(userId: string, limit = 5): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }

    // Map all activities and populate with user info
    const activities = await Promise.all(
      (data || []).map(async (dbActivity) => await mapDbActivityToActivity(dbActivity))
    );

    return activities;
  },

  async getRecentEventActivities(limit = 5): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .in('type', ['join_event', 'add_item', 'update_event'])
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent event activities:', error);
      return [];
    }

    // Map all activities and populate with user info
    const activities = await Promise.all(
      (data || []).map(async (dbActivity) => await mapDbActivityToActivity(dbActivity))
    );

    return activities;
  }
}; 