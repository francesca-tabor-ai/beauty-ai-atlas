import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { EntityType, RelationType } from "@/lib/supabase/types";

interface RelatedEntity {
  id: string;
  slug: string;
  title: string;
  relation: RelationType;
  relationStrength?: number | null;
}

interface RelatedEntitiesResult {
  brands: RelatedEntity[];
  use_cases: RelatedEntity[];
  ai_specialisms: RelatedEntity[];
  job_roles: RelatedEntity[];
  projects: RelatedEntity[];
  timeline_events: RelatedEntity[];
  learning_paths: RelatedEntity[];
}

/**
 * Get all entities related to a given entity through the edges table.
 * Optimized to batch queries by entity type to avoid N+1 problems.
 *
 * @param supabase - Supabase client instance
 * @param entityType - Type of the source entity
 * @param entityId - ID of the source entity
 * @returns Grouped related entities by type
 */
export async function getRelatedEntities(
  supabase: SupabaseClient<Database>,
  entityType: EntityType,
  entityId: string
): Promise<RelatedEntitiesResult> {
  // Step 1: Query all edges connected to this entity
  // Query edges where current entity is either source or target
  const { data: edges, error: edgesError } = await supabase
    .from("edges")
    .select("*")
    .eq("published", true)
    .or(
      `and(from_type.eq.${entityType},from_id.eq.${entityId}),and(to_type.eq.${entityType},to_id.eq.${entityId})`
    );

  if (edgesError) {
    console.error("Error fetching edges:", edgesError);
    throw new Error(`Failed to fetch related entities: ${edgesError.message}`);
  }

  if (!edges || edges.length === 0) {
    return {
      brands: [],
      use_cases: [],
      ai_specialisms: [],
      job_roles: [],
      projects: [],
      timeline_events: [],
      learning_paths: [],
    };
  }

  // Step 2: Group edges by the "other" entity type and collect IDs
  const entityGroups: Record<
    EntityType,
    Array<{ id: string; relation: RelationType; strength?: number | null }>
  > = {
    brands: [],
    use_cases: [],
    ai_specialisms: [],
    job_roles: [],
    projects: [],
    timeline_events: [],
    learning_paths: [],
  };

  for (const edge of edges) {
    // Determine which entity is the "other" one (not the current entity)
    if (edge.from_type === entityType && edge.from_id === entityId) {
      // Current entity is the source, so the target is the related entity
      entityGroups[edge.to_type as EntityType].push({
        id: edge.to_id,
        relation: edge.relation_type,
        strength: edge.strength,
      });
    } else if (edge.to_type === entityType && edge.to_id === entityId) {
      // Current entity is the target, so the source is the related entity
      entityGroups[edge.from_type as EntityType].push({
        id: edge.from_id,
        relation: edge.relation_type,
        strength: edge.strength,
      });
    }
  }

  // Step 3: Batch fetch entities by type (one query per type)
  const result: RelatedEntitiesResult = {
    brands: [],
    use_cases: [],
    ai_specialisms: [],
    job_roles: [],
    projects: [],
    timeline_events: [],
    learning_paths: [],
  };

  // Fetch brands
  if (entityGroups.brands.length > 0) {
    const brandIds = entityGroups.brands.map((e) => e.id);
    const { data: brands } = await supabase
      .from("brands")
      .select("id, slug, name, published")
      .in("id", brandIds)
      .eq("published", true);

    if (brands) {
      result.brands = brands.map((brand) => {
        const edgeInfo = entityGroups.brands.find((e) => e.id === brand.id);
        return {
          id: brand.id,
          slug: brand.slug,
          title: brand.name,
          relation: edgeInfo?.relation || ("related_to" as RelationType),
          relationStrength: edgeInfo?.strength,
        };
      });
    }
  }

  // Fetch use_cases
  if (entityGroups.use_cases.length > 0) {
    const useCaseIds = entityGroups.use_cases.map((e) => e.id);
    const { data: useCases } = await supabase
      .from("use_cases")
      .select("id, slug, title, published")
      .in("id", useCaseIds)
      .eq("published", true);

    if (useCases) {
      result.use_cases = useCases.map((useCase) => {
        const edgeInfo = entityGroups.use_cases.find((e) => e.id === useCase.id);
        return {
          id: useCase.id,
          slug: useCase.slug,
          title: useCase.title,
          relation: edgeInfo?.relation || ("related_to" as RelationType),
          relationStrength: edgeInfo?.strength,
        };
      });
    }
  }

  // Fetch ai_specialisms
  if (entityGroups.ai_specialisms.length > 0) {
    const aiIds = entityGroups.ai_specialisms.map((e) => e.id);
    const { data: aiSpecialisms } = await supabase
      .from("ai_specialisms")
      .select("id, slug, name, published")
      .in("id", aiIds)
      .eq("published", true);

    if (aiSpecialisms) {
      result.ai_specialisms = aiSpecialisms.map((ai) => {
        const edgeInfo = entityGroups.ai_specialisms.find((e) => e.id === ai.id);
        return {
          id: ai.id,
          slug: ai.slug,
          title: ai.name,
          relation: edgeInfo?.relation || ("related_to" as RelationType),
          relationStrength: edgeInfo?.strength,
        };
      });
    }
  }

  // Fetch job_roles
  if (entityGroups.job_roles.length > 0) {
    const jobIds = entityGroups.job_roles.map((e) => e.id);
    const { data: jobRoles } = await supabase
      .from("job_roles")
      .select("id, slug, title, published")
      .in("id", jobIds)
      .eq("published", true);

    if (jobRoles) {
      result.job_roles = jobRoles.map((job) => {
        const edgeInfo = entityGroups.job_roles.find((e) => e.id === job.id);
        return {
          id: job.id,
          slug: job.slug,
          title: job.title,
          relation: edgeInfo?.relation || ("related_to" as RelationType),
          relationStrength: edgeInfo?.strength,
        };
      });
    }
  }

  // Fetch projects
  if (entityGroups.projects.length > 0) {
    const projectIds = entityGroups.projects.map((e) => e.id);
    const { data: projects } = await supabase
      .from("projects")
      .select("id, slug, title, published")
      .in("id", projectIds)
      .eq("published", true);

    if (projects) {
      result.projects = projects.map((project) => {
        const edgeInfo = entityGroups.projects.find((e) => e.id === project.id);
        return {
          id: project.id,
          slug: project.slug,
          title: project.title,
          relation: edgeInfo?.relation || ("related_to" as RelationType),
          relationStrength: edgeInfo?.strength,
        };
      });
    }
  }

  // Fetch timeline_events
  if (entityGroups.timeline_events.length > 0) {
    const eventIds = entityGroups.timeline_events.map((e) => e.id);
    const { data: events } = await supabase
      .from("timeline_events")
      .select("id, slug, title, published")
      .in("id", eventIds)
      .eq("published", true);

    if (events) {
      result.timeline_events = events.map((event) => {
        const edgeInfo = entityGroups.timeline_events.find(
          (e) => e.id === event.id
        );
        return {
          id: event.id,
          slug: event.slug,
          title: event.title,
          relation: edgeInfo?.relation || ("related_to" as RelationType),
          relationStrength: edgeInfo?.strength,
        };
      });
    }
  }

  // Fetch learning_paths
  if (entityGroups.learning_paths.length > 0) {
    const pathIds = entityGroups.learning_paths.map((e) => e.id);
    const { data: paths } = await supabase
      .from("learning_paths")
      .select("id, slug, title, published")
      .in("id", pathIds)
      .eq("published", true);

    if (paths) {
      result.learning_paths = paths.map((path) => {
        const edgeInfo = entityGroups.learning_paths.find((e) => e.id === path.id);
        return {
          id: path.id,
          slug: path.slug,
          title: path.title,
          relation: edgeInfo?.relation || ("related_to" as RelationType),
          relationStrength: edgeInfo?.strength,
        };
      });
    }
  }

  return result;
}

