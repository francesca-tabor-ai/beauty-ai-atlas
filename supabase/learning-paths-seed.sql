-- Supabase SQL Seed: Learning Paths
-- Matches existing schema (uses 'description', 'difficulty', 'duration_hours', 'steps' JSONB array)
-- Paste directly into the Supabase SQL editor and run

-- 1) Create table if it does not exist
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_hours INTEGER,
  steps JSONB[] DEFAULT '{}',
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

DROP TRIGGER IF EXISTS learning_paths_set_updated_at ON public.learning_paths;
CREATE TRIGGER learning_paths_set_updated_at
  BEFORE UPDATE ON public.learning_paths
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 2) Seed Learning Paths
INSERT INTO public.learning_paths (
  slug,
  title,
  description,
  difficulty,
  duration_hours,
  steps,
  tags,
  published
)
VALUES
(
  'ai-beauty-fundamentals',
  'AI in Beauty: Fundamentals',
  'Introduction to how AI is transforming the beauty industry, from virtual try-on to personalized recommendations.',
  'beginner',
  8,
  ARRAY[
    '{"entity_type": "use_cases", "entity_slug": "personalized-recommendations", "label": "Understand Core Beauty AI Use Cases", "order": 1}'::jsonb,
    '{"entity_type": "ai_specialisms", "entity_slug": "generative-ai", "label": "Explore Generative AI in Beauty", "order": 2}'::jsonb,
    '{"entity_type": "use_cases", "entity_slug": "virtual-try-on", "label": "See Virtual Try-On in Practice", "order": 3}'::jsonb
  ],
  ARRAY['foundations', 'industry-overview', 'beginner'],
  true
),
(
  'computer-vision-beauty',
  'Computer Vision for Beauty Applications',
  'Deep dive into computer vision techniques used in skin analysis, virtual try-on, and beauty product recognition.',
  'intermediate',
  20,
  ARRAY[
    '{"entity_type": "ai_specialisms", "entity_slug": "computer-vision", "label": "Master Computer Vision Basics", "order": 1}'::jsonb,
    '{"entity_type": "use_cases", "entity_slug": "skin-diagnostics", "label": "Study Skin Diagnostics", "order": 2}'::jsonb,
    '{"entity_type": "projects", "entity_slug": "skin-ai-diagnostic", "label": "Analyze Real Project", "order": 3}'::jsonb
  ],
  ARRAY['computer-vision', 'technical', 'intermediate'],
  true
),
(
  'beauty-ai-career',
  'Building a Career in Beauty AI',
  'Comprehensive path for professionals looking to enter or advance in AI roles within the beauty industry.',
  'advanced',
  40,
  ARRAY[
    '{"entity_type": "use_cases", "entity_slug": "virtual-try-on", "label": "Learn the Beauty AI Landscape", "order": 1}'::jsonb,
    '{"entity_type": "ai_specialisms", "entity_slug": "recommendation-systems", "label": "Pick an AI Specialism", "order": 2}'::jsonb,
    '{"entity_type": "job_roles", "entity_slug": "personalization-engineer", "label": "Explore a Job Role", "order": 3}'::jsonb,
    '{"entity_type": "projects", "entity_slug": "personalized-skincare-routine", "label": "Review a Real Project Case", "order": 4}'::jsonb
  ],
  ARRAY['career', 'portfolio', 'advanced'],
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  duration_hours = EXCLUDED.duration_hours,
  steps = EXCLUDED.steps,
  tags = EXCLUDED.tags,
  published = EXCLUDED.published,
  updated_at = NOW();

-- ✅ Learning Paths seeded successfully

