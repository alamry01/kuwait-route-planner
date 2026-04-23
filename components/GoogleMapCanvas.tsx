"use client";

import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { AlgoStep } from "@/lib/types";
import { kuwaitGraph, nodeLatLngs } from "@/lib/graphData";

interface Props {
  step: AlgoStep | null;
  startNode: string | null;
  endNode: string | null;
  onNodeClick: (id: string) => void;
  pickingStart: boolean;
  pickingEnd: boolean;
}

const MAP_STYLE = [
  { elementType: "geometry",                      stylers: [{ color: "#0d1020" }] },
  { elementType: "labels.icon",                   stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill",              stylers: [{ color: "#566080" }] },
  { elementType: "labels.text.stroke",            stylers: [{ color: "#0a0c14" }] },
  { featureType: "administrative",        elementType: "geometry",            stylers: [{ color: "#1e2540" }] },
  { featureType: "administrative.country",elementType: "labels.text.fill",   stylers: [{ color: "#8896b0" }] },
  { featureType: "administrative.locality",elementType: "labels.text.fill",  stylers: [{ color: "#8896b0" }] },
  { featureType: "poi",                           stylers: [{ visibility: "off" }] },
  { featureType: "road",          elementType: "geometry.fill",              stylers: [{ color: "#1a2038" }] },
  { featureType: "road",          elementType: "geometry.stroke",            stylers: [{ color: "#0d1020" }] },
  { featureType: "road",          elementType: "labels.text.fill",           stylers: [{ color: "#3a4560" }] },
  { featureType: "road.highway",  elementType: "geometry.fill",              stylers: [{ color: "#243050" }] },
  { featureType: "road.highway",  elementType: "geometry.stroke",            stylers: [{ color: "#0a0c14" }] },
  { featureType: "road.highway",  elementType: "labels.text.fill",           stylers: [{ color: "#566080" }] },
  { featureType: "transit",                       stylers: [{ visibility: "off" }] },
  { featureType: "water",         elementType: "geometry",                   stylers: [{ color: "#06080f" }] },
  { featureType: "water",         elementType: "labels.text.fill",           stylers: [{ color: "#1e2540" }] },
];

function nodeColor(id: string, step: AlgoStep | null, start: string | null, end: string | null) {
  if (id === start)                        return { fill: "#5b8cff", ring: "#3b6ce0" };
  if (id === end)                          return { fill: "#ff5570", ring: "#cc2244" };
  if (step?.finalPath?.includes(id))       return { fill: "#2de89e", ring: "#1ab87c" };
  if (step?.currentNode === id)            return { fill: "#f5a623", ring: "#c17d0a" };
  if (step?.visited.includes(id))          return { fill: "#2a3352", ring: "#1e2540" };
  if (step?.inQueue.includes(id))          return { fill: "#4a3880", ring: "#3a2860" };
  return                                          { fill: "#161b2a", ring: "#1e2540" };
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

export default function GoogleMapCanvas({ step, startNode, endNode, onNodeClick, pickingStart, pickingEnd }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<((s: AlgoStep | null, sn: string | null, en: string | null) => void) | null>(null);

  // Keep latest state accessible inside the overlay without re-creating it
  const stateRef = useRef({ step, startNode, endNode, onNodeClick });
  useEffect(() => { stateRef.current = { step, startNode, endNode, onNodeClick }; });

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
      v: "weekly",
    });

    importLibrary("maps").then(() => {
      if (cancelled || !containerRef.current) return;

      const map = new window.google.maps.Map(containerRef.current, {
        center: { lat: 29.18, lng: 47.95 },
        zoom: 10,
        styles: MAP_STYLE,
        disableDefaultUI: true,
        gestureHandling: "greedy",
        zoomControl: true,
        zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_BOTTOM },
      });

      class KuwaitOverlay extends window.google.maps.OverlayView {
        private svg!: SVGSVGElement;

        onAdd() {
          this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement;
          Object.assign(this.svg.style, {
            position: "absolute", overflow: "visible", pointerEvents: "none", top: "0", left: "0",
          });
          this.getPanes()!.overlayMouseTarget.appendChild(this.svg);
        }

        draw() {
          this.redraw(stateRef.current.step, stateRef.current.startNode, stateRef.current.endNode);
        }

        redraw(step: AlgoStep | null, sn: string | null, en: string | null) {
          const proj = this.getProjection();
          if (!proj || !this.svg) return;

          // Convert all lat/lng → pixel
          const pts: Record<string, { x: number; y: number }> = {};
          for (const [id, [lat, lng]] of Object.entries(nodeLatLngs)) {
            const p = proj.fromLatLngToDivPixel(new window.google.maps.LatLng(lat, lng));
            if (p) pts[id] = { x: p.x, y: p.y };
          }

          // Clear
          while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);

          const ns = "http://www.w3.org/2000/svg";
          const mk = (tag: string) => document.createElementNS(ns, tag);
          const set = (el: Element, attrs: Record<string, string>) => {
            for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
          };

          // Edges
          for (const e of kuwaitGraph.edges) {
            const a = pts[e.u], b = pts[e.v];
            if (!a || !b) continue;
            const onPath = isPathEdge(e.u, e.v, step?.finalPath);
            const relaxed = isRelaxedEdge(e.u, e.v, step);

            const line = mk("line");
            set(line, {
              x1: String(a.x), y1: String(a.y), x2: String(b.x), y2: String(b.y),
              stroke: onPath ? "#2de89e" : relaxed ? "#f5a623" : "#2a3352",
              "stroke-width": onPath ? "3" : relaxed ? "2.5" : "1.5",
              "stroke-opacity": onPath ? "1" : relaxed ? "0.9" : "0.55",
            });
            this.svg.appendChild(line);

            // Weight label
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
            const wt = mk("text");
            set(wt, { x: String(mx), y: String(my - 4), "text-anchor": "middle", "font-size": "9", fill: onPath ? "#2de89e" : "#3a4560" });
            wt.textContent = String(e.weight);
            this.svg.appendChild(wt);
          }

          // Nodes
          for (const [id, pos] of Object.entries(pts)) {
            const { fill, ring } = nodeColor(id, step, sn, en);
            const isCurrent = step?.currentNode === id && !step?.finalPath;
            const isOnPath = !!step?.finalPath?.includes(id);

            const g = mk("g") as SVGGElement;
            g.style.cursor = "pointer";
            g.style.pointerEvents = "all";

            if (isCurrent) {
              const pulse = mk("circle");
              set(pulse, { cx: String(pos.x), cy: String(pos.y), r: "17", fill: "none", stroke: "#f5a623", "stroke-width": "1.5", opacity: "0.35" });
              g.appendChild(pulse);
            }
            if (isOnPath) {
              const glow = mk("circle");
              set(glow, { cx: String(pos.x), cy: String(pos.y), r: "15", fill: "none", stroke: "#2de89e", "stroke-width": "1", opacity: "0.25" });
              g.appendChild(glow);
            }

            const shadow = mk("circle");
            set(shadow, { cx: String(pos.x), cy: String(pos.y + 1.5), r: "12", fill: "rgba(0,0,0,0.35)" });
            g.appendChild(shadow);

            const circle = mk("circle");
            set(circle, { cx: String(pos.x), cy: String(pos.y), r: "12", fill, stroke: ring, "stroke-width": "1.5" });
            g.appendChild(circle);

            const scoreVal = step?.scores[id];
            if (scoreVal !== undefined && scoreVal !== Infinity) {
              const st = mk("text");
              set(st, { x: String(pos.x), y: String(pos.y + 4), "text-anchor": "middle", "font-size": "8", "font-weight": "700", fill: "rgba(255,255,255,0.9)" });
              st.textContent = String(Math.round(scoreVal));
              g.appendChild(st);
            }

            const label = mk("text");
            set(label, {
              x: String(pos.x), y: String(pos.y + 24),
              "text-anchor": "middle", "font-size": "9", "font-family": "sans-serif",
              fill: isOnPath ? "#2de89e" : isCurrent ? "#f5a623" : id === sn ? "#5b8cff" : id === en ? "#ff5570" : "#8896b0",
            });
            label.textContent = id.length > 12 ? id.split(" ").slice(0, 2).join(" ") : id;
            g.appendChild(label);

            // Second line for long names
            if (id.split(" ").length > 2 && id.length > 12) {
              const label2 = mk("text");
              set(label2, { x: String(pos.x), y: String(pos.y + 34), "text-anchor": "middle", "font-size": "9", "font-family": "sans-serif", fill: "#8896b0" });
              label2.textContent = id.split(" ").slice(2).join(" ");
              g.appendChild(label2);
            }

            // Invisible hit area (44px touch target)
            const hit = mk("circle");
            set(hit, { cx: String(pos.x), cy: String(pos.y), r: "22", fill: "transparent" });
            hit.addEventListener("click", () => stateRef.current.onNodeClick(id));
            g.appendChild(hit);

            this.svg.appendChild(g);
          }
        }

        onRemove() { this.svg?.remove(); }
      }

      const overlay = new KuwaitOverlay();
      overlay.setMap(map);

      drawRef.current = (s, sn, en) => {
        (overlay as { redraw: (s: AlgoStep | null, sn: string | null, en: string | null) => void }).redraw(s, sn, en);
      };
    });

    return () => { cancelled = true; drawRef.current = null; };
  }, []);

  // Redraw whenever algo state changes
  useEffect(() => {
    drawRef.current?.(step, startNode, endNode);
  }, [step, startNode, endNode]);

  const cursor = pickingStart || pickingEnd ? "crosshair" : "default";

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", cursor }} />

      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 44, left: 14,
        display: "flex", gap: 10, flexWrap: "wrap",
        pointerEvents: "none",
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
