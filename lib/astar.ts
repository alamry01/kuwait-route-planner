import { AlgoStep, GraphData, PQEntry } from "./types";
import { getNeighbors, nodeLatLngs } from "./graphData";

function heuristic(_graph: GraphData, a: string, b: string): number {
  const [latA, lngA] = nodeLatLngs[a] ?? [0, 0];
  const [latB, lngB] = nodeLatLngs[b] ?? [0, 0];
  const dlat = (latA - latB) * 111;
  const dlng = (lngA - lngB) * 97;
  return Math.sqrt(dlat * dlat + dlng * dlng);
}

function reconstructPath(prev: Record<string, string | null>, end: string): string[] {
  const path: string[] = [];
  let n: string | null = end;
  while (n !== null && n !== undefined) {
    path.unshift(n);
    n = prev[n] ?? null;
  }
  return path;
}

export function runAStar(graph: GraphData, start: string, end: string): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const INF = Infinity;

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const hScore: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited: Set<string> = new Set();

  for (const node of graph.nodes) {
    gScore[node.id] = INF;
    fScore[node.id] = INF;
    prev[node.id] = null;
  }

  gScore[start] = 0;
  const h0 = heuristic(graph,start, end);
  fScore[start] = h0;
  hScore[start] = h0;

  let pq: PQEntry[] = [{ node: start, priority: h0, g: 0, h: h0 }];

  let stepNum = 0;

  steps.push({
    stepNumber: stepNum++,
    currentNode: start,
    visited: [],
    inQueue: [start],
    pq: [{ node: start, priority: h0, g: 0, h: h0 }],
    scores: { ...fScore },
    gScores: { ...gScore },
    hScores: { ...hScore },
    prev: { ...prev },
    updatedNeighbors: [],
    explanation: `Initialize: g("${start}") = 0, h("${start}") = ${h0.toFixed(1)} (heuristic to goal), f = ${h0.toFixed(1)}. Add to Priority Queue.`,
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
        scores: { ...fScore },
        gScores: { ...gScore },
        hScores: { ...hScore },
        prev: { ...prev },
        updatedNeighbors: [],
        finalPath: path,
        explanation: `Reached destination "${end}"! g = ${gScore[end].toFixed(0)} km. Path: ${path.join(" → ")}`,
        concept: "done",
      });
      break;
    }

    const neighbors = getNeighbors(u, graph.edges);
    const updatedNeighbors = [];

    for (const { dest, weight } of neighbors) {
      if (visited.has(dest)) continue;
      const tentG = gScore[u] + weight;
      if (tentG < gScore[dest]) {
        const oldF = fScore[dest];
        const h = heuristic(graph,dest, end);
        gScore[dest] = tentG;
        hScore[dest] = h;
        fScore[dest] = tentG + h;
        prev[dest] = u;
        pq.push({ node: dest, priority: tentG + h, g: tentG, h });
        updatedNeighbors.push({ node: dest, oldScore: oldF, newScore: tentG + h });
      }
    }

    const sortedPQ = [...pq].sort((a, b) => a.priority - b.priority);

    steps.push({
      stepNumber: stepNum++,
      currentNode: u,
      visited: [...visited],
      inQueue: sortedPQ.map((e) => e.node),
      pq: sortedPQ,
      scores: { ...fScore },
      gScores: { ...gScore },
      hScores: { ...hScore },
      prev: { ...prev },
      updatedNeighbors,
      explanation: buildAStarExplanation(u, gScore[u], heuristic(graph,u, end), updatedNeighbors),
      concept: "relax",
    });
  }

  return steps;
}

function buildAStarExplanation(
  node: string,
  g: number,
  h: number,
  updates: Array<{ node: string; oldScore: number; newScore: number }>
): string {
  const f = g + h;
  let msg = `Dequeue "${node}" — g=${g.toFixed(0)}, h=${h.toFixed(1)}, f=${f.toFixed(1)}. Mark as visited. `;
  if (updates.length === 0) {
    msg += "No neighbors improved.";
  } else {
    const parts = updates.map((u) => {
      const old = u.oldScore === Infinity ? "∞" : u.oldScore.toFixed(1);
      return `"${u.node}": f ${old} → ${u.newScore.toFixed(1)}`;
    });
    msg += `Update neighbors: ${parts.join(", ")}.`;
  }
  return msg;
}
