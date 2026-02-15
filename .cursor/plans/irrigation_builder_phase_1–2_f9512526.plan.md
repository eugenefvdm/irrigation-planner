---
name: Irrigation Builder Phase 1–2
overview: "Bootstrap an irrigation design/planning tool with React + SVG grid: Phase 1 implements the grid engine, component model, placement, rotation, port validation, and JSON export; Phase 2 adds the SVG visualizer with click-to-place, rotation control, connection-point highlighting, and a seeded example system using all five components."
todos: []
isProject: false
---

# Irrigation Builder — Phase 1 & Phase 2 Plan

## Stack and scope

- **Stack:** Next.js (App Router), TypeScript, Tailwind, Zustand, SVG.
- **Grid:** Fixed 50px cells, snap-to-grid, one component per cell (per doc recommendation).
- **Scope:** Design/installation planning only. No BOM, no SaaS, no commercial features. Connection validation and pipe-connection support only (no water-flow simulation).

---

## Phase 1 — Logical engine

Core is a **placement engine**: grid state, component definitions with ports, placement/rotation, and port-based connection validation. No drag UI; logic and state only (UI comes in Phase 2).

### 1.1 Project bootstrap

- Next.js app with TypeScript and Tailwind in `irrigation-builder` root.
- Add Zustand for global grid/placement state.

### 1.2 Data model (TypeScript)

Define in a single types module (e.g. `src/types.ts` or `src/lib/types.ts`):

- **Port:** `id`, `type` (`'slip' | 'male_thread' | 'female_thread' | 'barb'`), `direction` (`'north' | 'south' | 'east' | 'west'`).
- **PipeComponent (catalog):** `id`, `name`, `category` (`'fitting' | 'connector' | 'emitter'`), `ports: Port[]`. Optional `svgPath` or similar for Phase 2.
- **PlacedComponent:** `componentId` (references catalog), `x`, `y` (grid coords), `rotation`: `0 | 90 | 180 | 270`.
- **Grid:** 2D structure keyed by cell `(x, y)`; each cell holds at most one `PlacedComponent`. Grid dimensions (e.g. 20×20) as constants.

### 1.3 Component catalog (JSON / const)

Minimal inventory (as in doc):

- `pipe_straight` (coupling) — two ports opposite (e.g. east/west).
- `elbow_90` — two ports at 90° (e.g. east/south).
- `tee` — three ports (e.g. east/west/south).
- `male_adapter` — one port (e.g. male_thread, east).
- `drip_emitter_2lph` — e.g. one barb port.

Store as a const array or JSON; each item is a `PipeComponent` with correct `ports` and `direction`s so rotation can be derived (rotate = add 90° to each port direction, wrap N/S/E/W).

### 1.4 Grid system and placement

- **Grid:** Fixed 50px cell size (constant). Helper: grid coord `(x, y)` → pixel position for SVG later.
- **Placement rules:** Place only on integer grid cells; one component per cell; no overlap.
- **Actions (in Zustand or pure functions):** `placeComponent(componentId, x, y, rotation?)`, `removeComponent(x, y)`, `rotateComponent(x, y)` (cycle 0 → 90 → 180 → 270). State: map `"x,y"` → `PlacedComponent`.

### 1.5 Port matching and connection validation

- **Resolve world-direction of a port:** Given `PlacedComponent` at `(x, y)` with `rotation`, compute each port’s effective direction (e.g. “east” + 90° → “south”).
- **Adjacent cells:** For a port facing “north”, the adjacent cell is `(x, y - 1)`; south `(x, y + 1)`; east `(x + 1, y)`; west `(x - 1, y)`.
- **Valid connection:** Two ports connect if (1) they are on adjacent cells, (2) their world directions point at each other (north ↔ south, east ↔ west), (3) port types are compatible (e.g. slip–slip, male_thread–female_thread, barb into appropriate receptor). Keep rules minimal: focus on “can these two ports connect?” (no flow simulation).
- **API:** e.g. `getConnections(gridState): Array<{ from: {x,y,portId }, to: {x,y,portId } }>` and/or `getValidConnectionTargets(x, y, portId)` for highlighting in Phase 2.

### 1.6 Rotation logic

- Rotation is stored as 0 | 90 | 180 | 270. When applying rotation, each port’s `direction` is rotated by that amount (N→E→S→W→N). Use a small helper `rotateDirection(direction, degrees)`.

### 1.7 JSON export

- **Export:** Serialize grid state (dimensions + list of `PlacedComponent` with `componentId`, `x`, `y`, `rotation`) to JSON. Optionally include catalog reference or a minimal component list so the file is self-contained for re-import later.

---

## Phase 2 — Visualizer

SVG-based UI that consumes the Phase 1 engine: show grid, place components, rotate, highlight valid connection points. No drag-and-drop (Phase 3).

### 2.1 SVG grid canvas

- One page (e.g. `/` or `/plan`) with a full-screen or large SVG.
- Draw a 20×20 (or configurable) grid: 50px cells, light lines, no fill (or subtle fill for even/odd).
- Use the same 50px constant so grid coordinates map 1:1 to pixel positions (e.g. cell `(x, y)` → `(x * 50, y * 50)`).

### 2.2 Component rendering

- For each catalog entry, define a simple SVG representation (path or shapes) that fits in one 50×50 cell. Center the symbol in the cell; respect `rotation` (CSS `transform: rotate(...)` or SVG `transform` on a `<g>` at cell center).
- Map each `PlacedComponent` from state to an SVG group: position at `(x * 50, y * 50)`, rotate by `rotation`, then draw the component’s symbol. Differentiate by `componentId` (colour or stroke is enough for MVP).

### 2.3 Click-to-place

- **Sidebar or toolbar:** List (or buttons) of the five components. Clicking a component sets “selected component” (and default rotation 0).
- **Grid click:** If a cell is empty and a component is selected, call `placeComponent(selectedId, x, y, 0)`. Then clear or keep selection (your choice; keep for multi-place is useful).
- **Click on existing component:** Option A: select it for rotation/deletion. Option B: just show rotation/delete controls. Prefer at least “select” so we can rotate or delete.

### 2.4 Rotation and delete

- **Rotation:** When a placed component is selected, show a “Rotate” button (or “R” hint). On click, call `rotateComponent(x, y)`.
- **Delete:** “Remove” or trash button for the selected component; call `removeComponent(x, y)`.

### 2.5 Highlight valid connection points

- When a component is selected (or on hover), compute `getValidConnectionTargets` for each of its ports. For each valid target cell or port, draw a highlight (e.g. circle or glow) on the SVG so users see where connections are valid. No need to draw “pipes” as lines yet if you want to keep MVP minimal; highlighting is enough to show connection validation.

### 2.6 Zustand integration

- Single store (or slices): catalog (read-only), grid state (placed components), selected cell/component, selected catalog item for placement. Actions: place, remove, rotate, setSelection, clearSelection. Selectors: get connections, get valid targets for (x, y, portId).

### 2.7 Seed example system

- **Seed data:** One JSON structure (or initial Zustand state) that places **all five** components in a small example layout so that:
  - At least one `pipe_straight`, one `elbow_90`, one `tee`, one `male_adapter`, one `drip_emitter_2lph` are visible.
  - Some of them are connected (adjacent and port-valid) so that connection highlighting or future pipe drawing would make sense.
- Load this seed on first load or via a “Load example” button so you can visualize the full set and connection logic immediately.

### 2.8 JSON export in UI

- Add a “Export” button that calls the Phase 1 export and downloads the JSON (or copies to clipboard). Optional: “Import” to load JSON into state (if you implement import in Phase 1, hook it here).

---

## File structure (suggested)

```
src/
  app/
    layout.tsx
    page.tsx              → plan/canvas page
    globals.css
  components/
    GridCanvas.tsx        → SVG grid + placed components
    ComponentSymbol.tsx   → one component’s SVG by id
    Toolbar.tsx           → component palette + rotate/delete/export
    ConnectionHighlights.tsx  → SVG overlay for valid targets
  lib/
    types.ts              → Port, PipeComponent, PlacedComponent, grid types
    catalog.ts            → pipe_straight, elbow_90, tee, male_adapter, drip_emitter_2lph
    gridEngine.ts         → place, remove, rotate; getConnections; getValidTargets
    export.ts             → grid state → JSON
    constants.ts          → CELL_SIZE = 50, GRID_WIDTH, GRID_HEIGHT
  store/
    useGridStore.ts       → Zustand store (grid state, selection, actions)
  data/
    seedSystem.json       → example layout using all 5 components (or in catalog as default state)
```

---

## Order of implementation

1. **Phase 1**
  - Types + constants + catalog (all five components with ports).
  - Grid engine: state shape, place/remove/rotate, rotateDirection, getConnections, getValidConnectionTargets.
  - Export to JSON (and optionally import).
2. **Phase 2**
  - Zustand store wiring to engine.
  - SVG grid + component symbols (by componentId) with rotation.
  - Toolbar: select component, click-to-place, select placed, rotate, remove, export.
  - Connection highlights from getValidConnectionTargets.
  - Seed data and load-example so the canvas shows a full example system.

---

## Out of scope (not in this plan)

- Phase 3: drag-and-drop, sidebar inventory, zoom/pan, cost calculator.
- BOM, SaaS, commercial features.
- Water flow simulation (only “these two ports can connect” validation).
- Multi-cell components (valves/manifolds); keep one component per cell.

