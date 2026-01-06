"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

const brandSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  headquarters: z.string().nullable().optional(),
  founded_year: z.number().int().min(1800).max(new Date().getFullYear()).nullable().optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
    if (typeof val === "string") {
      return val.split(",").map((t) => t.trim()).filter(Boolean);
    }
    return val || [];
  }),
  published: z.boolean().optional().default(false),
});

export async function uploadBrands(data: unknown[]) {
  const supabase = createAdminClient();
  const errors: string[] = [];
  let successCount = 0;

  for (let i = 0; i < data.length; i++) {
    try {
      const item = data[i] as Record<string, unknown>;
      
      // Generate slug if not provided
      if (!item.slug && item.name) {
        item.slug = generateSlug(item.name as string);
      }

      // Transform tags if string
      if (typeof item.tags === "string") {
        item.tags = (item.tags as string).split(",").map((t) => t.trim()).filter(Boolean);
      }

      // Transform boolean fields
      if (typeof item.published === "string") {
        item.published = item.published === "true" || item.published === "1";
      }

      // Transform number fields
      if (item.founded_year && typeof item.founded_year === "string") {
        item.founded_year = parseInt(item.founded_year as string, 10);
      }

      const validated = brandSchema.parse(item);

      const { error } = await supabase.from("brands").upsert(
        {
          name: validated.name,
          slug: validated.slug || generateSlug(validated.name),
          description: validated.description,
          website: validated.website,
          logo_url: validated.logo_url,
          category: validated.category,
          headquarters: validated.headquarters,
          founded_year: validated.founded_year,
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

  revalidatePath("/admin/brands");

  return {
    success: errors.length === 0,
    message: `Uploaded ${successCount} of ${data.length} brands${errors.length > 0 ? `. ${errors.length} errors.` : ""}`,
    errors: errors.length > 0 ? errors : undefined,
  };
}

