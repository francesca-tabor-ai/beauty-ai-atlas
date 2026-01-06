import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface FilterBadgeProps {
  label: string;
  value: string;
  onRemove?: () => void;
  href?: string;
}

export function FilterBadge({ label, value, onRemove, href }: FilterBadgeProps) {
  const content = (
    <Badge variant="outline" className="gap-2 flex items-center">
      <span className="text-xs">
        {label}: {value}
      </span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="ml-1 hover:bg-muted rounded-full p-0.5"
          aria-label={`Remove ${label} filter`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );

  if (href && !onRemove) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return <div className="inline-block">{content}</div>;
}

