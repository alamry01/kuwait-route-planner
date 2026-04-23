"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import GraphCanvas from "@/components/GraphCanvas";
import LearnPanel from "@/components/LearnPanel";
import { AlgoStep } from "@/lib/types";
import { kuwaitGraph } from "@/lib/graphData";
import { runDijkstra } from "@/lib/dijkstra";
import { runAStar } from "@/lib/astar";

type Algorithm = "dijkstra" | "astar" | "compare";
const SPEEDS = [1400, 800, 400, 180];

export default function Visualizer() {
  const router = useRouter();
  const [algorithm, setAlgorithm] = useState<Algorithm>("dijkstra");
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");
  const [learnOpen, setLearnOpen] = useState(false);

  const [dSteps, setDSteps] = useState<AlgoStep[]>([]);
  const [dIndex, setDIndex] = useState(0);
  const [aSteps, setASteps] = useState<AlgoStep[]>([]);
  const [aIndex, setAIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speedLevel, setSpeedLevel] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const primarySteps = algorithm === "astar" ? aSteps : dSteps;
  const primaryIndex = algorithm === "astar" ? aIndex : dIndex;
  const primaryStep = primarySteps[primaryIndex] ?? null;
  const hasRun = primarySteps.length > 0;
  const atEnd = primaryIndex >= primarySteps.length - 1;

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // Auto-run when both nodes selected
  useEffect(() => {
    if (!startNode || !endNode) return;
    stopTimer(); setIsPlaying(false);
    if (algorithm !== "astar") { setDSteps(runDijkstra(kuwaitGraph, startNode, endNode)); setDIndex(0); }
    if (algorithm !== "dijkstra") { setASteps(runAStar(kuwaitGraph, startNode, endNode)); setAIndex(0); }
  }, [startNode, endNode, algorithm, stopTimer]);

  useEffect(() => {
    if (!isPlaying) { stopTimer(); return; }
    timerRef.current = setInterval(() => {
      if (algorithm === "dijkstra") {
        setDIndex((p) => { if (p >= dSteps.length - 1) { setIsPlaying(false); return p; } return p + 1; });
      } else if (algorithm === "astar") {
        setAIndex((p) => { if (p >= aSteps.length - 1) { setIsPlaying(false); return p; } return p + 1; });
      } else {
        setDIndex((p) => Math.min(p + 1, dSteps.length - 1));
        setAIndex((p) => { if (p >= aSteps.length - 1) { setIsPlaying(false); return p; } return p + 1; });
      }
    }, SPEEDS[speedLevel]);
    return stopTimer;
  }, [isPlaying, speedLevel, algorithm, dSteps.length, aSteps.length, stopTimer]);

  const stepPrev = () => {
    stopTimer(); setIsPlaying(false);
    if (algorithm !== "astar") setDIndex((p) => Math.max(p - 1, 0));
    if (algorithm !== "dijkstra") setAIndex((p) => Math.max(p - 1, 0));
  };
  const stepNext = () => {
    stopTimer(); setIsPlaying(false);
    if (algorithm !== "astar") setDIndex((p) => Math.min(p + 1, dSteps.length - 1));
    if (algorithm !== "dijkstra") setAIndex((p) => Math.min(p + 1, aSteps.length - 1));
  };
  const restart = useCallback(() => {
    stopTimer(); setIsPlaying(false); setDIndex(0); setAIndex(0);
  }, [stopTimer]);

  const resetSelection = useCallback(() => {
    stopTimer(); setIsPlaying(false);
    setStartNode(""); setEndNode("");
    setDSteps([]); setASteps([]);
    setDIndex(0); setAIndex(0);
  }, [stopTimer]);

  const handleNodeClick = useCallback((id: string) => {
    if (!startNode) { setStartNode(id); return; }
    if (!endNode && id !== startNode) { setEndNode(id); }
  }, [startNode, endNode]);

  const nodes = kuwaitGraph.nodes.map((n) => n.id);

  return (
    <div style={{ background: "var(--bg)", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header */}
      <header style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0 20px",
        height: 52,
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexShrink: 0,
      }}>
        {/* Back */}
        <button
          onClick={() => router.push("/")}
          style={{
            width: 30, height: 30, borderRadius: 7,
            border: "1px solid var(--border-soft)",
            background: "transparent",
            color: "var(--muted)",
            cursor: "pointer", fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "color 0.15s, border-color 0.15s",
            flexShrink: 0,
          }}
          title="Home"
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--blue)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)"; }}
        >←</button>

        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", flexShrink: 0 }}>
          Route Planner
        </span>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />

        {/* Algorithm tabs */}
        <div className="algo-tabs" style={{ flexShrink: 0 }}>
          {(["dijkstra", "astar", "compare"] as Algorithm[]).map((alg) => (
            <button
              key={alg}
              className={`algo-tab${algorithm === alg ? alg === "dijkstra" ? " active-d" : alg === "astar" ? " active-a" : " active-c" : ""}`}
              onClick={() => setAlgorithm(alg)}
            >
              {alg === "dijkstra" ? "Dijkstra" : alg === "astar" ? "A*" : "Compare"}
            </button>
          ))}
        </div>

        {/* Route pickers */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <select className="route-select" value={startNode} onChange={(e) => setStartNode(e.target.value)}>
            <option value="">From…</option>
            {nodes.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>→</span>
          <select className="route-select" value={endNode} onChange={(e) => setEndNode(e.target.value)}>
            <option value="">To…</option>
            {nodes.filter((n) => n !== startNode).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {/* Playback — only when running */}
        {hasRun && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <button className="pb-btn" onClick={restart} title="Restart">↩</button>
            <button className="pb-btn" onClick={stepPrev} disabled={primaryIndex === 0}>‹</button>
            <button
              className="pb-btn primary"
              onClick={() => atEnd ? restart() : setIsPlaying((p) => !p)}
            >
              {isPlaying ? "⏸" : atEnd ? "↩" : "▶"}
            </button>
            <button className="pb-btn" onClick={stepNext} disabled={atEnd}>›</button>

            {/* Speed */}
            <div className="spd-dots" style={{ marginLeft: 4 }}>
              {SPEEDS.map((_, i) => (
                <div key={i} className={`spd-dot${i <= speedLevel ? " on" : ""}`} onClick={() => setSpeedLevel(i)} />
              ))}
            </div>

            {/* Counter */}
            <span style={{ fontSize: 10, color: "var(--muted)", fontVariantNumeric: "tabular-nums", marginLeft: 2 }}>
              {primaryIndex + 1}/{primarySteps.length}
            </span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Learn toggle */}
        <button
          onClick={() => setLearnOpen((o) => !o)}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: `1px solid ${learnOpen ? "var(--blue)" : "var(--border-soft)"}`,
            background: learnOpen ? "var(--blue-dim)" : "transparent",
            color: learnOpen ? "var(--blue)" : "var(--muted)",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-sora), sans-serif",
            cursor: "pointer",
            transition: "all 0.15s",
            flexShrink: 0,
          }}
        >
          Learn
        </button>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* Map */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>

          {/* Empty state */}
          {!startNode && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none", zIndex: 2,
            }}>
              <div style={{
                background: "var(--panel)",
                border: "1px solid var(--border-soft)",
                borderRadius: 14,
                padding: "18px 28px",
                textAlign: "center",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 5 }}>
                  Pick a starting area
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  Click a node on the map or use the dropdowns above
                </div>
              </div>
            </div>
          )}

          {startNode && !endNode && (
            <div style={{
              position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
              background: "var(--panel)",
              border: "1px solid var(--border-soft)",
              borderRadius: 20,
              padding: "7px 18px",
              zIndex: 5, pointerEvents: "none",
              fontSize: 12, color: "var(--text)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            }}>
              Now pick a destination
            </div>
          )}

          {/* Reset button — top right of map */}
          {(startNode || endNode) && (
            <button
              onClick={resetSelection}
              style={{
                position: "absolute", top: 12, right: 12, zIndex: 5,
                padding: "6px 13px",
                borderRadius: 8,
                border: "1px solid var(--border-soft)",
                background: "var(--surface)",
                color: "var(--muted)",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-sora), sans-serif",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
                boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--red)";
                el.style.color = "var(--red)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--border-soft)";
                el.style.color = "var(--muted)";
              }}
            >
              <span style={{ fontSize: 12 }}>↺</span> Reset
            </button>
          )}

          <GraphCanvas
            graph={kuwaitGraph}
            step={primaryStep}
            startNode={startNode || null}
            endNode={endNode || null}
            onNodeClick={handleNodeClick}
            pickingStart={!startNode}
            pickingEnd={!!startNode && !endNode}
          />
        </div>

        {/* Learn panel — slides in */}
        <div style={{
          width: learnOpen ? 290 : 0,
          borderLeft: learnOpen ? "1px solid var(--border)" : "none",
          background: "var(--surface)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
        }}>
          {learnOpen && (
            <LearnPanel
              steps={primarySteps}
              currentIndex={primaryIndex}
              algorithm={algorithm}
              dijkstraSteps={dSteps}
              astarSteps={aSteps}
              dijkstraIndex={dIndex}
              astarIndex={aIndex}
            />
          )}
        </div>
      </div>

      {/* Result bar */}
      {primaryStep?.finalPath && algorithm !== "compare" && (
        <div style={{
          background: "rgba(45,232,158,0.05)",
          borderTop: "1px solid rgba(45,232,158,0.18)",
          padding: "8px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 12,
          flexShrink: 0,
        }}>
          <span style={{ color: "var(--mint)", fontWeight: 700, flexShrink: 0 }}>Shortest path</span>
          <span style={{ color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            {primaryStep.finalPath.join(" → ")}
          </span>
          <span style={{ color: "var(--mint)", fontWeight: 700, fontFamily: "var(--font-mono), monospace", flexShrink: 0 }}>
            {algorithm === "dijkstra"
              ? `${Math.round(primaryStep.scores[primaryStep.currentNode])} km`
              : `${Math.round(primaryStep.gScores?.[primaryStep.currentNode] ?? 0)} km`}
          </span>
        </div>
      )}
    </div>
  );
}
