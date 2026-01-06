import { createClient } from "@/lib/supabase/server";

/**
 * Check if the current user is an admin
 * @returns true if user is authenticated and has admin role, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      return false;
    }

    // Check both user_metadata and app_metadata for role
    const role =
      (user.user_metadata?.role as string | undefined) ??
      (user.app_metadata?.role as string | undefined);

    return role === "admin";
  } catch {
    return false;
  }
}

