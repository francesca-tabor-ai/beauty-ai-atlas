import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import { EntityHeader } from "@/components/entities/EntityHeader";
import { RelatedContent } from "@/components/graph/RelatedContent";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

interface UseCasePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: UseCasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const useCase = await getEntityBySlug(supabase, "use_cases", slug);

  if (!useCase || !useCase.published) {
    return {
      title: "Use Case Not Found",
    };
  }

  return {
    title: `${useCase.title} | Beauty × AI Atlas`,
    description:
      useCase.description ||
      `Learn about ${useCase.title} and its applications in beauty AI.`,
    openGraph: {
      title: useCase.title,
      description: useCase.description || undefined,
      type: "website",
    },
  };
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const useCase = await getEntityBySlug(supabase, "use_cases", slug);

  if (!useCase || !useCase.published) {
    notFound();
  }

  const maturityLabels: Record<string, string> = {
    emerging: "Emerging",
    growing: "Growing",
    established: "Established",
  };

  const maturityColors: Record<string, string> = {
    emerging: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    growing: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    established: "bg-green-500/10 text-green-700 dark:text-green-400",
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <EntityHeader
          title={useCase.title}
          category={useCase.category}
          tags={useCase.tags}
          createdAt={useCase.created_at}
          updatedAt={useCase.updated_at}
        />

        {/* Maturity & Impact Score */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {useCase.maturity_level && (
            <Badge
              className={maturityColors[useCase.maturity_level] || ""}
            >
              {maturityLabels[useCase.maturity_level] || useCase.maturity_level}
            </Badge>
          )}
          {useCase.impact_score && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Impact Score:
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i < useCase.impact_score!
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                    aria-hidden="true"
                  />
                ))}
                <span className="ml-2 text-sm font-medium">
                  {useCase.impact_score}/10
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {useCase.description && (
          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <p className="text-lg leading-relaxed">{useCase.description}</p>
          </div>
        )}

        {/* Related Content */}
        <div className="mt-12 pt-8 border-t">
          <RelatedContent entityType="use_cases" entityId={useCase.id} />
        </div>
      </article>
    </div>
  );
}
