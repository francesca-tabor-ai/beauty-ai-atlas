"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

const learningPathSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).nullable().optional(),
  duration_hours: z.number().int().min(1).nullable().optional(),
  steps: z.union([
    z.array(z.record(z.unknown())),
    z.string()
  ]).optional().transform((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    }
    return val || [];
  }),
  tags: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
    if (typeof val === "string") {
      return val.split(",").map((t) => t.trim()).filter(Boolean);
    }
    return val || [];
  }),
  published: z.boolean().optional().default(false),
});

export async function uploadLearningPaths(data: unknown[]) {
  const supabase = createAdminClient();
  const errors: string[] = [];
  let successCount = 0;

  for (let i = 0; i < data.length; i++) {
    try {
      const item = data[i] as Record<string, unknown>;
      
      if (!item.slug && item.title) {
        item.slug = generateSlug(item.title as string);
      }

      if (typeof item.tags === "string") {
        item.tags = (item.tags as string).split(",").map((t) => t.trim()).filter(Boolean);
      }

      if (typeof item.published === "string") {
        item.published = item.published === "true" || item.published === "1";
      }

      if (item.duration_hours && typeof item.duration_hours === "string") {
        item.duration_hours = parseInt(item.duration_hours as string, 10);
      }

      if (item.steps && typeof item.steps === "string") {
        try {
          item.steps = JSON.parse(item.steps as string);
        } catch {
          item.steps = [];
        }
      }

      const validated = learningPathSchema.parse(item);

      const { error } = await supabase.from("learning_paths").upsert(
        {
          title: validated.title,
          slug: validated.slug || generateSlug(validated.title),
          description: validated.description,
          difficulty: validated.difficulty,
          duration_hours: validated.duration_hours,
          steps: validated.steps,
          tags: validated.tags,
          published: validated.published,
        },
        { onConflict: "slug" }
      );

      if (error) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      } else {
        successCount++;
      }
    } catch (error) {
      errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : "Validation error"}`);
    }
  }

  revalidatePath("/admin/paths");

  return {
    success: errors.length === 0,
    message: `Uploaded ${successCount} of ${data.length} learning paths${errors.length > 0 ? `. ${errors.length} errors.` : ""}`,
    errors: errors.length > 0 ? errors : undefined,
  };
}

