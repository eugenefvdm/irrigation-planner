import type { ExportData, GridState, PlacedComponent } from "./types";
import { GRID_HEIGHT, GRID_WIDTH } from "./constants";

const EXPORT_VERSION = 1;

export interface ExportOptions {
  zoom?: number;
  name?: string;
}

export function exportGridToJson(grid: GridState, options?: ExportOptions): string {
  const placed: PlacedComponent[] = Object.values(grid);
  const data: ExportData = {
    version: EXPORT_VERSION,
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    placed,
    ...(options?.zoom != null && { zoom: options.zoom }),
    ...(options?.name != null && options.name !== "" && { name: options.name }),
  };
  return JSON.stringify(data, null, 2);
}

export interface ImportResult {
  grid: GridState;
  zoom?: number;
  name?: string;
}

export function importGridFromJson(json: string): ImportResult {
  const data = JSON.parse(json) as ExportData;
  const grid: GridState = {};
  for (const p of data.placed ?? []) {
    if (
      typeof p.x === "number" &&
      typeof p.y === "number" &&
      typeof p.componentId === "string" &&
      [0, 90, 180, 270].includes(p.rotation as number)
    ) {
      const key = `${p.x},${p.y}`;
      grid[key] = {
        componentId: p.componentId,
        x: p.x,
        y: p.y,
        rotation: p.rotation as 0 | 90 | 180 | 270,
        ...(typeof p.text === "string" && { text: p.text }),
      };
    }
  }
  const zoom =
    typeof data.zoom === "number" && data.zoom >= 0.5 && data.zoom <= 2 ? data.zoom : undefined;
  const name = typeof data.name === "string" ? data.name : undefined;
  return { grid, ...(zoom != null && { zoom }), ...(name != null && { name }) };
}
