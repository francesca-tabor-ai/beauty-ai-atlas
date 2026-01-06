-- Beauty × AI Atlas - Row Level Security Policies
-- Security model: Public read (published only), Admin full access

-- ============================================================================
-- HELPER FUNCTION: Check if current user is admin
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt()->>'role')::text = 'admin',
    false
  );
$$;

COMMENT ON FUNCTION is_admin() IS 
  'Returns true if the current authenticated user has admin role in JWT claims';

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_specialisms ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- BRANDS POLICIES
-- ============================================================================

-- Public users can read published brands
CREATE POLICY "Public read access to published brands"
ON brands
FOR SELECT
TO public
USING (published = true);

COMMENT ON POLICY "Public read access to published brands" ON brands IS
  'Allows anyone to read brands where published = true';

-- Admin users have full access
CREATE POLICY "Admin full access to brands"
ON brands
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

COMMENT ON POLICY "Admin full access to brands" ON brands IS
  'Allows users with admin role to perform all operations (SELECT, INSERT, UPDATE, DELETE)';

-- ============================================================================
-- USE CASES POLICIES
-- ============================================================================

-- Public users can read published use cases
CREATE POLICY "Public read access to published use cases"
ON use_cases
FOR SELECT
TO public
USING (published = true);

COMMENT ON POLICY "Public read access to published use cases" ON use_cases IS
  'Allows anyone to read use cases where published = true';

-- Admin users have full access
CREATE POLICY "Admin full access to use cases"
ON use_cases
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

COMMENT ON POLICY "Admin full access to use cases" ON use_cases IS
  'Allows users with admin role to perform all operations';

-- ============================================================================
-- AI SPECIALISMS POLICIES
-- ============================================================================

-- Public users can read published AI specialisms
CREATE POLICY "Public read access to published ai specialisms"
ON ai_specialisms
FOR SELECT
TO public
USING (published = true);

COMMENT ON POLICY "Public read access to published ai specialisms" ON ai_specialisms IS
  'Allows anyone to read AI specialisms where published = true';

-- Admin users have full access
CREATE POLICY "Admin full access to ai specialisms"
ON ai_specialisms
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

COMMENT ON POLICY "Admin full access to ai specialisms" ON ai_specialisms IS
  'Allows users with admin role to perform all operations';

-- ============================================================================
-- JOB ROLES POLICIES
-- ============================================================================

-- Public users can read published job roles
CREATE POLICY "Public read access to published job roles"
ON job_roles
FOR SELECT
TO public
USING (published = true);

COMMENT ON POLICY "Public read access to published job roles" ON job_roles IS
  'Allows anyone to read job roles where published = true';

-- Admin users have full access
CREATE POLICY "Admin full access to job roles"
ON job_roles
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

COMMENT ON POLICY "Admin full access to job roles" ON job_roles IS
  'Allows users with admin role to perform all operations';

-- ============================================================================
-- PROJECTS POLICIES
-- ============================================================================

-- Public users can read published projects
CREATE POLICY "Public read access to published projects"
ON projects
FOR SELECT
TO public
USING (published = true);

COMMENT ON POLICY "Public read access to published projects" ON projects IS
  'Allows anyone to read projects where published = true';

-- Admin users have full access
CREATE POLICY "Admin full access to projects"
ON projects
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

COMMENT ON POLICY "Admin full access to projects" ON projects IS
  'Allows users with admin role to perform all operations';

-- ============================================================================
-- TIMELINE EVENTS POLICIES
-- ============================================================================

-- Public users can read published timeline events
CREATE POLICY "Public read access to published timeline events"
ON timeline_events
FOR SELECT
TO public
USING (published = true);

COMMENT ON POLICY "Public read access to published timeline events" ON timeline_events IS
  'Allows anyone to read timeline events where published = true';

-- Admin users have full access
CREATE POLICY "Admin full access to timeline events"
ON timeline_events
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

COMMENT ON POLICY "Admin full access to timeline events" ON timeline_events IS
  'Allows users with admin role to perform all operations';

-- ============================================================================
-- LEARNING PATHS POLICIES
-- ============================================================================

-- Public users can read published learning paths
CREATE POLICY "Public read access to published learning paths"
ON learning_paths
FOR SELECT
TO public
USING (published = true);

COMMENT ON POLICY "Public read access to published learning paths" ON learning_paths IS
  'Allows anyone to read learning paths where published = true';

-- Admin users have full access
CREATE POLICY "Admin full access to learning paths"
ON learning_paths
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

COMMENT ON POLICY "Admin full access to learning paths" ON learning_paths IS
  'Allows users with admin role to perform all operations';

-- ============================================================================
-- EDGES POLICIES (Special: Both endpoints must be published)
-- ============================================================================

-- Helper function to check if both edge endpoints are published
CREATE OR REPLACE FUNCTION both_endpoints_published(
  p_from_type entity_type_enum,
  p_from_id uuid,
  p_to_type entity_type_enum,
  p_to_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  from_published boolean;
  to_published boolean;
BEGIN
  -- Check if from entity is published
  CASE p_from_type
    WHEN 'brands' THEN
      SELECT published INTO from_published FROM brands WHERE id = p_from_id;
    WHEN 'use_cases' THEN
      SELECT published INTO from_published FROM use_cases WHERE id = p_from_id;
    WHEN 'ai_specialisms' THEN
      SELECT published INTO from_published FROM ai_specialisms WHERE id = p_from_id;
    WHEN 'job_roles' THEN
      SELECT published INTO from_published FROM job_roles WHERE id = p_from_id;
    WHEN 'projects' THEN
      SELECT published INTO from_published FROM projects WHERE id = p_from_id;
    WHEN 'timeline_events' THEN
      SELECT published INTO from_published FROM timeline_events WHERE id = p_from_id;
    WHEN 'learning_paths' THEN
      SELECT published INTO from_published FROM learning_paths WHERE id = p_from_id;
  END CASE;

  -- Check if to entity is published
  CASE p_to_type
    WHEN 'brands' THEN
      SELECT published INTO to_published FROM brands WHERE id = p_to_id;
    WHEN 'use_cases' THEN
      SELECT published INTO to_published FROM use_cases WHERE id = p_to_id;
    WHEN 'ai_specialisms' THEN
      SELECT published INTO to_published FROM ai_specialisms WHERE id = p_to_id;
    WHEN 'job_roles' THEN
      SELECT published INTO to_published FROM job_roles WHERE id = p_to_id;
    WHEN 'projects' THEN
      SELECT published INTO to_published FROM projects WHERE id = p_to_id;
    WHEN 'timeline_events' THEN
      SELECT published INTO to_published FROM timeline_events WHERE id = p_to_id;
    WHEN 'learning_paths' THEN
      SELECT published INTO to_published FROM learning_paths WHERE id = p_to_id;
  END CASE;

  -- Return true only if both are published
  RETURN COALESCE(from_published, false) = true 
     AND COALESCE(to_published, false) = true;
END;
$$;

COMMENT ON FUNCTION both_endpoints_published IS
  'Checks if both entities connected by an edge are published. Returns true only if both endpoints are published.';

-- Public users can read edges where both endpoints are published AND edge itself is published
CREATE POLICY "Public read access to published edges with published endpoints"
ON edges
FOR SELECT
TO public
USING (
  published = true 
  AND both_endpoints_published(from_type, from_id, to_type, to_id) = true
);

COMMENT ON POLICY "Public read access to published edges with published endpoints" ON edges IS
  'Allows anyone to read edges where: 1) edge is published, AND 2) both connected entities are published';

-- Admin users have full access to edges
CREATE POLICY "Admin full access to edges"
ON edges
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

COMMENT ON POLICY "Admin full access to edges" ON edges IS
  'Allows users with admin role to perform all operations on edges';

-- ============================================================================
-- NOTES ON ADMIN ROLE SETUP
-- ============================================================================

-- To set a user as admin, update their metadata in Supabase:
-- 
-- Option 1: Via Supabase Dashboard
-- 1. Go to Authentication > Users
-- 2. Select user
-- 3. Edit raw_app_meta_data: {"role": "admin"}
--
-- Option 2: Via SQL (for initial setup)
-- UPDATE auth.users 
-- SET raw_app_meta_data = jsonb_build_object('role', 'admin')
-- WHERE email = 'admin@example.com';
--
-- Option 3: Via Supabase Admin API
-- Use the admin API to update user metadata with role: 'admin'

