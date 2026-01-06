import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import { EntityHeader } from "@/components/entities/EntityHeader";
import type { Metadata } from "next";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const brand = await getEntityBySlug(supabase, "brands", slug);

  if (!brand || !brand.published) {
    return {
      title: "Brand Not Found",
    };
  }

  return {
    title: `${brand.name} | Beauty × AI Atlas`,
    description: brand.description || `Learn about ${brand.name} and their AI initiatives in beauty.`,
    openGraph: {
      title: brand.name,
      description: brand.description || undefined,
      type: "website",
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const brand = await getEntityBySlug(supabase, "brands", slug);

  // Return 404 if brand doesn't exist or isn't published
  if (!brand || !brand.published) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <EntityHeader
          title={brand.name}
          category={brand.category}
          tags={brand.tags}
          createdAt={brand.created_at}
          updatedAt={brand.updated_at}
          metadata={{
            headquarters: brand.headquarters,
            founded_year: brand.founded_year?.toString(),
            website: brand.website,
          }}
        />

        {/* Description */}
        {brand.description && (
          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <p className="text-lg leading-relaxed">{brand.description}</p>
          </div>
        )}

        {/* Additional Info */}
        {(brand.website || brand.headquarters || brand.founded_year) && (
          <div className="mt-8 p-6 rounded-lg border bg-muted/50">
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brand.headquarters && (
                <>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Headquarters
                  </dt>
                  <dd className="text-sm">{brand.headquarters}</dd>
                </>
              )}
              {brand.founded_year && (
                <>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Founded
                  </dt>
                  <dd className="text-sm">{brand.founded_year}</dd>
                </>
              )}
              {brand.website && (
                <>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Website
                  </dt>
                  <dd className="text-sm">
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {brand.website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </>
              )}
            </dl>
          </div>
        )}

        {/* Placeholder for Related Content */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Related Content</h2>
          <p className="text-muted-foreground">
            Related brands, projects, and use cases will appear here.
          </p>
        </div>
      </article>
    </div>
  );
}
