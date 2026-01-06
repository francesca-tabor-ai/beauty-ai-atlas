"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { EntityType, RelationType } from "@/lib/supabase/types";

// Zod schema for edge validation
const edgeSchema = z.object({
  from_type: z.enum([
    "brands",
    "use_cases",
    "ai_specialisms",
    "job_roles",
    "projects",
    "timeline_events",
    "learning_paths",
  ]),
  from_id: z.string().uuid("From entity ID must be a valid UUID"),
  to_type: z.enum([
    "brands",
    "use_cases",
    "ai_specialisms",
    "job_roles",
    "projects",
    "timeline_events",
    "learning_paths",
  ]),
  to_id: z.string().uuid("To entity ID must be a valid UUID"),
  relation_type: z.enum([
    "implements",
    "enables",
    "transforms",
    "requires",
    "influences",
    "demonstrates",
    "includes",
    "related_to",
  ]),
  strength: z.number().int().min(1).max(5).nullable().optional(),
  published: z.boolean().default(false),
});

export async function createEdge(formData: FormData) {
  const supabase = createAdminClient();

  // Extract and parse form data
  const rawData = {
    from_type: formData.get("from_type") as EntityType,
    from_id: formData.get("from_id") as string,
    to_type: formData.get("to_type") as EntityType,
    to_id: formData.get("to_id") as string,
    relation_type: formData.get("relation_type") as RelationType,
    strength: formData.get("strength")
      ? parseInt(formData.get("strength") as string)
      : null,
    published: formData.get("published") === "on",
  };

  // Validate with zod
  const validation = edgeSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", "),
    };
  }

  const data = validation.data;

  // Check that from and to are different
  if (data.from_id === data.to_id) {
    return {
      error: "From and To entities must be different",
    };
  }

  // Insert into database
  const { error } = await supabase.from("edges").insert({
    from_type: data.from_type,
    from_id: data.from_id,
    to_type: data.to_type,
    to_id: data.to_id,
    relation_type: data.relation_type,
    strength: data.strength,
    published: data.published,
    metadata: {},
  });

  if (error) {
    // Handle unique constraint violation
    if (error.code === "23505") {
      return {
        error: "This relationship already exists",
      };
    }
    return {
      error: error.message || "Failed to create edge",
    };
  }

  revalidatePath("/admin/edges");
  redirect("/admin/edges");
}

export async function deleteEdge(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("edges").delete().eq("id", id);

  if (error) {
    return {
      error: error.message || "Failed to delete edge",
    };
  }

  revalidatePath("/admin/edges");
  redirect("/admin/edges");
}

