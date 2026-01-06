// Database types for Beauty × AI Atlas
//
// To generate real types from your Supabase schema, run:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
//
// Or if using Supabase CLI locally:
//   npx supabase gen types typescript --local > lib/supabase/types.ts
//
// This will generate a complete Database type that includes all tables,
// relationships, and RLS policies from your schema.

/**
 * Placeholder Database type.
 * Replace this with generated types from Supabase CLI.
 */
export type Database = any;

export type EntityType =
  | "brands"
  | "use_cases"
  | "ai_specialisms"
  | "job_roles"
  | "projects"
  | "timeline_events"
  | "learning_paths";

export type RelationType =
  | "implements"
  | "enables"
  | "transforms"
  | "requires"
  | "influences"
  | "demonstrates"
  | "includes"
  | "related_to";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  category: string | null;
  headquarters: string | null;
  founded_year: number | null;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface UseCase {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: "diagnostic" | "generative" | "recommendation" | "analytics" | null;
  maturity_level: "emerging" | "growing" | "established" | null;
  impact_score: number | null;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AISpecialism {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category:
    | "computer_vision"
    | "nlp"
    | "recommendation_systems"
    | "generative_ai"
    | null;
  maturity_timeline: Record<string, string>;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobRole {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  department: string | null;
  seniority_level: string | null;
  ai_impact_level: "low" | "medium" | "high" | "transformative" | null;
  emerging: boolean;
  skills_required: string[];
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  business_case: {
    problem?: string;
    objective?: string;
    investment_range?: string;
    roi_assumptions?: string;
    kpis?: string[];
  };
  prd: {
    user_stories?: string[];
    functional_requirements?: string[];
    non_functional?: string[];
    risks?: string[];
    ethics_compliance?: string[];
  };
  maturity: "concept" | "pilot" | "production" | null;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  slug: string;
  year: number;
  month: number | null;
  title: string;
  description: string | null;
  event_type: "technology" | "regulation" | "market" | "cultural" | null;
  significance: "low" | "medium" | "high" | "critical" | null;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  duration_hours: number | null;
  steps: Array<{
    entity_type: EntityType;
    entity_slug: string;
    label: string;
    order: number;
  }>;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Edge {
  id: string;
  from_type: EntityType;
  from_id: string;
  to_type: EntityType;
  to_id: string;
  relation_type: RelationType;
  strength: number | null;
  published: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Helper type for entity lookup
export type Entity =
  | Brand
  | UseCase
  | AISpecialism
  | JobRole
  | Project
  | TimelineEvent
  | LearningPath;

