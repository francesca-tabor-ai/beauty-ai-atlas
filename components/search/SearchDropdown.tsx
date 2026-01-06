"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  rank: number;
}

interface SearchResults {
  [entityType: string]: SearchResult[];
}

// Entity type labels and URL mappings
const entityLabels: Record<string, string> = {
  brands: "Brands",
  use_cases: "Use Cases",
  ai_specialisms: "AI Specialisms",
  job_roles: "Job Roles",
  projects: "Projects",
  timeline_events: "Timeline Events",
  learning_paths: "Learning Paths",
};

const entityUrlMap: Record<string, string> = {
  brands: "/brands",
  use_cases: "/use-cases",
  ai_specialisms: "/ai",
  job_roles: "/jobs",
  projects: "/projects",
  timeline_events: "/timeline",
  learning_paths: "/paths",
};

export function SearchDropdown() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < 2) {
      setResults({});
      setIsOpen(false);
      return;
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || {});
          setIsOpen(Object.keys(data.results || {}).length > 0);
        } else {
          setResults({});
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults({});
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

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

  const handleResultClick = (entityType: string, slug: string) => {
    const baseUrl = entityUrlMap[entityType] || `/${entityType}`;
    router.push(`${baseUrl}/${slug}`);
    setIsOpen(false);
    setQuery("");
  };

  const totalResults = Object.values(results).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            if (totalResults > 0) {
              setIsOpen(true);
            }
          }}
          className="w-64 pl-8"
        />
        {loading && (
          <Loader2 className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && totalResults > 0 && (
        <Card className="absolute z-50 mt-2 w-96 max-h-[400px] overflow-y-auto">
          <CardContent className="p-0">
            <div className="divide-y">
              {Object.entries(results).map(([entityType, items]) => (
                <div key={entityType} className="p-2">
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                    {entityLabels[entityType] || entityType}
                  </div>
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      href={`${entityUrlMap[entityType]}/${item.slug}`}
                      onClick={() => handleResultClick(entityType, item.slug)}
                      className="block px-2 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {item.slug}
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isOpen && query.trim().length >= 2 && !loading && totalResults === 0 && (
        <Card className="absolute z-50 mt-2 w-96">
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            No results found for "{query}"
          </CardContent>
        </Card>
      )}
    </div>
  );
}

