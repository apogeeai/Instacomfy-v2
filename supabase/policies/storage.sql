
-- Enable the storage extension
create extension if not exists "storage" schema "storage";

-- Create the images bucket if it doesn't exist
insert into storage.buckets (id, name)
values ('images', 'images')
on conflict do nothing;

-- Allow public read access to images bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- Allow authenticated uploads to images bucket
create policy "Allow uploads"
on storage.objects for insert
with check ( bucket_id = 'images' );

-- Allow owner to delete their uploads
create policy "Allow delete own files"
on storage.objects for delete
using ( auth.uid() = owner );
