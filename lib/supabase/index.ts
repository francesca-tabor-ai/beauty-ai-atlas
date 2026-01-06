/**
 * Supabase client utilities for Beauty × AI Atlas
 *
 * This module exports all Supabase-related utilities:
 * - Server clients (for Server Components and Server Actions)
 * - Client components client
 * - Reusable query builders
 * - Type definitions
 */

export { createClient, createAdminClient } from "./server";
export { createClient as createBrowserClient } from "./client";
export * from "./queries";
export * from "./types";

