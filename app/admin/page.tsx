import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

async function getEntityCounts() {
  const supabase = await createClient();

  const [brands, useCases, aiSpecialisms, jobRoles, projects, timelineEvents, learningPaths, edges] = await Promise.all([
    supabase.from("brands").select("id", { count: "exact", head: true }),
    supabase.from("use_cases").select("id", { count: "exact", head: true }),
    supabase.from("ai_specialisms").select("id", { count: "exact", head: true }),
    supabase.from("job_roles").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("timeline_events").select("id", { count: "exact", head: true }),
    supabase.from("learning_paths").select("id", { count: "exact", head: true }),
    supabase.from("edges").select("id", { count: "exact", head: true }),
  ]);

  return {
    brands: brands.count || 0,
    useCases: useCases.count || 0,
    aiSpecialisms: aiSpecialisms.count || 0,
    jobRoles: jobRoles.count || 0,
    projects: projects.count || 0,
    timelineEvents: timelineEvents.count || 0,
    learningPaths: learningPaths.count || 0,
    edges: edges.count || 0,
  };
}

const entityConfig = [
  { key: "brands", label: "Brands", href: "/admin/brands", countKey: "brands" },
  { key: "use-cases", label: "Use Cases", href: "/admin/use-cases", countKey: "useCases" },
  { key: "ai", label: "AI Specialisms", href: "/admin/ai", countKey: "aiSpecialisms" },
  { key: "jobs", label: "Job Roles", href: "/admin/jobs", countKey: "jobRoles" },
  { key: "projects", label: "Projects", href: "/admin/projects", countKey: "projects" },
  { key: "timeline", label: "Timeline Events", href: "/admin/timeline", countKey: "timelineEvents" },
  { key: "paths", label: "Learning Paths", href: "/admin/paths", countKey: "learningPaths" },
  { key: "edges", label: "Edges", href: "/admin/edges", countKey: "edges" },
] as const;

export default async function AdminDashboard() {
  const counts = await getEntityCounts();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage all entities in Beauty × AI Atlas
        </p>
      </div>

      {/* Entity Counts Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {entityConfig.map((entity) => {
          const count = counts[entity.countKey as keyof typeof counts];

          return (
            <Card key={entity.key} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{entity.label}</CardTitle>
                  <span className="text-2xl font-bold text-primary">{count}</span>
                </div>
                <CardDescription>Total {entity.label.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={entity.href}>View All</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`${entity.href}/upload`}>
                      <Plus className="mr-1 h-4 w-4" />
                      Upload
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`${entity.href}/new`}>
                      <Plus className="mr-1 h-4 w-4" />
                      New
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {counts.brands +
                counts.useCases +
                counts.aiSpecialisms +
                counts.jobRoles +
                counts.projects +
                counts.timelineEvents +
                counts.learningPaths}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Excluding edges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.edges}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Graph edges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Graph Density</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {counts.edges > 0
                ? (
                    (counts.edges /
                      (counts.brands +
                        counts.useCases +
                        counts.aiSpecialisms +
                        counts.jobRoles +
                        counts.projects +
                        counts.timelineEvents +
                        counts.learningPaths)) *
                    100
                  ).toFixed(1)
                : "0"}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Edges per entity
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

