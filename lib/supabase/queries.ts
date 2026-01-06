import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Type helper for table names in the database
 */
type TableName = keyof Database["public"]["Tables"] & string;

/**
 * Type helper for table row types
 */
type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"];

/**
 * Type helper for table insert types
 */
type TableInsert<T extends TableName> =
  Database["public"]["Tables"][T]["Insert"];

/**
 * Type helper for table update types
 */
type TableUpdate<T extends TableName> =
  Database["public"]["Tables"][T]["Update"];

/**
 * Generic filter options for querying entities
 */
export interface EntityFilters {
  category?: string;
  tags?: string[];
  published?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

/**
 * Get a single entity by slug from any table.
 *
 * @param supabase - Supabase client instance
 * @param table - Table name
 * @param slug - Entity slug
 * @returns Entity data or null if not found
 * @example
 * ```ts
 * const brand = await getEntityBySlug(supabase, 'brands', 'loreal');
 * ```
 */
export async function getEntityBySlug<T extends TableName>(
  supabase: SupabaseClient<Database>,
  table: T,
  slug: string
): Promise<TableRow<T> | null> {
  const { data, error } = await supabase
    .from(table as string)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching ${table} by slug:`, error);
    throw new Error(`Failed to fetch ${table}: ${error.message}`);
  }

  return data;
}

/**
 * Get all published entities from a table with optional filters.
 *
 * @param supabase - Supabase client instance
 * @param table - Table name
 * @param filters - Optional filters (category, tags, etc.)
 * @returns Array of published entities
 * @example
 * ```ts
 * const brands = await getPublishedEntities(supabase, 'brands', {
 *   category: 'Luxury',
 *   tags: ['ai-innovation'],
 *   limit: 10
 * });
 * ```
 */
export async function getPublishedEntities<T extends TableName>(
  supabase: SupabaseClient<Database>,
  table: T,
  filters?: EntityFilters
): Promise<TableRow<T>[]> {
  let query = supabase
    .from(table as string)
    .select("*")
    .eq("published", true);

  // Apply filters
  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.contains("tags", filters.tags);
  }

  if (filters?.orderBy) {
    query = query.order(filters.orderBy, {
      ascending: filters.orderDirection !== "desc",
    });
  } else {
    // Default ordering by created_at
    query = query.order("created_at", { ascending: false });
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 10) - 1
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching published ${table}:`, error);
    throw new Error(`Failed to fetch ${table}: ${error.message}`);
  }

  return data || [];
}

/**
 * Search entities by text across multiple fields.
 *
 * @param supabase - Supabase client instance
 * @param table - Table name
 * @param searchTerm - Search query string
 * @param fields - Fields to search in (defaults to common text fields)
 * @returns Array of matching entities
 * @example
 * ```ts
 * const results = await searchEntities(
 *   supabase,
 *   'brands',
 *   'L\'Oréal',
 *   ['name', 'description']
 * );
 * ```
 */
export async function searchEntities<T extends TableName>(
  supabase: SupabaseClient<Database>,
  table: T,
  searchTerm: string,
  fields?: string[]
): Promise<TableRow<T>[]> {
  if (!searchTerm.trim()) {
    return [];
  }

  // Default fields to search based on table
  const defaultFields: Record<string, string[]> = {
    brands: ["name", "description"],
    use_cases: ["title", "description"],
    ai_specialisms: ["name", "description"],
    job_roles: ["title", "description"],
    projects: ["title", "description"],
    timeline_events: ["title", "description"],
    learning_paths: ["title", "description"],
  };

  const searchFields = fields || defaultFields[table as string] || ["name", "title"];

  // Build OR conditions for each field
  let query = supabase
    .from(table as string)
    .select("*")
    .eq("published", true);

  // Apply search using or() for multiple fields with ilike
  const orConditions = searchFields
    .map((field: string) => `${field}.ilike.%${searchTerm}%`)
    .join(",");

  query = query.or(orConditions);

  const { data, error } = await query;

  if (error) {
    console.error(`Error searching ${table}:`, error);
    throw new Error(`Failed to search ${table}: ${error.message}`);
  }

  return data || [];
}

/**
 * Get edges (relationships) for a specific entity.
 *
 * @param supabase - Supabase client instance
 * @param entityType - Type of the source entity
 * @param entityId - ID of the source entity
 * @param direction - 'from' (outgoing) or 'to' (incoming) or 'both'
 * @returns Array of edges
 * @example
 * ```ts
 * const connections = await getEntityEdges(
 *   supabase,
 *   'brands',
 *   brandId,
 *   'both'
 * );
 * ```
 */
export async function getEntityEdges(
  supabase: SupabaseClient<Database>,
  entityType: string,
  entityId: string,
  direction: "from" | "to" | "both" = "both"
) {
  let query = supabase.from("edges").select("*").eq("published", true);

  if (direction === "from") {
    // Outgoing edges: entity is the source
    query = query
      .eq("from_type", entityType)
      .eq("from_id", entityId);
  } else if (direction === "to") {
    // Incoming edges: entity is the target
    query = query
      .eq("to_type", entityType)
      .eq("to_id", entityId);
  } else {
    // Both directions: entity can be source or target
    query = query.or(
      `and(from_type.eq.${entityType},from_id.eq.${entityId}),and(to_type.eq.${entityType},to_id.eq.${entityId})`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching edges:", error);
    throw new Error(`Failed to fetch edges: ${error.message}`);
  }

  return data || [];
}

/**
 * Get related entities through edges.
 *
 * @param supabase - Supabase client instance
 * @param entityType - Type of the source entity
 * @param entityId - ID of the source entity
 * @param relationType - Optional filter by relation type
 * @returns Array of related entities with their relationship info
 * @example
 * ```ts
 * const related = await getRelatedEntities(
 *   supabase,
 *   'brands',
 *   brandId,
 *   'implements'
 * );
 * ```
 */
export async function getRelatedEntities(
  supabase: SupabaseClient<Database>,
  entityType: string,
  entityId: string,
  relationType?: string
) {
  let query = supabase
    .from("edges")
    .select("*")
    .eq("published", true)
    .or(
      `and(from_type.eq.${entityType},from_id.eq.${entityId}),and(to_type.eq.${entityType},to_id.eq.${entityId})`
    );

  if (relationType) {
    query = query.eq("relation_type", relationType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching related entities:", error);
    throw new Error(`Failed to fetch related entities: ${error.message}`);
  }

  return data || [];
}

