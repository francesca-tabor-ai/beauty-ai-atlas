declare module "dagre" {
  export interface Graph {
    setDefaultEdgeLabel(callback: () => string | Record<string, unknown>): Graph;
    setGraph(options: { rankdir?: "TB" | "BT" | "LR" | "RL"; nodesep?: number; ranksep?: number }): Graph;
    setNode(id: string, node: { width?: number; height?: number }): Graph;
    setEdge(source: string, target: string, edge?: { label?: string }): Graph;
    node(id: string): { x: number; y: number; width?: number; height?: number };
    edges(): Array<{ v: string; w: string }>;
    nodes(): string[];
  }

  export interface GraphOptions {
    nodesep?: number;
    ranksep?: number;
    rankdir?: "TB" | "BT" | "LR" | "RL";
  }

  export class graphlib {
    static Graph: new (options?: GraphOptions) => Graph;
  }

  export function layout(graph: Graph): void;
  
  const dagre: {
    graphlib: {
      Graph: new (options?: GraphOptions) => Graph;
    };
    layout: (graph: Graph) => void;
  };
  
  export default dagre;
}

