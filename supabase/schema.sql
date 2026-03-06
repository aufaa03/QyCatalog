-- Create products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  affiliate_url text not null,
  image_url text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table products enable row level security;

-- Public: anyone can read products
create policy "Public read products"
  on products for select
  using (true);

-- Authenticated: admin can insert
create policy "Authenticated insert products"
  on products for insert
  with check (auth.role() = 'authenticated');

-- Authenticated: admin can update
create policy "Authenticated update products"
  on products for update
  using (auth.role() = 'authenticated');

-- Authenticated: admin can delete
create policy "Authenticated delete products"
  on products for delete
  using (auth.role() = 'authenticated');

-- Storage bucket for product images (run in Supabase SQL editor or Dashboard > Storage)
-- 1. Create a bucket named "products" with Public access
-- 2. Add storage policy - public read:
--    (bucket_id = 'products')
-- 3. Add storage policy - authenticated upload:
--    (bucket_id = 'products' AND auth.role() = 'authenticated')
