-- Add guest_name column to messages table
ALTER TABLE public.messages ADD COLUMN guest_name TEXT NULL;

-- Update the foreign key constraint to allow guest messages
ALTER TABLE public.messages DROP CONSTRAINT messages_author_id_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update RLS policies for messages to allow guest posts
DROP POLICY IF EXISTS "Users can create own messages" ON public.messages;
CREATE POLICY "Anyone can create messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Add a comment to explain the guest_name column
COMMENT ON COLUMN public.messages.guest_name IS 'Name for guest users who post messages without an account'; 