-- Create public product-images bucket (Supabase Storage)
-- Run in SQL Editor after enabling storage

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Service role uploads via API; no anon upload policy needed
