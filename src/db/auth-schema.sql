-- Configure Supabase Auth

-- Create required function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- New auth.users are auto-synced to our public.users table
  -- But for our application, we may want to trigger this process manually
  -- or have more control over the data that's stored
  
  -- For now, we won't do anything automatically
  -- This is a placeholder for future functionality if needed
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a new user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Setup RLS (Row Level Security) policies for user data

-- Enable RLS on users table (if not already enabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users should only be able to see and update their own data
CREATE POLICY "Users can view own user data" ON public.users
  FOR SELECT
  USING (auth.uid()::uuid = id OR auth.role() = 'service_role');

CREATE POLICY "Users can update own user data" ON public.users
  FOR UPDATE
  USING (auth.uid()::uuid = id OR auth.role() = 'service_role');

-- Allow user creation (for registration)
CREATE POLICY "Users can insert own user data" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid()::uuid = id OR auth.role() = 'service_role');

-- Service role bypass for admin operations
CREATE POLICY "Service role can do anything to users" ON public.users
  USING (auth.role() = 'service_role');

-- Events policies: Users can see all events
CREATE POLICY "Users can view all events" ON public.events
  FOR SELECT
  USING (true);

-- Users can only modify events they created
CREATE POLICY "Users can insert own events" ON public.events
  FOR INSERT
  WITH CHECK (auth.uid()::uuid = creator_id OR auth.role() = 'service_role');

CREATE POLICY "Users can update own events" ON public.events
  FOR UPDATE
  USING (auth.uid()::uuid = creator_id OR auth.role() = 'service_role');

CREATE POLICY "Users can delete own events" ON public.events
  FOR DELETE
  USING (auth.uid()::uuid = creator_id OR auth.role() = 'service_role');

-- Items policies: Similar to events but scoped to event ownership
CREATE POLICY "Users can view all items" ON public.items
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert items to own events" ON public.items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = event_id AND creator_id = auth.uid()::uuid
    ) OR auth.role() = 'service_role'
  );

CREATE POLICY "Users can update items in own events" ON public.items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = event_id AND creator_id = auth.uid()::uuid
    ) OR auth.role() = 'service_role'
  );

CREATE POLICY "Users can delete items in own events" ON public.items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = event_id AND creator_id = auth.uid()::uuid
    ) OR auth.role() = 'service_role'
  );

-- Messages policies
CREATE POLICY "Users can view all messages" ON public.messages
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid()::uuid = author_id OR auth.role() = 'service_role');

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE
  USING (auth.uid()::uuid = author_id OR auth.role() = 'service_role');

CREATE POLICY "Users can delete own messages" ON public.messages
  FOR DELETE
  USING (auth.uid()::uuid = author_id OR auth.role() = 'service_role');

-- Activities policies
CREATE POLICY "Users can view all activities" ON public.activities
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create own activities" ON public.activities
  FOR INSERT
  WITH CHECK (auth.uid()::uuid = user_id OR auth.role() = 'service_role');

-- No update or delete needed for activities as they are immutable records 