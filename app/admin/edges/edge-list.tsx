import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { DeleteEdgeButton } from "./delete-button";

// Helper to get entity display name
async function getEntityDisplayName(
  entityType: string,
  entityId: string
): Promise<{ name: string; slug: string } | null> {
  const supabase = await createClient();

  const tableConfig: Record<string, { table: string; nameField: string }> = {
    brands: { table: "brands", nameField: "name" },
    use_cases: { table: "use_cases", nameField: "title" },
    ai_specialisms: { table: "ai_specialisms", nameField: "name" },
    job_roles: { table: "job_roles", nameField: "title" },
    projects: { table: "projects", nameField: "title" },
    timeline_events: { table: "timeline_events", nameField: "title" },
    learning_paths: { table: "learning_paths", nameField: "title" },
  };

  const config = tableConfig[entityType];
  if (!config) return null;

  const { data } = await supabase
    .from(config.table)
    .select(`id, slug, ${config.nameField}`)
    .eq("id", entityId)
    .single();

  if (!data) return null;

  const dataRecord = data as unknown as Record<string, unknown>;
  return {
    name: (dataRecord[config.nameField] as string | undefined) || (dataRecord.slug as string),
    slug: dataRecord.slug as string,
  };
}

// Helper to get entity URL
function getEntityUrl(entityType: string, slug: string): string {
  const urlMap: Record<string, string> = {
    brands: "/brands",
    use_cases: "/use-cases",
    ai_specialisms: "/ai",
    job_roles: "/jobs",
    projects: "/projects",
    timeline_events: "/timeline",
    learning_paths: "/paths",
  };

  const baseUrl = urlMap[entityType] || `/${entityType}`;
  return `${baseUrl}/${slug}`;
}

export async function EdgeList() {
  const supabase = await createClient();

  // Fetch all edges (admin can see all)
  const { data: edges, error } = await supabase
    .from("edges")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 border border-destructive text-destructive px-4 py-3">
        Error loading edges: {error.message}
      </div>
    );
  }

  if (!edges || edges.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No relationships found. Create your first relationship above.
      </div>
    );
  }

  // Fetch entity names for all edges
  const entityPromises = edges.map(async (edge) => {
    const [fromEntity, toEntity] = await Promise.all([
      getEntityDisplayName(edge.from_type, edge.from_id),
      getEntityDisplayName(edge.to_type, edge.to_id),
    ]);

    return {
      edge,
      fromEntity,
      toEntity,
    };
  });

  const edgesWithEntities = await Promise.all(entityPromises);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">From</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Relation</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">To</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Strength</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {edgesWithEntities.map(({ edge, fromEntity, toEntity }) => (
              <tr key={edge.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  {fromEntity ? (
                    <div>
                      <Link
                        href={getEntityUrl(edge.from_type, fromEntity.slug)}
                        className="text-sm font-medium hover:text-primary"
                        target="_blank"
                      >
                        {fromEntity.name}
                      </Link>
                      <div className="text-xs text-muted-foreground font-mono">
                        {edge.from_type}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {edge.from_id.substring(0, 8)}...
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm capitalize">
                    {edge.relation_type.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {toEntity ? (
                    <div>
                      <Link
                        href={getEntityUrl(edge.to_type, toEntity.slug)}
                        className="text-sm font-medium hover:text-primary"
                        target="_blank"
                      >
                        {toEntity.name}
                      </Link>
                      <div className="text-xs text-muted-foreground font-mono">
                        {edge.to_type}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {edge.to_id.substring(0, 8)}...
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {edge.strength ? (
                    <span className="text-sm">{edge.strength}/5</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {edge.published ? (
                    <Badge variant="default">Published</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <DeleteEdgeButton edgeId={edge.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

