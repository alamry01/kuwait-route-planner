# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Read the bundled Next.js docs first

This project uses **Next.js 16** with **React 19**, which contains breaking changes from older versions. Before modifying any Next.js-specific behavior (routing, layouts, data fetching), read the relevant guide in `node_modules/next/dist/docs/`. Key sections: `01-app/01-getting-started/` for core patterns, `01-app/02-guides/` for specific use cases.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # Type-check without emitting (no test suite exists)
```

## Architecture

This is a single-page client-side application — no API routes, no server components with data fetching. Every component that uses React state or browser APIs is marked `"use client"`.

### Data flow

```
lib/graphData.ts  →  lib/dijkstra.ts  →  app/page.tsx  →  components/
lib/graphData.ts  →  lib/astar.ts     ↗
```

**`lib/types.ts`** — All shared TypeScript interfaces. `AlgoStep` is the central type: a snapshot of the full algorithm state at each iteration (visited set, priority queue, distance scores, updated neighbors, human-readable explanation). Both algorithms produce `AlgoStep[]`.

**`lib/graphData.ts`** — Static Kuwait graph (24 nodes, 41 edges). Node `x/y` coordinates are in the original Java coordinate space (roughly 200–480 × 180–580); `GraphCanvas` maps these to SVG viewport via `tx()`/`ty()` transform functions. `getNeighbors()` is the shared adjacency lookup used by both algorithm files.

**`lib/dijkstra.ts` / `lib/astar.ts`** — Pure functions `runDijkstra(graph, start, end): AlgoStep[]` and `runAStar(graph, start, end): AlgoStep[]`. Both simulate a min-heap with a sorted array (intentional — clarity over performance). The PQ is re-sorted on every iteration so visualization matches the conceptual model exactly. A*'s heuristic is Euclidean distance × 0.3 (matches the original Java, ensures admissibility on this map).

**`app/page.tsx`** — Owns all state: selected nodes, current step indices, algorithm mode, playback timer. Calls `runDijkstra`/`runAStar` on demand and stores the full `AlgoStep[]` arrays. The playback timer uses `setInterval` stored in a `useRef` to advance step indices; `stopTimer` is a `useCallback` to safely clear it.

**`components/GraphCanvas.tsx`** — SVG-only visualization. Node color/stroke is derived purely from the current `AlgoStep` (no internal state). The coordinate transform (`tx`/`ty`) scales the Java coordinate space to a 640×520 SVG viewport with 50px padding. Node score badges (the number inside each circle) show `step.scores[node.id]` — for Dijkstra this is distance, for A* this is the f-score.

**`components/StepPanel.tsx`** — Renders the priority queue list and score table from the current step. For A*, `PQEntry` carries optional `g` and `h` fields displayed alongside the f-score priority.

**`components/ComparePanel.tsx`** — Receives separate step arrays and indices for both algorithms. The compare mode in `page.tsx` drives both `dIndex` and `aIndex` forward simultaneously in the same timer tick.

**`components/EducationPanel.tsx`** — Purely static content, no props. Tabs are local state only.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. The import in `globals.css` is `@import "tailwindcss"` (v4 syntax — not `@tailwind base/components/utilities`). Dark slate color palette throughout (`slate-950` background, `slate-900`/`slate-800` panels).

### Adding a new algorithm

1. Create `lib/<name>.ts` exporting `run<Name>(graph: GraphData, start: string, end: string): AlgoStep[]`
2. Populate `AlgoStep.scores` with the priority used for the PQ (so `StepPanel` and `GraphCanvas` score badges work automatically)
3. Add the algorithm option to the `Algorithm` union type in `page.tsx` and wire up state/playback identically to the Dijkstra/A* pattern
