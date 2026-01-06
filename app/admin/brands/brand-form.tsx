"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSlug } from "./actions";
import type { BrandFormData } from "./actions";

interface BrandFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  initialData?: {
    name: string;
    slug: string;
    description: string | null;
    website: string | null;
    logo_url: string | null;
    category: string | null;
    headquarters: string | null;
    founded_year: number | null;
    tags: string[];
    published: boolean;
  };
}

export function BrandForm({ action, initialData }: BrandFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(!initialData);

  // Auto-generate slug from name when name changes (only if creating new)
  useEffect(() => {
    if (autoGenerateSlug && name) {
      setSlug(generateSlug(name));
    }
  }, [name, autoGenerateSlug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., L'Oréal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setAutoGenerateSlug(false);
                }}
                required
                pattern="^[a-z0-9-]+$"
                placeholder="e.g., loreal"
                className="flex-1"
              />
              {!initialData && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAutoGenerateSlug(true);
                    setSlug(generateSlug(name));
                  }}
                >
                  Auto-generate
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Lowercase alphanumeric with hyphens only
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description || ""}
              rows={4}
              placeholder="Brand description..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              name="website"
              type="url"
              defaultValue={initialData?.website || ""}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              name="logo_url"
              type="url"
              defaultValue={initialData?.logo_url || ""}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              name="category"
              defaultValue={initialData?.category || ""}
            >
              <option value="">Select a category</option>
              <option value="Luxury & Mass Market">Luxury & Mass Market</option>
              <option value="Indie & Niche">Indie & Niche</option>
              <option value="K-Beauty">K-Beauty</option>
              <option value="Tech-Forward">Tech-Forward</option>
              <option value="Sustainability-Focused">Sustainability-Focused</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headquarters">Headquarters</Label>
            <Input
              id="headquarters"
              name="headquarters"
              defaultValue={initialData?.headquarters || ""}
              placeholder="e.g., Clichy, France"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="founded_year">Founded Year</Label>
            <Input
              id="founded_year"
              name="founded_year"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              defaultValue={initialData?.founded_year || ""}
              placeholder="e.g., 1909"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={initialData?.tags?.join(", ") || ""}
              placeholder="luxury, k-beauty, sustainability (comma-separated)"
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked={initialData?.published || false}
              className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <Label htmlFor="published" className="cursor-pointer">
              Published (visible to public)
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Brand" : "Create Brand"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

