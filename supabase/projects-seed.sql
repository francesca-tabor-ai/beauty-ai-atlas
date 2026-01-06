-- Supabase SQL Seed: Projects
-- Matches existing schema (uses 'description', 'business_case' JSONB, 'prd' JSONB, 'maturity')
-- Paste directly into the Supabase SQL editor and run

-- 1) Create table if it does not exist
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  business_case JSONB DEFAULT '{}',
  prd JSONB DEFAULT '{}',
  maturity TEXT CHECK (maturity IN ('concept', 'pilot', 'production')),
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

DROP TRIGGER IF EXISTS projects_set_updated_at ON public.projects;
CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 2) Seed Projects
INSERT INTO public.projects (
  slug,
  title,
  description,
  category,
  tags,
  maturity,
  business_case,
  prd,
  published
)
VALUES
(
  'modiface-ar-integration',
  'ModiFace AR Integration',
  'Integration of ModiFace augmented reality technology to enable virtual makeup try-on across digital and retail touchpoints.',
  'AR & Consumer Experience',
  ARRAY['augmented-reality', 'computer-vision', 'virtual-try-on', 'consumer-experience'],
  'production',
  '{
    "problem": "Low online conversion rates due to inability to try products",
    "objective": "Increase online sales through immersive try-on experiences",
    "investment_range": "$5M–$10M",
    "roi_assumptions": ["Increased conversion rates", "Reduced product returns through immersive try-on experiences"],
    "kpis": ["conversion_rate", "engagement_time", "return_rate"]
  }'::jsonb,
  '{
    "user_stories": [
      "As a customer, I want to try on makeup virtually",
      "As a customer, I want to see how products look on my skin tone"
    ],
    "functional_requirements": ["Real-time AR rendering", "Color matching", "Product recommendations"],
    "non_functional": ["<2s load time", "Works on 90%+ devices", "Accessibility compliance"],
    "risks": [
      {"description": "Device compatibility issues", "severity": "medium"},
      {"description": "Color accuracy challenges", "severity": "high"},
      {"description": "Performance on older devices", "severity": "medium"}
    ],
    "ethics_compliance": ["Privacy of facial data", "No age restrictions", "Inclusive skin tones"]
  }'::jsonb,
  true
),
(
  'skin-ai-diagnostic',
  'AI Skin Diagnostic Platform',
  'AI-powered skin analysis tool for dermatologists and consumers to assess skin conditions using image analysis.',
  'Healthcare & Diagnostics',
  ARRAY['healthcare', 'diagnostics', 'computer-vision'],
  'pilot',
  '{
    "problem": "Limited access to dermatological expertise",
    "objective": "Democratize skin health assessment through AI",
    "investment_range": "$10M–$20M",
    "roi_assumptions": ["B2B licensing model with dermatology clinics and enterprise partners", "50K+ users in year one"],
    "kpis": ["diagnostic_accuracy", "user_adoption", "b2b_licenses", "patient_outcomes"]
  }'::jsonb,
  '{
    "user_stories": [
      "As a dermatologist, I want AI-assisted skin analysis",
      "As a consumer, I want to understand my skin condition"
    ],
    "functional_requirements": ["Image upload", "AI analysis", "Report generation", "Treatment suggestions"],
    "non_functional": ["HIPAA compliance", "99.9% uptime", "Sub-second analysis"],
    "risks": [
      {"description": "Regulatory approval delays", "severity": "high"},
      {"description": "Misdiagnosis liability", "severity": "high"},
      {"description": "Data privacy concerns", "severity": "medium"}
    ],
    "ethics_compliance": ["Medical device regulations", "Patient privacy", "Bias mitigation"]
  }'::jsonb,
  true
),
(
  'personalized-skincare-routine',
  'AI-Powered Personalized Skincare Routine',
  'Machine learning–driven system that generates personalized skincare routines based on skin type, goals, and behavioral data.',
  'Personalization & E-commerce',
  ARRAY['personalization', 'recommendation-systems', 'e-commerce', 'machine-learning'],
  'production',
  '{
    "problem": "Generic skincare recommendations don''t address individual needs",
    "objective": "Increase customer satisfaction and repeat purchases through personalization",
    "investment_range": "$3M–$7M",
    "roi_assumptions": ["Revenue uplift through higher average order value", "Increased repeat purchases"],
    "kpis": ["average_order_value", "retention_rate", "routine_completion"]
  }'::jsonb,
  '{
    "user_stories": [
      "As a customer, I want a personalized skincare routine based on my skin type",
      "As a customer, I want to track my skincare progress over time"
    ],
    "functional_requirements": ["Skin type assessment", "Product recommendations", "Routine builder", "Progress tracking"],
    "non_functional": ["Real-time recommendations", "Mobile-first design", "Data privacy"],
    "risks": [
      {"description": "Algorithm bias in recommendations", "severity": "medium"},
      {"description": "Data quality issues", "severity": "low"}
    ],
    "ethics_compliance": ["Transparent recommendation logic", "User data privacy", "No discriminatory practices"]
  }'::jsonb,
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  maturity = EXCLUDED.maturity,
  business_case = EXCLUDED.business_case,
  prd = EXCLUDED.prd,
  published = EXCLUDED.published,
  updated_at = NOW();

-- ✅ Projects seeded successfully

