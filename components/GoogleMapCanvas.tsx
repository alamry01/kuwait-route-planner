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

// ── Map style — deep navy matching the app ──────────────
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry",                        stylers: [{ color: "#0d1020" }] },
  { elementType: "labels.icon",                     stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill",                stylers: [{ color: "#566080" }] },
  { elementType: "labels.text.stroke",              stylers: [{ color: "#0a0c14" }] },
  { featureType: "administrative",        elementType: "geometry",          stylers: [{ color: "#1e2540" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill",stylers: [{ color: "#8896b0" }] },
  { featureType: "poi",                             stylers: [{ visibility: "off" }] },
  { featureType: "road",                  elementType: "geometry.fill",     stylers: [{ color: "#1e2840" }] },
  { featureType: "road",                  elementType: "geometry.stroke",   stylers: [{ color: "#0d1020" }] },
  { featureType: "road",                  elementType: "labels.text.fill",  stylers: [{ color: "#3a4560" }] },
  { featureType: "road.highway",          elementType: "geometry.fill",     stylers: [{ color: "#243050" }] },
  { featureType: "road.highway",          elementType: "geometry.stroke",   stylers: [{ color: "#0a0c14" }] },
  { featureType: "road.highway",          elementType: "labels.text.fill",  stylers: [{ color: "#566080" }] },
  { featureType: "transit",                         stylers: [{ visibility: "off" }] },
  { featureType: "water",                 elementType: "geometry",          stylers: [{ color: "#06080f" }] },
  { featureType: "water",                 elementType: "labels.text.fill",  stylers: [{ color: "#1e2540" }] },
];

// ── Color helpers ───────────────────────────────────────
function nodeColor(id: string, step: AlgoStep | null, start: string | null, end: string | null) {
  if (id === start)                      return { fill: "#5b8cff", ring: "#3b6ce0" };
  if (id === end)                        return { fill: "#ff5570", ring: "#cc2244" };
  if (step?.finalPath?.includes(id))     return { fill: "#2de89e", ring: "#1ab87c" };
  if (step?.currentNode === id)          return { fill: "#f5a623", ring: "#c17d0a" };
  if (step?.visited.includes(id))        return { fill: "#2a3352", ring: "#1e2540" };
  if (step?.inQueue.includes(id))        return { fill: "#4a3880", ring: "#3a2860" };
  return                                        { fill: "#161b2a", ring: "#1e2540" };
}

function edgeStyle(u: string, v: string, step: AlgoStep | null) {
  const path = step?.finalPath;
  if (path && path.length >= 2) {
    for (let i = 0; i < path.length - 1; i++) {
      if ((path[i] === u && path[i + 1] === v) || (path[i] === v && path[i + 1] === u))
        return { color: "#2de89e", weight: 3, opacity: 0.9, zIndex: 3 };
    }
  }
  if (step?.updatedNeighbors.some(
    (nb) => (step.currentNode === u && nb.node === v) || (step.currentNode === v && nb.node === u)
  )) return { color: "#f5a623", weight: 2.5, opacity: 0.85, zIndex: 2 };
  return { color: "#2a3352", weight: 1.5, opacity: 0.55, zIndex: 1 };
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

  // Refs that survive re-renders without triggering them
  const stateRef = useRef({ step, startNode, endNode, onNodeClick });
  const edgePolylinesRef = useRef<Map<string, google.maps.Polyline>>(new Map());
  const overlayRef = useRef<google.maps.OverlayView | null>(null);
  const redrawNodesRef = useRef<((s: AlgoStep | null, sn: string | null, en: string | null) => void) | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const lastPathKeyRef = useRef<string>("");

  // Always keep stateRef current
  useEffect(() => { stateRef.current = { step, startNode, endNode, onNodeClick }; });

  // ── One-time map initialisation ────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    setOptions({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!, v: "weekly" });

    importLibrary("maps").then(() => {
      if (cancelled || !containerRef.current) return;

      const map = new window.google.maps.Map(containerRef.current, {
        center: { lat: 29.1, lng: 47.95 },
        zoom: 9,
        styles: MAP_STYLE,
        disableDefaultUI: true,
        gestureHandling: "greedy",
        zoomControl: true,
        zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_BOTTOM },
      });

      // ── Directions service + renderer (for final path on actual roads) ──
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: "#2de89e",
          strokeWeight: 5,
          strokeOpacity: 0.85,
          zIndex: 10,
        },
      });
      directionsRenderer.setMap(map);
      directionsServiceRef.current = directionsService;
      directionsRendererRef.current = directionsRenderer;

      // ── Create one Polyline per edge ────────────────────
      const edgePolylines = new Map<string, google.maps.Polyline>();
      for (const e of kuwaitGraph.edges) {
        const [lat1, lng1] = nodeLatLngs[e.u] ?? [0, 0];
        const [lat2, lng2] = nodeLatLngs[e.v] ?? [0, 0];
        const pl = new window.google.maps.Polyline({
          path: [{ lat: lat1, lng: lng1 }, { lat: lat2, lng: lng2 }],
          strokeColor: "#2a3352",
          strokeWeight: 1.5,
          strokeOpacity: 0.55,
          zIndex: 1,
          map,
        });
        edgePolylines.set(`${e.u}-${e.v}`, pl);
      }
      edgePolylinesRef.current = edgePolylines;

      // ── SVG Overlay — nodes + weight labels only ────────
      class NodeOverlay extends window.google.maps.OverlayView {
        private svg!: SVGSVGElement;

        onAdd() {
          this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement;
          Object.assign(this.svg.style, { position: "absolute", overflow: "visible", pointerEvents: "none", top: "0", left: "0" });
          this.getPanes()!.overlayMouseTarget.appendChild(this.svg);
        }

        draw() {
          this.redraw(stateRef.current.step, stateRef.current.startNode, stateRef.current.endNode);
        }

        redraw(step: AlgoStep | null, sn: string | null, en: string | null) {
          const proj = this.getProjection();
          if (!proj || !this.svg) return;

          const pts: Record<string, { x: number; y: number }> = {};
          for (const [id, [lat, lng]] of Object.entries(nodeLatLngs)) {
            const p = proj.fromLatLngToDivPixel(new window.google.maps.LatLng(lat, lng));
            if (p) pts[id] = { x: p.x, y: p.y };
          }

          while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
          const ns = "http://www.w3.org/2000/svg";
          const mk = (tag: string) => document.createElementNS(ns, tag);
          const set = (el: Element, attrs: Record<string, string>) => {
            for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
          };

          // Weight labels at edge midpoints
          for (const e of kuwaitGraph.edges) {
            const a = pts[e.u], b = pts[e.v];
            if (!a || !b) continue;
            const onPath = step?.finalPath?.length && step.finalPath.some((_, i, arr) =>
              i < arr.length - 1 && ((arr[i] === e.u && arr[i + 1] === e.v) || (arr[i] === e.v && arr[i + 1] === e.u))
            );
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
            const wt = mk("text");
            set(wt, { x: String(mx), y: String(my - 4), "text-anchor": "middle", "font-size": "8.5", "font-family": "monospace", fill: onPath ? "#2de89e" : "#3a4560" });
            wt.textContent = String(e.weight);
            this.svg.appendChild(wt);
          }

          // Node circles
          for (const [id, pos] of Object.entries(pts)) {
            if (!kuwaitGraph.nodes.find((n) => n.id === id)) continue;
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
            set(shadow, { cx: String(pos.x), cy: String(pos.y + 1.5), r: "12", fill: "rgba(0,0,0,0.4)" });
            g.appendChild(shadow);

            const circle = mk("circle");
            set(circle, { cx: String(pos.x), cy: String(pos.y), r: "12", fill, stroke: ring, "stroke-width": "1.5" });
            g.appendChild(circle);

            const scoreVal = step?.scores[id];
            if (scoreVal !== undefined && scoreVal !== Infinity) {
              const st = mk("text");
              set(st, { x: String(pos.x), y: String(pos.y + 4), "text-anchor": "middle", "font-size": "7.5", "font-weight": "700", "font-family": "monospace", fill: "rgba(255,255,255,0.9)" });
              st.textContent = String(Math.round(scoreVal));
              g.appendChild(st);
            }

            // Name label (two lines if long)
            const words = id.split(" ");
            const line1 = words.slice(0, 2).join(" ");
            const line2 = words.length > 2 ? words.slice(2).join(" ") : null;
            const labelColor = isOnPath ? "#2de89e" : isCurrent ? "#f5a623" : id === sn ? "#5b8cff" : id === en ? "#ff5570" : "#8896b0";

            const lbl = mk("text");
            set(lbl, { x: String(pos.x), y: String(pos.y + 23), "text-anchor": "middle", "font-size": "8.5", "font-family": "sans-serif", fill: labelColor });
            lbl.textContent = line1;
            g.appendChild(lbl);

            if (line2) {
              const lbl2 = mk("text");
              set(lbl2, { x: String(pos.x), y: String(pos.y + 33), "text-anchor": "middle", "font-size": "8.5", "font-family": "sans-serif", fill: labelColor });
              lbl2.textContent = line2;
              g.appendChild(lbl2);
            }

            // Invisible 44px touch target
            const hit = mk("circle");
            set(hit, { cx: String(pos.x), cy: String(pos.y), r: "22", fill: "transparent" });
            hit.addEventListener("click", () => stateRef.current.onNodeClick(id));
            g.appendChild(hit);

            this.svg.appendChild(g);
          }
        }

        onRemove() { this.svg?.remove(); }
      }

      const overlay = new NodeOverlay();
      overlay.setMap(map);
      overlayRef.current = overlay;

      redrawNodesRef.current = (s, sn, en) => {
        (overlay as { redraw: typeof NodeOverlay.prototype.redraw }).redraw(s, sn, en);
      };
    });

    return () => { cancelled = true; };
  }, []);

  // ── Update edge colours + node overlay on every step ──
  useEffect(() => {
    // Edge polylines
    for (const e of kuwaitGraph.edges) {
      const pl = edgePolylinesRef.current.get(`${e.u}-${e.v}`);
      if (!pl) continue;
      const { color, weight, opacity, zIndex } = edgeStyle(e.u, e.v, step);
      pl.setOptions({ strokeColor: color, strokeWeight: weight, strokeOpacity: opacity, zIndex });
    }
    // Node overlay
    redrawNodesRef.current?.(step, startNode, endNode);
  }, [step, startNode, endNode]);

  // ── Final path → fetch actual road route via Directions API ──
  useEffect(() => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) return;

    const path = step?.finalPath;
    const pathKey = path ? path.join(",") : "";

    if (pathKey === lastPathKeyRef.current) return;
    lastPathKeyRef.current = pathKey;

    if (!path || path.length < 2) {
      directionsRendererRef.current.set("directions", null);
      return;
    }

    const [lat0, lng0] = nodeLatLngs[path[0]] ?? [0, 0];
    const [latN, lngN] = nodeLatLngs[path[path.length - 1]] ?? [0, 0];

    // API supports max 8 waypoints; use intermediate nodes up to that limit
    const waypoints = path.slice(1, -1).slice(0, 8).map((id) => {
      const [lat, lng] = nodeLatLngs[id] ?? [0, 0];
      return { location: new window.google.maps.LatLng(lat, lng), stopover: false };
    });

    directionsServiceRef.current.route(
      {
        origin: new window.google.maps.LatLng(lat0, lng0),
        destination: new window.google.maps.LatLng(latN, lngN),
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === "OK" && result && directionsRendererRef.current) {
          directionsRendererRef.current.setDirections(result);
        }
      }
    );
  }, [step?.finalPath]);

  const cursor = pickingStart || pickingEnd ? "crosshair" : "default";

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", cursor }} />

      {/* Legend */}
      <div style={{ position: "absolute", bottom: 44, left: 14, display: "flex", gap: 10, flexWrap: "wrap", pointerEvents: "none" }}>
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
