import { create } from "zustand";
import type { GridState, PlacedComponent } from "@/lib/types";
import {
  placeComponent as enginePlace,
  removeComponent as engineRemove,
  rotateComponent as engineRotate,
  getConnections,
  getValidConnectionTargets,
} from "@/lib/gridEngine";
import { COMPONENT_CATALOG } from "@/lib/catalog";
import { exportGridToJson, importGridFromJson } from "@/lib/export";

type Rotation = 0 | 90 | 180 | 270;

interface Selection {
  x: number;
  y: number;
}

const MAX_HISTORY = 50;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.25;

interface GridStore {
  grid: GridState;
  history: GridState[];
  historyIndex: number;
  zoom: number;
  selectedCatalogId: string | null;
  selectedCell: Selection | null;
  place: (componentId: string, x: number, y: number, rotation?: Rotation) => void;
  remove: (x: number, y: number) => void;
  rotate: (x: number, y: number) => void;
  undo: () => void;
  redo: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setSelectedCatalog: (id: string | null) => void;
  setSelectedCell: (x: number | null, y: number | null) => void;
  getConnections: () => ReturnType<typeof getConnections>;
  getValidTargets: (x: number, y: number, portId?: string) => ReturnType<typeof getValidConnectionTargets>;
  loadGrid: (grid: GridState) => void;
  loadFromJson: (json: string) => void;
  exportJson: () => string;
  catalog: typeof COMPONENT_CATALOG;
}

function pushHistory(get: () => GridStore, nextGrid: GridState): { history: GridState[]; historyIndex: number } {
  let { history, historyIndex } = get();
  if (historyIndex < history.length - 1) {
    history = history.slice(0, historyIndex + 1);
  }
  history = [...history, nextGrid];
  if (history.length > MAX_HISTORY) {
    history = history.slice(1);
  }
  return { history, historyIndex: history.length - 1 };
}

export const useGridStore = create<GridStore>((set, get) => ({
  grid: {},
  history: [{}],
  historyIndex: 0,
  zoom: 1,
  selectedCatalogId: null,
  selectedCell: null,
  catalog: COMPONENT_CATALOG,

  place(componentId, x, y, rotation = 0) {
    const grid = get().grid;
    const nextGrid = enginePlace(grid, componentId, x, y, rotation);
    const { history, historyIndex } = pushHistory(get, nextGrid);
    set({ grid: nextGrid, history, historyIndex });
  },

  remove(x, y) {
    const grid = get().grid;
    const nextGrid = engineRemove(grid, x, y);
    const { history, historyIndex } = pushHistory(get, nextGrid);
    set({ grid: nextGrid, history, historyIndex, selectedCell: null });
  },

  rotate(x, y) {
    const grid = get().grid;
    const nextGrid = engineRotate(grid, x, y);
    const { history, historyIndex } = pushHistory(get, nextGrid);
    set({ grid: nextGrid, history, historyIndex });
  },

  undo() {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    set({ grid: history[nextIndex], historyIndex: nextIndex, selectedCell: null });
  },

  redo() {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    set({ grid: history[nextIndex], historyIndex: nextIndex, selectedCell: null });
  },

  zoomIn() {
    set((s) => ({ zoom: Math.min(ZOOM_MAX, s.zoom + ZOOM_STEP) }));
  },

  zoomOut() {
    set((s) => ({ zoom: Math.max(ZOOM_MIN, s.zoom - ZOOM_STEP) }));
  },

  setSelectedCatalog(id) {
    set({ selectedCatalogId: id });
  },

  setSelectedCell(x, y) {
    if (x === null || y === null) set({ selectedCell: null });
    else set({ selectedCell: { x, y } });
  },

  getConnections() {
    return getConnections(get().grid);
  },

  getValidTargets(x, y, portId) {
    return getValidConnectionTargets(get().grid, x, y, portId);
  },

  loadGrid(grid) {
    set({ grid, history: [grid], historyIndex: 0, selectedCell: null });
  },

  loadFromJson(json) {
    try {
      const grid = importGridFromJson(json);
      set({ grid, history: [grid], historyIndex: 0, selectedCell: null });
    } catch {
      // ignore invalid json
    }
  },

  exportJson() {
    return exportGridToJson(get().grid);
  },
}));
