"use client";

import { GraphData, AlgoStep } from "@/lib/types";

interface Props {
  graph: GraphData;
  step: AlgoStep | null;
  startNode: string | null;
  endNode: string | null;
  onNodeClick: (id: string) => void;
  pickingStart: boolean;
  pickingEnd: boolean;
}

const ORIG_X_MIN = 200, ORIG_X_MAX = 480;
const ORIG_Y_MIN = 180, ORIG_Y_MAX = 580;
const SVG_W = 680, SVG_H = 540;
const PAD = 52;

function tx(x: number) {
  return PAD + ((x - ORIG_X_MIN) / (ORIG_X_MAX - ORIG_X_MIN)) * (SVG_W - PAD * 2);
}
function ty(y: number) {
  return PAD + ((y - ORIG_Y_MIN) / (ORIG_Y_MAX - ORIG_Y_MIN)) * (SVG_H - PAD * 2);
}

function nodeColor(id: string, step: AlgoStep | null, start: string | null, end: string | null) {
  if (id === start)                          return { fill: "#5b8cff", ring: "#3b6ce0" };
  if (id === end)                            return { fill: "#ff5570", ring: "#cc2244" };
  if (step?.finalPath?.includes(id))         return { fill: "#2de89e", ring: "#1ab87c" };
  if (step?.currentNode === id)              return { fill: "#f5a623", ring: "#c17d0a" };
  if (step?.visited.includes(id))            return { fill: "#2a3352", ring: "#1e2540" };
  if (step?.inQueue.includes(id))            return { fill: "#4a3880", ring: "#3a2860" };
  return                                            { fill: "#161b2a", ring: "#1e2540" };
}

function isPathEdge(u: string, v: string, path: string[] | undefined) {
  if (!path || path.length < 2) return false;
  for (let i = 0; i < path.length - 1; i++) {
    if ((path[i] === u && path[i + 1] === v) || (path[i] === v && path[i + 1] === u)) return true;
  }
  return false;
}

function isRelaxedEdge(u: string, v: string, step: AlgoStep | null) {
  if (!step) return false;
  return step.updatedNeighbors.some(
    (nb) => (step.currentNode === u && nb.node === v) || (step.currentNode === v && nb.node === u)
  );
}

const LEGEND = [
  { color: "#5b8cff", label: "Start" },
  { color: "#ff5570", label: "End" },
  { color: "#f5a623", label: "Current" },
  { color: "#4a3880", label: "Queued" },
  { color: "#2a3352", label: "Visited" },
  { color: "#2de89e", label: "Path" },
];

export default function GraphCanvas({ graph, step, startNode, endNode, onNodeClick, pickingStart, pickingEnd }: Props) {
  const nodeMap = Object.fromEntries(graph.nodes.map((n) => [n.id, n]));
  const cursor = (pickingStart || pickingEnd) ? "crosshair" : "default";

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width: "100%", height: "100%", cursor, display: "block" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle dot grid — less mechanical than lines */}
          <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="#1e2540" />
          </pattern>
          <filter id="node-shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4" />
          </filter>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width={SVG_W} height={SVG_H} fill="#0a0c14" />
        <rect width={SVG_W} height={SVG_H} fill="url(#dots)" />

        {/* Edges */}
        {graph.edges.map((e) => {
          const a = nodeMap[e.u], b = nodeMap[e.v];
          if (!a || !b) return null;
          const x1 = tx(a.x), y1 = ty(a.y), x2 = tx(b.x), y2 = ty(b.y);
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          const onPath = isPathEdge(e.u, e.v, step?.finalPath);
          const relaxed = isRelaxedEdge(e.u, e.v, step);

          return (
            <g key={`${e.u}-${e.v}`}>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={onPath ? "#2de89e" : relaxed ? "#f5a623" : "#1e2540"}
                strokeWidth={onPath ? 2.5 : relaxed ? 2 : 1.2}
                strokeOpacity={onPath ? 1 : relaxed ? 0.85 : 0.7}
              />
              <text
                x={mx} y={my - 3}
                textAnchor="middle"
                fontSize="8.5"
                fontFamily="var(--font-mono), monospace"
                fill={onPath ? "#2de89e" : "#3a4560"}
              >
                {e.weight}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {graph.nodes.map((node) => {
          const x = tx(node.x), y = ty(node.y);
          const { fill, ring } = nodeColor(node.id, step, startNode, endNode);
          const isCurrent = step?.currentNode === node.id && !step?.finalPath;
          const isOnPath = step?.finalPath?.includes(node.id);
          const scoreVal = step?.scores[node.id];
          const showScore = scoreVal !== undefined && scoreVal !== Infinity;

          return (
            <g key={node.id} onClick={() => onNodeClick(node.id)} style={{ cursor: "pointer" }}>
              {/* Invisible large touch target for mobile (44px minimum) */}
              <circle cx={x} cy={y} r={20} fill="transparent" />
              {/* Pulse ring for current node — amber glow */}
              {isCurrent && (
                <circle cx={x} cy={y} r={16} fill="none" stroke="#f5a623" strokeWidth="1.5" opacity="0.4">
                  <animate attributeName="r" values="13;20;13" dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Glow ring for path nodes */}
              {isOnPath && (
                <circle cx={x} cy={y} r={15} fill="none" stroke="#2de89e" strokeWidth="1" opacity="0.25" />
              )}

              {/* Shadow layer */}
              <circle cx={x} cy={y + 1.5} r={11} fill="rgba(0,0,0,0.35)" />

              {/* Main circle */}
              <circle
                cx={x} cy={y} r={11}
                fill={fill}
                stroke={ring}
                strokeWidth="1.5"
              />

              {/* Score inside node */}
              {showScore && (
                <text
                  x={x} y={y + 3.5}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontFamily="var(--font-mono), monospace"
                  fontWeight="700"
                  fill="rgba(255,255,255,0.9)"
                >
                  {Math.round(scoreVal)}
                </text>
              )}

              {/* Label below */}
              <text
                x={x} y={y + 21}
                textAnchor="middle"
                fontSize="8"
                fontFamily="var(--font-sora), sans-serif"
                fontWeight="500"
                fill={isOnPath ? "#2de89e" : isCurrent ? "#f5a623" : node.id === startNode ? "#5b8cff" : node.id === endNode ? "#ff5570" : "#8896b0"}
              >
                {node.id.length > 12 ? node.id.split(" ").slice(0, 2).join(" ") : node.id}
              </text>
              {node.id.split(" ").length > 2 && node.id.length > 12 && (
                <text x={x} y={y + 29} textAnchor="middle" fontSize="8" fontFamily="var(--font-sora), sans-serif" fontWeight="500" fill="#8896b0">
                  {node.id.split(" ").slice(2).join(" ")}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend — bottom left, subtle */}
      <div style={{
        position: "absolute", bottom: 12, left: 14,
        display: "flex", gap: 10, flexWrap: "wrap",
      }}>
        {LEGEND.map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-sora), sans-serif" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
