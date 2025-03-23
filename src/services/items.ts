import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

// Since EventItem is not defined in mock-db/types.ts, we'll define it here
export interface EventItem {
  id: string;
  eventId: string;
  name: string;
  description: string;
  url: string;
  image: string;
  price: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  claimedBy: string | null;
}

// Define the database item type manually since it's not in database.types.ts yet
interface DbItem {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
  claimed_by: string | null;
}

// Convert Supabase item to app EventItem type
const mapDbItemToEventItem = (dbItem: DbItem): EventItem => {
  return {
    id: dbItem.id,
    eventId: dbItem.event_id,
    name: dbItem.name,
    description: dbItem.description || '',
    url: dbItem.url || '',
    image: dbItem.image_url || '',
    price: dbItem.price,
    status: dbItem.status,
    createdAt: new Date(dbItem.created_at),
    updatedAt: new Date(dbItem.updated_at),
    claimedBy: dbItem.claimed_by
  };
};

export const itemsService = {
  async list(eventId: string): Promise<EventItem[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching items:', error);
      return [];
    }

    return (data || []).map(mapDbItemToEventItem);
  },

  async getById(id: string): Promise<EventItem | null> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching item:', error);
      return null;
    }

    return mapDbItemToEventItem(data);
  },

  async create(itemData: {
    eventId: string;
    name: string;
    description?: string;
    url?: string;
    image?: string;
    price?: number;
    status?: string;
  }): Promise<EventItem | null> {
    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          event_id: itemData.eventId,
          name: itemData.name,
          description: itemData.description || '',
          url: itemData.url || '',
          image_url: itemData.image || '',
          price: itemData.price || 0,
          status: itemData.status || 'available',
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating item:', error);
      return null;
    }

    return mapDbItemToEventItem(data);
  },

  async update(
    id: string,
    itemData: {
      name?: string;
      description?: string;
      url?: string;
      image?: string;
      price?: number;
      status?: string;
      claimedBy?: string | null;
    }
  ): Promise<EventItem | null> {
    const updates: { [key: string]: any } = { updated_at: new Date().toISOString() };

    if (itemData.name !== undefined) updates.name = itemData.name;
    if (itemData.description !== undefined) updates.description = itemData.description;
    if (itemData.url !== undefined) updates.url = itemData.url;
    if (itemData.image !== undefined) updates.image_url = itemData.image;
    if (itemData.price !== undefined) updates.price = itemData.price;
    if (itemData.status !== undefined) updates.status = itemData.status;
    if (itemData.claimedBy !== undefined) updates.claimed_by = itemData.claimedBy;

    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating item:', error);
      return null;
    }

    return mapDbItemToEventItem(data);
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      return false;
    }

    return true;
  },

  async claimItem(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('items')
      .update({
        status: 'claimed',
        claimed_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('status', 'available'); // Only claim if it's available

    if (error) {
      console.error('Error claiming item:', error);
      return false;
    }

    return true;
  },

  async unclaimItem(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('items')
      .update({
        status: 'available',
        claimed_by: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('claimed_by', userId); // Only unclaim if claimed by this user

    if (error) {
      console.error('Error unclaiming item:', error);
      return false;
    }

    return true;
  }
}; 