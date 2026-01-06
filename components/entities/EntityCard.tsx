import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
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
  slug: _slug,
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
        "group relative block rounded-2xl border border-border bg-card p-6 transition-all duration-150 ease-out cursor-pointer",
        "hover:-translate-y-[2px] hover:shadow-md hover:border-accent",
        "active:translate-y-0 active:shadow-sm",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        "motion-reduce:transition-none motion-reduce:hover:transform-none",
        className
      )}
    >
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold group-hover:text-accent transition-colors duration-150 group-hover:underline underline-offset-4">
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

        {/* Chevron affordance */}
        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-150 motion-reduce:transition-none" />
      </div>
    </Link>
  );
}

