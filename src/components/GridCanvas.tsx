"use client";

import { useRef, useState, useEffect } from "react";
import { useGridStore } from "@/store/useGridStore";
import { getComponentById } from "@/lib/catalog";
import { CELL_SIZE, GRID_HEIGHT, GRID_WIDTH } from "@/lib/constants";
import { ComponentSymbol } from "./ComponentSymbol";
import { ConnectionHighlights } from "./ConnectionHighlights";

const WIDTH = GRID_WIDTH * CELL_SIZE;
const HEIGHT = GRID_HEIGHT * CELL_SIZE;

function eventToGrid(e: { clientX: number; clientY: number }, svg: SVGSVGElement | null): { gx: number; gy: number } | null {
  if (!svg) return null;
  const rect = svg.getBoundingClientRect();
  const scaleX = WIDTH / rect.width;
  const scaleY = HEIGHT / rect.height;
  const gx = Math.floor(((e.clientX - rect.left) * scaleX) / CELL_SIZE);
  const gy = Math.floor(((e.clientY - rect.top) * scaleY) / CELL_SIZE);
  if (gx >= 0 && gx < GRID_WIDTH && gy >= 0 && gy < GRID_HEIGHT) return { gx, gy };
  return null;
}

type MarqueeState = { start: { gx: number; gy: number }; current: { gx: number; gy: number } };
type DragMoveState = { start: { gx: number; gy: number } };

export function GridCanvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [marquee, setMarquee] = useState<MarqueeState | null>(null);
  const marqueeRef = useRef<MarqueeState | null>(null);
  marqueeRef.current = marquee;
  const [dragMove, setDragMove] = useState<DragMoveState | null>(null);
  const dragMoveRef = useRef<DragMoveState | null>(null);
  dragMoveRef.current = dragMove;
  const justDraggedRef = useRef(false);

  const grid = useGridStore((s) => s.grid);
  const selectedCatalogId = useGridStore((s) => s.selectedCatalogId);
  const selectedCells = useGridStore((s) => s.selectedCells);
  const place = useGridStore((s) => s.place);
  const setSelectedCells = useGridStore((s) => s.setSelectedCells);
  const moveSelection = useGridStore((s) => s.moveSelection);

  const handleCellClick = (gx: number, gy: number) => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    const key = `${gx},${gy}`;
    const placed = grid[key];
    if (placed) {
      setSelectedCells([{ x: gx, y: gy }]);
      return;
    }
    if (selectedCatalogId) {
      if (selectedCatalogId === "label") {
        const text = window.prompt("Enter text", "");
        if (text === null) return;
        place(selectedCatalogId, gx, gy, 0, text ?? "");
      } else {
        place(selectedCatalogId, gx, gy, 0);
      }
    } else {
      setSelectedCells([]);
    }
  };

  useEffect(() => {
    if (marquee === null) return;
    const onMouseMove = (e: MouseEvent) => {
      const pt = eventToGrid(e, svgRef.current);
      if (pt) setMarquee((m) => (m ? { ...m, current: pt } : null));
    };
    const onMouseUp = () => {
      const m = marqueeRef.current;
      if (!m) return;
      const { grid: g, setSelectedCells: setCells } = useGridStore.getState();
      const isClick = m.start.gx === m.current.gx && m.start.gy === m.current.gy;
      if (isClick) {
        const key = `${m.start.gx},${m.start.gy}`;
        setCells(g[key] ? [{ x: m.start.gx, y: m.start.gy }] : []);
      } else {
        const minGx = Math.min(m.start.gx, m.current.gx);
        const maxGx = Math.max(m.start.gx, m.current.gx);
        const minGy = Math.min(m.start.gy, m.current.gy);
        const maxGy = Math.max(m.start.gy, m.current.gy);
        const cells: { x: number; y: number }[] = [];
        for (let gx = minGx; gx <= maxGx; gx++) {
          for (let gy = minGy; gy <= maxGy; gy++) {
            if (g[`${gx},${gy}`]) cells.push({ x: gx, y: gy });
          }
        }
        setCells(cells);
      }
      setMarquee(null);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [marquee]);

  useEffect(() => {
    if (dragMove === null) return;
    const onMouseUp = (e: MouseEvent) => {
      const d = dragMoveRef.current;
      if (!d) return;
      const pt = eventToGrid(e, svgRef.current);
      if (pt) {
        const dx = pt.gx - d.start.gx;
        const dy = pt.gy - d.start.gy;
        if (dx !== 0 || dy !== 0) {
          justDraggedRef.current = true;
          moveSelection(dx, dy);
        }
      }
      setDragMove(null);
    };
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [dragMove, moveSelection]);

  const handleBackgroundMouseDown = (e: React.MouseEvent<SVGRectElement>) => {
    if (selectedCatalogId) return;
    const svg = e.currentTarget.ownerSVGElement!;
    const pt = eventToGrid(e, svg);
    if (pt) setMarquee({ start: pt, current: pt });
  };

  return (
    <svg
      ref={svgRef}
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
      <rect
        width={WIDTH}
        height={HEIGHT}
        fill="url(#grid-pattern)"
        onMouseDown={handleBackgroundMouseDown}
        className="cursor-default"
      />
      {marquee && (
        <rect
          x={Math.min(marquee.start.gx, marquee.current.gx) * CELL_SIZE}
          y={Math.min(marquee.start.gy, marquee.current.gy) * CELL_SIZE}
          width={(Math.abs(marquee.current.gx - marquee.start.gx) + 1) * CELL_SIZE}
          height={(Math.abs(marquee.current.gy - marquee.start.gy) + 1) * CELL_SIZE}
          fill="rgb(147 51 234 / 0.1)"
          stroke="rgb(147 51 234)"
          strokeWidth={2}
          className="pointer-events-none"
        />
      )}
      <ConnectionHighlights />
      {Object.entries(grid).map(([key, placed]) => {
        const [x, y] = key.split(",").map(Number);
        const component = getComponentById(placed.componentId);
        if (!component) return null;
        const selected = selectedCells.some((c) => c.x === x && c.y === y);
        return (
          <g
            key={key}
            transform={`translate(${x * CELL_SIZE}, ${y * CELL_SIZE})`}
            data-tour={placed.componentId === "tap" ? "example-tap" : undefined}
            onMouseDown={() => {
              if (selected && selectedCells.length > 0) setDragMove({ start: { gx: x, gy: y } });
            }}
            onClick={() => handleCellClick(x, y)}
            className={selected && selectedCells.length > 0 ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}
          >
            <title>{component.name}</title>
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
            <ComponentSymbol component={component} rotation={placed.rotation} selected={selected} text={placed.text} />
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

