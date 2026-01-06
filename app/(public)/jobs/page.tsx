import { createClient } from "@/lib/supabase/server";
import { getPublishedEntities, searchEntities } from "@/lib/supabase/queries";
import { EntityCard } from "@/components/entities/EntityCard";
import { EmptyState } from "@/components/entities/EmptyState";
import { FilterBadge } from "@/components/entities/FilterBadge";
import { isAdmin } from "@/lib/auth/isAdmin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface JobsPageProps {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    department?: string;
    ai_impact_level?: string;
  }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const userIsAdmin = await isAdmin();

  let jobRoles;
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

  // Fetch job roles
  if (params.search) {
    jobRoles = await searchEntities(
      supabase,
      "job_roles",
      params.search,
      ["title", "description"]
    );
    activeFilters.push({
      label: "Search",
      value: params.search,
      key: "search",
    });
  } else {
    jobRoles = await getPublishedEntities(supabase, "job_roles", filters);
  }

  // Client-side filters
  if (params.department) {
    jobRoles = jobRoles.filter((job) => job.department === params.department);
    activeFilters.push({
      label: "Department",
      value: params.department,
      key: "department",
    });
  }

  if (params.ai_impact_level) {
    jobRoles = jobRoles.filter(
      (job) => job.ai_impact_level === params.ai_impact_level
    );
    activeFilters.push({
      label: "AI Impact",
      value: params.ai_impact_level,
      key: "ai_impact_level",
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
    if (params.department && excludeKey !== "department") {
      newParams.set("department", params.department);
    }
    if (params.ai_impact_level && excludeKey !== "ai_impact_level") {
      newParams.set("ai_impact_level", params.ai_impact_level);
    }
    return `/jobs${newParams.toString() ? `?${newParams.toString()}` : ""}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Job Roles</h1>
          <p className="text-muted-foreground">
            Discover career opportunities in beauty AI
          </p>
        </div>
        {userIsAdmin && (
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/jobs/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Job Roles
            </Link>
          </Button>
        )}
      </div>

      {/* Active Filters & Count */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {jobRoles.length}{" "}
          {jobRoles.length === 1 ? "job role" : "job roles"} found
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
      {jobRoles.length === 0 ? (
        <EmptyState
          title="No job roles found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobRoles.map((job) => (
            <EntityCard
              key={job.id}
              title={job.title}
              description={job.description}
              slug={job.slug}
              href={`/jobs/${job.slug}`}
              tags={job.tags}
              category={job.department}
            />
          ))}
        </div>
      )}
    </div>
  );
}
