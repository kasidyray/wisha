import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import { usersService } from './users';

// Define our message types
export interface MessageMedia {
  type: 'image' | 'video' | 'audio' | 'gif';
  url: string;
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  eventId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  media?: MessageMedia;
  createdAt: Date;
  updatedAt: Date;
}

type DbMessage = Database['public']['Tables']['messages']['Row'] & {
  guest_name?: string | null; // Add guest_name field
};

// Convert Supabase message to app Message type
const mapDbMessageToMessage = async (dbMessage: DbMessage): Promise<Message> => {
  // Get author info if not a guest message
  let authorName = 'Guest';
  let authorAvatar: string | null = null;
  
  if (dbMessage.guest_name) {
    // It's a guest message
    authorName = dbMessage.guest_name;
  } else {
    // Get the author info from the users table
    const author = await usersService.getById(dbMessage.author_id);
    if (author) {
      authorName = author.name;
      authorAvatar = author.avatar;
    }
  }
  
  // Build message object
  const message: Message = {
    id: dbMessage.id,
    eventId: dbMessage.event_id,
    content: dbMessage.content,
    author: {
      id: dbMessage.author_id,
      name: authorName,
      avatar: authorAvatar
    },
    createdAt: new Date(dbMessage.created_at),
    updatedAt: new Date(dbMessage.updated_at)
  };

  // Add media if present
  if (dbMessage.media_type && dbMessage.media_url) {
    message.media = {
      type: dbMessage.media_type,
      url: dbMessage.media_url,
      thumbnailUrl: dbMessage.media_thumbnail_url || undefined
    };
  }

  return message;
};

export const messagesService = {
  async list(eventId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    // Map all messages and populate with author info
    const messages = await Promise.all(
      (data || []).map(async (dbMessage) => await mapDbMessageToMessage(dbMessage))
    );

    return messages;
  },

  async getById(id: string): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching message:', error);
      return null;
    }

    return await mapDbMessageToMessage(data);
  },

  async create(messageData: {
    eventId: string;
    content: string;
    authorId?: string;
    authorName?: string;
    media?: {
      type: 'image' | 'video' | 'audio' | 'gif';
      url: string;
      thumbnailUrl?: string;
    };
  }): Promise<Message | null> {
    let authorId = messageData.authorId;
    if (!authorId) {
      authorId = "00000000-0000-0000-0000-000000000000";
    }
    
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          event_id: messageData.eventId,
          content: messageData.content,
          author_id: authorId,
          guest_name: !messageData.authorId ? messageData.authorName : null,
          media_type: messageData.media?.type || null,
          media_url: messageData.media?.url || null,
          media_thumbnail_url: messageData.media?.thumbnailUrl || null,
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating message:', error);
      return null;
    }

    return await mapDbMessageToMessage(data);
  },

  async update(
    id: string,
    messageData: {
      content?: string;
      media?: {
        type: 'image' | 'video' | 'audio' | 'gif';
        url: string;
        thumbnailUrl?: string;
      } | null;
    }
  ): Promise<Message | null> {
    const updates: { [key: string]: any } = { updated_at: new Date().toISOString() };

    if (messageData.content !== undefined) updates.content = messageData.content;
    
    if (messageData.media === null) {
      // Remove media
      updates.media_type = null;
      updates.media_url = null;
      updates.media_thumbnail_url = null;
    } else if (messageData.media) {
      // Update media
      updates.media_type = messageData.media.type;
      updates.media_url = messageData.media.url;
      updates.media_thumbnail_url = messageData.media.thumbnailUrl || null;
    }

    const { data, error } = await supabase
      .from('messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating message:', error);
      return null;
    }

    return await mapDbMessageToMessage(data);
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting message:', error);
      return false;
    }

    return true;
  }
}; 