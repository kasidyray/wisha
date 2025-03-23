-- Create an RPC function to set up storage policies
CREATE OR REPLACE FUNCTION setup_storage_policies(bucket_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create policies for buckets table
  BEGIN
    CREATE POLICY "Public Bucket Access" ON storage.buckets FOR SELECT
      USING (true);
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  
  BEGIN
    CREATE POLICY "Allow bucket creation" ON storage.buckets FOR INSERT
      WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  
  BEGIN
    CREATE POLICY "Allow bucket updates" ON storage.buckets FOR UPDATE
      USING (true)
      WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  
  -- Create policies for objects table
  BEGIN
    CREATE POLICY "Public Access" ON storage.objects FOR SELECT
      USING ((bucket_id = bucket_name) AND (storage.foldername(name))[1] != 'private');
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  
  BEGIN
    CREATE POLICY "Users can upload" ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = bucket_name);
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  
  BEGIN
    CREATE POLICY "Users can update their own objects" ON storage.objects FOR UPDATE
      USING ((bucket_id = bucket_name) AND ((auth.uid() = owner) OR (owner IS NULL)))
      WITH CHECK ((bucket_id = bucket_name) AND ((auth.uid() = owner) OR (owner IS NULL)));
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  
  BEGIN
    CREATE POLICY "Users can delete their own objects" ON storage.objects FOR DELETE
      USING ((bucket_id = bucket_name) AND ((auth.uid() = owner) OR (owner IS NULL)));
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END;
$$;

-- Update the existing storage bucket
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY[
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp', 
    'application/pdf', 
    'text/plain', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]::text[]
WHERE id = 'wisha-bucket';

-- Drop existing policies and recreate them
DO $$
BEGIN
  -- Drop existing policies for buckets table if they exist
  BEGIN
    DROP POLICY IF EXISTS "Public Bucket Access" ON storage.buckets;
    DROP POLICY IF EXISTS "Allow bucket creation" ON storage.buckets;
    DROP POLICY IF EXISTS "Allow bucket updates" ON storage.buckets;
  EXCEPTION WHEN others THEN
    NULL;
  END;
  
  -- Drop existing policies for objects table if they exist
  BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own objects" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own objects" ON storage.objects;
  EXCEPTION WHEN others THEN
    NULL;
  END;
END
$$;

-- Create policy for public access to buckets
CREATE POLICY "Public Bucket Access" ON storage.buckets FOR SELECT
  USING (true);

-- Create policy for bucket creation
CREATE POLICY "Allow bucket creation" ON storage.buckets FOR INSERT
  WITH CHECK (true);

-- Create policy for bucket updates
CREATE POLICY "Allow bucket updates" ON storage.buckets FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Enable Row Level Security (RLS)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies to control access to files
-- Allow anonymous users to view public files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
  USING (bucket_id = 'wisha-bucket' AND (storage.foldername(name))[1] != 'private');

-- Users can insert objects (upload files)
CREATE POLICY "Users can upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wisha-bucket');

-- Authenticated users can update their own objects
CREATE POLICY "Users can update their own objects" ON storage.objects FOR UPDATE
  USING (bucket_id = 'wisha-bucket' AND (auth.uid() = owner OR owner IS NULL))
  WITH CHECK (bucket_id = 'wisha-bucket' AND (auth.uid() = owner OR owner IS NULL));

-- Users can delete their own objects
CREATE POLICY "Users can delete their own objects" ON storage.objects FOR DELETE
  USING (bucket_id = 'wisha-bucket' AND (auth.uid() = owner OR owner IS NULL));
