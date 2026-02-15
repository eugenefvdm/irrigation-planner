# AI hints (for future “same question” context)

## Pipe icon margin / “extend lines closer to the ends”

**What was used to answer:**
- Icons are the **horizontal** and **vertical straight pipe** symbols (brown line + yellow endpoint dots in dark grey rounded cells).
- They are implemented in **`src/components/ComponentSymbol.tsx`**.
- The two cases are:
  - **`pipe_straight`** – horizontal line, dots at left/right.
  - **`pipe_straight_v`** – vertical line, dots at top/bottom.
- A single **`margin`** value controls inset from the cell edges for both:
  - Defined near the top of the component: `const margin = (4 / 50) * S;` (was `(8 / 50) * S`).
  - Used for line endpoints and port-dot positions (`x1`, `x2`, `y1`, `y2`, and `circle` cx/cy).
- **To extend lines closer to the ends (less margin):** decrease the margin fraction, e.g. `(4/50)*S` or `(2/50)*S`. Don’t go so small that port dots (radius `rSmall = (3/50)*S`) are clipped by the cell.
- Port dot radius: `rSmall = (3 / 50) * S`; class for dot color: `PORT_DOT_CLASS` (amber).

## Load and Save (MVP)

**What was used to answer:**
- **Save**: Persists current diagram to `localStorage` under key `"irrigation-diagram"`. Uses `useGridStore().exportJson()` from `src/store/useGridStore.ts`, which calls `exportGridToJson` from `src/lib/export.ts`. No filenames; single saved state per origin.
- **Load**: Reads from `localStorage.getItem("irrigation-diagram")` and calls `loadFromJson(json)` on the store. Store uses `importGridFromJson` from `src/lib/export.ts`. Replaces current grid and resets history.
- Buttons are in **`src/components/Toolbar.tsx`** (`handleSave`, `handleLoad`). Styling matches other toolbar buttons (stone borders, dark mode support).

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
- Native SVG `<title>` as first child of each component’s `<g>`: `<title>{component.name}</title>`. Browser shows tooltip on hover; delay is browser-controlled (~1–2s).
