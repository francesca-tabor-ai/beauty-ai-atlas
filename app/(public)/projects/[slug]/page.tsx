import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import { EntityHeader } from "@/components/entities/EntityHeader";
import { RelatedContent } from "@/components/graph/RelatedContent";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const project = await getEntityBySlug(supabase, "projects", slug);

  if (!project || !project.published) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Beauty × AI Atlas`,
    description:
      project.description ||
      `Learn about ${project.title} and its impact on beauty AI.`,
    openGraph: {
      title: project.title,
      description: project.description || undefined,
      type: "website",
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const project = await getEntityBySlug(supabase, "projects", slug);

  if (!project || !project.published) {
    notFound();
  }

  const maturityLabels: Record<string, string> = {
    concept: "Concept",
    pilot: "Pilot",
    production: "Production",
  };

  const maturityColors: Record<string, string> = {
    concept: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    pilot: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    production: "bg-green-500/10 text-green-700 dark:text-green-400",
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <EntityHeader
          title={project.title}
          category={project.category}
          tags={project.tags}
          createdAt={project.created_at}
          updatedAt={project.updated_at}
        />

        {/* Maturity Badge */}
        {project.maturity && (
          <div className="mt-6">
            <Badge
              className={maturityColors[project.maturity] || ""}
            >
              {maturityLabels[project.maturity] || project.maturity}
            </Badge>
          </div>
        )}

        {/* Description */}
        {project.description && (
          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <p className="text-lg leading-relaxed">{project.description}</p>
          </div>
        )}

        {/* Business Case (if available) */}
        {project.business_case &&
          Object.keys(project.business_case).length > 0 && (
            <div className="mt-8 p-6 rounded-lg border bg-muted/50">
              <h2 className="text-lg font-semibold mb-4">Business Case</h2>
              <dl className="space-y-3">
                {project.business_case.problem && (
                  <>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Problem
                    </dt>
                    <dd className="text-sm">{project.business_case.problem}</dd>
                  </>
                )}
                {project.business_case.objective && (
                  <>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Objective
                    </dt>
                    <dd className="text-sm">
                      {project.business_case.objective}
                    </dd>
                  </>
                )}
                {project.business_case.investment_range && (
                  <>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Investment Range
                    </dt>
                    <dd className="text-sm">
                      {project.business_case.investment_range}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          )}

        {/* Related Content */}
        <div className="mt-12 pt-8 border-t">
          <RelatedContent entityType="projects" entityId={project.id} />
        </div>
      </article>
    </div>
  );
}
