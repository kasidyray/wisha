-- Create a guest user account
INSERT INTO public.users (id, name, email, avatar_url, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  'Guest User', 
  'guest@example.com', 
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Add a comment to explain what this user is for
COMMENT ON TABLE public.users IS 'App users, including the special guest user with ID 00000000-0000-0000-0000-000000000000'; 