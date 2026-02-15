"use client";

import { useGridStore } from "@/store/useGridStore";
import { getComponentById } from "@/lib/catalog";
import { CELL_SIZE, GRID_HEIGHT, GRID_WIDTH } from "@/lib/constants";
import { ComponentSymbol } from "./ComponentSymbol";
import { ConnectionHighlights } from "./ConnectionHighlights";

const WIDTH = GRID_WIDTH * CELL_SIZE;
const HEIGHT = GRID_HEIGHT * CELL_SIZE;

export function GridCanvas() {
  const grid = useGridStore((s) => s.grid);
  const selectedCatalogId = useGridStore((s) => s.selectedCatalogId);
  const selectedCell = useGridStore((s) => s.selectedCell);
  const place = useGridStore((s) => s.place);
  const setSelectedCell = useGridStore((s) => s.setSelectedCell);
  const setSelectedCatalog = useGridStore((s) => s.setSelectedCatalog);

  const handleCellClick = (gx: number, gy: number) => {
    const key = `${gx},${gy}`;
    const placed = grid[key];
    if (placed) {
      setSelectedCell(gx, gy);
      return;
    }
    if (selectedCatalogId) {
      place(selectedCatalogId, gx, gy, 0);
    } else {
      setSelectedCell(null, null);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<SVGRectElement>) => {
    const svg = e.currentTarget.ownerSVGElement!;
    const rect = svg.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const scaleY = HEIGHT / rect.height;
    const gx = Math.floor(((e.clientX - rect.left) * scaleX) / CELL_SIZE);
    const gy = Math.floor(((e.clientY - rect.top) * scaleY) / CELL_SIZE);
    if (gx >= 0 && gx < GRID_WIDTH && gy >= 0 && gy < GRID_HEIGHT && !grid[`${gx},${gy}`]) {
      setSelectedCell(null, null);
    }
  };

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      className="border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800"
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <defs>
        <pattern id="grid-pattern" width={CELL_SIZE} height={CELL_SIZE} patternUnits="userSpaceOnUse">
          <path
            d={`M ${CELL_SIZE} 0 L 0 0 0 ${CELL_SIZE}`}
            fill="none"
            stroke="rgb(228 228 231)"
            strokeWidth="0.5"
            className="dark:stroke-stone-600"
          />
        </pattern>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="url(#grid-pattern)" onClick={handleBackgroundClick} className="cursor-default" />
      <ConnectionHighlights />
      {Object.entries(grid).map(([key, placed]) => {
        const [x, y] = key.split(",").map(Number);
        const component = getComponentById(placed.componentId);
        if (!component) return null;
        const selected = selectedCell?.x === x && selectedCell?.y === y;
        return (
          <g
            key={key}
            transform={`translate(${x * CELL_SIZE}, ${y * CELL_SIZE})`}
            onClick={() => handleCellClick(x, y)}
            className="cursor-pointer"
          >
            {selected && (
              <rect
                x={1}
                y={1}
                width={CELL_SIZE - 2}
                height={CELL_SIZE - 2}
                rx={4}
                fill="rgb(245 158 11 / 0.15)"
                stroke="rgb(245 158 11)"
                strokeWidth={2}
              />
            )}
            <ComponentSymbol component={component} rotation={placed.rotation} selected={selected} />
          </g>
        );
      })}
      {selectedCatalogId && (
        <g>
          {Array.from({ length: GRID_HEIGHT }, (_, gy) =>
            Array.from({ length: GRID_WIDTH }, (_, gx) => {
              const key = `${gx},${gy}`;
              if (grid[key]) return null;
              return (
                <rect
                  key={key}
                  x={gx * CELL_SIZE + 2}
                  y={gy * CELL_SIZE + 2}
                  width={CELL_SIZE - 4}
                  height={CELL_SIZE - 4}
                  className="cursor-crosshair fill-transparent hover:fill-amber-500/10 dark:hover:fill-amber-400/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCellClick(gx, gy);
                  }}
                />
              );
            })
          )}
        </g>
      )}
    </svg>
  );
}
