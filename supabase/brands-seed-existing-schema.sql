-- Supabase SQL Seed: Brands (L'Oréal, Estée Lauder, Glossier)
-- Adapted for existing schema (uses 'name' instead of 'title', 'description' instead of 'summary')
-- Paste this directly into the Supabase SQL editor and run.

-- Note: This assumes the existing brands table schema with:
-- name, description, website, logo_url, category, headquarters, founded_year, tags, published

-- Upsert seed rows (matching existing schema)
INSERT INTO public.brands (slug, name, description, website, logo_url, category, headquarters, founded_year, tags, published)
VALUES
(
  'loreal',
  'L''Oréal',
  'World''s largest cosmetics company, pioneering AI in beauty through virtual try-on, skin analysis, and personalized recommendations.',
  'https://www.loreal.com',
  NULL,
  'Luxury & Mass Market',
  'Clichy, France',
  1909,
  ARRAY['luxury', 'mass-market', 'sustainability', 'computer-vision', 'personalization'],
  true
),
(
  'estee-lauder',
  'Estée Lauder Companies',
  'Prestige beauty conglomerate leveraging AI for consumer insights, product development, and omnichannel experiences.',
  'https://www.esteelauder.com',
  NULL,
  'Luxury',
  'New York, USA',
  1946,
  ARRAY['luxury', 'prestige', 'ai-innovation', 'consumer-insights', 'omnichannel'],
  true
),
(
  'glossier',
  'Glossier',
  'Digital-native beauty brand using AI for community-driven product development and hyper-personalized shopping experiences.',
  'https://www.glossier.com',
  NULL,
  'Digital-First',
  'New York, USA',
  2014,
  ARRAY['digital-native', 'community-driven', 'personalization', 'e-commerce'],
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  website = EXCLUDED.website,
  logo_url = EXCLUDED.logo_url,
  category = EXCLUDED.category,
  headquarters = EXCLUDED.headquarters,
  founded_year = EXCLUDED.founded_year,
  tags = EXCLUDED.tags,
  published = EXCLUDED.published,
  updated_at = NOW();

