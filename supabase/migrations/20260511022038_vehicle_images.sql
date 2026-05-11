-- Add image_url to vehicles table
alter table vehicles add column if not exists image_url text;

-- Create storage bucket for car images
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload to their own folder
create policy "Users can upload car images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'car-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read
create policy "Public can view car images" on storage.objects
  for select to public
  using (bucket_id = 'car-images');

-- Allow users to delete their own images
create policy "Users can delete own car images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'car-images' and (storage.foldername(name))[1] = auth.uid()::text);
