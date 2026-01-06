import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getRelatedEntities } from "@/lib/graph/getRelated";
import { createClient } from "@/lib/supabase/server";
import type { EntityType } from "@/lib/supabase/types";

interface RelatedContentProps {
  entityType: EntityType;
  entityId: string;
}

// Human-readable labels for entity types
const entityTypeLabels: Record<EntityType, string> = {
  brands: "Brands",
  use_cases: "Use Cases",
  ai_specialisms: "AI Specialisms",
  job_roles: "Job Roles",
  projects: "Projects",
  timeline_events: "Timeline Events",
  learning_paths: "Learning Paths",
};

// Human-readable labels for relation types
const relationTypeLabels: Record<string, string> = {
  implements: "Implements",
  enables: "Enables",
  transforms: "Transforms",
  requires: "Requires",
  influences: "Influences",
  demonstrates: "Demonstrates",
  includes: "Includes",
  related_to: "Related To",
};

// URL paths for entity types
const entityTypePaths: Record<EntityType, string> = {
  brands: "/brands",
  use_cases: "/use-cases",
  ai_specialisms: "/ai",
  job_roles: "/jobs",
  projects: "/projects",
  timeline_events: "/timeline",
  learning_paths: "/paths",
};

export async function RelatedContent({
  entityType,
  entityId,
}: RelatedContentProps) {
  const supabase = await createClient();
  const related = await getRelatedEntities(supabase, entityType, entityId);

  // Count total related entities
  const totalRelated =
    related.brands.length +
    related.use_cases.length +
    related.ai_specialisms.length +
    related.job_roles.length +
    related.projects.length +
    related.timeline_events.length +
    related.learning_paths.length;

  // If no related content, return null
  if (totalRelated === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Related Content</h2>

      {/* Brands */}
      {related.brands.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-3">
            {entityTypeLabels.brands}
          </h3>
          <div className="flex flex-wrap gap-2">
            {related.brands.map((brand) => (
              <Link
                key={brand.id}
                href={`${entityTypePaths.brands}/${brand.slug}`}
                className="group"
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  title={`${relationTypeLabels[brand.relation] || brand.relation}${
                    brand.relationStrength
                      ? ` (strength: ${brand.relationStrength})`
                      : ""
                  }`}
                >
                  {brand.title}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Use Cases */}
      {related.use_cases.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-3">
            {entityTypeLabels.use_cases}
          </h3>
          <div className="flex flex-wrap gap-2">
            {related.use_cases.map((useCase) => (
              <Link
                key={useCase.id}
                href={`${entityTypePaths.use_cases}/${useCase.slug}`}
                className="group"
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  title={`${relationTypeLabels[useCase.relation] || useCase.relation}${
                    useCase.relationStrength
                      ? ` (strength: ${useCase.relationStrength})`
                      : ""
                  }`}
                >
                  {useCase.title}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* AI Specialisms */}
      {related.ai_specialisms.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-3">
            {entityTypeLabels.ai_specialisms}
          </h3>
          <div className="flex flex-wrap gap-2">
            {related.ai_specialisms.map((ai) => (
              <Link
                key={ai.id}
                href={`${entityTypePaths.ai_specialisms}/${ai.slug}`}
                className="group"
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  title={`${relationTypeLabels[ai.relation] || ai.relation}${
                    ai.relationStrength
                      ? ` (strength: ${ai.relationStrength})`
                      : ""
                  }`}
                >
                  {ai.title}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Job Roles */}
      {related.job_roles.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-3">
            {entityTypeLabels.job_roles}
          </h3>
          <div className="flex flex-wrap gap-2">
            {related.job_roles.map((job) => (
              <Link
                key={job.id}
                href={`${entityTypePaths.job_roles}/${job.slug}`}
                className="group"
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  title={`${relationTypeLabels[job.relation] || job.relation}${
                    job.relationStrength
                      ? ` (strength: ${job.relationStrength})`
                      : ""
                  }`}
                >
                  {job.title}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {related.projects.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-3">
            {entityTypeLabels.projects}
          </h3>
          <div className="flex flex-wrap gap-2">
            {related.projects.map((project) => (
              <Link
                key={project.id}
                href={`${entityTypePaths.projects}/${project.slug}`}
                className="group"
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  title={`${relationTypeLabels[project.relation] || project.relation}${
                    project.relationStrength
                      ? ` (strength: ${project.relationStrength})`
                      : ""
                  }`}
                >
                  {project.title}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Timeline Events */}
      {related.timeline_events.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-3">
            {entityTypeLabels.timeline_events}
          </h3>
          <div className="flex flex-wrap gap-2">
            {related.timeline_events.map((event) => (
              <Link
                key={event.id}
                href={`${entityTypePaths.timeline_events}/${event.slug}`}
                className="group"
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  title={`${relationTypeLabels[event.relation] || event.relation}${
                    event.relationStrength
                      ? ` (strength: ${event.relationStrength})`
                      : ""
                  }`}
                >
                  {event.title}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Learning Paths */}
      {related.learning_paths.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-3">
            {entityTypeLabels.learning_paths}
          </h3>
          <div className="flex flex-wrap gap-2">
            {related.learning_paths.map((path) => (
              <Link
                key={path.id}
                href={`${entityTypePaths.learning_paths}/${path.slug}`}
                className="group"
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  title={`${relationTypeLabels[path.relation] || path.relation}${
                    path.relationStrength
                      ? ` (strength: ${path.relationStrength})`
                      : ""
                  }`}
                >
                  {path.title}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

