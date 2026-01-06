import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Check if user is authenticated
  if (!user || error) {
    redirect("/");
  }

  // Check if user has admin role
  // Check both user_metadata and app_metadata for role
  const role =
    (user.user_metadata?.role as string | undefined) ??
    (user.app_metadata?.role as string | undefined);

  if (role !== "admin") {
    // Return 403 Forbidden page
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">403 Forbidden</h1>
          <p className="text-muted-foreground mb-8">
            You do not have permission to access this area.
          </p>
          <Link
            href="/"
            className="text-primary hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin - show admin layout
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

