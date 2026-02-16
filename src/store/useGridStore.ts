import { create } from "zustand";
import type { GridState, PlacedComponent } from "@/lib/types";
import {
  placeComponent as enginePlace,
  removeComponent as engineRemove,
  rotateComponent as engineRotate,
  moveComponents as engineMoveComponents,
  removeComponents as engineRemoveComponents,
  rotateComponents as engineRotateComponents,
  getConnections,
  getValidConnectionTargets,
} from "@/lib/gridEngine";
import { COMPONENT_CATALOG } from "@/lib/catalog";
import { exportGridToJson, importGridFromJson } from "@/lib/export";

type Rotation = 0 | 90 | 180 | 270;

export type SelectionCell = { x: number; y: number };

const MAX_HISTORY = 50;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.25;

const DEFAULT_DOCUMENT_NAME = "Untitled";

interface GridStore {
  grid: GridState;
  history: GridState[];
  historyIndex: number;
  zoom: number;
  documentName: string;
  selectedCatalogId: string | null;
  selectedCells: SelectionCell[];
  place: (componentId: string, x: number, y: number, rotation?: Rotation, text?: string) => void;
  remove: (x: number, y: number) => void;
  rotate: (x: number, y: number) => void;
  undo: () => void;
  redo: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setSelectedCatalog: (id: string | null) => void;
  setSelectedCells: (cells: SelectionCell[]) => void;
  moveSelection: (dx: number, dy: number) => void;
  removeSelection: () => void;
  rotateSelection: () => void;
  getConnections: () => ReturnType<typeof getConnections>;
  getValidTargets: (x: number, y: number, portId?: string) => ReturnType<typeof getValidConnectionTargets>;
  loadGrid: (grid: GridState) => void;
  loadFromJson: (json: string) => void;
  exportJson: () => string;
  setDocumentName: (name: string) => void;
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
  documentName: DEFAULT_DOCUMENT_NAME,
  selectedCatalogId: null,
  selectedCells: [],
  catalog: COMPONENT_CATALOG,

  place(componentId, x, y, rotation = 0, text) {
    const grid = get().grid;
    const nextGrid = enginePlace(grid, componentId, x, y, rotation, text);
    const { history, historyIndex } = pushHistory(get, nextGrid);
    set({ grid: nextGrid, history, historyIndex });
  },

  remove(x, y) {
    const grid = get().grid;
    const nextGrid = engineRemove(grid, x, y);
    const { history, historyIndex } = pushHistory(get, nextGrid);
    set({ grid: nextGrid, history, historyIndex, selectedCells: [] });
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
    set({ grid: history[nextIndex], historyIndex: nextIndex, selectedCells: [] });
  },

  redo() {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    set({ grid: history[nextIndex], historyIndex: nextIndex, selectedCells: [] });
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

  setSelectedCells(cells) {
    set({ selectedCells: cells });
  },

  moveSelection(dx, dy) {
    const { grid, selectedCells } = get();
    if (selectedCells.length === 0) return;
    const nextGrid = engineMoveComponents(grid, selectedCells, dx, dy);
    if (nextGrid === grid) return;
    const { history, historyIndex } = pushHistory(get, nextGrid);
    const newPositions = selectedCells.map((c) => ({ x: c.x + dx, y: c.y + dy }));
    set({ grid: nextGrid, history, historyIndex, selectedCells: newPositions });
  },

  removeSelection() {
    const { grid, selectedCells } = get();
    if (selectedCells.length === 0) return;
    const nextGrid = engineRemoveComponents(grid, selectedCells);
    const { history, historyIndex } = pushHistory(get, nextGrid);
    set({ grid: nextGrid, history, historyIndex, selectedCells: [] });
  },

  rotateSelection() {
    const { grid, selectedCells } = get();
    if (selectedCells.length === 0) return;
    const nextGrid = engineRotateComponents(grid, selectedCells);
    const { history, historyIndex } = pushHistory(get, nextGrid);
    set({ grid: nextGrid, history, historyIndex });
  },

  getConnections() {
    return getConnections(get().grid);
  },

  getValidTargets(x, y, portId) {
    return getValidConnectionTargets(get().grid, x, y, portId);
  },

  loadGrid(grid) {
    set({ grid, history: [grid], historyIndex: 0, selectedCells: [] });
  },

  loadFromJson(json) {
    try {
      const { grid, zoom, name } = importGridFromJson(json);
      set({
        grid,
        history: [grid],
        historyIndex: 0,
        selectedCells: [],
        ...(zoom != null && { zoom }),
        documentName: name ?? DEFAULT_DOCUMENT_NAME,
      });
    } catch {
      // ignore invalid json
    }
  },

  exportJson() {
    const { grid, zoom, documentName } = get();
    return exportGridToJson(grid, { zoom, name: documentName });
  },

  setDocumentName(name) {
    set({ documentName: name.trim() || DEFAULT_DOCUMENT_NAME });
  },
}));
