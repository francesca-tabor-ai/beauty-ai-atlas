import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminUseCasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Use Cases</h1>
          <p className="text-muted-foreground mt-1">
            Manage all use cases
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/use-cases/upload">
              <Plus className="mr-2 h-4 w-4" />
              Upload
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/use-cases/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

