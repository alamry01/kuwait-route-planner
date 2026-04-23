"use client";

import { useState } from "react";
import { AlgoStep } from "@/lib/types";

type Tab = "trace" | "theory";
type TheoryTab = "Graph" | "Queue" | "Dijkstra" | "A*" | "Compare";

interface Props {
  steps: AlgoStep[];
  currentIndex: number;
  algorithm: "dijkstra" | "astar" | "compare";
  dijkstraSteps?: AlgoStep[];
  astarSteps?: AlgoStep[];
  dijkstraIndex?: number;
  astarIndex?: number;
}

function TraceLog({ steps, currentIndex, algorithm }: {
  steps: AlgoStep[];
  currentIndex: number;
  algorithm: "dijkstra" | "astar";
}) {
  const visible = steps.slice(0, currentIndex + 1).reverse();
  const finalStep = steps.find((s) => s.concept === "done");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Final result */}
      {finalStep?.finalPath && (
        <div style={{
          margin: "0 0 1px",
          padding: "10px 16px",
          background: "rgba(45,232,158,0.06)",
          borderBottom: "1px solid rgba(45,232,158,0.15)",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--mint)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>
            Shortest path found
          </div>
          <div style={{ fontSize: 11, color: "#b0c8b0", lineHeight: 1.6 }}>
            {finalStep.finalPath.join(" → ")}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--mint)", marginTop: 4, fontFamily: "var(--font-mono), monospace" }}>
            {algorithm === "dijkstra"
              ? `${Math.round(finalStep.scores[finalStep.currentNode])} km`
              : `${Math.round(finalStep.gScores?.[finalStep.currentNode] ?? 0)} km`}
          </div>
        </div>
      )}

      {/* Step log */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
        {visible.length === 0 ? (
          <div style={{ padding: "20px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Select start and end to run the algorithm.</div>
          </div>
        ) : (
          visible.map((step, i) => {
            const isLatest = i === 0;
            const isDone = step.concept === "done";

            return (
              <div key={step.stepNumber} style={{
                padding: "8px 16px",
                borderBottom: "1px solid var(--border)",
                opacity: isLatest ? 1 : 0.55,
                transition: "opacity 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                    background: isDone ? "var(--mint)" : isLatest ? "var(--amber)" : "var(--border-soft)",
                  }} />
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: isDone ? "var(--mint)" : isLatest ? "var(--amber)" : "var(--text)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {step.currentNode}
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--muted)", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                    {step.stepNumber + 1}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: isLatest ? "#c0ccdd" : "var(--muted)", lineHeight: 1.55, margin: 0 }}>
                  {step.explanation}
                </p>
                {/* Updated neighbors */}
                {step.updatedNeighbors.length > 0 && (
                  <div style={{ marginTop: 5, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {step.updatedNeighbors.map((nb) => (
                      <span key={nb.node} style={{
                        fontSize: 10,
                        padding: "2px 7px",
                        borderRadius: 8,
                        background: "rgba(91,140,255,0.1)",
                        border: "1px solid rgba(91,140,255,0.2)",
                        color: "var(--blue)",
                        fontFamily: "var(--font-mono), monospace",
                      }}>
                        {nb.node.split(" ")[0]} {nb.newScore.toFixed(0)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function CompareTrace({ dSteps, aSteps, dIndex, aIndex }: {
  dSteps: AlgoStep[]; aSteps: AlgoStep[];
  dIndex: number; aIndex: number;
}) {
  const dStep = dSteps[dIndex];
  const aStep = aSteps[aIndex];
  const dFinal = dSteps[dSteps.length - 1];
  const aFinal = aSteps[aSteps.length - 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {dFinal?.finalPath && aFinal?.finalPath && (
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            {([
              { label: "Dijkstra visited", value: dFinal.visited.length, color: "var(--blue)" },
              { label: "A* visited", value: aFinal.visited.length, color: "var(--violet)" },
            ] as const).map(({ label, value, color }) => (
              <div key={label} style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "8px 10px",
              }}>
                <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: "var(--font-mono), monospace" }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{
            padding: "8px 10px",
            borderRadius: 8,
            background: "var(--mint-glow)",
            border: "1px solid rgba(45,232,158,0.15)",
            fontSize: 11,
            color: "var(--mint)",
            fontWeight: 600,
            textAlign: "center",
          }}>
            A* explored {Math.max(0, dFinal.visited.length - aFinal.visited.length)} fewer nodes
          </div>
        </div>
      )}
      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", borderRight: "1px solid var(--border)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--blue)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>Dijkstra</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{dStep?.currentNode}</div>
          <p style={{ fontSize: 10.5, color: "var(--muted)", lineHeight: 1.55 }}>{dStep?.explanation}</p>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--violet)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>A*</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{aStep?.currentNode}</div>
          <p style={{ fontSize: 10.5, color: "var(--muted)", lineHeight: 1.55 }}>{aStep?.explanation}</p>
        </div>
      </div>
    </div>
  );
}

const THEORY_TABS: TheoryTab[] = ["Graph", "Queue", "Dijkstra", "A*", "Compare"];

const THEORY: Record<TheoryTab, React.ReactNode> = {
  Graph: (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.65 }}>
        A <strong style={{ color: "var(--text)" }}>graph</strong> is a set of <strong style={{ color: "var(--text)" }}>nodes</strong> (locations) linked by <strong style={{ color: "var(--text)" }}>weighted edges</strong> (roads with distances).
      </p>
      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, fontFamily: "var(--font-mono), monospace", fontSize: 11, lineHeight: 1.7 }}>
        <span style={{ color: "#566080" }}>// adjacency list</span>{"\n"}
        <span style={{ color: "var(--blue)" }}>"Kuwait City"</span> → [{"\n"}
        {"  "}<span style={{ color: "var(--mint)" }}>Shuwaikh(5)</span>, Hawally(6), ...{"\n"}
        ]
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[["Node", "A location"], ["Edge", "A road"], ["Weight", "Distance km"], ["Adj. list", "Neighbor map"]].map(([t, d]) => (
          <div key={t} style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--blue)", marginBottom: 2 }}>{t}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  ),
  Queue: (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.65 }}>
        A <strong style={{ color: "var(--text)" }}>min-heap</strong> that always dequeues the node with the smallest distance first. O(log n) insert and remove.
      </p>
      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, fontFamily: "var(--font-mono), monospace", fontSize: 11, lineHeight: 1.7 }}>
        <span style={{ color: "var(--amber)" }}>enqueue</span>(node, dist) → O(log n){"\n"}
        <span style={{ color: "var(--amber)" }}>dequeue</span>()         → O(log n){"\n"}
        <span style={{ color: "var(--amber)" }}>peek</span>()            → O(1)
      </div>
      {[{ node: "Shuwaikh", d: 5 }, { node: "Hawally", d: 6 }, { node: "Farwaniya", d: 12 }].map((e, i) => (
        <div key={e.node} style={{
          display: "flex", justifyContent: "space-between", padding: "6px 10px", borderRadius: 7,
          border: `1px solid ${i === 0 ? "rgba(245,166,35,0.3)" : "var(--border)"}`,
          background: i === 0 ? "rgba(245,166,35,0.07)" : "var(--panel)",
          fontSize: 11,
        }}>
          <span style={{ color: i === 0 ? "var(--amber)" : "var(--text)" }}>{i === 0 ? "→ " : "  "}{e.node}</span>
          <span style={{ color: "var(--mint)", fontFamily: "var(--font-mono), monospace" }}>{e.d} km</span>
        </div>
      ))}
    </div>
  ),
  Dijkstra: (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.65 }}>
        Explores nodes from nearest outward, <strong style={{ color: "var(--mint)" }}>relaxing</strong> edges greedily. Guarantees shortest path on non-negative weights.
      </p>
      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, fontFamily: "var(--font-mono), monospace", fontSize: 11, lineHeight: 1.75 }}>
        dist[start] = 0; dist[∗] = ∞{"\n"}
        <span style={{ color: "var(--blue)" }}>while</span> PQ not empty:{"\n"}
        {"  "}u = PQ.dequeue(){"\n"}
        {"  "}mark u visited{"\n"}
        {"  "}<span style={{ color: "var(--blue)" }}>for</span> v in neighbors(u):{"\n"}
        {"    "}<span style={{ color: "var(--amber)" }}>if</span> dist[u]+w &lt; dist[v]:{"\n"}
        {"      "}dist[v] = dist[u]+w{"\n"}
        {"      "}PQ.add(v, dist[v])
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)" }}>Complexity: <code style={{ color: "var(--text)" }}>O((V+E) log V)</code></p>
    </div>
  ),
  "A*": (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.65 }}>
        Dijkstra + a <strong style={{ color: "var(--violet)" }}>heuristic h(n)</strong> that estimates remaining cost. Guides search toward the goal — visits fewer nodes.
      </p>
      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, fontFamily: "var(--font-mono), monospace", fontSize: 11, lineHeight: 1.75 }}>
        <span style={{ color: "#566080" }}>// f(n) = g(n) + h(n)</span>{"\n"}
        <span style={{ color: "var(--blue)" }}>g(n)</span>  actual cost start→n{"\n"}
        <span style={{ color: "var(--violet)" }}>h(n)</span>  heuristic: estimate n→goal{"\n"}
        <span style={{ color: "var(--amber)" }}>f(n)</span>  total estimated cost{"\n\n"}
        h = euclidean × 0.3{"\n"}
        <span style={{ color: "#566080" }}>// ×0.3 keeps h admissible</span>
      </div>
    </div>
  ),
  Compare: (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--muted)", fontWeight: 500 }}></th>
            <th style={{ padding: "6px 8px", color: "var(--blue)", fontWeight: 700 }}>Dijkstra</th>
            <th style={{ padding: "6px 8px", color: "var(--violet)", fontWeight: 700 }}>A*</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Priority", "distance", "f = g + h"],
            ["Direction", "uniform", "toward goal"],
            ["Heuristic", "no", "yes"],
            ["Nodes visited", "more", "fewer"],
            ["Optimal?", "always", "if h ≤ true cost"],
          ].map(([p, d, a]) => (
            <tr key={p} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "6px 8px", color: "var(--muted)" }}>{p}</td>
              <td style={{ padding: "6px 8px", textAlign: "center", color: "var(--blue)" }}>{d}</td>
              <td style={{ padding: "6px 8px", textAlign: "center", color: "var(--violet)" }}>{a}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export default function LearnPanel({ steps, currentIndex, algorithm, dijkstraSteps, astarSteps, dijkstraIndex, astarIndex }: Props) {
  const [tab, setTab] = useState<Tab>("trace");
  const [theoryTab, setTheoryTab] = useState<TheoryTab>("Graph");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Panel tabs */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        padding: "0 16px",
      }}>
        {(["trace", "theory"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "11px 14px",
              border: "none",
              borderBottom: `2px solid ${tab === t ? "var(--blue)" : "transparent"}`,
              background: "transparent",
              color: tab === t ? "var(--text)" : "var(--muted)",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--font-sora), sans-serif",
              cursor: "pointer",
              transition: "color 0.15s",
              textTransform: "capitalize",
            }}
          >
            {t === "trace" ? "Operations" : "Theory"}
          </button>
        ))}
      </div>

      {tab === "trace" ? (
        algorithm === "compare" && dijkstraSteps && astarSteps ? (
          <CompareTrace
            dSteps={dijkstraSteps}
            aSteps={astarSteps}
            dIndex={dijkstraIndex ?? 0}
            aIndex={astarIndex ?? 0}
          />
        ) : (
          <TraceLog steps={steps} currentIndex={currentIndex} algorithm={algorithm === "compare" ? "dijkstra" : algorithm} />
        )
      ) : (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          {/* Theory sub-tabs */}
          <div style={{ display: "flex", gap: 2, padding: "8px 12px", flexWrap: "wrap", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            {THEORY_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTheoryTab(t)}
                style={{
                  padding: "4px 11px",
                  borderRadius: 6,
                  border: "none",
                  background: theoryTab === t ? "var(--blue-dim)" : "transparent",
                  color: theoryTab === t ? "var(--blue)" : "var(--muted)",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "var(--font-sora), sans-serif",
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
            {THEORY[theoryTab]}
          </div>
        </div>
      )}
    </div>
  );
}
