-- Supabase SQL Seed: Timeline Events
-- Matches existing schema (uses 'description', 'event_type', 'year'/'month', 'tags')
-- Paste this directly into the Supabase SQL editor and run

-- 1) Create table if it does not exist
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  year INTEGER NOT NULL,
  month INTEGER CHECK (month >= 1 AND month <= 12),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('technology', 'regulation', 'market', 'cultural')),
  significance TEXT CHECK (significance IN ('low', 'medium', 'high', 'critical')),
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS timeline_events_set_updated_at ON public.timeline_events;
CREATE TRIGGER timeline_events_set_updated_at
  BEFORE UPDATE ON public.timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 2) Seed Timeline Events
INSERT INTO public.timeline_events (
  slug,
  title,
  year,
  month,
  event_type,
  significance,
  description,
  tags,
  published
)
VALUES
(
  'eu-ai-act-impacts-beauty-tech',
  'EU AI Act Impacts Beauty Tech',
  2024,
  3,
  'regulation',
  'high',
  'EU AI Act comes into effect, requiring beauty AI applications—especially diagnostic tools—to meet new compliance and transparency standards.',
  ARRAY['regulation', 'compliance', 'eu', 'diagnostics', 'skin-diagnostics'],
  true
),
(
  'generative-ai-transforms-beauty-content',
  'Generative AI Transforms Beauty Content',
  2023,
  11,
  'technology',
  'high',
  'Beauty brands begin using large language models and image generators for product descriptions, marketing content, and virtual influencer creation.',
  ARRAY['generative-ai', 'content-creation', 'marketing', 'nlp', 'ai-beauty-content-generation'],
  true
),
(
  'loreal-acquires-modiface',
  'L''Oréal Acquires ModiFace',
  2018,
  3,
  'market',
  'critical',
  'L''Oréal acquires ModiFace, a leading augmented reality beauty technology company, marking a major milestone in AI adoption across the beauty industry.',
  ARRAY['acquisition', 'ar', 'market-leadership', 'ai-adoption', 'loreal', 'virtual-try-on'],
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  year = EXCLUDED.year,
  month = EXCLUDED.month,
  event_type = EXCLUDED.event_type,
  significance = EXCLUDED.significance,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  published = EXCLUDED.published,
  updated_at = NOW();

-- ✅ Timeline events seeded successfully

