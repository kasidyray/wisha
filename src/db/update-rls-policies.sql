-- ROW LEVEL SECURITY POLICIES ONLY
-- Use this script to update existing RLS policies without recreating tables

-- Make sure RLS is enabled on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Service role can do anything" ON public.users;
DROP POLICY IF EXISTS "Service role can do anything" ON public.events;
DROP POLICY IF EXISTS "Service role can do anything" ON public.items;
DROP POLICY IF EXISTS "Service role can do anything" ON public.messages;
DROP POLICY IF EXISTS "Service role can do anything" ON public.activities;

DROP POLICY IF EXISTS "Service role can do anything on users" ON public.users;
DROP POLICY IF EXISTS "Service role can do anything on events" ON public.events;
DROP POLICY IF EXISTS "Service role can do anything on items" ON public.items;
DROP POLICY IF EXISTS "Service role can do anything on messages" ON public.messages;
DROP POLICY IF EXISTS "Service role can do anything on activities" ON public.activities;

DROP POLICY IF EXISTS "Users can view own user data" ON public.users;
DROP POLICY IF EXISTS "Users can update own user data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own user data" ON public.users;

DROP POLICY IF EXISTS "Users can view all events" ON public.events;
DROP POLICY IF EXISTS "Users can insert own events" ON public.events;
DROP POLICY IF EXISTS "Users can update own events" ON public.events;
DROP POLICY IF EXISTS "Users can delete own events" ON public.events;

DROP POLICY IF EXISTS "Users can view all items" ON public.items;
DROP POLICY IF EXISTS "Users can insert items to own events" ON public.items;
DROP POLICY IF EXISTS "Users can update items in own events" ON public.items;
DROP POLICY IF EXISTS "Users can delete items in own events" ON public.items;

DROP POLICY IF EXISTS "Users can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON public.messages;

DROP POLICY IF EXISTS "Users can view all activities" ON public.activities;
DROP POLICY IF EXISTS "Users can create own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can create activities about themselves" ON public.activities;

DROP POLICY IF EXISTS "Allow public access for testing" ON public.users;
DROP POLICY IF EXISTS "Allow public access for testing" ON public.events;
DROP POLICY IF EXISTS "Allow public access for testing" ON public.items;
DROP POLICY IF EXISTS "Allow public access for testing" ON public.messages;
DROP POLICY IF EXISTS "Allow public access for testing" ON public.activities;

-- Service role policies
CREATE POLICY "Service role can do anything on users" ON public.users 
  FOR ALL USING (auth.role() = 'service_role');
  
CREATE POLICY "Service role can do anything on events" ON public.events 
  FOR ALL USING (auth.role() = 'service_role');
  
CREATE POLICY "Service role can do anything on items" ON public.items 
  FOR ALL USING (auth.role() = 'service_role');
  
CREATE POLICY "Service role can do anything on messages" ON public.messages 
  FOR ALL USING (auth.role() = 'service_role');
  
CREATE POLICY "Service role can do anything on activities" ON public.activities 
  FOR ALL USING (auth.role() = 'service_role');

-- User policies
CREATE POLICY "Users can view own user data" ON public.users
  FOR SELECT USING (auth.uid()::uuid = id);
  
CREATE POLICY "Users can update own user data" ON public.users
  FOR UPDATE USING (auth.uid()::uuid = id);
  
CREATE POLICY "Users can insert own user data" ON public.users
  FOR INSERT WITH CHECK (auth.uid()::uuid = id);

-- Event policies
CREATE POLICY "Users can view all events" ON public.events
  FOR SELECT USING (true);
  
CREATE POLICY "Users can insert own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid()::uuid = creator_id);
  
CREATE POLICY "Users can update own events" ON public.events
  FOR UPDATE USING (auth.uid()::uuid = creator_id);
  
CREATE POLICY "Users can delete own events" ON public.events
  FOR DELETE USING (auth.uid()::uuid = creator_id);

-- Item policies
CREATE POLICY "Users can view all items" ON public.items
  FOR SELECT USING (true);
  
CREATE POLICY "Users can insert items in own events" ON public.items
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.events WHERE id = event_id AND creator_id = auth.uid()::uuid
  ));
  
CREATE POLICY "Users can update items in own events" ON public.items
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.events WHERE id = event_id AND creator_id = auth.uid()::uuid
  ));
  
CREATE POLICY "Users can delete items in own events" ON public.items
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.events WHERE id = event_id AND creator_id = auth.uid()::uuid
  ));

-- Message policies
CREATE POLICY "Users can view all messages" ON public.messages
  FOR SELECT USING (true);
  
CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid()::uuid = author_id);
  
CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (auth.uid()::uuid = author_id);
  
CREATE POLICY "Users can delete own messages" ON public.messages
  FOR DELETE USING (auth.uid()::uuid = author_id);

-- Activity policies
CREATE POLICY "Users can view all activities" ON public.activities
  FOR SELECT USING (true);
  
CREATE POLICY "Users can create activities about themselves" ON public.activities
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id); 