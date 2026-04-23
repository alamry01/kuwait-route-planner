import { AlgoStep, GraphData, PQEntry } from "./types";
import { getNeighbors } from "./graphData";

function reconstructPath(prev: Record<string, string | null>, end: string): string[] {
  const path: string[] = [];
  let n: string | null = end;
  while (n !== null && n !== undefined) {
    path.unshift(n);
    n = prev[n] ?? null;
  }
  return path;
}

export function runDijkstra(graph: GraphData, start: string, end: string): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const INF = Infinity;

  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited: Set<string> = new Set();

  for (const node of graph.nodes) {
    dist[node.id] = INF;
    prev[node.id] = null;
  }
  dist[start] = 0;

  // Min-heap simulation using a sorted array (for clarity in visualization)
  let pq: PQEntry[] = [{ node: start, priority: 0 }];

  let stepNum = 0;

  steps.push({
    stepNumber: stepNum++,
    currentNode: start,
    visited: [],
    inQueue: [start],
    pq: [{ node: start, priority: 0 }],
    scores: { ...dist },
    prev: { ...prev },
    updatedNeighbors: [],
    explanation: `Initialize: Set distance to "${start}" = 0. All other nodes = ∞. Add "${start}" to the Priority Queue.`,
    concept: "initialization",
  });

  while (pq.length > 0) {
    pq.sort((a, b) => a.priority - b.priority);
    const { node: u } = pq.shift()!;

    if (visited.has(u)) continue;
    visited.add(u);

    if (u === end) {
      const path = reconstructPath(prev, end);
      steps.push({
        stepNumber: stepNum++,
        currentNode: u,
        visited: [...visited],
        inQueue: pq.map((e) => e.node),
        pq: [...pq],
        scores: { ...dist },
        prev: { ...prev },
        updatedNeighbors: [],
        finalPath: path,
        explanation: `Reached destination "${end}"! Distance = ${dist[end]} km. Path: ${path.join(" → ")}`,
        concept: "done",
      });
      break;
    }

    const neighbors = getNeighbors(u, graph.edges);
    const updatedNeighbors = [];

    for (const { dest, weight } of neighbors) {
      if (visited.has(dest)) continue;
      const alt = dist[u] + weight;
      if (alt < dist[dest]) {
        const oldDist = dist[dest];
        dist[dest] = alt;
        prev[dest] = u;
        pq.push({ node: dest, priority: alt });
        updatedNeighbors.push({ node: dest, oldScore: oldDist, newScore: alt });
      }
    }

    const sortedPQ = [...pq].sort((a, b) => a.priority - b.priority);

    steps.push({
      stepNumber: stepNum++,
      currentNode: u,
      visited: [...visited],
      inQueue: sortedPQ.map((e) => e.node),
      pq: sortedPQ,
      scores: { ...dist },
      prev: { ...prev },
      updatedNeighbors,
      explanation: buildDijkstraExplanation(u, dist[u], updatedNeighbors),
      concept: "relax",
    });
  }

  return steps;
}

function buildDijkstraExplanation(
  node: string,
  dist: number,
  updates: Array<{ node: string; oldScore: number; newScore: number }>
): string {
  let msg = `Dequeue "${node}" (dist=${dist} km) — mark as visited. `;
  if (updates.length === 0) {
    msg += "No neighbors were improved.";
  } else {
    const parts = updates.map((u) => {
      const old = u.oldScore === Infinity ? "∞" : `${u.oldScore}`;
      return `"${u.node}": ${old} → ${u.newScore}`;
    });
    msg += `Relax edges: ${parts.join(", ")}.`;
  }
  return msg;
}
