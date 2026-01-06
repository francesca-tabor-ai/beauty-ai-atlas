import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EntityType } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const entityType = searchParams.get("type") as EntityType;

  if (!entityType) {
    return NextResponse.json({ error: "Entity type is required" }, { status: 400 });
  }

  const supabase = await createClient();

  // Map entity types to table names and field names
  const tableConfig: Record<
    EntityType,
    { table: string; nameField: string; titleField?: string }
  > = {
    brands: { table: "brands", nameField: "name" },
    use_cases: { table: "use_cases", nameField: "title", titleField: "title" },
    ai_specialisms: { table: "ai_specialisms", nameField: "name" },
    job_roles: { table: "job_roles", nameField: "title", titleField: "title" },
    projects: { table: "projects", nameField: "title", titleField: "title" },
    timeline_events: { table: "timeline_events", nameField: "title", titleField: "title" },
    learning_paths: { table: "learning_paths", nameField: "title", titleField: "title" },
  };

  const config = tableConfig[entityType];
  if (!config) {
    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
  }

  // Fetch entities (admin can see all, published and unpublished)
  const { data, error } = await supabase
    .from(config.table)
    .select("id, slug, " + config.nameField)
    .order(config.nameField, { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json([]);
  }

  // Transform data to include both name and title fields
  const entities = data.map((entity) => {
    const entityRecord = entity as unknown as Record<string, unknown>;
    return {
      id: entityRecord.id as string,
      slug: entityRecord.slug as string,
      name: config.titleField ? undefined : (entityRecord[config.nameField] as string),
      title: config.titleField ? (entityRecord[config.titleField] as string) : undefined,
    };
  });

  return NextResponse.json(entities);
}

