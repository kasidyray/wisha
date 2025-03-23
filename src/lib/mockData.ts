// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  password: string; // In a real app, this would be hashed
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: string;
  participantCount: number;
  itemCount: number;
  coverImage?: string;
  creatorId: string;
}

export interface MessageMedia {
  type: 'image' | 'video' | 'audio' | 'gif';
  url: string;
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  eventId: string;
  content: string;
  date: Date;
  author: {
    id: string;
    name: string;
  };
  media?: {
    type: 'image' | 'video' | 'audio' | 'gif';
    url: string;
  };
}

export interface ActivityItem {
  id: string;
  type: 'join_event' | 'add_item' | 'update_event' | 'new_message';
  eventId: string;
  userId?: string;
  userName: string;
  date: Date;
  details?: string;
}

// Dummy user accounts
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed
    avatar: null
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: null
  }
];

// Mock events (John has events, Jane has none)
export const mockEvents: Event[] = [
  {
    id: 'e1',
    title: "John's Birthday Celebration",
    description: "Join us for an amazing birthday celebration!",
    date: new Date('2024-04-15'),
    type: 'Birthday',
    participantCount: 12,
    itemCount: 8,
    coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlydGhkYXklMjBwYXJ0eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    creatorId: 'u1'
  },
  {
    id: 'e2',
    title: "Summer House Party",
    description: "A fun summer gathering with friends and family!",
    date: new Date('2024-07-20'),
    type: 'Party',
    participantCount: 25,
    itemCount: 15,
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFydHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    creatorId: 'u1'
  }
];

// Mock messages
export const mockMessages: Message[] = [
  {
    id: 'm1',
    eventId: 'e1',
    content: "Can't wait to celebrate with you!",
    date: new Date('2024-03-01'),
    author: {
      id: 'u2',
      name: 'Jane Smith'
    }
  },
  {
    id: 'm2',
    eventId: 'e1',
    content: "This is going to be amazing!",
    date: new Date('2024-03-02'),
    author: {
      id: 'u3',
      name: 'Mike Johnson'
    },
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176'
    }
  }
];

export const mockActivities: ActivityItem[] = [
  {
    id: 'a1',
    type: 'join_event',
    eventId: 'e3',
    userName: 'Alex',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'a2',
    type: 'add_item',
    eventId: 'e1',
    userName: 'Jessica',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: 'a3',
    type: 'update_event',
    eventId: 'e2',
    userName: 'John',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    details: 'Updated event date'
  }
];

// Helper function to get current user (for demo purposes)
export const getCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem('wisha_user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

// Helper function to get user's events
export const getUserEvents = (userId: string): Event[] => {
  return mockEvents.filter(event => event.creatorId === userId);
};

// Helper function to authenticate user
export const authenticateUser = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user || null;
};

// Helper function to get an event by ID
export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

// Helper function to get messages for an event
export const getEventMessages = (eventId: string): Message[] => {
  return mockMessages.filter(message => message.eventId === eventId);
};

// Helper function to get host information for an event
export const getEventHost = (event: Event): User | undefined => {
  return mockUsers.find(user => user.id === event.creatorId);
};

// Helper function to get activities for a user
export const getUserActivities = (userId: string): ActivityItem[] => {
  return mockActivities.filter(activity => activity.userId === userId);
}; 