-- WARNING: This will delete ALL data in your database
-- Only use this if you want to completely reset your database

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS public.activities;
DROP TABLE IF EXISTS public.messages;
DROP TABLE IF EXISTS public.items;
DROP TABLE IF EXISTS public.events;
DROP TABLE IF EXISTS public.users;

-- Drop any triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.increment_participant_count(UUID); 