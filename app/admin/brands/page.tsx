import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DeleteBrandButton } from "./delete-button";

export default async function AdminBrandsPage() {
  const supabase = await createClient();

  // Fetch all brands (admin can see all, published and unpublished)
  const { data: brands, error } = await supabase
    .from("brands")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Brands</h1>
        <p className="text-destructive">Error loading brands: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-muted-foreground mt-1">
            Manage all brands ({brands?.length || 0} total)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/brands/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {brands && brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{brand.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                      {brand.slug}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {brand.category || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {brand.published ? (
                        <Badge variant="default">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/brands/${brand.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteBrandButton brandId={brand.id} brandName={brand.name} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No brands found. Create your first brand to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
