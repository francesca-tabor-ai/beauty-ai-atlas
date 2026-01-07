"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, LogOut, LayoutDashboard, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MobileAuthMenuProps {
  onLinkClick?: () => void;
}

export function MobileAuthMenu({ onLinkClick }: MobileAuthMenuProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setIsAuthenticated(true);
          setUserEmail(user.email ?? null);
          const role =
            (user.user_metadata?.role as string | undefined) ??
            (user.app_metadata?.role as string | undefined);
          setIsAdmin(role === "admin");
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUserEmail(null);
        }
      } catch {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserEmail(null);
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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserEmail(null);
    onLinkClick?.();
    router.push("/");
    router.refresh();
  };

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-accent hover:bg-accent/10 rounded-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transition-none"
        onClick={onLinkClick}
      >
        <LogIn className="inline mr-2 h-4 w-4" />
        Admin Login
      </Link>
    );
  }

  return (
    <>
      {isAdmin && (
        <>
          <Link
            href="/admin"
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-accent hover:bg-accent/10 rounded-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transition-none"
            onClick={onLinkClick}
          >
            <LayoutDashboard className="inline mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/upload-data"
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-accent hover:bg-accent/10 rounded-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transition-none"
            onClick={onLinkClick}
          >
            <Upload className="inline mr-2 h-4 w-4" />
            Upload Data
          </Link>
        </>
      )}
      <button
        className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-accent hover:bg-accent/10 rounded-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transition-none w-full text-left"
        onClick={handleSignOut}
      >
        <LogOut className="inline mr-2 h-4 w-4" />
        Sign Out
      </button>
    </>
  );
}

