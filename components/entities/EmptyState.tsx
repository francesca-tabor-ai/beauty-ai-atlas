import { Search } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your filters or search terms.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}

