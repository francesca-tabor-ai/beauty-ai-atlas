import { createClient } from "@/lib/supabase/server";
import { getPublishedEntities, searchEntities } from "@/lib/supabase/queries";
import { EntityCard } from "@/components/entities/EntityCard";
import { EmptyState } from "@/components/entities/EmptyState";
import { FilterBadge } from "@/components/entities/FilterBadge";
import { isAdmin } from "@/lib/auth/isAdmin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UseCasesPageProps {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    category?: string;
    maturity_level?: string;
  }>;
}

export default async function UseCasesPage({
  searchParams,
}: UseCasesPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const userIsAdmin = await isAdmin();

  let useCases;
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

  // Fetch use cases
  if (params.search) {
    useCases = await searchEntities(
      supabase,
      "use_cases",
      params.search,
      ["title", "description"]
    );
    activeFilters.push({
      label: "Search",
      value: params.search,
      key: "search",
    });
  } else {
    useCases = await getPublishedEntities(supabase, "use_cases", filters);
  }

  // Filter by maturity_level if specified (client-side filter after fetch)
  if (params.maturity_level) {
    useCases = useCases.filter(
      (uc) => uc.maturity_level === params.maturity_level
    );
    activeFilters.push({
      label: "Maturity",
      value: params.maturity_level,
      key: "maturity_level",
    });
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
    if (params.maturity_level && excludeKey !== "maturity_level") {
      newParams.set("maturity_level", params.maturity_level);
    }
    return `/use-cases${newParams.toString() ? `?${newParams.toString()}` : ""}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Use Cases</h1>
          <p className="text-muted-foreground">
            Discover AI applications in the beauty industry
          </p>
        </div>
        {userIsAdmin && (
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/use-cases/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Use Cases
            </Link>
          </Button>
        )}
      </div>

      {/* Active Filters & Count */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {useCases.length}{" "}
          {useCases.length === 1 ? "use case" : "use cases"} found
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
      {useCases.length === 0 ? (
        <EmptyState
          title="No use cases found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <EntityCard
              key={useCase.id}
              title={useCase.title}
              description={useCase.description}
              slug={useCase.slug}
              href={`/use-cases/${useCase.slug}`}
              tags={useCase.tags}
              category={useCase.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
