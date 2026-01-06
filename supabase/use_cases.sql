-- Beauty × AI Atlas - Use Cases Seed Data
-- Generated from use_cases.json
-- Uses UPSERT to allow safe re-running

-- ============================================================================
-- USE CASES (12 entries)
-- ============================================================================

INSERT INTO use_cases (slug, title, description, category, maturity_level, impact_score, tags, published) VALUES
(
  'virtual-try-on',
  'Virtual Try-On',
  'AR-powered virtual makeup and product try-on experiences for e-commerce.',
  'generative',
  'established',
  9,
  ARRAY['ar', 'e-commerce', 'consumer-experience'],
  true
),
(
  'skin-analysis',
  'AI Skin Analysis',
  'Computer vision-based skin condition analysis for personalized skincare recommendations.',
  'diagnostic',
  'growing',
  8,
  ARRAY['computer-vision', 'skincare', 'personalization'],
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
  'virtual-try-on-tech',
  'Virtual Try-On Technology',
  'AR-powered virtual makeup and skincare try-on experiences using computer vision and facial recognition.',
  'generative',
  'established',
  9,
  ARRAY['ar', 'computer-vision', 'consumer-experience'],
  true
),
(
  'personalized-recommendations',
  'Personalized Product Recommendations',
  'ML-driven recommendation engines that suggest beauty products based on skin type, preferences, and purchase history.',
  'recommendation',
  'established',
  9,
  ARRAY['recommendation-systems', 'personalization', 'e-commerce'],
  true
),
(
  'skin-aging-wrinkle-mapping',
  'Skin Aging & Wrinkle Mapping',
  'Quantitative analysis of wrinkles, fine lines, and skin texture changes over time using facial imaging.',
  'diagnostic',
  'growing',
  8,
  ARRAY['computer-vision', 'aging', 'skincare'],
  true
),
(
  'hair-loss-scalp-diagnostics',
  'Hair Loss & Scalp Health Diagnostics',
  'AI-based analysis of scalp images to identify hair thinning, dandruff, and scalp health issues.',
  'diagnostic',
  'growing',
  7,
  ARRAY['computer-vision', 'haircare', 'diagnostics'],
  true
),
(
  'climate-aware-beauty',
  'Climate-Aware Beauty Recommendations',
  'Adaptive beauty product and routine recommendations based on climate, humidity, and pollution data.',
  'recommendation',
  'emerging',
  7,
  ARRAY['personalization', 'climate-data', 'analytics'],
  true
),
(
  'ai-cosmetic-formulation',
  'AI-Assisted Cosmetic Formulation',
  'Machine learning systems that assist cosmetic scientists in designing and optimizing formulations.',
  'analytics',
  'growing',
  8,
  ARRAY['formulation', 'machine-learning', 'r-and-d'],
  true
),
(
  'environmental-impact-modeling',
  'Environmental Impact Modeling for Beauty Products',
  'AI models that estimate environmental impact across the lifecycle of beauty products and ingredients.',
  'analytics',
  'emerging',
  8,
  ARRAY['sustainability', 'lifecycle-analysis', 'regulation'],
  true
),
(
  'ai-beauty-content-generation',
  'AI-Generated Beauty Marketing Content',
  'Generative AI tools that produce beauty-focused copy, imagery, and campaign assets.',
  'generative',
  'established',
  9,
  ARRAY['generative-ai', 'marketing', 'content'],
  true
),
(
  'digital-twins-skin-hair',
  'Digital Twins for Skin & Hair',
  'Virtual replicas of skin and hair used to simulate treatments, products, and long-term outcomes.',
  'analytics',
  'emerging',
  10,
  ARRAY['digital-twins', 'simulation', 'future-tech'],
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

