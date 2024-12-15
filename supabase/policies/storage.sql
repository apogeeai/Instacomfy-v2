
-- Create a new bucket for AI generated images
INSERT INTO storage.buckets (id, name) 
VALUES ('ai-images', 'AI Generated Images');

-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'ai-images');

-- Allow authenticated uploads
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ai-images');

-- Allow owner to delete
CREATE POLICY "Allow delete"
ON storage.objects FOR DELETE USING (
  auth.uid() = owner
);
