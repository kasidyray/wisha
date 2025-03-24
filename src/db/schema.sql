-- USERS TABLE
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.users IS 'App users';

-- EVENTS TABLE
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NULL, -- Optional instructions for event participants
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  participant_count INTEGER DEFAULT 0 NOT NULL,
  item_count INTEGER DEFAULT 0 NOT NULL,
  cover_image_url TEXT NULL,
  creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.events IS 'Events like birthdays, weddings, etc.';

-- ITEMS TABLE
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NULL,
  url TEXT NULL,
  image_url TEXT NULL,
  price DECIMAL(10, 2) DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'available' NOT NULL,
  claimed_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.items IS 'Gift items for events';

-- MESSAGES TABLE
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  media_type TEXT NULL CHECK (media_type IN ('image', 'video', 'audio', 'gif')),
  media_url TEXT NULL,
  media_thumbnail_url TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.messages IS 'Messages for event discussions';

-- ACTIVITIES TABLE
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('join_event', 'add_item', 'update_event', 'new_message')),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  details TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.activities IS 'Activity log for events';

-- INDEXES
CREATE INDEX idx_events_creator_id ON public.events(creator_id);
CREATE INDEX idx_items_event_id ON public.items(event_id);
CREATE INDEX idx_items_claimed_by ON public.items(claimed_by);
CREATE INDEX idx_messages_event_id ON public.messages(event_id);
CREATE INDEX idx_messages_author_id ON public.messages(author_id);
CREATE INDEX idx_activities_event_id ON public.activities(event_id);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);

-- FUNCTIONS
CREATE OR REPLACE FUNCTION increment_participant_count(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.events
  SET participant_count = participant_count + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ROW LEVEL SECURITY POLICIES

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Service role policies
CREATE POLICY "Service role can do anything on users" ON public.users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do anything on events" ON public.events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do anything on items" ON public.items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do anything on messages" ON public.messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do anything on activities" ON public.activities FOR ALL USING (auth.role() = 'service_role');

-- User policies
CREATE POLICY "Users can view own user data" ON public.users FOR SELECT USING (auth.uid()::uuid = id);
CREATE POLICY "Users can update own user data" ON public.users FOR UPDATE USING (auth.uid()::uuid = id);

-- Event policies
CREATE POLICY "Users can view all events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Users can create own events" ON public.events FOR INSERT WITH CHECK (auth.uid()::uuid = creator_id);
CREATE POLICY "Users can update own events" ON public.events FOR UPDATE USING (auth.uid()::uuid = creator_id);
CREATE POLICY "Users can delete own events" ON public.events FOR DELETE USING (auth.uid()::uuid = creator_id);

-- Item policies
CREATE POLICY "Users can view all items" ON public.items FOR SELECT USING (true);
CREATE POLICY "Users can create items in own events" ON public.items
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
CREATE POLICY "Users can view all messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Users can create own messages" ON public.messages FOR INSERT WITH CHECK (auth.uid()::uuid = author_id);
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE USING (auth.uid()::uuid = author_id);
CREATE POLICY "Users can delete own messages" ON public.messages FOR DELETE USING (auth.uid()::uuid = author_id);

-- Activity policies
CREATE POLICY "Users can view all activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Users can create activities about themselves" ON public.activities FOR INSERT WITH CHECK (auth.uid()::uuid = user_id); 