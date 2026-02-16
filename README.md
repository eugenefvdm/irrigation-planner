# Irrigation Builder

## Getting started

1. Open the app and (optionally) click **Help** in the toolbar for a short guided tour.
2. Click **Load example** to load a sample irrigation plan.
3. In the diagram you’ll see the **tap** and the rest of the example layout.
4. **Place piping** by choosing an icon in the task bar, then clicking on the grid.
5. Use **Save** to download your diagram as a JSON file.

---

# AI hints (for future "same question" context)

## How pipes and junctions are drawn

**Where to look:** **`src/components/ComponentSymbol.tsx`**.

- Each symbol is an SVG `<g>` with optional `transform={rotate(...)}` (0/90/180/270). All coordinates are in **cell-local space** (0 to `S` where `S = CELL_SIZE`, typically 50).
- **Shared layout:** `margin` controls how far lines and port circles sit from the cell edges. With `margin = 0`, lines run **edge-to-edge** so that connection circles from adjacent cells meet at the same world position (joins look continuous; T-bars and straight couplings are compact).
- **Pipe segments:** `pipe_straight` draws a horizontal `<line>` and two port `<circle>`s at the ends; `pipe_straight_v` is vertical. Line and circles use the same endpoints (`margin` to `S - margin`; with margin 0 that's 0 to S).
- **Tees / elbows:** `tee`, `tee_n`, `tee_e`, `tee_w` and `elbow_90*` use `<path>` with `M`/`L`/`H`/`V`. Each has port circles at line ends and at the branch; stem lines go from center (`HALF`) to the relevant edge so the branch port sits on the main run.
- **Drip emitters:** One vertical line from the emitter circle down to the bottom edge, with a port circle at `(HALF, S - margin)`. **Tap** has a spout and one horizontal line + port to the right.
- **Port dot radius:** `rSmall = (3 / 50) * S`; color via `PORT_DOT_CLASS` (amber). To make joins closer, reduce or zero `margin`; zero gives overlapping circles at cell boundaries.

## How the grid positions each cell

**Where to look:** **`src/components/GridCanvas.tsx`**.

- The grid is one SVG. Each placed component is a `<g>` with `transform={translate(x*CELL_SIZE, y*CELL_SIZE)}` (see GridCanvas). So cell `(gx, gy)` has its symbol drawn in a box from `(gx*CELL_SIZE, gy*CELL_SIZE)` to `((gx+1)*CELL_SIZE, (gy+1)*CELL_SIZE)`.
- **Cell size:** **`src/lib/constants.ts`** – `CELL_SIZE = 50`, `GRID_WIDTH`, `GRID_HEIGHT`.
- **Shared edges:** The right edge of cell (gx, gy) and the left edge of cell (gx+1, gy) both map to the same x in world space (`(gx+1) * CELL_SIZE`). So when symbols use `margin = 0` and draw port circles at 0 and S, the circle at the right edge of one cell and the circle at the left edge of the next cell render at the same pixel (joins overlap as intended).

## Pipe icon margin / "extend lines closer to the ends" (compact joins)

**What was used to answer:**
- Icons are implemented in **`src/components/ComponentSymbol.tsx`** (see **How pipes and junctions are drawn** above).
- A single **`margin`** at the top of the component controls inset from the cell edges for line endpoints and port-dot positions. **Current value:** `margin = 0` so lines run edge-to-edge and connection circles overlap at T-bars and straight couplings.
- **To make joins less compact again:** set e.g. `const margin = (4 / 50) * S;`. Port dot radius: `rSmall = (3 / 50) * S`; class: `PORT_DOT_CLASS` (amber).

## Load and Save (MVP)

**What was used to answer:**
- **Save**: Downloads the current diagram as a JSON file. If the document name is "Untitled", prompts for a name and uses it (sanitized) as the filename; otherwise uses the current document name. Uses `useGridStore().exportJson()` from `src/store/useGridStore.ts`, which calls `exportGridToJson` from `src/lib/export.ts`. Ctrl+S triggers Save.
- **Load**: Opens a file picker; the selected JSON file is read and loaded via `loadFromJson` on the store. Store uses `importGridFromJson` from `src/lib/export.ts`. Replaces current grid and resets history. If there are unsaved changes, user is asked to confirm before loading.
- Buttons are in **`src/components/Toolbar.tsx`** (`handleSave`, `handleLoadClick` / `handleLoadFile`). Styling matches other toolbar buttons (stone borders, dark mode support).

## Click cell to select object (not only on the object)

**What was used to answer:**
- Selection is in **`src/components/GridCanvas.tsx`**. The grid has (1) a full-size background `<rect>` with `handleBackgroundClick`, and (2) each placed component is a `<g>` with `onClick={() => handleCellClick(x, y)}`. Clicks on the symbol hit the `<g>`; clicks on empty area of a cell hit the background rect.
- **Before:** `handleBackgroundClick` only did something when the cell was *empty* (`!grid[key]`): it called `setSelectedCell(null, null)`. So clicking empty space inside a cell that had an object did nothing.
- **Fix:** In `handleBackgroundClick`, after computing grid cell `(gx, gy)` from the click, if the cell has an object (`grid[key]`), call `setSelectedCell(gx, gy)`; otherwise call `setSelectedCell(null, null)`. So clicking anywhere in the cell (background or symbol) selects the object in that cell.
- Store: **`src/store/useGridStore.ts`** (`selectedCell`, `setSelectedCell`).

## Checking the catalog for how emitter components and ports are defined

**What was used to answer:**
- **Catalog:** **`src/lib/catalog.ts`** – `COMPONENT_CATALOG` is an array of `PipeComponent` (from `src/lib/types.ts`). Each entry has `id`, `name`, `category`, and `ports`.
- **Types:** **`src/lib/types.ts`** – `PipeComponent` has `id`, `name`, `category` (`"fitting" | "connector" | "emitter"`), and `ports: Port[]`. Each `Port` has `id`, `type` (`"slip" | "male_thread" | "female_thread" | "barb"`), and `direction` (`"north" | "south" | "east" | "west"`).
- **Emitters:** Emitter components (e.g. `drip_emitter_2lph`, `drip_emitter_4lph`, `drip_emitter_8lph`) use `category: "emitter"` and a single barb port, e.g. `ports: [{ id: "p1", type: "barb", direction: "south" }]`.
- **Symbols:** Rendering for each `component.id` is in **`src/components/ComponentSymbol.tsx`** (switch on `component.id`). Multiple catalog IDs can share one case (e.g. the three drip emitters use one case and derive the label from `component.id`).

## Connection highlights (green circles for valid targets)

**What was used to answer:**
- Green circles for valid connection targets are rendered by **`src/components/ConnectionHighlights.tsx`**. It calls `getValidTargets(selectedCell)` from the store; engine logic is in **`src/lib/gridEngine.ts`** (`getValidConnectionTargets`).
- **Render order:** ConnectionHighlights is rendered after the background rect, *before* the placed components. Rendering it last (on top) caused highlights to disappear entirely; keep current order.
- **Tap alignment:** The tap symbol in **`src/components/ComponentSymbol.tsx`** uses `baseY = HALF` (not `HALF + 2`) so it aligns vertically with other components. Port is at right edge `(S - margin, baseY)`; catalog has `direction: "east"`.
- **Port compatibility:** `getValidConnectionTargets` requires adjacent cells, facing ports, and compatible types (slip–slip, male_thread–female_thread, barb–slip). Tap has `female_thread`; only `male_adapter` (male_thread) connects to it.

## Tooltips (grid component hover)

**What was used to answer:**
- Tooltips for placed components live in **`src/components/GridCanvas.tsx`**.
- Native SVG `<title>` as first child of each component's `<g>`: `<title>{component.name}</title>`. Browser shows tooltip on hover; delay is browser-controlled (~1–2s).
