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
