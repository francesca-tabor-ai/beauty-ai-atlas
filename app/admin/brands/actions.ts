"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

// Zod schema for brand validation
const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  headquarters: z.string().nullable().optional(),
  founded_year: z.number().int().min(1800).max(new Date().getFullYear()).nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().default(false),
});

export type BrandFormData = z.infer<typeof brandSchema>;

export async function createBrand(formData: FormData) {
  const supabase = createAdminClient();

  // Extract and parse form data
  const websiteValue = (formData.get("website") as string)?.trim() || null;
  const logoUrlValue = (formData.get("logo_url") as string)?.trim() || null;
  
  // Validate URLs if provided
  if (websiteValue && !websiteValue.match(/^https?:\/\/.+/)) {
    return { error: "Website must be a valid URL (starting with http:// or https://)" };
  }
  if (logoUrlValue && !logoUrlValue.match(/^https?:\/\/.+/)) {
    return { error: "Logo URL must be a valid URL (starting with http:// or https://)" };
  }
  
  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string || generateSlug(formData.get("name") as string),
    description: formData.get("description") as string || null,
    website: websiteValue,
    logo_url: logoUrlValue,
    category: formData.get("category") as string || null,
    headquarters: formData.get("headquarters") as string || null,
    founded_year: formData.get("founded_year") ? parseInt(formData.get("founded_year") as string) : null,
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean) : [],
    published: formData.get("published") === "on",
  };

  // Validate with zod
  const validation = brandSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", "),
    };
  }

  const data = validation.data;

  // Insert into database
  const { error } = await supabase.from("brands").insert({
    name: data.name,
    slug: data.slug,
    description: data.description,
    website: data.website || null,
    logo_url: data.logo_url || null,
    category: data.category || null,
    headquarters: data.headquarters || null,
    founded_year: data.founded_year || null,
    tags: data.tags || [],
    published: data.published,
  });

  if (error) {
    return {
      error: error.message || "Failed to create brand",
    };
  }

  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function updateBrand(id: string, formData: FormData) {
  const supabase = createAdminClient();

  // Extract and parse form data
  const websiteValue = (formData.get("website") as string)?.trim() || null;
  const logoUrlValue = (formData.get("logo_url") as string)?.trim() || null;
  
  // Validate URLs if provided
  if (websiteValue && !websiteValue.match(/^https?:\/\/.+/)) {
    return { error: "Website must be a valid URL (starting with http:// or https://)" };
  }
  if (logoUrlValue && !logoUrlValue.match(/^https?:\/\/.+/)) {
    return { error: "Logo URL must be a valid URL (starting with http:// or https://)" };
  }
  
  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string || null,
    website: websiteValue,
    logo_url: logoUrlValue,
    category: formData.get("category") as string || null,
    headquarters: formData.get("headquarters") as string || null,
    founded_year: formData.get("founded_year") ? parseInt(formData.get("founded_year") as string) : null,
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean) : [],
    published: formData.get("published") === "on",
  };

  // Validate with zod
  const validation = brandSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", "),
    };
  }

  const data = validation.data;

  // Update in database
  const { error } = await supabase
    .from("brands")
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description,
      website: data.website || null,
      logo_url: data.logo_url || null,
      category: data.category || null,
      headquarters: data.headquarters || null,
      founded_year: data.founded_year || null,
      tags: data.tags || [],
      published: data.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return {
      error: error.message || "Failed to update brand",
    };
  }

  revalidatePath("/admin/brands");
  revalidatePath(`/admin/brands/${id}`);
  redirect("/admin/brands");
}

export async function deleteBrand(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("brands").delete().eq("id", id);

  if (error) {
    return {
      error: error.message || "Failed to delete brand",
    };
  }

  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

