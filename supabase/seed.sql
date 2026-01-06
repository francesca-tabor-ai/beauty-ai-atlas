-- Beauty × AI Atlas - Seed Data
-- Realistic data for beauty × AI knowledge platform

-- ============================================================================
-- BRANDS (3 entries)
-- ============================================================================

INSERT INTO brands (slug, name, description, website, logo_url, category, headquarters, founded_year, tags, published) VALUES
(
  'loreal',
  'L''Oréal',
  'World''s largest cosmetics company, pioneering AI in beauty through virtual try-on, skin analysis, and personalized recommendations.',
  'https://www.loreal.com',
  'https://example.com/logos/loreal.png',
  'Luxury & Mass Market',
  'Clichy, France',
  1909,
  ARRAY['luxury', 'k-beauty', 'sustainability', 'ai-innovation', 'personalization'],
  true
),
(
  'estee-lauder',
  'Estée Lauder Companies',
  'Prestige beauty conglomerate leveraging AI for consumer insights, product development, and omnichannel experiences.',
  'https://www.esteelauder.com',
  'https://example.com/logos/estee-lauder.png',
  'Luxury',
  'New York, USA',
  1946,
  ARRAY['luxury', 'prestige', 'ai-innovation', 'consumer-insights'],
  true
),
(
  'glossier',
  'Glossier',
  'Digital-native beauty brand using AI for community-driven product development and hyper-personalized shopping experiences.',
  'https://www.glossier.com',
  'https://example.com/logos/glossier.png',
  'Digital-First',
  'New York, USA',
  2014,
  ARRAY['digital-native', 'community-driven', 'personalization', 'millennial'],
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

-- ============================================================================
-- USE CASES (3 entries)
-- ============================================================================

INSERT INTO use_cases (slug, title, description, category, maturity_level, impact_score, tags, published) VALUES
(
  'virtual-try-on',
  'Virtual Try-On Technology',
  'AR-powered virtual makeup and skincare try-on experiences using computer vision and facial recognition.',
  'generative',
  'established',
  9,
  ARRAY['ar', 'computer-vision', 'consumer-experience', 'e-commerce'],
  true
),
(
  'skin-diagnostics',
  'AI-Powered Skin Analysis',
  'Automated skin condition assessment using image analysis, machine learning, and dermatological knowledge bases.',
  'diagnostic',
  'growing',
  8,
  ARRAY['computer-vision', 'healthcare', 'personalization', 'diagnostics'],
  true
),
(
  'personalized-recommendations',
  'Personalized Product Recommendations',
  'ML-driven recommendation engines that suggest beauty products based on skin type, preferences, and purchase history.',
  'recommendation',
  'established',
  7,
  ARRAY['recommendation-systems', 'personalization', 'e-commerce', 'nlp'],
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  maturity_level = EXCLUDED.maturity_level,
  impact_score = EXCLUDED.impact_score,
  tags = EXCLUDED.tags,
  published = EXCLUDED.published,
  updated_at = NOW();

-- ============================================================================
-- AI SPECIALISMS (3 entries)
-- ============================================================================

INSERT INTO ai_specialisms (slug, name, description, category, maturity_timeline, tags, published) VALUES
(
  'computer-vision',
  'Computer Vision',
  'Image recognition and analysis for skin assessment, makeup application, and product identification.',
  'computer_vision',
  '{"2018": "research", "2020": "pilot", "2022": "commercial", "2024": "mainstream"}'::jsonb,
  ARRAY['image-recognition', 'facial-analysis', 'object-detection'],
  true
),
(
  'generative-ai',
  'Generative AI',
  'Creating synthetic beauty content, virtual influencers, and AI-generated product imagery.',
  'generative_ai',
  '{"2021": "research", "2023": "early-adoption", "2024": "rapid-growth"}'::jsonb,
  ARRAY['gans', 'diffusion-models', 'content-generation'],
  true
),
(
  'recommendation-systems',
  'Recommendation Systems',
  'Personalized product suggestions using collaborative filtering, content-based filtering, and hybrid approaches.',
  'recommendation_systems',
  '{"2015": "basic", "2018": "ml-enhanced", "2021": "deep-learning", "2024": "transformer-based"}'::jsonb,
  ARRAY['collaborative-filtering', 'content-based', 'hybrid'],
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  maturity_timeline = EXCLUDED.maturity_timeline,
  tags = EXCLUDED.tags,
  published = EXCLUDED.published,
  updated_at = NOW();

-- ============================================================================
-- JOB ROLES (3 entries)
-- ============================================================================

INSERT INTO job_roles (slug, title, description, department, seniority_level, ai_impact_level, emerging, skills_required, tags, published) VALUES
(
  'ai-beauty-scientist',
  'AI Beauty Scientist',
  'Research and develop AI solutions for beauty applications, combining computer vision, ML, and cosmetic science.',
  'R&D',
  'Senior',
  'transformative',
  true,
  ARRAY['python', 'computer-vision', 'machine-learning', 'cosmetic-science', 'tensorflow'],
  ARRAY['emerging-role', 'research', 'interdisciplinary'],
  true
),
(
  'personalization-engineer',
  'Personalization Engineer',
  'Build and maintain recommendation systems and personalization engines for beauty e-commerce platforms.',
  'Engineering',
  'Mid to Senior',
  'high',
  false,
  ARRAY['python', 'recommendation-systems', 'ml-ops', 'data-engineering', 'aws'],
  ARRAY['e-commerce', 'ml-engineering'],
  true
),
(
  'ar-beauty-developer',
  'AR Beauty Developer',
  'Develop augmented reality experiences for virtual try-on, makeup simulation, and interactive beauty apps.',
  'Engineering',
  'Mid',
  'high',
  false,
  ARRAY['unity', 'arkit', 'ar-core', 'computer-vision', '3d-graphics', 'swift', 'kotlin'],
  ARRAY['ar', 'mobile-development', 'computer-vision'],
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  department = EXCLUDED.department,
  seniority_level = EXCLUDED.seniority_level,
  ai_impact_level = EXCLUDED.ai_impact_level,
  emerging = EXCLUDED.emerging,
  skills_required = EXCLUDED.skills_required,
  tags = EXCLUDED.tags,
  published = EXCLUDED.published,
  updated_at = NOW();

-- ============================================================================
-- PROJECTS (3 entries)
-- ============================================================================

INSERT INTO projects (slug, title, description, category, business_case, prd, maturity, tags, published) VALUES
(
  'modiface-integration',
  'ModiFace AR Integration',
  'Integration of ModiFace virtual try-on technology into L''Oréal''s e-commerce platforms.',
  'Consumer Experience',
  '{
    "problem": "Low online conversion rates due to inability to try products",
    "objective": "Increase online sales by 30% through virtual try-on",
    "investment_range": "$5M-$10M",
    "roi_assumptions": "30% conversion increase, 20% higher AOV",
    "kpis": ["conversion_rate", "average_order_value", "time_on_site", "return_rate"]
  }'::jsonb,
  '{
    "user_stories": [
      "As a customer, I want to try on lipstick virtually",
      "As a customer, I want to see how foundation matches my skin tone"
    ],
    "functional_requirements": ["Real-time AR rendering", "Color matching", "Product recommendations"],
    "non_functional": ["<2s load time", "Works on 90%+ devices", "Accessibility compliance"],
    "risks": ["Device compatibility", "Color accuracy", "Performance"],
    "ethics_compliance": ["Privacy of facial data", "No age restrictions", "Inclusive skin tones"]
  }'::jsonb,
  'production',
  ARRAY['ar', 'e-commerce', 'consumer-experience'],
  true
),
(
  'skin-ai-diagnostic',
  'AI Skin Diagnostic Platform',
  'AI-powered skin analysis tool for dermatologists and consumers to assess skin conditions.',
  'Healthcare & Diagnostics',
  '{
    "problem": "Limited access to dermatological expertise",
    "objective": "Democratize skin health assessment",
    "investment_range": "$10M-$20M",
    "roi_assumptions": "B2B licensing model, 50K+ users in year 1",
    "kpis": ["diagnostic_accuracy", "user_adoption", "b2b_licenses", "patient_outcomes"]
  }'::jsonb,
  '{
    "user_stories": [
      "As a dermatologist, I want AI-assisted skin analysis",
      "As a consumer, I want to understand my skin condition"
    ],
    "functional_requirements": ["Image upload", "AI analysis", "Report generation", "Treatment suggestions"],
    "non_functional": ["HIPAA compliance", "99.9% uptime", "Sub-second analysis"],
    "risks": ["Regulatory approval", "Misdiagnosis liability", "Data privacy"],
    "ethics_compliance": ["Medical device regulations", "Patient privacy", "Bias mitigation"]
  }'::jsonb,
  'pilot',
  ARRAY['healthcare', 'diagnostics', 'computer-vision'],
  true
),
(
  'personalized-skincare-routine',
  'AI-Powered Personalized Skincare Routine',
  'ML-driven system that creates custom skincare routines based on skin type, goals, and environmental factors.',
  'Personalization',
  '{
    "problem": "One-size-fits-all skincare doesn''t work",
    "objective": "Increase customer satisfaction and retention",
    "investment_range": "$2M-$5M",
    "roi_assumptions": "25% increase in subscription retention, 40% higher LTV",
    "kpis": ["customer_satisfaction", "retention_rate", "lifetime_value", "routine_completion"]
  }'::jsonb,
  '{
    "user_stories": [
      "As a user, I want a personalized skincare routine",
      "As a user, I want to track my skin progress"
    ],
    "functional_requirements": ["Skin quiz", "Routine generation", "Progress tracking", "Product recommendations"],
    "non_functional": ["Mobile-first", "Real-time updates", "Multi-language"],
    "risks": ["Algorithm accuracy", "Product availability", "User engagement"],
    "ethics_compliance": ["Data privacy", "No medical claims", "Transparent algorithms"]
  }'::jsonb,
  'concept',
  ARRAY['personalization', 'recommendation-systems', 'skincare'],
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  business_case = EXCLUDED.business_case,
  prd = EXCLUDED.prd,
  maturity = EXCLUDED.maturity,
  tags = EXCLUDED.tags,
  published = EXCLUDED.published,
  updated_at = NOW();

-- ============================================================================
-- TIMELINE EVENTS (3 entries)
-- ============================================================================

INSERT INTO timeline_events (slug, year, month, title, description, event_type, significance, tags, published) VALUES
(
  'modiface-acquisition',
  '2018',
  3,
  'L''Oréal Acquires ModiFace',
  'L''Oréal acquires ModiFace, a leading AR beauty technology company, marking a major milestone in AI adoption in beauty.',
  'market',
  'critical',
  ARRAY['acquisition', 'ar', 'market-leadership', 'ai-adoption'],
  true
),
(
  'gpt-beauty-content',
  '2023',
  11,
  'Generative AI Transforms Beauty Content',
  'Beauty brands begin using GPT and DALL-E for product descriptions, marketing content, and virtual influencer creation.',
  'technology',
  'high',
  ARRAY['generative-ai', 'content-creation', 'marketing', 'nlp'],
  true
),
(
  'eu-ai-act-beauty',
  '2024',
  3,
  'EU AI Act Impacts Beauty Tech',
  'EU AI Act comes into effect, requiring beauty AI applications (especially diagnostic tools) to meet new compliance standards.',
  'regulation',
  'high',
  ARRAY['regulation', 'compliance', 'eu', 'diagnostics'],
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  year = EXCLUDED.year,
  month = EXCLUDED.month,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  event_type = EXCLUDED.event_type,
  significance = EXCLUDED.significance,
  tags = EXCLUDED.tags,
  published = EXCLUDED.published,
  updated_at = NOW();

-- ============================================================================
-- LEARNING PATHS (3 entries)
-- ============================================================================

INSERT INTO learning_paths (slug, title, description, difficulty, duration_hours, steps, tags, published) VALUES
(
  'ai-beauty-fundamentals',
  'AI in Beauty: Fundamentals',
  'Introduction to how AI is transforming the beauty industry, from virtual try-on to personalized recommendations.',
  'beginner',
  8,
  ARRAY[
    '{"entity_type": "use_cases", "entity_slug": "virtual-try-on", "label": "Learn about Virtual Try-On", "order": 1}'::jsonb,
    '{"entity_type": "ai_specialisms", "entity_slug": "computer-vision", "label": "Understand Computer Vision", "order": 2}'::jsonb,
    '{"entity_type": "brands", "entity_slug": "loreal", "label": "Explore L''Oréal''s AI initiatives", "order": 3}'::jsonb
  ],
  ARRAY['beginner', 'fundamentals', 'overview'],
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
  ARRAY['intermediate', 'computer-vision', 'technical'],
  true
),
(
  'beauty-ai-career',
  'Building a Career in Beauty AI',
  'Comprehensive path for professionals looking to enter or advance in AI roles within the beauty industry.',
  'advanced',
  40,
  ARRAY[
    '{"entity_type": "job_roles", "entity_slug": "ai-beauty-scientist", "label": "Explore AI Beauty Scientist Role", "order": 1}'::jsonb,
    '{"entity_type": "job_roles", "entity_slug": "personalization-engineer", "label": "Learn Personalization Engineering", "order": 2}'::jsonb,
    '{"entity_type": "projects", "entity_slug": "modiface-integration", "label": "Study Production Projects", "order": 3}'::jsonb,
    '{"entity_type": "timeline_events", "entity_slug": "modiface-acquisition", "label": "Understand Industry Evolution", "order": 4}'::jsonb
  ],
  ARRAY['advanced', 'career', 'comprehensive'],
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

-- ============================================================================
-- EDGES (20 realistic relationships)
-- ============================================================================

-- Get IDs for relationships (we'll use a subquery approach)
DO $$
DECLARE
  loreal_id UUID;
  estee_lauder_id UUID;
  glossier_id UUID;
  virtual_tryon_id UUID;
  skin_diagnostics_id UUID;
  personalized_rec_id UUID;
  computer_vision_id UUID;
  generative_ai_id UUID;
  recommendation_systems_id UUID;
  ai_beauty_scientist_id UUID;
  personalization_engineer_id UUID;
  ar_developer_id UUID;
  modiface_project_id UUID;
  skin_diagnostic_project_id UUID;
  personalized_routine_project_id UUID;
  modiface_event_id UUID;
  gpt_event_id UUID;
  eu_act_event_id UUID;
  ai_fundamentals_path_id UUID;
  computer_vision_path_id UUID;
  beauty_career_path_id UUID;
BEGIN
  -- Get brand IDs
  SELECT id INTO loreal_id FROM brands WHERE slug = 'loreal';
  SELECT id INTO estee_lauder_id FROM brands WHERE slug = 'estee-lauder';
  SELECT id INTO glossier_id FROM brands WHERE slug = 'glossier';
  
  -- Get use case IDs
  SELECT id INTO virtual_tryon_id FROM use_cases WHERE slug = 'virtual-try-on';
  SELECT id INTO skin_diagnostics_id FROM use_cases WHERE slug = 'skin-diagnostics';
  SELECT id INTO personalized_rec_id FROM use_cases WHERE slug = 'personalized-recommendations';
  
  -- Get AI specialism IDs
  SELECT id INTO computer_vision_id FROM ai_specialisms WHERE slug = 'computer-vision';
  SELECT id INTO generative_ai_id FROM ai_specialisms WHERE slug = 'generative-ai';
  SELECT id INTO recommendation_systems_id FROM ai_specialisms WHERE slug = 'recommendation-systems';
  
  -- Get job role IDs
  SELECT id INTO ai_beauty_scientist_id FROM job_roles WHERE slug = 'ai-beauty-scientist';
  SELECT id INTO personalization_engineer_id FROM job_roles WHERE slug = 'personalization-engineer';
  SELECT id INTO ar_developer_id FROM job_roles WHERE slug = 'ar-beauty-developer';
  
  -- Get project IDs
  SELECT id INTO modiface_project_id FROM projects WHERE slug = 'modiface-integration';
  SELECT id INTO skin_diagnostic_project_id FROM projects WHERE slug = 'skin-ai-diagnostic';
  SELECT id INTO personalized_routine_project_id FROM projects WHERE slug = 'personalized-skincare-routine';
  
  -- Get timeline event IDs
  SELECT id INTO modiface_event_id FROM timeline_events WHERE slug = 'modiface-acquisition';
  SELECT id INTO gpt_event_id FROM timeline_events WHERE slug = 'gpt-beauty-content';
  SELECT id INTO eu_act_event_id FROM timeline_events WHERE slug = 'eu-ai-act-beauty';
  
  -- Get learning path IDs
  SELECT id INTO ai_fundamentals_path_id FROM learning_paths WHERE slug = 'ai-beauty-fundamentals';
  SELECT id INTO computer_vision_path_id FROM learning_paths WHERE slug = 'computer-vision-beauty';
  SELECT id INTO beauty_career_path_id FROM learning_paths WHERE slug = 'beauty-ai-career';

  -- Brand relationships
  INSERT INTO edges (from_type, from_id, to_type, to_id, relation_type, strength, published, metadata) VALUES
  -- L'Oréal implements ModiFace project
  ('brands', loreal_id, 'projects', modiface_project_id, 'implements', 5, true, '{"context": "Primary implementation partner"}'::jsonb),
  -- L'Oréal influenced by ModiFace acquisition event
  ('timeline_events', modiface_event_id, 'brands', loreal_id, 'influences', 5, true, '{"context": "Strategic acquisition"}'::jsonb),
  -- Glossier enables personalized recommendations
  ('brands', glossier_id, 'use_cases', personalized_rec_id, 'enables', 4, true, '{"context": "Core to business model"}'::jsonb),
  
  -- Use case relationships
  -- Virtual try-on requires computer vision
  ('use_cases', virtual_tryon_id, 'ai_specialisms', computer_vision_id, 'requires', 5, true, '{"context": "Core dependency"}'::jsonb),
  -- Skin diagnostics requires computer vision
  ('use_cases', skin_diagnostics_id, 'ai_specialisms', computer_vision_id, 'requires', 5, true, '{"context": "Essential technology"}'::jsonb),
  -- Personalized recommendations requires recommendation systems
  ('use_cases', personalized_rec_id, 'ai_specialisms', recommendation_systems_id, 'requires', 5, true, '{"context": "Foundation technology"}'::jsonb),
  -- Virtual try-on demonstrates computer vision
  ('use_cases', virtual_tryon_id, 'ai_specialisms', computer_vision_id, 'demonstrates', 4, true, '{"context": "Real-world application"}'::jsonb),
  
  -- Project relationships
  -- ModiFace project implements virtual try-on
  ('projects', modiface_project_id, 'use_cases', virtual_tryon_id, 'implements', 5, true, '{"context": "Production implementation"}'::jsonb),
  -- Skin diagnostic project implements skin diagnostics
  ('projects', skin_diagnostic_project_id, 'use_cases', skin_diagnostics_id, 'implements', 5, true, '{"context": "Pilot implementation"}'::jsonb),
  -- Personalized routine project implements personalized recommendations
  ('projects', personalized_routine_project_id, 'use_cases', personalized_rec_id, 'implements', 4, true, '{"context": "Concept stage"}'::jsonb),
  -- ModiFace project requires computer vision
  ('projects', modiface_project_id, 'ai_specialisms', computer_vision_id, 'requires', 5, true, '{"context": "Technical dependency"}'::jsonb),
  -- Skin diagnostic requires computer vision
  ('projects', skin_diagnostic_project_id, 'ai_specialisms', computer_vision_id, 'requires', 5, true, '{"context": "Core technology"}'::jsonb),
  -- Personalized routine requires recommendation systems
  ('projects', personalized_routine_project_id, 'ai_specialisms', recommendation_systems_id, 'requires', 4, true, '{"context": "ML foundation"}'::jsonb),
  
  -- Job role relationships
  -- AI Beauty Scientist role requires computer vision
  ('job_roles', ai_beauty_scientist_id, 'ai_specialisms', computer_vision_id, 'requires', 5, true, '{"context": "Essential skill"}'::jsonb),
  -- Personalization Engineer requires recommendation systems
  ('job_roles', personalization_engineer_id, 'ai_specialisms', recommendation_systems_id, 'requires', 5, true, '{"context": "Core expertise"}'::jsonb),
  -- AR Developer requires computer vision
  ('job_roles', ar_developer_id, 'ai_specialisms', computer_vision_id, 'requires', 4, true, '{"context": "Key technology"}'::jsonb),
  -- AI Beauty Scientist transforms skin diagnostics
  ('job_roles', ai_beauty_scientist_id, 'use_cases', skin_diagnostics_id, 'transforms', 4, true, '{"context": "Role enables innovation"}'::jsonb),
  
  -- Learning path relationships
  -- AI Fundamentals path includes virtual try-on
  ('learning_paths', ai_fundamentals_path_id, 'use_cases', virtual_tryon_id, 'includes', 3, true, '{"context": "Step 1 of path"}'::jsonb),
  -- Computer Vision path includes computer vision specialism
  ('learning_paths', computer_vision_path_id, 'ai_specialisms', computer_vision_id, 'includes', 5, true, '{"context": "Core content"}'::jsonb),
  -- Beauty Career path includes AI Beauty Scientist role
  ('learning_paths', beauty_career_path_id, 'job_roles', ai_beauty_scientist_id, 'includes', 4, true, '{"context": "Career option"}'::jsonb),
  
  -- Timeline event relationships
  -- GPT event influences generative AI specialism
  ('timeline_events', gpt_event_id, 'ai_specialisms', generative_ai_id, 'influences', 5, true, '{"context": "Market adoption driver"}'::jsonb),
  -- EU AI Act influences skin diagnostics (regulatory impact)
  ('timeline_events', eu_act_event_id, 'use_cases', skin_diagnostics_id, 'influences', 4, true, '{"context": "Regulatory compliance requirement"}'::jsonb)
ON CONFLICT (from_type, from_id, to_type, to_id, relation_type) DO UPDATE
SET
  strength = EXCLUDED.strength,
  published = EXCLUDED.published,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

END $$;

