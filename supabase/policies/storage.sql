
-- Allow public read access to the 'images' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated users to upload to 'images' bucket
CREATE POLICY "Authenticated Users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow users to update their own objects
CREATE POLICY "Users can update own objects"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

-- Allow users to delete their own objects
CREATE POLICY "Users can delete own objects"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);
