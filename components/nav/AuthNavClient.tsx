"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { LoggedInMenu } from "./LoggedInMenu";
import { LoggedOutMenu } from "./LoggedOutMenu";

export function AuthNavClient() {
  const [user, setUser] = useState<{ email: string | null; isAdmin: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          const role =
            (authUser.user_metadata?.role as string | undefined) ??
            (authUser.app_metadata?.role as string | undefined);
          setUser({
            email: authUser.email || "Account",
            isAdmin: role === "admin",
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (user) {
    return <LoggedInMenu userEmail={user.email} isAdmin={user.isAdmin} />;
  }

  return <LoggedOutMenu />;
}

