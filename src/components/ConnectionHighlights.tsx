"use client";

import { useGridStore } from "@/store/useGridStore";
import { CELL_SIZE } from "@/lib/constants";

const HALF = CELL_SIZE / 2;

export function ConnectionHighlights() {
  const selectedCells = useGridStore((s) => s.selectedCells);
  const getValidTargets = useGridStore((s) => s.getValidTargets);
  const grid = useGridStore((s) => s.grid);

  if (selectedCells.length !== 1) return null;
  const cell = selectedCells[0];
  const key = `${cell.x},${cell.y}`;
  if (!grid[key]) return null;

  const targets = getValidTargets(cell.x, cell.y);

  return (
    <g className="pointer-events-none">
      {targets.map((t) => (
        <g key={`${t.x},${t.y},${t.portId}`}>
          <circle
            cx={t.x * CELL_SIZE + HALF}
            cy={t.y * CELL_SIZE + HALF}
            r={14}
            fill="rgb(34 197 94 / 0.25)"
            stroke="rgb(34 197 94)"
            strokeWidth={2}
          />
        </g>
      ))}
    </g>
  );
}
