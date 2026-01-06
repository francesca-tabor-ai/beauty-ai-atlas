import { createClient } from "@/lib/supabase/server";
import { getPublishedEntities, searchEntities } from "@/lib/supabase/queries";
import { EntityCard } from "@/components/entities/EntityCard";
import { EmptyState } from "@/components/entities/EmptyState";
import { FilterBadge } from "@/components/entities/FilterBadge";
import Link from "next/link";

interface BrandsPageProps {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    category?: string;
  }>;
}

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  let brands;
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

  // Fetch brands
  if (params.search) {
    brands = await searchEntities(
      supabase,
      "brands",
      params.search,
      ["name", "description"]
    );
    activeFilters.push({
      label: "Search",
      value: params.search,
      key: "search",
    });
  } else {
    brands = await getPublishedEntities(supabase, "brands", filters);
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
    return `/brands${newParams.toString() ? `?${newParams.toString()}` : ""}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Brands</h1>
        <p className="text-muted-foreground">
          Explore beauty brands leveraging AI technology
        </p>
      </div>

      {/* Active Filters & Count */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {brands.length} {brands.length === 1 ? "brand" : "brands"} found
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
      {brands.length === 0 ? (
        <EmptyState
          title="No brands found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <EntityCard
              key={brand.id}
              title={brand.name}
              description={brand.description}
              slug={brand.slug}
              href={`/brands/${brand.slug}`}
              tags={brand.tags}
              category={brand.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
