import { EdgeForm } from "./edge-form";
import { EdgeList } from "./edge-list";

export default function AdminEdgesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Edge Builder</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage relationships between entities
        </p>
      </div>

      {/* Create Form */}
      <EdgeForm />

      {/* Edge List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">All Relationships</h2>
        <EdgeList />
      </div>
    </div>
  );
}
