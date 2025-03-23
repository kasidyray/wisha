# Supabase Storage Setup Guide

This guide will help you set up and configure Supabase Storage for the Wish-Flare application.

## Prerequisites

- A Supabase project
- Admin access to your Supabase project

## Setting Up the Storage Bucket

### Option 1: Using the SQL Editor (Recommended)

1. **Log in to your Supabase Dashboard**
2. **Go to the SQL Editor**
3. **Create a New Query**
4. **Paste the following SQL**:

```sql
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
```

5. **Run the query**

Note: After running this SQL script, you can also manually call the RPC function to ensure policies are set up properly:

```sql
SELECT setup_storage_policies('wisha-bucket');
```

### Option 2: Using the Supabase UI

1. **Log in to your Supabase Dashboard**
2. **Go to the Storage section**
3. **Create a New Bucket**
   - Name: `wisha-bucket`
   - Make it public: Check this option
   - File size limit: 5MB (5242880 bytes)
   - Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp, application/pdf, text/plain, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document`

4. **Configure CORS** (Cross-Origin Resource Sharing)
   - Go to the Storage settings
   - Add the following CORS configuration:
     ```json
     {
       "AllowedOrigins": ["*"],
       "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3000
     }
     ```

## Setting Up Access Policies

If you used Option 1 with the SQL script, the policies are already set up. If you used Option 2, you need to set up the policies manually:

1. **Go to the Authentication section**
2. **Go to Policies**
3. **Create the following policies for the `storage.objects` table**:

   a. **Public Access**
   - Name: `Public Access`
   - Target roles: `anon, authenticated`
   - Operation: `SELECT`
   - Using expression: `bucket_id = 'wisha-bucket' AND (storage.foldername(name))[1] != 'private'`

   b. **Users can upload**
   - Name: `Users can upload`
   - Target roles: `anon, authenticated`
   - Operation: `INSERT`
   - Using expression: `bucket_id = 'wisha-bucket'`

   c. **Users can update their own objects**
   - Name: `Users can update their own objects`
   - Target roles: `authenticated`
   - Operation: `UPDATE`
   - Using expression: `bucket_id = 'wisha-bucket' AND (auth.uid() = owner OR owner IS NULL)`

   d. **Users can delete their own objects**
   - Name: `Users can delete their own objects`
   - Target roles: `authenticated`
   - Operation: `DELETE`
   - Using expression: `bucket_id = 'wisha-bucket' AND (auth.uid() = owner OR owner IS NULL)`

## Troubleshooting Common Issues

### Bucket Not Found

If you see errors like "Bucket not found" or "storage/bucket-not-found":

1. Make sure you've created the bucket with the exact name `wisha-bucket`
2. Check if there are any typos in the bucket name
3. Ensure you have the correct Supabase project selected

### Permission Denied

If you see errors like "Permission denied" or "storage/unauthorized":

1. Make sure the proper RLS policies are in place
2. Check that the bucket is set to public if you need public access
3. Verify that you're authenticated if trying to upload as an authenticated user

### File Size Limits

If you're having issues with file size:

1. The default limit is set to 5MB
2. You can increase this in the bucket settings if needed

## Testing Your Setup

After setting up the bucket and policies, you can test the storage functionality by:

1. **Going to the Test Storage page** in your application (`/test-storage`)
2. **Uploading a file** using either the simple upload or drag-and-drop interface
3. **Verifying** that the file appears in the "Uploaded Files" section

If everything is working correctly, you should be able to upload files and see them displayed.

## Additional Configuration

### Custom Domain for Storage

If you want to use a custom domain for your storage URLs:

1. **Set up a custom domain** in your Supabase project settings
2. **Update your DNS** to point to Supabase's storage servers
3. **Modify the `getPublicUrl` method** in your storage service to use your custom domain

### Storage Events

You can set up webhooks to be triggered when storage events occur:

1. **Go to the Database section** in your Supabase dashboard
2. **Set up Database Webhooks** to respond to `INSERT`, `UPDATE`, or `DELETE` events on the `storage.objects` table
3. **Configure your webhook URL** to handle these events in your application

## Support

If you encounter issues that aren't resolved by this guide, please:

1. Check the Supabase documentation: [https://supabase.io/docs/guides/storage](https://supabase.io/docs/guides/storage)
2. Post in the Supabase community forums: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
3. Check for known issues in the GitHub repository: [https://github.com/supabase/storage-api/issues](https://github.com/supabase/storage-api/issues) 