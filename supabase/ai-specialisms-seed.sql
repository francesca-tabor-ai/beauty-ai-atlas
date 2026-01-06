-- Supabase SQL Seed: AI Specialisms
-- Matches existing schema (uses 'name' and 'description')
-- Paste this file directly into the Supabase SQL editor and run.

-- 1) Create table if it does not exist
CREATE TABLE IF NOT EXISTS public.ai_specialisms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('computer_vision', 'nlp', 'recommendation_systems', 'generative_ai')),
  maturity_timeline JSONB DEFAULT '{}',
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

DROP TRIGGER IF EXISTS ai_specialisms_set_updated_at ON public.ai_specialisms;
CREATE TRIGGER ai_specialisms_set_updated_at
  BEFORE UPDATE ON public.ai_specialisms
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 2) Seed AI Specialisms
INSERT INTO public.ai_specialisms (
  slug,
  name,
  description,
  category,
  tags,
  maturity_timeline,
  published
)
VALUES
(
  'computer-vision',
  'Computer Vision',
  'AI systems that interpret and analyze visual data such as images and video, enabling applications like skin analysis, virtual try-on, and quality inspection.',
  'computer_vision',
  ARRAY['image-analysis', 'facial-recognition', 'visual-ai'],
  '[
    {"year": 2010, "stage": "feature-based"},
    {"year": 2015, "stage": "cnn-driven"},
    {"year": 2020, "stage": "deep-learning"},
    {"year": 2023, "stage": "multimodal-vision"}
  ]'::jsonb,
  true
),
(
  'generative-ai',
  'Generative AI',
  'Models that generate new content such as text, images, video, or formulations, powering creative, marketing, and R&D innovation in beauty.',
  'generative_ai',
  ARRAY['text-generation', 'image-generation', 'foundation-models'],
  '[
    {"year": 2018, "stage": "gan-based"},
    {"year": 2021, "stage": "diffusion-models"},
    {"year": 2023, "stage": "large-language-models"},
    {"year": 2024, "stage": "multimodal-generation"}
  ]'::jsonb,
  true
),
(
  'recommendation-systems',
  'Recommendation Systems',
  'Personalized product and content recommendations using collaborative filtering, content-based filtering, and hybrid approaches.',
  'recommendation_systems',
  ARRAY['collaborative-filtering', 'content-based', 'hybrid'],
  '[
    {"year": 2015, "stage": "basic"},
    {"year": 2018, "stage": "ml-enhanced"},
    {"year": 2021, "stage": "deep-learning"},
    {"year": 2024, "stage": "transformer-based"}
  ]'::jsonb,
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  maturity_timeline = EXCLUDED.maturity_timeline,
  published = EXCLUDED.published,
  updated_at = NOW();

-- ✅ AI Specialisms seeded successfully

