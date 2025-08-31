-- Create items table for lost and found items (unchanged from current)

CREATE TABLE IF NOT EXISTS public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  name TEXT NOT NULL,
  description TEXT,
  contact TEXT NOT NULL,
  place TEXT NOT NULL,
  date DATE,
  image_url TEXT,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  -- NEW: track the user who created the item
  created_by UUID NOT NULL DEFAULT auth.uid()
);

-- Enable Row Level Security (unchanged)

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Policies for public access and inserts (adjusted slightly)

CREATE POLICY IF NOT EXISTS "Items are viewable by everyone" 
ON public.items 
FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can create items" 
ON public.items 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATED: Only allow users to update their own items
DROP POLICY IF EXISTS "Anyone can update items" ON public.items;

CREATE POLICY "Users can only update own items"
ON public.items
FOR UPDATE
USING (auth.uid() = created_by);

-- Function to update timestamps (unchanged)

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates (unchanged)

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for item images (unchanged)

INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for image uploads (unchanged)

CREATE POLICY IF NOT EXISTS "Item images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'item-images');

CREATE POLICY IF NOT EXISTS "Anyone can upload item images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'item-images');

CREATE POLICY IF NOT EXISTS "Anyone can update item images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'item-images');
