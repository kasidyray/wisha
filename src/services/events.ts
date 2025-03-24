import { supabase } from '@/lib/supabase';
import type { Event } from '@/lib/mock-db/types';
import type { Database } from '@/lib/database.types';
import { usersService } from './users';

type DbEvent = Database['public']['Tables']['events']['Row'];

// Convert Supabase event to app Event type
const mapDbEventToEvent = async (dbEvent: DbEvent): Promise<Event> => {
  // Get creator info if available
  let creator = undefined;
  if (dbEvent.creator_id) {
    creator = await usersService.getById(dbEvent.creator_id);
  }

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    instructions: dbEvent.instructions || '',
    date: new Date(dbEvent.date),
    type: dbEvent.type,
    participantCount: dbEvent.participant_count,
    itemCount: dbEvent.item_count,
    coverImage: dbEvent.cover_image_url,
    creatorId: dbEvent.creator_id,
    creator: creator || undefined,
    createdAt: new Date(dbEvent.created_at),
    updatedAt: new Date(dbEvent.updated_at)
  };
};

export const eventsService = {
  async list(userId?: string): Promise<Event[]> {
    let query = supabase
      .from('events')
      .select('*');
    
    if (userId) {
      query = query.eq('creator_id', userId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    // Map all events and populate with creator info
    const events = await Promise.all(
      (data || []).map(async (dbEvent) => await mapDbEventToEvent(dbEvent))
    );

    return events;
  },

  async getById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching event:', error);
      return null;
    }

    return await mapDbEventToEvent(data);
  },

  async create(eventData: {
    title: string;
    description: string;
    instructions?: string;
    date: Date;
    type: string;
    creatorId: string;
    coverImage?: string;
  }): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title: eventData.title,
          description: eventData.description,
          instructions: eventData.instructions || null,
          date: eventData.date.toISOString(),
          type: eventData.type,
          participant_count: 0,
          item_count: 0,
          cover_image_url: eventData.coverImage || null,
          creator_id: eventData.creatorId,
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating event:', error);
      return null;
    }

    return await mapDbEventToEvent(data);
  },

  async update(
    id: string,
    eventData: {
      title?: string;
      description?: string;
      instructions?: string;
      date?: Date;
      type?: string;
      participantCount?: number;
      itemCount?: number;
      coverImage?: string | null;
      creatorId?: string;
    }
  ): Promise<Event | null> {
    const updates: { [key: string]: any } = { updated_at: new Date().toISOString() };

    if (eventData.title !== undefined) updates.title = eventData.title;
    if (eventData.description !== undefined) updates.description = eventData.description;
    if (eventData.instructions !== undefined) updates.instructions = eventData.instructions;
    if (eventData.date !== undefined) updates.date = eventData.date.toISOString();
    if (eventData.type !== undefined) updates.type = eventData.type;
    if (eventData.participantCount !== undefined) updates.participant_count = eventData.participantCount;
    if (eventData.itemCount !== undefined) updates.item_count = eventData.itemCount;
    if (eventData.coverImage !== undefined) updates.cover_image_url = eventData.coverImage;
    if (eventData.creatorId !== undefined) updates.creator_id = eventData.creatorId;

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating event:', error);
      return null;
    }

    return await mapDbEventToEvent(data);
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      return false;
    }

    return true;
  },

  async incrementParticipantCount(id: string): Promise<boolean> {
    const { error } = await supabase.rpc('increment_participant_count', { event_id: id });
    
    if (error) {
      console.error('Error incrementing participant count:', error);
      return false;
    }
    
    return true;
  }
}; 