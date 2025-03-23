-- Drop the existing policy and recreate it
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT
  USING (bucket_id = 'wisha-bucket' AND (storage.foldername(name))[1] != 'private'); 