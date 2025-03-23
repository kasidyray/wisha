// Database Types
export interface DBUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  password: string; // In a real app, this would be hashed
  createdAt: Date;
  updatedAt: Date;
}

export interface DBEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: string;
  participantCount: number;
  itemCount: number;
  coverImage?: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBMessage {
  id: string;
  eventId: string;
  content: string;
  authorId: string;
  media?: {
    type: 'image' | 'video' | 'audio' | 'gif';
    url: string;
    thumbnailUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DBActivity {
  id: string;
  type: 'join_event' | 'add_item' | 'update_event' | 'new_message';
  eventId: string;
  userId: string;
  details?: string;
  createdAt: Date;
}

// Response Types (what we return to the client)
export interface User extends Omit<DBUser, 'password'> {}

export interface Event extends DBEvent {
  creator?: User;
}

export interface Message extends Omit<DBMessage, 'authorId'> {
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface Activity extends DBActivity {
  userName: string;
} 