import { Suspense } from "react";
import { GraphVisualization } from "@/components/graph/GraphVisualization";

interface MapPageProps {
  searchParams: Promise<{ entity?: string }>;
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const entityParam = params.entity || "brands:loreal"; // Default starting entity

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Knowledge Graph Explorer</h1>
        <p className="text-muted-foreground">
          Explore relationships between entities in the Beauty × AI Atlas
        </p>
      </div>

      <Suspense fallback={<div className="h-[600px] flex items-center justify-center">Loading graph...</div>}>
        <GraphVisualization entityParam={entityParam} />
      </Suspense>
    </div>
  );
}
