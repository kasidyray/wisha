import { authService } from '@/services/auth';
import { usersService } from '@/services/users';
import { eventsService } from '@/services/events';
import { messagesService } from '@/services/messages';
import { activitiesService } from '@/services/activities';
import { itemsService } from '@/services/items';
import { storageService } from '@/services/storage';
import type { User, Event, Message, Activity } from '@/lib/mock-db/types';

/**
 * Get current user - uses the auth service to get the real authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const userData = await authService.getCurrentUser();
  return userData?.profile || null;
};

/**
 * Helper function to get user's events
 */
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  const events = await eventsService.list(userId);
  return events || [];
};

/**
 * Helper function to authenticate user
 */
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const authData = await authService.signIn(email, password);
    return authData?.profile || null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

/**
 * Helper function to get an event by ID
 */
export const getEventById = async (id: string): Promise<Event | undefined> => {
  const event = await eventsService.getById(id);
  return event || undefined;
};

/**
 * Helper function to get messages for an event
 */
export const getEventMessages = async (eventId: string): Promise<Message[]> => {
  const messages = await messagesService.list(eventId);
  return messages || [];
};

/**
 * Helper function to get host information for an event
 */
export const getEventHost = async (event: Event): Promise<User | undefined> => {
  if (!event.creatorId) return undefined;
  const user = await usersService.getById(event.creatorId);
  return user || undefined;
};

/**
 * Helper function to get activities for a user
 */
export const getUserActivities = async (userId: string): Promise<Activity[]> => {
  const activities = await activitiesService.getRecentByUser(userId);
  return activities || [];
};

/**
 * Helper function to upload image to storage and update user avatar
 */
export const updateUserAvatar = async (userId: string, file: File): Promise<User | null> => {
  try {
    // This will upload the file and return the result including path and URL
    const result = await storageService.uploadFile(file, 'avatars');
    
    if (!result) {
      throw new Error('Failed to upload avatar image');
    }
    
    // Update the user profile with the new avatar URL
    const updatedUser = await authService.updateProfile(userId, {
      avatar: result.url
    });
    
    return updatedUser || null;
  } catch (error) {
    console.error('Error updating avatar:', error);
    return null;
  }
};

/**
 * Helper function to upload event cover image
 */
export const uploadEventCoverImage = async (file: File): Promise<string | null> => {
  try {
    const result = await storageService.uploadFile(file, 'events');
    return result?.url || null;
  } catch (error) {
    console.error('Error uploading event cover image:', error);
    return null;
  }
};

/**
 * Helper function to upload message media
 */
export const uploadMessageMedia = async (file: File): Promise<{url: string, type: string} | null> => {
  try {
    const result = await storageService.uploadFile(file, 'messages');
    if (!result) return null;
    
    return {
      url: result.url,
      type: result.contentType.startsWith('image/') ? 'image' : 
            result.contentType.startsWith('video/') ? 'video' :
            result.contentType.startsWith('audio/') ? 'audio' : 'file'
    };
  } catch (error) {
    console.error('Error uploading message media:', error);
    return null;
  }
};

/**
 * Helper function to upload item image
 */
export const uploadItemImage = async (file: File): Promise<string | null> => {
  try {
    const result = await storageService.uploadFile(file, 'items');
    return result?.url || null;
  } catch (error) {
    console.error('Error uploading item image:', error);
    return null;
  }
}; 