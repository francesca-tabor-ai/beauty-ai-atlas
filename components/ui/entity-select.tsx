"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Entity {
  id: string;
  slug: string;
  name?: string;
  title?: string;
}

interface EntitySelectProps {
  entityType: string;
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
}

export function EntitySelect({
  entityType,
  value,
  onValueChange,
  placeholder = "Select entity...",
  className,
}: EntitySelectProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch entities when entityType changes
  useEffect(() => {
    if (!entityType) {
      setEntities([]);
      return;
    }

    const fetchEntities = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/entities?type=${entityType}`);
        if (response.ok) {
          const data = await response.json();
          setEntities(data);
        }
      } catch (error) {
        console.error("Error fetching entities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [entityType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEntities = entities.filter((entity) => {
    const displayName = entity.name || entity.title || entity.slug;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedEntity = entities.find((e) => e.id === value);
  const displayName = selectedEntity
    ? selectedEntity.name || selectedEntity.title || selectedEntity.slug
    : placeholder;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
        disabled={!entityType || loading}
      >
        <span className="truncate">
          {loading ? "Loading..." : displayName}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && entityType && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="p-2">
            <Input
              placeholder="Search entities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredEntities.length > 0 ? (
              filteredEntities.map((entity) => {
                const entityDisplayName =
                  entity.name || entity.title || entity.slug;
                const isSelected = entity.id === value;

                return (
                  <button
                    key={entity.id}
                    type="button"
                    className={cn(
                      "w-full text-left px-2 py-1.5 text-sm hover:bg-accent flex items-center gap-2",
                      isSelected && "bg-accent"
                    )}
                    onClick={() => {
                      onValueChange(entity.id);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{entityDisplayName}</span>
                    <span className="ml-auto text-xs text-muted-foreground font-mono">
                      {entity.slug}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                {searchTerm ? "No entities found" : "No entities available"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

