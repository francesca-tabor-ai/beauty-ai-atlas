import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface EntityHeaderProps {
  title: string;
  category?: string | null;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export function EntityHeader({
  title,
  category,
  tags = [],
  createdAt,
  updatedAt,
  metadata,
}: EntityHeaderProps) {
  return (
    <header className="space-y-4 pb-6 border-b">
      {/* Title */}
      <h1 className="text-4xl font-bold">{title}</h1>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {/* Category */}
        {category && (
          <div className="uppercase tracking-wide font-medium">{category}</div>
        )}

        {/* Dates */}
        {createdAt && (
          <div>
            Created {format(new Date(createdAt), "MMMM d, yyyy")}
          </div>
        )}

        {updatedAt && updatedAt !== createdAt && (
          <div>
            Updated {format(new Date(updatedAt), "MMMM d, yyyy")}
          </div>
        )}

        {/* Additional metadata from props */}
        {metadata &&
          Object.entries(metadata).map(([key, value]) => {
            if (value && typeof value === "string") {
              return (
                <div key={key} className="capitalize">
                  {key.replace(/_/g, " ")}: {value}
                </div>
              );
            }
            return null;
          })}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </header>
  );
}

