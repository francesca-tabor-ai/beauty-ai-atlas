"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

const useCaseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  category: z.enum(["diagnostic", "generative", "recommendation", "analytics"]).nullable().optional(),
  maturity_level: z.enum(["emerging", "growing", "established"]).nullable().optional(),
  impact_score: z.number().int().min(1).max(10).nullable().optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
    if (typeof val === "string") {
      return val.split(",").map((t) => t.trim()).filter(Boolean);
    }
    return val || [];
  }),
  published: z.boolean().optional().default(false),
});

export async function uploadUseCases(data: unknown[]) {
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

      if (item.impact_score && typeof item.impact_score === "string") {
        item.impact_score = parseInt(item.impact_score as string, 10);
      }

      const validated = useCaseSchema.parse(item);

      const { error } = await supabase.from("use_cases").upsert(
        {
          title: validated.title,
          slug: validated.slug || generateSlug(validated.title),
          description: validated.description,
          category: validated.category,
          maturity_level: validated.maturity_level,
          impact_score: validated.impact_score,
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

  revalidatePath("/admin/use-cases");

  return {
    success: errors.length === 0,
    message: `Uploaded ${successCount} of ${data.length} use cases${errors.length > 0 ? `. ${errors.length} errors.` : ""}`,
    errors: errors.length > 0 ? errors : undefined,
  };
}

