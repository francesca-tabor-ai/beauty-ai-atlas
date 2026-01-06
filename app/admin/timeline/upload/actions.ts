"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

const timelineEventSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 10),
  month: z.number().int().min(1).max(12).nullable().optional(),
  description: z.string().nullable().optional(),
  event_type: z.enum(["technology", "regulation", "market", "cultural"]).nullable().optional(),
  significance: z.enum(["low", "medium", "high", "critical"]).nullable().optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
    if (typeof val === "string") {
      return val.split(",").map((t) => t.trim()).filter(Boolean);
    }
    return val || [];
  }),
  published: z.boolean().optional().default(false),
});

export async function uploadTimelineEvents(data: unknown[]) {
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

      if (item.year && typeof item.year === "string") {
        item.year = parseInt(item.year as string, 10);
      }

      if (item.month && typeof item.month === "string") {
        item.month = parseInt(item.month as string, 10);
      }

      const validated = timelineEventSchema.parse(item);

      const { error } = await supabase.from("timeline_events").upsert(
        {
          title: validated.title,
          slug: validated.slug || generateSlug(validated.title),
          year: validated.year,
          month: validated.month,
          description: validated.description,
          event_type: validated.event_type,
          significance: validated.significance,
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

  revalidatePath("/admin/timeline");

  return {
    success: errors.length === 0,
    message: `Uploaded ${successCount} of ${data.length} timeline events${errors.length > 0 ? `. ${errors.length} errors.` : ""}`,
    errors: errors.length > 0 ? errors : undefined,
  };
}

