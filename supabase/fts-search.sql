-- Full-Text Search for Beauty × AI Atlas
-- Creates search function and GIN indexes for performance

-- ============================================================================
-- CREATE SEARCH VECTOR COLUMNS (if they don't exist)
-- ============================================================================

-- Add tsvector columns for full-text search
DO $$
BEGIN
  -- Brands
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'brands'::regclass AND attname = 'search_vector') THEN
    ALTER TABLE brands ADD COLUMN search_vector tsvector;
  END IF;

  -- Use Cases
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'use_cases'::regclass AND attname = 'search_vector') THEN
    ALTER TABLE use_cases ADD COLUMN search_vector tsvector;
  END IF;

  -- AI Specialisms
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'ai_specialisms'::regclass AND attname = 'search_vector') THEN
    ALTER TABLE ai_specialisms ADD COLUMN search_vector tsvector;
  END IF;

  -- Job Roles
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'job_roles'::regclass AND attname = 'search_vector') THEN
    ALTER TABLE job_roles ADD COLUMN search_vector tsvector;
  END IF;

  -- Projects
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'projects'::regclass AND attname = 'search_vector') THEN
    ALTER TABLE projects ADD COLUMN search_vector tsvector;
  END IF;

  -- Timeline Events
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'timeline_events'::regclass AND attname = 'search_vector') THEN
    ALTER TABLE timeline_events ADD COLUMN search_vector tsvector;
  END IF;

  -- Learning Paths
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'learning_paths'::regclass AND attname = 'search_vector') THEN
    ALTER TABLE learning_paths ADD COLUMN search_vector tsvector;
  END IF;
END $$;

-- ============================================================================
-- CREATE TRIGGERS TO UPDATE SEARCH VECTORS
-- ============================================================================

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  -- Brands: search name, description, category, tags
  IF TG_TABLE_NAME = 'brands' THEN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C') ||
      setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, ARRAY[]::text[]), ' ')), 'C');
  END IF;

  -- Use Cases: search title, description, category, tags
  IF TG_TABLE_NAME = 'use_cases' THEN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.category::text, '')), 'C') ||
      setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, ARRAY[]::text[]), ' ')), 'C');
  END IF;

  -- AI Specialisms: search name, description, category, tags
  IF TG_TABLE_NAME = 'ai_specialisms' THEN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.category::text, '')), 'C') ||
      setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, ARRAY[]::text[]), ' ')), 'C');
  END IF;

  -- Job Roles: search title, description, department, tags
  IF TG_TABLE_NAME = 'job_roles' THEN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.department, '')), 'C') ||
      setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, ARRAY[]::text[]), ' ')), 'C');
  END IF;

  -- Projects: search title, description, category, tags
  IF TG_TABLE_NAME = 'projects' THEN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C') ||
      setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, ARRAY[]::text[]), ' ')), 'C');
  END IF;

  -- Timeline Events: search title, description, tags
  IF TG_TABLE_NAME = 'timeline_events' THEN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
      setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, ARRAY[]::text[]), ' ')), 'C');
  END IF;

  -- Learning Paths: search title, description, tags
  IF TG_TABLE_NAME = 'learning_paths' THEN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
      setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, ARRAY[]::text[]), ' ')), 'C');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
DROP TRIGGER IF EXISTS brands_search_vector_update ON brands;
CREATE TRIGGER brands_search_vector_update
  BEFORE INSERT OR UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

DROP TRIGGER IF EXISTS use_cases_search_vector_update ON use_cases;
CREATE TRIGGER use_cases_search_vector_update
  BEFORE INSERT OR UPDATE ON use_cases
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

DROP TRIGGER IF EXISTS ai_specialisms_search_vector_update ON ai_specialisms;
CREATE TRIGGER ai_specialisms_search_vector_update
  BEFORE INSERT OR UPDATE ON ai_specialisms
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

DROP TRIGGER IF EXISTS job_roles_search_vector_update ON job_roles;
CREATE TRIGGER job_roles_search_vector_update
  BEFORE INSERT OR UPDATE ON job_roles
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

DROP TRIGGER IF EXISTS projects_search_vector_update ON projects;
CREATE TRIGGER projects_search_vector_update
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

DROP TRIGGER IF EXISTS timeline_events_search_vector_update ON timeline_events;
CREATE TRIGGER timeline_events_search_vector_update
  BEFORE INSERT OR UPDATE ON timeline_events
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

DROP TRIGGER IF EXISTS learning_paths_search_vector_update ON learning_paths;
CREATE TRIGGER learning_paths_search_vector_update
  BEFORE INSERT OR UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- ============================================================================
-- CREATE GIN INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS brands_search_vector_idx ON brands USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS use_cases_search_vector_idx ON use_cases USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS ai_specialisms_search_vector_idx ON ai_specialisms USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS job_roles_search_vector_idx ON job_roles USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS projects_search_vector_idx ON projects USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS timeline_events_search_vector_idx ON timeline_events USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS learning_paths_search_vector_idx ON learning_paths USING GIN (search_vector);

-- ============================================================================
-- SEARCH FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION search_all_entities(search_term text)
RETURNS TABLE(
  entity_type text,
  entity_id uuid,
  title text,
  slug text,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  -- Brands
  SELECT
    'brands'::text,
    b.id,
    b.name::text,
    b.slug,
    ts_rank(b.search_vector, plainto_tsquery('english', search_term)) as rank
  FROM brands b
  WHERE b.published = true
    AND b.search_vector @@ plainto_tsquery('english', search_term)
  
  UNION ALL
  
  -- Use Cases
  SELECT
    'use_cases'::text,
    uc.id,
    uc.title::text,
    uc.slug,
    ts_rank(uc.search_vector, plainto_tsquery('english', search_term)) as rank
  FROM use_cases uc
  WHERE uc.published = true
    AND uc.search_vector @@ plainto_tsquery('english', search_term)
  
  UNION ALL
  
  -- AI Specialisms
  SELECT
    'ai_specialisms'::text,
    ai.id,
    ai.name::text,
    ai.slug,
    ts_rank(ai.search_vector, plainto_tsquery('english', search_term)) as rank
  FROM ai_specialisms ai
  WHERE ai.published = true
    AND ai.search_vector @@ plainto_tsquery('english', search_term)
  
  UNION ALL
  
  -- Job Roles
  SELECT
    'job_roles'::text,
    jr.id,
    jr.title::text,
    jr.slug,
    ts_rank(jr.search_vector, plainto_tsquery('english', search_term)) as rank
  FROM job_roles jr
  WHERE jr.published = true
    AND jr.search_vector @@ plainto_tsquery('english', search_term)
  
  UNION ALL
  
  -- Projects
  SELECT
    'projects'::text,
    p.id,
    p.title::text,
    p.slug,
    ts_rank(p.search_vector, plainto_tsquery('english', search_term)) as rank
  FROM projects p
  WHERE p.published = true
    AND p.search_vector @@ plainto_tsquery('english', search_term)
  
  UNION ALL
  
  -- Timeline Events
  SELECT
    'timeline_events'::text,
    te.id,
    te.title::text,
    te.slug,
    ts_rank(te.search_vector, plainto_tsquery('english', search_term)) as rank
  FROM timeline_events te
  WHERE te.published = true
    AND te.search_vector @@ plainto_tsquery('english', search_term)
  
  UNION ALL
  
  -- Learning Paths
  SELECT
    'learning_paths'::text,
    lp.id,
    lp.title::text,
    lp.slug,
    ts_rank(lp.search_vector, plainto_tsquery('english', search_term)) as rank
  FROM learning_paths lp
  WHERE lp.published = true
    AND lp.search_vector @@ plainto_tsquery('english', search_term)
  
  ORDER BY rank DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- INITIALIZE SEARCH VECTORS FOR EXISTING DATA
-- ============================================================================

-- Update existing rows to populate search vectors
UPDATE brands SET updated_at = updated_at;
UPDATE use_cases SET updated_at = updated_at;
UPDATE ai_specialisms SET updated_at = updated_at;
UPDATE job_roles SET updated_at = updated_at;
UPDATE projects SET updated_at = updated_at;
UPDATE timeline_events SET updated_at = updated_at;
UPDATE learning_paths SET updated_at = updated_at;

