import { users, events, messages, activities } from './data';
import type { User, Event, Message, Activity, DBUser } from './types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const auth = {
  async login(email: string, password: string): Promise<User> {
    await delay(500); // Simulate network delay
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async signup(data: { email: string; password: string; name: string }): Promise<User> {
    await delay(500);
    
    // Check if email exists
    if (users.find(u => u.email === data.email)) {
      throw new Error('Email already exists');
    }
    
    const newUser: DBUser = {
      id: `u${Date.now()}`,
      ...data,
      avatar: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async checkUserExists(email: string): Promise<boolean> {
    await delay(300);
    return users.some(user => user.email === email);
  }
};

// Events API
export const eventsApi = {
  async list(userId?: string): Promise<Event[]> {
    await delay(300);
    let filteredEvents = events;
    
    if (userId) {
      filteredEvents = events.filter(event => event.creatorId === userId);
    }
    
    return filteredEvents.map(event => ({
      ...event,
      creator: users.find(u => u.id === event.creatorId)
    }));
  },

  async get(id: string): Promise<Event | null> {
    await delay(300);
    const event = events.find(e => e.id === id);
    if (!event) return null;
    
    return {
      ...event,
      creator: users.find(u => u.id === event.creatorId)
    };
  },

  async create(data: Partial<Event>): Promise<Event> {
    await delay(500);
    
    const newEvent: Event = {
      id: `e${Date.now()}`,
      title: data.title || '',
      description: data.description || '',
      date: data.date || new Date(),
      type: data.type || 'Other',
      participantCount: 0,
      itemCount: 0,
      creatorId: data.creatorId || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    events.push(newEvent);
    return newEvent;
  }
};

// Messages API
export const messagesApi = {
  async list(eventId: string): Promise<Message[]> {
    await delay(300);
    
    return messages
      .filter(message => message.eventId === eventId)
      .map(message => {
        const author = users.find(u => u.id === message.authorId);
        return {
          ...message,
          author: {
            id: author?.id || 'guest',
            name: author?.name || 'Guest',
            avatar: author?.avatar || null
          }
        };
      });
  },

  async create(data: { eventId: string; content: string; authorId: string; media?: Message['media'] }): Promise<Message> {
    await delay(500);
    
    let author;
    if (data.authorId === 'guest') {
      author = {
        id: 'guest',
        name: 'Guest',
        avatar: null
      };
    } else {
      author = users.find(u => u.id === data.authorId);
      if (!author) throw new Error('Author not found');
    }
    
    const newMessage = {
      id: `m${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    messages.push(newMessage);
    
    return {
      ...newMessage,
      author: {
        id: author.id,
        name: author.name,
        avatar: author.avatar
      }
    };
  }
};

// Activities API
export const activitiesApi = {
  async list(userId?: string): Promise<Activity[]> {
    await delay(300);
    
    let filteredActivities = activities;
    if (userId) {
      filteredActivities = activities.filter(activity => activity.userId === userId);
    }
    
    return filteredActivities.map(activity => {
      const user = users.find(u => u.id === activity.userId);
      return {
        ...activity,
        userName: user?.name || 'Unknown'
      };
    });
  }
}; 