"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const adminNavLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/use-cases", label: "Use Cases" },
  { href: "/admin/ai", label: "AI Specialisms" },
  { href: "/admin/jobs", label: "Job Roles" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/timeline", label: "Timeline Events" },
  { href: "/admin/paths", label: "Learning Paths" },
  { href: "/admin/edges", label: "Edges" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Beauty × AI Atlas</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {adminNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}

