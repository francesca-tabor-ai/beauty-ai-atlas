"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Creates a Supabase client for Client Components.
 * Uses localStorage for session management via @supabase/ssr.
 *
 * @returns Supabase client with user session from localStorage
 * @example
 * ```tsx
 * 'use client';
 * const supabase = createClient();
 * const { data } = await supabase.from('brands').select('*');
 * ```
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
