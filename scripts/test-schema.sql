-- Test script to validate schema and seed data
-- Run this after executing schema.sql and seed.sql

-- ============================================================================
-- VALIDATION QUERIES
-- ============================================================================

-- 1. Check all entity counts
SELECT 
  'brands' as entity_type, COUNT(*) as count FROM brands WHERE published = true
UNION ALL
SELECT 'use_cases', COUNT(*) FROM use_cases WHERE published = true
UNION ALL
SELECT 'ai_specialisms', COUNT(*) FROM ai_specialisms WHERE published = true
UNION ALL
SELECT 'job_roles', COUNT(*) FROM job_roles WHERE published = true
UNION ALL
SELECT 'projects', COUNT(*) FROM projects WHERE published = true
UNION ALL
SELECT 'timeline_events', COUNT(*) FROM timeline_events WHERE published = true
UNION ALL
SELECT 'learning_paths', COUNT(*) FROM learning_paths WHERE published = true;

-- Expected: 3 for each entity type

-- 2. Check edge count
SELECT COUNT(*) as total_edges FROM edges WHERE published = true;
-- Expected: 20

-- 3. Check edge distribution by relation type
SELECT 
  relation_type, 
  COUNT(*) as count 
FROM edges 
WHERE published = true
GROUP BY relation_type
ORDER BY count DESC;

-- 4. Validate no orphaned edges (edges pointing to non-existent entities)
SELECT 
  e.id,
  e.from_type,
  e.from_id,
  e.to_type,
  e.to_id,
  'from_id not found' as issue
FROM edges e
WHERE NOT EXISTS (
  SELECT 1 FROM brands WHERE id = e.from_id AND e.from_type = 'brands'
  UNION ALL
  SELECT 1 FROM use_cases WHERE id = e.from_id AND e.from_type = 'use_cases'
  UNION ALL
  SELECT 1 FROM ai_specialisms WHERE id = e.from_id AND e.from_type = 'ai_specialisms'
  UNION ALL
  SELECT 1 FROM job_roles WHERE id = e.from_id AND e.from_type = 'job_roles'
  UNION ALL
  SELECT 1 FROM projects WHERE id = e.from_id AND e.from_type = 'projects'
  UNION ALL
  SELECT 1 FROM timeline_events WHERE id = e.from_id AND e.from_type = 'timeline_events'
  UNION ALL
  SELECT 1 FROM learning_paths WHERE id = e.from_id AND e.from_type = 'learning_paths'
)
OR NOT EXISTS (
  SELECT 1 FROM brands WHERE id = e.to_id AND e.to_type = 'brands'
  UNION ALL
  SELECT 1 FROM use_cases WHERE id = e.to_id AND e.to_type = 'use_cases'
  UNION ALL
  SELECT 1 FROM ai_specialisms WHERE id = e.to_id AND e.to_type = 'ai_specialisms'
  UNION ALL
  SELECT 1 FROM job_roles WHERE id = e.to_id AND e.to_type = 'job_roles'
  UNION ALL
  SELECT 1 FROM projects WHERE id = e.to_id AND e.to_type = 'projects'
  UNION ALL
  SELECT 1 FROM timeline_events WHERE id = e.to_id AND e.to_type = 'timeline_events'
  UNION ALL
  SELECT 1 FROM learning_paths WHERE id = e.to_id AND e.to_type = 'learning_paths'
);

-- Expected: 0 rows (no orphaned edges)

-- 5. Test graph query: Find all connections from L'Oréal
SELECT 
  e.relation_type,
  e.to_type,
  e.strength,
  CASE e.to_type
    WHEN 'brands' THEN (SELECT name FROM brands WHERE id = e.to_id)
    WHEN 'use_cases' THEN (SELECT title FROM use_cases WHERE id = e.to_id)
    WHEN 'ai_specialisms' THEN (SELECT name FROM ai_specialisms WHERE id = e.to_id)
    WHEN 'job_roles' THEN (SELECT title FROM job_roles WHERE id = e.to_id)
    WHEN 'projects' THEN (SELECT title FROM projects WHERE id = e.to_id)
    WHEN 'timeline_events' THEN (SELECT title FROM timeline_events WHERE id = e.to_id)
    WHEN 'learning_paths' THEN (SELECT title FROM learning_paths WHERE id = e.to_id)
  END as to_entity_name
FROM edges e
WHERE e.from_type = 'brands' 
  AND e.from_id = (SELECT id FROM brands WHERE slug = 'loreal')
  AND e.published = true
ORDER BY e.strength DESC;

-- 6. Test reverse query: What requires computer vision?
SELECT 
  e.from_type,
  e.relation_type,
  CASE e.from_type
    WHEN 'brands' THEN (SELECT name FROM brands WHERE id = e.from_id)
    WHEN 'use_cases' THEN (SELECT title FROM use_cases WHERE id = e.from_id)
    WHEN 'ai_specialisms' THEN (SELECT name FROM ai_specialisms WHERE id = e.from_id)
    WHEN 'job_roles' THEN (SELECT title FROM job_roles WHERE id = e.from_id)
    WHEN 'projects' THEN (SELECT title FROM projects WHERE id = e.from_id)
    WHEN 'timeline_events' THEN (SELECT title FROM timeline_events WHERE id = e.from_id)
    WHEN 'learning_paths' THEN (SELECT title FROM learning_paths WHERE id = e.from_id)
  END as from_entity_name
FROM edges e
WHERE e.to_type = 'ai_specialisms'
  AND e.to_id = (SELECT id FROM ai_specialisms WHERE slug = 'computer-vision')
  AND e.relation_type = 'requires'
  AND e.published = true;

-- 7. Test learning path structure
SELECT 
  lp.title as path_title,
  e.relation_type,
  e.to_type,
  (e.metadata->>'order')::int as step_order,
  (e.metadata->>'label')::text as step_label,
  CASE e.to_type
    WHEN 'brands' THEN (SELECT name FROM brands WHERE id = e.to_id)
    WHEN 'use_cases' THEN (SELECT title FROM use_cases WHERE id = e.to_id)
    WHEN 'ai_specialisms' THEN (SELECT name FROM ai_specialisms WHERE id = e.to_id)
    WHEN 'job_roles' THEN (SELECT title FROM job_roles WHERE id = e.to_id)
    WHEN 'projects' THEN (SELECT title FROM projects WHERE id = e.to_id)
    WHEN 'timeline_events' THEN (SELECT title FROM timeline_events WHERE id = e.to_id)
    WHEN 'learning_paths' THEN (SELECT title FROM learning_paths WHERE id = e.to_id)
  END as step_entity
FROM learning_paths lp
JOIN edges e ON e.from_id = lp.id AND e.from_type = 'learning_paths'
WHERE lp.slug = 'ai-beauty-fundamentals'
  AND e.published = true
ORDER BY (e.metadata->>'order')::int;

-- 8. Check indexes are being used (explain plan)
EXPLAIN ANALYZE
SELECT * FROM edges 
WHERE from_type = 'brands' 
  AND from_id = (SELECT id FROM brands WHERE slug = 'loreal')
  AND published = true;

-- All tests passed if:
-- 1. All entity counts = 3
-- 2. Edge count = 20
-- 3. No orphaned edges
-- 4. Graph queries return expected results

