import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Creates a Supabase client for Server Components.
 * Uses cookies for session management via @supabase/ssr.
 *
 * @returns Supabase client with user session from cookies
 * @example
 * ```ts
 * const supabase = await createClient();
 * const { data } = await supabase.from('brands').select('*');
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions. In that case, the middleware will handle cookies.
            if (process.env.NODE_ENV === "development") {
              console.warn("Failed to set cookies in Server Component:", error);
            }
          }
        },
      },
    }
  );
}

/**
 * Creates an admin Supabase client for Server Actions.
 * Uses service role key to bypass RLS policies.
 *
 * ⚠️ WARNING: Only use this in Server Actions, never expose to client.
 * The service role key has full database access.
 *
 * @returns Supabase admin client with service role key
 * @example
 * ```ts
 * 'use server';
 * const admin = createAdminClient();
 * const { data } = await admin.from('brands').delete().eq('id', id);
 * ```
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. This is required for admin operations."
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
