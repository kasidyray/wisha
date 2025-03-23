import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://jzwdhbkqogynqppfztxg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6d2RoYmtxb2d5bnFwcGZ6dHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NDkyNDMsImV4cCI6MjA1ODMyNTI0M30.rbRxcQYeUE-N8MJjdl66PcJdOPOyeSL5z2zr1jbZMek';

// Initialize the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey); 