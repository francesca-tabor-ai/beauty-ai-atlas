import { createClient } from "@/lib/supabase/server";
import { LoggedInMenu } from "./LoggedInMenu";
import { LoggedOutMenu } from "./LoggedOutMenu";

export async function AuthNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Check if user is admin
    const role =
      (user.user_metadata?.role as string | undefined) ??
      (user.app_metadata?.role as string | undefined);
    const isAdmin = role === "admin";

    return <LoggedInMenu userEmail={user.email || "Account"} isAdmin={isAdmin} />;
  }

  return <LoggedOutMenu />;
}

