"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

const aiSpecialismSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  category: z.enum(["computer_vision", "nlp", "recommendation_systems", "generative_ai"]).nullable().optional(),
  maturity_timeline: z.union([z.record(z.unknown()), z.string()]).optional().transform((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return {};
      }
    }
    return val || {};
  }),
  tags: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
    if (typeof val === "string") {
      return val.split(",").map((t) => t.trim()).filter(Boolean);
    }
    return val || [];
  }),
  published: z.boolean().optional().default(false),
});

export async function uploadAISpecialisms(data: unknown[]) {
  const supabase = createAdminClient();
  const errors: string[] = [];
  let successCount = 0;

  for (let i = 0; i < data.length; i++) {
    try {
      const item = data[i] as Record<string, unknown>;
      
      if (!item.slug && item.name) {
        item.slug = generateSlug(item.name as string);
      }

      if (typeof item.tags === "string") {
        item.tags = (item.tags as string).split(",").map((t) => t.trim()).filter(Boolean);
      }

      if (typeof item.published === "string") {
        item.published = item.published === "true" || item.published === "1";
      }

      if (item.maturity_timeline && typeof item.maturity_timeline === "string") {
        try {
          item.maturity_timeline = JSON.parse(item.maturity_timeline as string);
        } catch {
          item.maturity_timeline = {};
        }
      }

      const validated = aiSpecialismSchema.parse(item);

      const { error } = await supabase.from("ai_specialisms").upsert(
        {
          name: validated.name,
          slug: validated.slug || generateSlug(validated.name),
          description: validated.description,
          category: validated.category,
          maturity_timeline: validated.maturity_timeline,
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

  revalidatePath("/admin/ai");

  return {
    success: errors.length === 0,
    message: `Uploaded ${successCount} of ${data.length} AI specialisms${errors.length > 0 ? `. ${errors.length} errors.` : ""}`,
    errors: errors.length > 0 ? errors : undefined,
  };
}

