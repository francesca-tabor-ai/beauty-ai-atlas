-- Beauty × AI Atlas - Graph-Native Supabase Schema
-- This schema supports interconnected knowledge with graph relationships

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE entity_type_enum AS ENUM (
  'brands',
  'use_cases',
  'ai_specialisms',
  'job_roles',
  'projects',
  'timeline_events',
  'learning_paths'
);

CREATE TYPE relation_type_enum AS ENUM (
  'implements',
  'enables',
  'transforms',
  'requires',
  'influences',
  'demonstrates',
  'includes',
  'related_to'
);

-- ============================================================================
-- BRANDS
-- ============================================================================

CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  category TEXT,
  headquarters TEXT,
  founded_year INTEGER,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USE CASES
-- ============================================================================

CREATE TABLE use_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('diagnostic', 'generative', 'recommendation', 'analytics')),
  maturity_level TEXT CHECK (maturity_level IN ('emerging', 'growing', 'established')),
  impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 10),
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AI SPECIALISMS
-- ============================================================================

CREATE TABLE ai_specialisms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('computer_vision', 'nlp', 'recommendation_systems', 'generative_ai')),
  maturity_timeline JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- JOB ROLES
-- ============================================================================

CREATE TABLE job_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  department TEXT,
  seniority_level TEXT,
  ai_impact_level TEXT CHECK (ai_impact_level IN ('low', 'medium', 'high', 'transformative')),
  emerging BOOLEAN DEFAULT false,
  skills_required TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROJECTS
-- ============================================================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
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

-- ============================================================================
-- TIMELINE EVENTS
-- ============================================================================

CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
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

-- ============================================================================
-- LEARNING PATHS
-- ============================================================================

CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
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

-- ============================================================================
-- EDGES (Graph Relationships)
-- ============================================================================

CREATE TABLE edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_type entity_type_enum NOT NULL,
  from_id UUID NOT NULL,
  to_type entity_type_enum NOT NULL,
  to_id UUID NOT NULL,
  relation_type relation_type_enum NOT NULL,
  strength INTEGER CHECK (strength >= 1 AND strength <= 5),
  published BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT edges_no_self_reference CHECK (from_type != to_type OR from_id != to_id),
  CONSTRAINT edges_unique_relationship UNIQUE (from_type, from_id, to_type, to_id, relation_type)
);

-- Note: Polymorphic foreign key constraints are complex in SQL
-- We use triggers for validation instead of foreign keys

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Entity table indexes
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_published ON brands(published);
CREATE INDEX idx_brands_tags ON brands USING GIN(tags);
CREATE INDEX idx_brands_category ON brands(category);

CREATE INDEX idx_use_cases_slug ON use_cases(slug);
CREATE INDEX idx_use_cases_published ON use_cases(published);
CREATE INDEX idx_use_cases_tags ON use_cases USING GIN(tags);
CREATE INDEX idx_use_cases_category ON use_cases(category);
CREATE INDEX idx_use_cases_maturity ON use_cases(maturity_level);

CREATE INDEX idx_ai_specialisms_slug ON ai_specialisms(slug);
CREATE INDEX idx_ai_specialisms_published ON ai_specialisms(published);
CREATE INDEX idx_ai_specialisms_tags ON ai_specialisms USING GIN(tags);
CREATE INDEX idx_ai_specialisms_category ON ai_specialisms(category);

CREATE INDEX idx_job_roles_slug ON job_roles(slug);
CREATE INDEX idx_job_roles_published ON job_roles(published);
CREATE INDEX idx_job_roles_tags ON job_roles USING GIN(tags);
CREATE INDEX idx_job_roles_ai_impact ON job_roles(ai_impact_level);
CREATE INDEX idx_job_roles_emerging ON job_roles(emerging);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX idx_projects_maturity ON projects(maturity);
CREATE INDEX idx_projects_category ON projects(category);

CREATE INDEX idx_timeline_events_slug ON timeline_events(slug);
CREATE INDEX idx_timeline_events_published ON timeline_events(published);
CREATE INDEX idx_timeline_events_tags ON timeline_events USING GIN(tags);
CREATE INDEX idx_timeline_events_year ON timeline_events(year);
CREATE INDEX idx_timeline_events_type ON timeline_events(event_type);
CREATE INDEX idx_timeline_events_significance ON timeline_events(significance);

CREATE INDEX idx_learning_paths_slug ON learning_paths(slug);
CREATE INDEX idx_learning_paths_published ON learning_paths(published);
CREATE INDEX idx_learning_paths_tags ON learning_paths USING GIN(tags);
CREATE INDEX idx_learning_paths_difficulty ON learning_paths(difficulty);

-- Edge table indexes (critical for graph queries)
CREATE INDEX idx_edges_from ON edges(from_type, from_id);
CREATE INDEX idx_edges_to ON edges(to_type, to_id);
CREATE INDEX idx_edges_relation_type ON edges(relation_type);
CREATE INDEX idx_edges_published ON edges(published);
CREATE INDEX idx_edges_bidirectional ON edges(from_type, from_id, to_type, to_id);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_use_cases_updated_at BEFORE UPDATE ON use_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_specialisms_updated_at BEFORE UPDATE ON ai_specialisms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_roles_updated_at BEFORE UPDATE ON job_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timeline_events_updated_at BEFORE UPDATE ON timeline_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_edges_updated_at BEFORE UPDATE ON edges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- EDGE VALIDATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_edge_entities()
RETURNS TRIGGER AS $$
DECLARE
  from_exists BOOLEAN;
  to_exists BOOLEAN;
BEGIN
  -- Validate from_id exists in the correct table
  CASE NEW.from_type
    WHEN 'brands' THEN
      SELECT EXISTS(SELECT 1 FROM brands WHERE id = NEW.from_id) INTO from_exists;
    WHEN 'use_cases' THEN
      SELECT EXISTS(SELECT 1 FROM use_cases WHERE id = NEW.from_id) INTO from_exists;
    WHEN 'ai_specialisms' THEN
      SELECT EXISTS(SELECT 1 FROM ai_specialisms WHERE id = NEW.from_id) INTO from_exists;
    WHEN 'job_roles' THEN
      SELECT EXISTS(SELECT 1 FROM job_roles WHERE id = NEW.from_id) INTO from_exists;
    WHEN 'projects' THEN
      SELECT EXISTS(SELECT 1 FROM projects WHERE id = NEW.from_id) INTO from_exists;
    WHEN 'timeline_events' THEN
      SELECT EXISTS(SELECT 1 FROM timeline_events WHERE id = NEW.from_id) INTO from_exists;
    WHEN 'learning_paths' THEN
      SELECT EXISTS(SELECT 1 FROM learning_paths WHERE id = NEW.from_id) INTO from_exists;
  END CASE;

  IF NOT from_exists THEN
    RAISE EXCEPTION 'Invalid from_id: % does not exist in table %', NEW.from_id, NEW.from_type;
  END IF;

  -- Validate to_id exists in the correct table
  CASE NEW.to_type
    WHEN 'brands' THEN
      SELECT EXISTS(SELECT 1 FROM brands WHERE id = NEW.to_id) INTO to_exists;
    WHEN 'use_cases' THEN
      SELECT EXISTS(SELECT 1 FROM use_cases WHERE id = NEW.to_id) INTO to_exists;
    WHEN 'ai_specialisms' THEN
      SELECT EXISTS(SELECT 1 FROM ai_specialisms WHERE id = NEW.to_id) INTO to_exists;
    WHEN 'job_roles' THEN
      SELECT EXISTS(SELECT 1 FROM job_roles WHERE id = NEW.to_id) INTO to_exists;
    WHEN 'projects' THEN
      SELECT EXISTS(SELECT 1 FROM projects WHERE id = NEW.to_id) INTO to_exists;
    WHEN 'timeline_events' THEN
      SELECT EXISTS(SELECT 1 FROM timeline_events WHERE id = NEW.to_id) INTO to_exists;
    WHEN 'learning_paths' THEN
      SELECT EXISTS(SELECT 1 FROM learning_paths WHERE id = NEW.to_id) INTO to_exists;
  END CASE;

  IF NOT to_exists THEN
    RAISE EXCEPTION 'Invalid to_id: % does not exist in table %', NEW.to_id, NEW.to_type;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_edge_before_insert
  BEFORE INSERT OR UPDATE ON edges
  FOR EACH ROW
  EXECUTE FUNCTION validate_edge_entities();

