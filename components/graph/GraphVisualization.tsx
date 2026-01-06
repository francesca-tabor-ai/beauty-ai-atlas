"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { createClient } from "@/lib/supabase/client";
import { getRelatedEntities } from "@/lib/graph/getRelated";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { EntityType } from "@/lib/supabase/types";

// Entity type colors
const entityColors: Record<EntityType, string> = {
  brands: "#3b82f6", // blue
  use_cases: "#10b981", // green
  ai_specialisms: "#8b5cf6", // purple
  job_roles: "#f59e0b", // amber
  projects: "#ef4444", // red
  timeline_events: "#06b6d4", // cyan
  learning_paths: "#ec4899", // pink
};

// Entity type labels
const entityLabels: Record<EntityType, string> = {
  brands: "Brands",
  use_cases: "Use Cases",
  ai_specialisms: "AI Specialisms",
  job_roles: "Job Roles",
  projects: "Projects",
  timeline_events: "Timeline Events",
  learning_paths: "Learning Paths",
};

// URL mapping for entity types
const entityUrlMap: Record<EntityType, string> = {
  brands: "/brands",
  use_cases: "/use-cases",
  ai_specialisms: "/ai",
  job_roles: "/jobs",
  projects: "/projects",
  timeline_events: "/timeline",
  learning_paths: "/paths",
};

interface GraphVisualizationProps {
  entityParam: string; // Format: "entityType:slug"
}

export function GraphVisualization({ entityParam }: GraphVisualizationProps) {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(entityParam);

  // Parse entity param
  const parseEntityParam = (param: string): { type: EntityType; slug: string } | null => {
    const [type, ...slugParts] = param.split(":");
    if (!type || !slugParts.length) return null;
    const slug = slugParts.join(":");
    if (!Object.keys(entityColors).includes(type)) return null;
    return { type: type as EntityType, slug };
  };

  // Fetch graph data
  const fetchGraphData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const parsed = parseEntityParam(entityParam);
    if (!parsed) {
      setError("Invalid entity parameter format. Use: entityType:slug");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Fetch starting entity
      const { data: startingEntityData, error: entityError } = await supabase
        .from(parsed.type)
        .select("*")
        .eq("slug", parsed.slug)
        .eq("published", true)
        .single();

      if (entityError || !startingEntityData) {
        setError(`Entity not found: ${parsed.type}:${parsed.slug}`);
        setLoading(false);
        return;
      }

      const startingEntity = startingEntityData;

      // Fetch related entities
      const related = await getRelatedEntities(
        supabase,
        parsed.type,
        startingEntity.id
      );

      // Build nodes and edges
      const graphNodes: Node[] = [];
      const graphEdges: Edge[] = [];

      // Starting node (centered, larger)
      // Entity can have either 'name' or 'title' field depending on type
      const startingEntityRecord = startingEntity as Record<string, unknown>;
      const startingNodeTitle =
        (startingEntityRecord.name as string | undefined) ||
        (startingEntityRecord.title as string | undefined) ||
        startingEntity.slug;
      graphNodes.push({
        id: startingEntity.id,
        type: "default",
        data: {
          label: startingNodeTitle,
          entityType: parsed.type,
          slug: startingEntity.slug,
        },
        position: { x: 0, y: 0 }, // Will be positioned by dagre
        style: {
          background: entityColors[parsed.type],
          color: "#fff",
          border: "2px solid #000",
          width: 200,
          height: 80,
          fontSize: 14,
          fontWeight: "bold",
        },
      });

      // Related nodes
      let nodeYOffset = 0;
      Object.entries(related).forEach(([entityType, entities]) => {
        entities.forEach((entity: { id: string; slug: string; title: string; relation: string }) => {
          graphNodes.push({
            id: entity.id,
            type: "default",
            data: {
              label: entity.title,
              entityType: entityType as EntityType,
              slug: entity.slug,
            },
            position: { x: 0, y: nodeYOffset }, // Will be positioned by dagre
            style: {
              background: entityColors[entityType as EntityType],
              color: "#fff",
              width: 180,
              height: 60,
              fontSize: 12,
            },
          });

          // Create edge from starting node to related node
          graphEdges.push({
            id: `${startingEntity.id}-${entity.id}`,
            source: startingEntity.id,
            target: entity.id,
            label: entity.relation.replace(/_/g, " "),
            type: "smoothstep",
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: {
              stroke: "#94a3b8",
              strokeWidth: 2,
            },
            labelStyle: {
              fill: "#64748b",
              fontSize: 10,
            },
          });

          nodeYOffset += 100;
        });
      });

      // Apply dagre layout
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
      dagreGraph.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 100 });

      graphNodes.forEach((node) => {
        const nodeWidth = typeof node.style?.width === "number" ? node.style.width : 180;
        const nodeHeight = typeof node.style?.height === "number" ? node.style.height : 60;
        dagreGraph.setNode(node.id, {
          width: nodeWidth,
          height: nodeHeight,
        });
      });

      graphEdges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      // Update node positions
      const layoutedNodes = graphNodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const nodeWidth = typeof node.style?.width === "number" ? node.style.width : 180;
        const nodeHeight = typeof node.style?.height === "number" ? node.style.height : 60;
        return {
          ...node,
          position: {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
          },
        };
      });

      setNodes(layoutedNodes);
      setEdges(graphEdges);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching graph data:", err);
      setError(err instanceof Error ? err.message : "Failed to load graph");
      setLoading(false);
    }
  }, [entityParam, setNodes, setEdges]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  // Handle node click
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const entityType = node.data.entityType as EntityType;
      const slug = node.data.slug;
      const baseUrl = entityUrlMap[entityType];
      router.push(`${baseUrl}/${slug}`);
    },
    [router]
  );

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput) {
      router.push(`/map?entity=${encodeURIComponent(searchInput)}`);
    }
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center border rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => fetchGraphData()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="brands:loreal, use_cases:virtual-try-on, etc."
              className="flex-1"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Load Graph
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Graph */}
      <div className="h-[600px] border rounded-lg bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold mb-4">Entity Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(entityColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm">{entityLabels[type as EntityType]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

