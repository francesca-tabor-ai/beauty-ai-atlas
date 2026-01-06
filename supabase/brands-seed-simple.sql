-- Supabase SQL Seed: Brands (L'Oréal, Estée Lauder, Glossier)
-- Matches existing schema (uses 'name' and 'description')
-- Paste this directly into the Supabase SQL editor and run.

-- 1) Ensure the table exists (safe to keep even if you already have it)
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  category TEXT,
  headquarters TEXT,
  founded_year INTEGER,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: keep updated_at fresh automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS brands_set_updated_at ON public.brands;
CREATE TRIGGER brands_set_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 2) Upsert seed rows
INSERT INTO public.brands (slug, name, description, category, tags, published)
VALUES
(
  'loreal',
  'L''Oréal',
  'World''s largest cosmetics company, pioneering AI in beauty through virtual try-on, skin analysis, and personalized recommendations.',
  'Luxury & Mass Market',
  ARRAY['luxury', 'mass-market', 'sustainability', 'computer-vision', 'personalization'],
  true
),
(
  'estee-lauder',
  'Estée Lauder Companies',
  'Prestige beauty conglomerate leveraging AI for consumer insights, product development, and omnichannel experiences.',
  'Luxury',
  ARRAY['luxury', 'prestige', 'ai-innovation', 'consumer-insights', 'omnichannel'],
  true
),
(
  'glossier',
  'Glossier',
  'Digital-native beauty brand using AI for community-driven product development and hyper-personalized shopping experiences.',
  'Digital-First',
  ARRAY['digital-native', 'community-driven', 'personalization', 'e-commerce'],
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  published = EXCLUDED.published,
  updated_at = NOW();
