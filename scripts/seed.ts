#!/usr/bin/env tsx

/**
 * Seed script for Beauty × AI Atlas
 * 
 * Reads JSON files from /data directory and upserts them into Supabase.
 * 
 * Usage: npm run seed
 * Or: npx tsx scripts/seed.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";
import type { EntityType, RelationType } from "../lib/supabase/types";

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Missing required environment variables:");
  console.error("   NEXT_PUBLIC_SUPABASE_URL");
  console.error("   SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Create Supabase admin client (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Entity type to table name mapping
const entityTableMap: Record<EntityType, string> = {
  brands: "brands",
  use_cases: "use_cases",
  ai_specialisms: "ai_specialisms",
  job_roles: "job_roles",
  projects: "projects",
  timeline_events: "timeline_events",
  learning_paths: "learning_paths",
};

// Entity type to name field mapping
const entityNameFieldMap: Record<EntityType, string> = {
  brands: "name",
  use_cases: "title",
  ai_specialisms: "name",
  job_roles: "title",
  projects: "title",
  timeline_events: "title",
  learning_paths: "title",
};

/**
 * Read and parse JSON file
 */
function readJsonFile<T>(filename: string): T[] {
  try {
    const filePath = join(process.cwd(), "data", filename);
    const fileContent = readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.warn(`⚠️  File not found: data/${filename} (skipping)`);
      return [];
    }
    throw error;
  }
}

/**
 * Upsert entities into a table
 */
async function seedEntities<T extends { slug: string }>(
  entityType: EntityType,
  entities: T[]
): Promise<number> {
  if (entities.length === 0) {
    return 0;
  }

  const tableName = entityTableMap[entityType];
  let successCount = 0;
  let errorCount = 0;

  console.log(`\n📦 Seeding ${entityType}...`);

  for (const entity of entities) {
    try {
      // Prepare data for upsert
      const { slug, ...rest } = entity;
      const data = {
        ...rest,
        slug,
        updated_at: new Date().toISOString(),
      };

      // Upsert using slug as unique key
      const { error } = await supabase
        .from(tableName)
        .upsert(data, {
          onConflict: "slug",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error(`   ❌ Error upserting ${slug}:`, error.message);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (error) {
      console.error(`   ❌ Error processing ${entity.slug}:`, error);
      errorCount++;
    }
  }

  console.log(`   ✅ Seeded ${successCount} ${entityType}`);
  if (errorCount > 0) {
    console.log(`   ⚠️  ${errorCount} errors`);
  }

  return successCount;
}

/**
 * Resolve entity slug to ID
 */
async function resolveEntityId(
  entityType: EntityType,
  slug: string
): Promise<string | null> {
  const tableName = entityTableMap[entityType];
  const { data, error } = await supabase
    .from(tableName)
    .select("id")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.warn(`   ⚠️  Could not resolve ${entityType}:${slug} to ID`);
    return null;
  }

  return data.id;
}

/**
 * Seed edges (relationships)
 */
async function seedEdges(
  edges: Array<{
    from_type: EntityType;
    from_slug: string;
    to_type: EntityType;
    to_slug: string;
    relation_type: RelationType;
    strength?: number | null;
    published?: boolean;
    metadata?: Record<string, unknown>;
  }>
): Promise<number> {
  if (edges.length === 0) {
    return 0;
  }

  console.log(`\n🔗 Seeding edges...`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const edge of edges) {
    try {
      // Resolve slugs to IDs
      const [fromId, toId] = await Promise.all([
        resolveEntityId(edge.from_type, edge.from_slug),
        resolveEntityId(edge.to_type, edge.to_slug),
      ]);

      if (!fromId || !toId) {
        console.warn(
          `   ⚠️  Skipping edge: ${edge.from_type}:${edge.from_slug} → ${edge.to_type}:${edge.to_slug} (could not resolve IDs)`
        );
        skippedCount++;
        continue;
      }

      // Prepare edge data
      const edgeData = {
        from_type: edge.from_type,
        from_id: fromId,
        to_type: edge.to_type,
        to_id: toId,
        relation_type: edge.relation_type,
        strength: edge.strength ?? null,
        published: edge.published ?? false,
        metadata: edge.metadata ?? {},
        updated_at: new Date().toISOString(),
      };

      // Upsert edge (using unique constraint on from_type, from_id, to_type, to_id, relation_type)
      const { error } = await supabase.from("edges").upsert(edgeData, {
        onConflict: "from_type,from_id,to_type,to_id,relation_type",
        ignoreDuplicates: false,
      });

      if (error) {
        // Handle unique constraint violation gracefully
        if (error.code === "23505") {
          // Edge already exists, skip
          skippedCount++;
        } else {
          console.error(
            `   ❌ Error upserting edge ${edge.from_type}:${edge.from_slug} → ${edge.to_type}:${edge.to_slug}:`,
            error.message
          );
          errorCount++;
        }
      } else {
        successCount++;
      }
    } catch (error) {
      console.error(`   ❌ Error processing edge:`, error);
      errorCount++;
    }
  }

  console.log(`   ✅ Seeded ${successCount} edges`);
  if (skippedCount > 0) {
    console.log(`   ⏭️  Skipped ${skippedCount} edges (already exist or invalid)`);
  }
  if (errorCount > 0) {
    console.log(`   ⚠️  ${errorCount} errors`);
  }

  return successCount;
}

/**
 * Main seed function
 */
async function main() {
  console.log("🌱 Starting seed process...\n");

  const results: Record<string, number> = {};

  try {
    // Seed entities
    results.brands = await seedEntities("brands", readJsonFile<{ slug: string }>("brands.json"));
    results.use_cases = await seedEntities(
      "use_cases",
      readJsonFile<{ slug: string }>("use_cases.json")
    );
    results.ai_specialisms = await seedEntities(
      "ai_specialisms",
      readJsonFile<{ slug: string }>("ai_specialisms.json")
    );
    results.job_roles = await seedEntities(
      "job_roles",
      readJsonFile<{ slug: string }>("job_roles.json")
    );
    results.projects = await seedEntities(
      "projects",
      readJsonFile<{ slug: string }>("projects.json")
    );
    results.timeline_events = await seedEntities(
      "timeline_events",
      readJsonFile<{ slug: string }>("timeline_events.json")
    );
    results.learning_paths = await seedEntities(
      "learning_paths",
      readJsonFile<{ slug: string }>("learning_paths.json")
    );

    // Seed edges (after entities are seeded)
    results.edges = await seedEdges(readJsonFile("edges.json"));

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 Seed Summary:");
    console.log("=".repeat(50));
    
    const entityCounts = [
      `${results.brands} brands`,
      `${results.use_cases} use cases`,
      `${results.ai_specialisms} AI specialisms`,
      `${results.job_roles} job roles`,
      `${results.projects} projects`,
      `${results.timeline_events} timeline events`,
      `${results.learning_paths} learning paths`,
    ].filter((count) => !count.startsWith("0"));

    if (entityCounts.length > 0) {
      console.log(`   ${entityCounts.join(", ")}`);
    }
    
    if (results.edges > 0) {
      console.log(`   ${results.edges} edges`);
    }

    const totalEntities =
      results.brands +
      results.use_cases +
      results.ai_specialisms +
      results.job_roles +
      results.projects +
      results.timeline_events +
      results.learning_paths;

    console.log(`\n   Total: ${totalEntities} entities, ${results.edges} edges`);
    console.log("=".repeat(50));
    console.log("✅ Seed process completed!\n");
  } catch (error) {
    console.error("\n❌ Seed process failed:", error);
    process.exit(1);
  }
}

// Run the seed script
main();

