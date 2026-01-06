"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntitySelect } from "@/components/ui/entity-select";
import { createEdge } from "./actions";
import type { EntityType, RelationType } from "@/lib/supabase/types";

const entityTypes: EntityType[] = [
  "brands",
  "use_cases",
  "ai_specialisms",
  "job_roles",
  "projects",
  "timeline_events",
  "learning_paths",
];

const relationTypes: RelationType[] = [
  "implements",
  "enables",
  "transforms",
  "requires",
  "influences",
  "demonstrates",
  "includes",
  "related_to",
];

export function EdgeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromType, setFromType] = useState<EntityType | "">("");
  const [fromId, setFromId] = useState<string | null>(null);
  const [toType, setToType] = useState<EntityType | "">("");
  const [toId, setToId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createEdge(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      // Reset form
      setFromType("");
      setFromId(null);
      setToType("");
      setToId(null);
      router.refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Relationship</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive text-destructive px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Entity */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">From Entity</h3>
              
              <div className="space-y-2">
                <Label htmlFor="from_type">Entity Type *</Label>
                <Select
                  id="from_type"
                  name="from_type"
                  value={fromType}
                  onChange={(e) => {
                    setFromType(e.target.value as EntityType);
                    setFromId(null); // Reset selection when type changes
                  }}
                  required
                >
                  <option value="">Select type...</option>
                  {entityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="from_id">Entity *</Label>
                <EntitySelect
                  entityType={fromType}
                  value={fromId}
                  onValueChange={setFromId}
                  placeholder="Select entity..."
                />
                <input
                  type="hidden"
                  name="from_id"
                  value={fromId || ""}
                  required
                />
              </div>
            </div>

            {/* To Entity */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">To Entity</h3>
              
              <div className="space-y-2">
                <Label htmlFor="to_type">Entity Type *</Label>
                <Select
                  id="to_type"
                  name="to_type"
                  value={toType}
                  onChange={(e) => {
                    setToType(e.target.value as EntityType);
                    setToId(null); // Reset selection when type changes
                  }}
                  required
                >
                  <option value="">Select type...</option>
                  {entityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to_id">Entity *</Label>
                <EntitySelect
                  entityType={toType}
                  value={toId}
                  onValueChange={setToId}
                  placeholder="Select entity..."
                />
                <input
                  type="hidden"
                  name="to_id"
                  value={toId || ""}
                  required
                />
              </div>
            </div>
          </div>

          {/* Relation Type and Strength */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="relation_type">Relation Type *</Label>
              <Select id="relation_type" name="relation_type" required>
                <option value="">Select relation type...</option>
                {relationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strength">Strength (1-5)</Label>
              <Input
                id="strength"
                name="strength"
                type="number"
                min="1"
                max="5"
                placeholder="Optional"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Relationship strength (1 = weak, 5 = strong)
              </p>
            </div>
          </div>

          {/* Published */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <Label htmlFor="published" className="cursor-pointer">
              Published (visible to public)
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting || !fromId || !toId}>
              {isSubmitting ? "Creating..." : "Create Relationship"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFromType("");
                setFromId(null);
                setToType("");
                setToId(null);
                setError(null);
              }}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

