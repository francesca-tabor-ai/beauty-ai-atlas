import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import { EntityHeader } from "@/components/entities/EntityHeader";
import { RelatedContent } from "@/components/graph/RelatedContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { EntityType } from "@/lib/supabase/types";

interface LearningPathPageProps {
  params: Promise<{ slug: string }>;
}

// Map entity_type to URL paths
function getEntityUrl(entityType: string, entitySlug: string): string {
  const typeMap: Record<string, string> = {
    brands: "/brands",
    use_cases: "/use-cases",
    ai_specialisms: "/ai",
    job_roles: "/jobs",
    projects: "/projects",
    timeline_events: "/timeline",
    learning_paths: "/paths",
  };

  const basePath = typeMap[entityType] || `/${entityType}`;
  return `${basePath}/${entitySlug}`;
}

export async function generateMetadata({
  params,
}: LearningPathPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const path = await getEntityBySlug(supabase, "learning_paths", slug);

  if (!path || !path.published) {
    return {
      title: "Learning Path Not Found",
    };
  }

  return {
    title: `${path.title} | Beauty × AI Atlas`,
    description:
      path.description ||
      `Follow this learning path to master ${path.title} in beauty AI.`,
    openGraph: {
      title: path.title,
      description: path.description || undefined,
      type: "website",
    },
  };
}

export default async function LearningPathPage({
  params,
}: LearningPathPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const path = await getEntityBySlug(supabase, "learning_paths", slug);

  if (!path || !path.published) {
    notFound();
  }

  const difficultyLabels: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
    intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
  };

  // Parse and sort steps by order
  const steps =
    path.steps && Array.isArray(path.steps)
      ? (path.steps as Array<{
          entity_type: EntityType;
          entity_slug: string;
          label: string;
          order: number;
        }>)
          .filter((step) => step.order && step.entity_type && step.entity_slug)
          .sort((a, b) => a.order - b.order)
      : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <EntityHeader
          title={path.title}
          tags={path.tags}
          createdAt={path.created_at}
          updatedAt={path.updated_at}
        />

        {/* Difficulty & Duration */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {path.difficulty && (
            <Badge
              className={
                difficultyColors[path.difficulty] ||
                "bg-muted text-muted-foreground"
              }
            >
              {difficultyLabels[path.difficulty] || path.difficulty}
            </Badge>
          )}
          {path.duration_hours && (
            <div className="text-sm text-muted-foreground">
              Estimated duration: <strong>{path.duration_hours} hours</strong>
            </div>
          )}
          {steps.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {steps.length} {steps.length === 1 ? "step" : "steps"}
            </div>
          )}
        </div>

        {/* Description */}
        {path.description && (
          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <p className="text-lg leading-relaxed">{path.description}</p>
          </div>
        )}

        {/* Export Button */}
        {steps.length > 0 && (
          <div className="mt-8">
            <Button variant="outline" asChild>
              <a href={`/api/export/path/${path.slug}`} download>
                <Download className="mr-2 h-4 w-4" />
                Export Learning Path
              </a>
            </Button>
          </div>
        )}

        {/* Learning Path Steps */}
        {steps.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Learning Path Steps</h2>
            <div className="space-y-4">
              {steps.map((step, index) => {
                const stepUrl = getEntityUrl(step.entity_type, step.entity_slug);
                return (
                  <Card
                    key={index}
                    className="hover:border-accent transition-colors group"
                  >
                    <CardContent className="p-6">
                      <Link href={stepUrl} className="block">
                        <div className="flex items-start gap-4">
                          {/* Step Number */}
                          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                            {step.order || index + 1}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors duration-150">
                              {step.label}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              <span className="capitalize">
                                {step.entity_type.replace(/_/g, " ")}
                              </span>
                              {" • "}
                              <span className="font-mono text-xs">
                                {step.entity_slug}
                              </span>
                            </div>
                          </div>

                          {/* Link Icon */}
                          <div className="flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Content */}
        <div className="mt-12 pt-8 border-t">
          <RelatedContent entityType="learning_paths" entityId={path.id} />
        </div>
      </article>
    </div>
  );
}
