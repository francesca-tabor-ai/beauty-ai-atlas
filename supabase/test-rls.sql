-- Test script for Row Level Security policies
-- Run this after executing rls-policies.sql

-- ============================================================================
-- TEST 1: Verify RLS is enabled
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('brands', 'use_cases', 'ai_specialisms', 'job_roles', 'projects', 'timeline_events', 'learning_paths', 'edges')
ORDER BY tablename;

-- Expected: All tables should have rls_enabled = true

-- ============================================================================
-- TEST 2: Verify policies exist
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('brands', 'use_cases', 'ai_specialisms', 'job_roles', 'projects', 'timeline_events', 'learning_paths', 'edges')
ORDER BY tablename, policyname;

-- Expected: 2 policies per entity table (public read + admin full), 2 for edges

-- ============================================================================
-- TEST 3: Test public read access (should only see published)
-- ============================================================================

-- This should only return published brands
SELECT 
  COUNT(*) as published_brands_count,
  (SELECT COUNT(*) FROM brands) as total_brands_count
FROM brands
WHERE published = true;

-- Expected: published_brands_count should equal total_brands_count if all are published
-- If some are unpublished, published_brands_count < total_brands_count

-- ============================================================================
-- TEST 4: Test edge visibility (both endpoints must be published)
-- ============================================================================

-- Count edges where both endpoints are published
SELECT 
  COUNT(*) as visible_edges_count,
  (SELECT COUNT(*) FROM edges WHERE published = true) as published_edges_count
FROM edges e
WHERE e.published = true
  AND both_endpoints_published(e.from_type, e.from_id, e.to_type, e.to_id) = true;

-- Expected: visible_edges_count should equal published_edges_count if all endpoints are published

-- ============================================================================
-- TEST 5: Test edge visibility with unpublished entity
-- ============================================================================

-- Temporarily unpublish a brand to test edge visibility
-- (This is a test - you may want to revert after)
DO $$
DECLARE
  test_brand_id uuid;
  edge_count_before int;
  edge_count_after int;
BEGIN
  -- Get a brand ID
  SELECT id INTO test_brand_id FROM brands WHERE slug = 'loreal' LIMIT 1;
  
  -- Count edges before
  SELECT COUNT(*) INTO edge_count_before
  FROM edges
  WHERE published = true
    AND (from_id = test_brand_id OR to_id = test_brand_id);
  
  -- Unpublish the brand
  UPDATE brands SET published = false WHERE id = test_brand_id;
  
  -- Count visible edges after (should be 0 if brand was only endpoint)
  SELECT COUNT(*) INTO edge_count_after
  FROM edges e
  WHERE e.published = true
    AND both_endpoints_published(e.from_type, e.from_id, e.to_type, e.to_id) = true
    AND (e.from_id = test_brand_id OR e.to_id = test_brand_id);
  
  -- Re-publish the brand
  UPDATE brands SET published = true WHERE id = test_brand_id;
  
  RAISE NOTICE 'Edges before unpublish: %, Edges after (should be 0): %', edge_count_before, edge_count_after;
END $$;

-- ============================================================================
-- TEST 6: Verify helper functions exist
-- ============================================================================

SELECT 
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('is_admin', 'both_endpoints_published')
ORDER BY routine_name;

-- Expected: Both functions should exist

-- ============================================================================
-- TEST 7: Test is_admin function (should return false for anonymous users)
-- ============================================================================

-- This should return false when not authenticated as admin
SELECT is_admin() as current_user_is_admin;

-- Expected: false (unless you're authenticated as admin)

-- ============================================================================
-- TEST 8: Verify admin policies allow full access
-- ============================================================================

-- Check that admin policies exist and allow ALL operations
SELECT 
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'ALL' THEN 'Full access'
    WHEN cmd = 'SELECT' THEN 'Read only'
    ELSE cmd::text
  END as access_level
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname LIKE '%Admin%'
ORDER BY tablename;

-- Expected: All admin policies should have cmd = 'ALL'

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- Run this to get a summary of your RLS setup:
SELECT 
  'RLS Enabled Tables' as metric,
  COUNT(*)::text as value
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('brands', 'use_cases', 'ai_specialisms', 'job_roles', 'projects', 'timeline_events', 'learning_paths', 'edges')
  AND rowsecurity = true

UNION ALL

SELECT 
  'Total Policies' as metric,
  COUNT(*)::text as value
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('brands', 'use_cases', 'ai_specialisms', 'job_roles', 'projects', 'timeline_events', 'learning_paths', 'edges')

UNION ALL

SELECT 
  'Helper Functions' as metric,
  COUNT(*)::text as value
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('is_admin', 'both_endpoints_published');

-- Expected results:
-- RLS Enabled Tables: 8
-- Total Policies: 16 (2 per table)
-- Helper Functions: 2

