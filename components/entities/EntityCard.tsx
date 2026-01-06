import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EntityCardProps {
  title: string;
  description?: string | null;
  slug: string;
  href: string;
  tags?: string[];
  category?: string | null;
  className?: string;
}

export function EntityCard({
  title,
  description,
  slug,
  href,
  tags = [],
  category,
  className,
}: EntityCardProps) {
  // Truncate description to 150 characters
  const truncatedDescription = description
    ? description.length > 150
      ? `${description.substring(0, 150)}...`
      : description
    : null;

  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-md",
        className
      )}
    >
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Category */}
        {category && (
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {category}
          </div>
        )}

        {/* Description */}
        {truncatedDescription && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncatedDescription}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

