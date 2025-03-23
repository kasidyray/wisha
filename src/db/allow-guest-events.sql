-- Drop existing policy
DROP POLICY IF EXISTS "Users can create own events" ON public.events;

-- Create new policy that allows guests to create events
CREATE POLICY "Anyone can create events" ON public.events 
  FOR INSERT WITH CHECK (true);

-- Make sure we have a guest user
INSERT INTO public.users (id, name, email, avatar_url)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Guest User', 'guest@example.com', NULL)
ON CONFLICT (id) DO NOTHING; 