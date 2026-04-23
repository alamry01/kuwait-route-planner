"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import GoogleMapCanvas from "@/components/GoogleMapCanvas";
import LearnPanel from "@/components/LearnPanel";
import { AlgoStep } from "@/lib/types";
import { kuwaitGraph } from "@/lib/graphData";
import { runDijkstra } from "@/lib/dijkstra";
import { runAStar } from "@/lib/astar";

type Algorithm = "dijkstra" | "astar" | "compare";
const SPEEDS = [1400, 800, 400, 180];

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

export default function Visualizer() {
  const router = useRouter();
  const isMobile = useIsMobile();

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

  // ── Shared sub-elements ──────────────────────────────

  const algoTabs = (
    <div className="algo-tabs">
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
  );

  const routePickers = (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
      <select className="route-select" value={startNode} onChange={(e) => setStartNode(e.target.value)} style={{ flex: 1, minWidth: 0 }}>
        <option value="">From…</option>
        {nodes.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <span style={{ fontSize: 12, color: "var(--muted)", flexShrink: 0 }}>→</span>
      <select className="route-select" value={endNode} onChange={(e) => setEndNode(e.target.value)} style={{ flex: 1, minWidth: 0 }}>
        <option value="">To…</option>
        {nodes.filter((n) => n !== startNode).map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      {(startNode || endNode) && (
        <button
          onClick={resetSelection}
          style={{
            flexShrink: 0, width: 32, height: 32,
            borderRadius: 7, border: "1px solid var(--border-soft)",
            background: "transparent", color: "var(--muted)",
            cursor: "pointer", fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "color 0.15s, border-color 0.15s",
          }}
          title="Reset selection"
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--red)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--red)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)"; }}
        >↺</button>
      )}
    </div>
  );

  const playbackControls = hasRun ? (
    <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
      <button className="pb-btn" onClick={restart} title="Restart">↩</button>
      <button className="pb-btn" onClick={stepPrev} disabled={primaryIndex === 0}>‹</button>
      <button className="pb-btn primary" onClick={() => atEnd ? restart() : setIsPlaying((p) => !p)}>
        {isPlaying ? "⏸" : atEnd ? "↩" : "▶"}
      </button>
      <button className="pb-btn" onClick={stepNext} disabled={atEnd}>›</button>
      <div className="spd-dots" style={{ marginLeft: 2 }}>
        {SPEEDS.map((_, i) => (
          <div key={i} className={`spd-dot${i <= speedLevel ? " on" : ""}`} onClick={() => setSpeedLevel(i)} />
        ))}
      </div>
      <span style={{ fontSize: 10, color: "var(--muted)", fontVariantNumeric: "tabular-nums", marginLeft: 2, whiteSpace: "nowrap" }}>
        {primaryIndex + 1}/{primarySteps.length}
      </span>
    </div>
  ) : null;

  const resultBar = primaryStep?.finalPath && algorithm !== "compare" ? (
    <div style={{
      background: "rgba(45,232,158,0.05)",
      borderTop: "1px solid rgba(45,232,158,0.18)",
      padding: "8px 16px",
      display: "flex", alignItems: "center", gap: 10,
      fontSize: 12, flexShrink: 0,
    }}>
      <span style={{ color: "var(--mint)", fontWeight: 700, flexShrink: 0 }}>Path</span>
      <span style={{ color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, fontSize: 11 }}>
        {primaryStep.finalPath.join(" → ")}
      </span>
      <span style={{ color: "var(--mint)", fontWeight: 700, fontFamily: "var(--font-mono), monospace", flexShrink: 0 }}>
        {algorithm === "dijkstra"
          ? `${Math.round(primaryStep.scores[primaryStep.currentNode])} km`
          : `${Math.round(primaryStep.gScores?.[primaryStep.currentNode] ?? 0)} km`}
      </span>
    </div>
  ) : null;

  const learnPanel = (
    <LearnPanel
      steps={primarySteps}
      currentIndex={primaryIndex}
      algorithm={algorithm}
      dijkstraSteps={dSteps}
      astarSteps={aSteps}
      dijkstraIndex={dIndex}
      astarIndex={aIndex}
    />
  );

  const mapArea = (
    <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
      {/* Non-blocking hint banner — top center, small pill */}
      {(!startNode || (startNode && !endNode)) && (
        <div style={{
          position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
          background: "rgba(16,19,31,0.82)", backdropFilter: "blur(8px)",
          border: "1px solid var(--border-soft)",
          borderRadius: 20, padding: "6px 16px",
          zIndex: 5, pointerEvents: "none",
          fontSize: 12, color: "var(--muted)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
          whiteSpace: "nowrap",
        }}>
          {!startNode
            ? (isMobile ? "Tap a node or use dropdowns below" : "Click a node or use dropdowns above")
            : "Now pick a destination"}
        </div>
      )}
      {/* Reset button — top right */}
      {(startNode || endNode) && !isMobile && (
        <button
          onClick={resetSelection}
          style={{
            position: "absolute", top: 12, right: 12, zIndex: 5,
            padding: "6px 13px", borderRadius: 8,
            border: "1px solid var(--border-soft)", background: "rgba(16,19,31,0.82)",
            backdropFilter: "blur(8px)",
            color: "var(--muted)", fontSize: 11, fontWeight: 600,
            fontFamily: "var(--font-sora), sans-serif", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.15s", boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--red)"; (e.currentTarget as HTMLElement).style.color = "var(--red)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
        >
          ↺ Reset
        </button>
      )}
      <GoogleMapCanvas
        step={primaryStep}
        startNode={startNode || null}
        endNode={endNode || null}
        onNodeClick={handleNodeClick}
        pickingStart={!startNode}
        pickingEnd={!!startNode && !endNode}
      />
    </div>
  );

  // ── MOBILE LAYOUT ────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ background: "var(--bg)", height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Compact header */}
        <header style={{
          background: "var(--surface)", borderBottom: "1px solid var(--border)",
          padding: "0 16px", height: 52,
          display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
        }}>
          <button
            onClick={() => router.push("/")}
            style={{
              width: 36, height: 36, borderRadius: 8,
              border: "1px solid var(--border-soft)", background: "transparent",
              color: "var(--muted)", cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >←</button>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", flex: 1 }}>
            Route Planner
          </span>
          <button
            onClick={() => setLearnOpen((o) => !o)}
            style={{
              padding: "7px 14px", borderRadius: 8,
              border: `1px solid ${learnOpen ? "var(--blue)" : "var(--border-soft)"}`,
              background: learnOpen ? "var(--blue-dim)" : "transparent",
              color: learnOpen ? "var(--blue)" : "var(--muted)",
              fontSize: 13, fontWeight: 600,
              fontFamily: "var(--font-sora), sans-serif", cursor: "pointer",
            }}
          >Learn</button>
        </header>

        {/* Map — takes all remaining space above bottom bar */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
          {mapArea}
          {resultBar}
        </div>

        {/* Bottom bar — algo tabs + route pickers + playback */}
        <div className="mobile-bottom-bar">
          {/* Row 1: algo + playback */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {algoTabs}
            <div style={{ flex: 1 }} />
            {playbackControls}
          </div>
          {/* Row 2: route selectors */}
          {routePickers}
        </div>

        {/* Bottom sheet backdrop */}
        <div className={`bottom-sheet-backdrop${learnOpen ? " open" : ""}`} onClick={() => setLearnOpen(false)} />

        {/* Bottom sheet: Learn */}
        <div className={`bottom-sheet${learnOpen ? " open" : ""}`}>
          <div className="bottom-sheet-handle" />
          <div style={{
            padding: "10px 16px 6px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid var(--border)", flexShrink: 0,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Learn</span>
            <button
              onClick={() => setLearnOpen(false)}
              style={{
                width: 32, height: 32, borderRadius: 7,
                border: "1px solid var(--border-soft)", background: "transparent",
                color: "var(--muted)", cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >×</button>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            {learnPanel}
          </div>
        </div>
      </div>
    );
  }

  // ── DESKTOP LAYOUT ───────────────────────────────────
  return (
    <div style={{ background: "var(--bg)", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <header style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border)",
        padding: "0 20px", height: 52,
        display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
      }}>
        <button
          onClick={() => router.push("/")}
          style={{
            width: 30, height: 30, borderRadius: 7,
            border: "1px solid var(--border-soft)", background: "transparent",
            color: "var(--muted)", cursor: "pointer", fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "color 0.15s, border-color 0.15s", flexShrink: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--blue)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)"; }}
        >←</button>

        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", flexShrink: 0 }}>
          Route Planner
        </span>
        <div style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />
        {algoTabs}
        {routePickers}
        {playbackControls}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setLearnOpen((o) => !o)}
          style={{
            padding: "6px 14px", borderRadius: 8,
            border: `1px solid ${learnOpen ? "var(--blue)" : "var(--border-soft)"}`,
            background: learnOpen ? "var(--blue-dim)" : "transparent",
            color: learnOpen ? "var(--blue)" : "var(--muted)",
            fontSize: 12, fontWeight: 600,
            fontFamily: "var(--font-sora), sans-serif", cursor: "pointer",
            transition: "all 0.15s", flexShrink: 0,
          }}
        >Learn</button>
      </header>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {mapArea}
        <div style={{
          width: learnOpen ? 290 : 0,
          borderLeft: learnOpen ? "1px solid var(--border)" : "none",
          background: "var(--surface)",
          overflow: "hidden", display: "flex", flexDirection: "column", flexShrink: 0,
          transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
        }}>
          {learnOpen && learnPanel}
        </div>
      </div>

      {resultBar}
    </div>
  );
}
