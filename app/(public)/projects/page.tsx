import { createClient } from "@/lib/supabase/server";
import { getPublishedEntities, searchEntities } from "@/lib/supabase/queries";
import { EntityCard } from "@/components/entities/EntityCard";
import { EmptyState } from "@/components/entities/EmptyState";
import { FilterBadge } from "@/components/entities/FilterBadge";

interface ProjectsPageProps {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    category?: string;
    maturity?: string;
  }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  let projects;
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

  // Fetch projects
  if (params.search) {
    projects = await searchEntities(
      supabase,
      "projects",
      params.search,
      ["title", "description"]
    );
    activeFilters.push({
      label: "Search",
      value: params.search,
      key: "search",
    });
  } else {
    projects = await getPublishedEntities(supabase, "projects", filters);
  }

  // Filter by maturity if specified
  if (params.maturity) {
    projects = projects.filter((p) => p.maturity === params.maturity);
    activeFilters.push({
      label: "Maturity",
      value: params.maturity,
      key: "maturity",
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
    if (params.maturity && excludeKey !== "maturity") {
      newParams.set("maturity", params.maturity);
    }
    return `/projects${newParams.toString() ? `?${newParams.toString()}` : ""}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground">
          Explore real-world AI projects in beauty
        </p>
      </div>

      {/* Active Filters & Count */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {projects.length}{" "}
          {projects.length === 1 ? "project" : "projects"} found
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
      {projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <EntityCard
              key={project.id}
              title={project.title}
              description={project.description}
              slug={project.slug}
              href={`/projects/${project.slug}`}
              tags={project.tags}
              category={project.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
