import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ArrowRight } from "lucide-react";

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
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Upload Data</h1>
          <p className="text-muted-foreground mt-2">
            Bulk import entities from JSON or CSV files. Each upload form supports automatic slug generation, data validation, and idempotent upserts.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Note:</strong> Upload forms require admin authentication. If you&apos;re not an admin, you&apos;ll be redirected to the home page when accessing upload forms.
          </p>
        </div>

        {/* Upload Links Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {uploadLinks.map((link) => (
            <Card key={link.href} className="hover:border-accent transition-colors duration-150">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5 text-accent" />
                  {link.label}
                </CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={link.href}>
                    Upload
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
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

