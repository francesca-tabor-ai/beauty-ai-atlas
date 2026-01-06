import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import { EntityHeader } from "@/components/entities/EntityHeader";
import { RelatedContent } from "@/components/graph/RelatedContent";
import type { Metadata } from "next";

interface AIPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AIPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const ai = await getEntityBySlug(supabase, "ai_specialisms", slug);

  if (!ai || !ai.published) {
    return {
      title: "AI Specialism Not Found",
    };
  }

  return {
    title: `${ai.name} | Beauty × AI Atlas`,
    description:
      ai.description ||
      `Learn about ${ai.name} and its role in beauty AI applications.`,
    openGraph: {
      title: ai.name,
      description: ai.description || undefined,
      type: "website",
    },
  };
}

export default async function AIPage({ params }: AIPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const ai = await getEntityBySlug(supabase, "ai_specialisms", slug);

  if (!ai || !ai.published) {
    notFound();
  }

  // Sort maturity timeline by year
  const timelineEntries =
    ai.maturity_timeline && Object.keys(ai.maturity_timeline).length > 0
      ? Object.entries(ai.maturity_timeline)
          .map(([year, status]) => ({
            year: parseInt(year, 10),
            status: status as string,
          }))
          .sort((a, b) => a.year - b.year)
      : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <EntityHeader
          title={ai.name}
          category={ai.category}
          tags={ai.tags}
          createdAt={ai.created_at}
          updatedAt={ai.updated_at}
        />

        {/* Description */}
        {ai.description && (
          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <p className="text-lg leading-relaxed">{ai.description}</p>
          </div>
        )}

        {/* Maturity Timeline */}
        {timelineEntries.length > 0 && (
          <div className="mt-8 p-6 rounded-lg border bg-muted/50">
            <h2 className="text-lg font-semibold mb-4">Maturity Timeline</h2>
            <div className="space-y-3">
              {timelineEntries.map((entry, index) => (
                <div key={entry.year} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 text-sm font-medium text-muted-foreground">
                      {entry.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">{entry.status}</div>
                    {index < timelineEntries.length - 1 && (
                      <div className="mt-2 h-4 w-px bg-border ml-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Content */}
        <div className="mt-12 pt-8 border-t">
          <RelatedContent entityType="ai_specialisms" entityId={ai.id} />
        </div>
      </article>
    </div>
  );
}
