export interface Node {
  id: string;
  x?: number;
  y?: number;
}

export interface EdgeDef {
  u: string;
  v: string;
  weight: number;
}

export interface GraphData {
  nodes: Node[];
  edges: EdgeDef[];
}

export type NodeState =
  | "default"
  | "inQueue"
  | "current"
  | "visited"
  | "path"
  | "start"
  | "end";

export type EdgeState = "default" | "relaxed" | "path";

export interface PQEntry {
  node: string;
  priority: number;
  g?: number;
  h?: number;
}

export interface NeighborUpdate {
  node: string;
  oldScore: number;
  newScore: number;
}

export interface AlgoStep {
  stepNumber: number;
  currentNode: string;
  visited: string[];
  inQueue: string[];
  pq: PQEntry[];
  scores: Record<string, number>;
  gScores?: Record<string, number>;
  hScores?: Record<string, number>;
  prev: Record<string, string | null>;
  updatedNeighbors: NeighborUpdate[];
  explanation: string;
  concept: string;
  finalPath?: string[];
}
