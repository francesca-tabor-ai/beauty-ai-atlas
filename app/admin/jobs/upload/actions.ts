"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

const jobRoleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  seniority_level: z.string().nullable().optional(),
  ai_impact_level: z.enum(["low", "medium", "high", "transformative"]).nullable().optional(),
  emerging: z.boolean().optional().default(false),
  skills_required: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
    if (typeof val === "string") {
      return val.split(",").map((t) => t.trim()).filter(Boolean);
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

export async function uploadJobRoles(data: unknown[]) {
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

      if (typeof item.skills_required === "string") {
        item.skills_required = (item.skills_required as string).split(",").map((t) => t.trim()).filter(Boolean);
      }

      if (typeof item.published === "string") {
        item.published = item.published === "true" || item.published === "1";
      }

      if (typeof item.emerging === "string") {
        item.emerging = item.emerging === "true" || item.emerging === "1";
      }

      const validated = jobRoleSchema.parse(item);

      const { error } = await supabase.from("job_roles").upsert(
        {
          title: validated.title,
          slug: validated.slug || generateSlug(validated.title),
          description: validated.description,
          department: validated.department,
          seniority_level: validated.seniority_level,
          ai_impact_level: validated.ai_impact_level,
          emerging: validated.emerging,
          skills_required: validated.skills_required,
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

  revalidatePath("/admin/jobs");

  return {
    success: errors.length === 0,
    message: `Uploaded ${successCount} of ${data.length} job roles${errors.length > 0 ? `. ${errors.length} errors.` : ""}`,
    errors: errors.length > 0 ? errors : undefined,
  };
}

