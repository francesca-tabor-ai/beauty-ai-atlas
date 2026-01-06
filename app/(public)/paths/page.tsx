import { createClient } from "@/lib/supabase/server";
import { getPublishedEntities, searchEntities } from "@/lib/supabase/queries";
import { EntityCard } from "@/components/entities/EntityCard";
import { EmptyState } from "@/components/entities/EmptyState";
import { FilterBadge } from "@/components/entities/FilterBadge";
import { Badge } from "@/components/ui/badge";
import { isAdmin } from "@/lib/auth/isAdmin";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";

interface PathsPageProps {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    difficulty?: string;
  }>;
}

export default async function PathsPage({ searchParams }: PathsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const userIsAdmin = await isAdmin();

  let learningPaths;
  const activeFilters: Array<{ label: string; value: string; key: string }> =
    [];

  // Build filter object
  const filters: {
    tags?: string[];
    published?: boolean;
  } = {
    published: true,
  };

  if (params.tag) {
    filters.tags = [params.tag];
    activeFilters.push({ label: "Tag", value: params.tag, key: "tag" });
  }

  // Fetch learning paths
  if (params.search) {
    learningPaths = await searchEntities(
      supabase,
      "learning_paths",
      params.search,
      ["title", "description"]
    );
    activeFilters.push({
      label: "Search",
      value: params.search,
      key: "search",
    });
  } else {
    learningPaths = await getPublishedEntities(
      supabase,
      "learning_paths",
      filters
    );
  }

  // Filter by difficulty if specified
  if (params.difficulty) {
    learningPaths = learningPaths.filter(
      (path) => path.difficulty === params.difficulty
    );
    activeFilters.push({
      label: "Difficulty",
      value: params.difficulty,
      key: "difficulty",
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
    if (params.difficulty && excludeKey !== "difficulty") {
      newParams.set("difficulty", params.difficulty);
    }
    return `/paths${newParams.toString() ? `?${newParams.toString()}` : ""}`;
  };

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

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Learning Paths</h1>
          <p className="text-muted-foreground">
            Follow structured learning paths to master beauty AI
          </p>
        </div>
        {userIsAdmin && (
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/paths/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Learning Paths
            </Link>
          </Button>
        )}
      </div>

      {/* Active Filters & Count */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {learningPaths.length}{" "}
          {learningPaths.length === 1 ? "path" : "paths"} found
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
      {learningPaths.length === 0 ? (
        <EmptyState
          title="No learning paths found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {learningPaths.map((path) => (
            <Link
              key={path.id}
              href={`/paths/${path.slug}`}
              className="group block rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Title */}
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {path.title}
                </h3>

                {/* Difficulty & Duration */}
                <div className="flex items-center gap-3">
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
                    <span className="text-xs text-muted-foreground">
                      ~{path.duration_hours} hours
                    </span>
                  )}
                </div>

                {/* Description */}
                {path.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {path.description}
                  </p>
                )}

                {/* Steps count */}
                {path.steps && path.steps.length > 0 && (
                  <div className="text-xs text-muted-foreground pt-2">
                    {path.steps.length}{" "}
                    {path.steps.length === 1 ? "step" : "steps"}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
