"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const uploadLinks = [
  {
    href: "/admin/brands/upload",
    label: "Upload Brands",
    description: "Bulk import brands from JSON or CSV files",
  },
  {
    href: "/admin/use-cases/upload",
    label: "Upload Use Cases",
    description: "Bulk import use cases from JSON or CSV files",
  },
  {
    href: "/admin/ai/upload",
    label: "Upload AI Specialisms",
    description: "Bulk import AI specialisms from JSON or CSV files",
  },
  {
    href: "/admin/jobs/upload",
    label: "Upload Job Roles",
    description: "Bulk import job roles from JSON or CSV files",
  },
  {
    href: "/admin/timeline/upload",
    label: "Upload Timeline Events",
    description: "Bulk import timeline events from JSON or CSV files",
  },
  {
    href: "/admin/paths/upload",
    label: "Upload Learning Paths",
    description: "Bulk import learning paths from JSON or CSV files",
  },
];

export default function UploadDataPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const role =
            (user.user_metadata?.role as string | undefined) ??
            (user.app_metadata?.role as string | undefined);
          setIsAdmin(role === "admin");
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isAdmin) {
      e.preventDefault();
      // Redirect to login with return URL
      router.push(`/login?next=${encodeURIComponent(href)}`);
      return;
    }
    // If admin, let the link navigate normally
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Upload Data</h1>
          <p className="text-muted-foreground mt-2">
            Bulk import entities from JSON or CSV files. Each upload form supports automatic slug generation, data validation, and idempotent upserts.
          </p>
          {!isAdmin && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Admin access required.</strong> Please{" "}
                <Link href="/login" className="underline hover:text-foreground">
                  sign in as an admin
                </Link>{" "}
                to access upload forms.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Upload Links Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {uploadLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`block rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-150 ${
                isAdmin
                  ? "hover:border-accent hover:bg-accent/5 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold">{link.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
                <div
                  className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    isAdmin
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Upload
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Supported Formats</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>JSON: Array of objects or single object</li>
                <li>CSV: Comma-separated values with header row</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Automatic slug generation (if not provided)</li>
                <li>Data type transformation (strings to arrays, booleans, etc.)</li>
                <li>Zod validation for each entity type</li>
                <li>Idempotent upserts (safe to re-run)</li>
                <li>Detailed error reporting per row</li>
                <li>Example JSON downloads available</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tips</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Download the example JSON to see the expected format</li>
                <li>Tags and arrays can be comma-separated strings in CSV</li>
                <li>JSONB fields (like steps, maturity_timeline) should be JSON objects</li>
                <li>Boolean fields accept &quot;true&quot;/&quot;1&quot; or &quot;false&quot;/&quot;0&quot; strings</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
