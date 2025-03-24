export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          instructions: string | null
          date: string
          type: string
          participant_count: number
          item_count: number
          cover_image_url: string | null
          creator_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          instructions?: string | null
          date: string
          type: string
          participant_count?: number
          item_count?: number
          cover_image_url?: string | null
          creator_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          instructions?: string | null
          date?: string
          type?: string
          participant_count?: number
          item_count?: number
          cover_image_url?: string | null
          creator_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          event_id: string
          content: string
          author_id: string
          media_type: 'image' | 'video' | 'audio' | 'gif' | null
          media_url: string | null
          media_thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          content: string
          author_id: string
          media_type?: 'image' | 'video' | 'audio' | 'gif' | null
          media_url?: string | null
          media_thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          content?: string
          author_id?: string
          media_type?: 'image' | 'video' | 'audio' | 'gif' | null
          media_url?: string | null
          media_thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          type: 'join_event' | 'add_item' | 'update_event' | 'new_message'
          event_id: string
          user_id: string
          details: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: 'join_event' | 'add_item' | 'update_event' | 'new_message'
          event_id: string
          user_id: string
          details?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'join_event' | 'add_item' | 'update_event' | 'new_message'
          event_id?: string
          user_id?: string
          details?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 