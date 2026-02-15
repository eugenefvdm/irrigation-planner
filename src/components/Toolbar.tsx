"use client";

import { useGridStore } from "@/store/useGridStore";
import { getSeedGrid } from "@/data/seedSystem";
import { ComponentSymbol } from "./ComponentSymbol";

const TOOLBAR_ICON_SIZE = 32;

function ZoomOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
    </svg>
  );
}

function ZoomInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
    </svg>
  );
}

function UndoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
  );
}

function RedoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H6a6 6 0 000 12h3" />
    </svg>
  );
}

export function Toolbar() {
  const catalog = useGridStore((s) => s.catalog);
  const selectedCatalogId = useGridStore((s) => s.selectedCatalogId);
  const setSelectedCatalog = useGridStore((s) => s.setSelectedCatalog);
  const selectedCell = useGridStore((s) => s.selectedCell);
  const setSelectedCell = useGridStore((s) => s.setSelectedCell);
  const rotate = useGridStore((s) => s.rotate);
  const remove = useGridStore((s) => s.remove);
  const exportJson = useGridStore((s) => s.exportJson);
  const loadFromJson = useGridStore((s) => s.loadFromJson);
  const zoom = useGridStore((s) => s.zoom);
  const zoomIn = useGridStore((s) => s.zoomIn);
  const zoomOut = useGridStore((s) => s.zoomOut);
  const undo = useGridStore((s) => s.undo);
  const redo = useGridStore((s) => s.redo);
  const history = useGridStore((s) => s.history);
  const historyIndex = useGridStore((s) => s.historyIndex);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const btnClass =
    "p-1.5 rounded border transition-colors border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-50 disabled:pointer-events-none";

  const handleLoadExample = () => {
    useGridStore.getState().loadGrid(getSeedGrid());
  };

  const handleExport = () => {
    const json = exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "irrigation-plan.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const STORAGE_KEY = "irrigation-diagram";

  const handleSave = () => {
    const json = exportJson();
    localStorage.setItem(STORAGE_KEY, json);
  };

  const handleLoad = () => {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) loadFromJson(json);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
      <div className="flex items-center gap-1">
        <button type="button" title="Zoom out" onClick={zoomOut} className={btnClass}>
          <ZoomOutIcon className="size-5" />
        </button>
        <span className="min-w-[2.5rem] text-center text-sm text-stone-600 dark:text-stone-400">
          {Math.round(zoom * 100)}%
        </span>
        <button type="button" title="Zoom in" onClick={zoomIn} className={btnClass}>
          <ZoomInIcon className="size-5" />
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button type="button" title="Undo" onClick={undo} disabled={!canUndo} className={btnClass}>
          <UndoIcon className="size-5" />
        </button>
        <button type="button" title="Redo" onClick={redo} disabled={!canRedo} className={btnClass}>
          <RedoIcon className="size-5" />
        </button>
      </div>
      <span className="w-px h-6 bg-stone-300 dark:bg-stone-600" />
      <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Place:</span>
      {catalog.map((c) => (
        <button
          key={c.id}
          type="button"
          title={c.name}
          onClick={() => setSelectedCatalog(selectedCatalogId === c.id ? null : c.id)}
          className={`p-1.5 rounded border transition-colors ${
            selectedCatalogId === c.id
              ? "bg-amber-100 dark:bg-amber-900/40 border-amber-500 dark:border-amber-400 text-amber-800 dark:text-amber-200"
              : "bg-stone-50 dark:bg-stone-700/50 border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
          }`}
        >
          <svg width={TOOLBAR_ICON_SIZE} height={TOOLBAR_ICON_SIZE} viewBox={`0 0 ${TOOLBAR_ICON_SIZE} ${TOOLBAR_ICON_SIZE}`} className="block">
            <ComponentSymbol component={c} size={TOOLBAR_ICON_SIZE} rotation={0} selected={selectedCatalogId === c.id} />
          </svg>
        </button>
      ))}
      <span className="w-px h-6 bg-stone-300 dark:bg-stone-600" />
      {selectedCell && (
        <>
          <button
            type="button"
            onClick={() => rotate(selectedCell.x, selectedCell.y)}
            className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
          >
            Rotate
          </button>
          <button
            type="button"
            onClick={() => remove(selectedCell.x, selectedCell.y)}
            className="px-3 py-1.5 rounded text-sm border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300"
          >
            Remove
          </button>
        </>
      )}
      <span className="flex-1" />
      <button
        type="button"
        onClick={handleSave}
        className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
      >
        Save
      </button>
      <button
        type="button"
        onClick={handleLoad}
        className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
      >
        Load
      </button>
      <button
        type="button"
        onClick={handleLoadExample}
        className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
      >
        Load example
      </button>
      <button
        type="button"
        onClick={handleExport}
        className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
      >
        Export JSON
      </button>
    </div>
  );
}
