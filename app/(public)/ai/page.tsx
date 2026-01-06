import { createClient } from "@/lib/supabase/server";
import { getPublishedEntities, searchEntities } from "@/lib/supabase/queries";
import { EntityCard } from "@/components/entities/EntityCard";
import { EmptyState } from "@/components/entities/EmptyState";
import { FilterBadge } from "@/components/entities/FilterBadge";
import { isAdmin } from "@/lib/auth/isAdmin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface AIPageProps {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    category?: string;
  }>;
}

export default async function AIPage({ searchParams }: AIPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const userIsAdmin = await isAdmin();

  let aiSpecialisms;
  const activeFilters: Array<{ label: string; value: string; key: string }> =
    [];

  // Build filter object
  const filters: {
    category?: string;
    tags?: string[];
    published?: boolean;
  } = {
    published: true,
  };

  if (params.category) {
    filters.category = params.category;
    activeFilters.push({
      label: "Category",
      value: params.category,
      key: "category",
    });
  }

  if (params.tag) {
    filters.tags = [params.tag];
    activeFilters.push({ label: "Tag", value: params.tag, key: "tag" });
  }

  // Fetch AI specialisms
  if (params.search) {
    aiSpecialisms = await searchEntities(
      supabase,
      "ai_specialisms",
      params.search,
      ["name", "description"]
    );
    activeFilters.push({
      label: "Search",
      value: params.search,
      key: "search",
    });
  } else {
    aiSpecialisms = await getPublishedEntities(
      supabase,
      "ai_specialisms",
      filters
    );
  }

  // Build URL without a specific filter
  const buildFilterUrl = (excludeKey: string) => {
    const newParams = new URLSearchParams();
    if (params.search && excludeKey !== "search") {
      newParams.set("search", params.search);
    }
    if (params.tag && excludeKey !== "tag") {
      newParams.set("tag", params.tag);
    }
    if (params.category && excludeKey !== "category") {
      newParams.set("category", params.category);
    }
    return `/ai${newParams.toString() ? `?${newParams.toString()}` : ""}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">AI Specialisms</h1>
          <p className="text-muted-foreground">
            Explore AI technologies powering beauty innovation
          </p>
        </div>
        {userIsAdmin && (
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/ai/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload AI Specialisms
            </Link>
          </Button>
        )}
      </div>

      {/* Active Filters & Count */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {aiSpecialisms.length}{" "}
          {aiSpecialisms.length === 1 ? "specialism" : "specialisms"} found
        </div>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <FilterBadge
                key={filter.key}
                label={filter.label}
                value={filter.value}
                href={buildFilterUrl(filter.key)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {aiSpecialisms.length === 0 ? (
        <EmptyState
          title="No AI specialisms found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {aiSpecialisms.map((ai) => (
            <EntityCard
              key={ai.id}
              title={ai.name}
              description={ai.description}
              slug={ai.slug}
              href={`/ai/${ai.slug}`}
              tags={ai.tags}
              category={ai.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
