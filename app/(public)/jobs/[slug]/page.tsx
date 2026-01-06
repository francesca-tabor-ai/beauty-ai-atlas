import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import { EntityHeader } from "@/components/entities/EntityHeader";
import { RelatedContent } from "@/components/graph/RelatedContent";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const job = await getEntityBySlug(supabase, "job_roles", slug);

  if (!job || !job.published) {
    return {
      title: "Job Role Not Found",
    };
  }

  return {
    title: `${job.title} | Beauty × AI Atlas`,
    description:
      job.description ||
      `Learn about the ${job.title} role in beauty AI.`,
    openGraph: {
      title: job.title,
      description: job.description || undefined,
      type: "website",
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const job = await getEntityBySlug(supabase, "job_roles", slug);

  if (!job || !job.published) {
    notFound();
  }

  const impactLabels: Record<string, string> = {
    low: "Low Impact",
    medium: "Medium Impact",
    high: "High Impact",
    transformative: "Transformative Impact",
  };

  const impactColors: Record<string, string> = {
    low: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
    medium: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    high: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    transformative: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <EntityHeader
          title={job.title}
          category={job.department}
          tags={job.tags}
          createdAt={job.created_at}
          updatedAt={job.updated_at}
          metadata={{
            seniority_level: job.seniority_level,
            emerging: job.emerging ? "Emerging Role" : undefined,
          }}
        />

        {/* AI Impact Level & Emerging Badge */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {job.ai_impact_level && (
            <Badge className={impactColors[job.ai_impact_level] || ""}>
              {impactLabels[job.ai_impact_level] || job.ai_impact_level}
            </Badge>
          )}
          {job.emerging && (
            <Badge variant="outline" className="border-blue-500 text-blue-700 dark:text-blue-400">
              Emerging Role
            </Badge>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <p className="text-lg leading-relaxed">{job.description}</p>
          </div>
        )}

        {/* Skills Required */}
        {job.skills_required && job.skills_required.length > 0 && (
          <div className="mt-8 p-6 rounded-lg border bg-muted/50">
            <h2 className="text-lg font-semibold mb-4">Skills Required</h2>
            <ul className="list-disc list-inside space-y-2">
              {job.skills_required.map((skill: string) => (
                <li key={skill} className="text-sm">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Content */}
        <div className="mt-12 pt-8 border-t">
          <RelatedContent entityType="job_roles" entityId={job.id} />
        </div>
      </article>
    </div>
  );
}
