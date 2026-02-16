"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useGridStore } from "@/store/useGridStore";
import { useThemeStore, type Theme } from "@/store/useThemeStore";
import { exampleJson } from "@/data/example";
import { GRID_HEIGHT, GRID_WIDTH } from "@/lib/constants";
import { exportGridToJson } from "@/lib/export";
import { ComponentSymbol } from "./ComponentSymbol";

function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(null), 2000);
    return () => clearTimeout(id);
  }, [message]);

  return { message, show };
}

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

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  );
}

function ComputerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  );
}

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function Toolbar() {
  const toast = useToast();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const catalog = useGridStore((s) => s.catalog);
  const selectedCatalogId = useGridStore((s) => s.selectedCatalogId);
  const setSelectedCatalog = useGridStore((s) => s.setSelectedCatalog);
  const selectedCells = useGridStore((s) => s.selectedCells);
  const rotateSelection = useGridStore((s) => s.rotateSelection);
  const removeSelection = useGridStore((s) => s.removeSelection);
  const moveSelection = useGridStore((s) => s.moveSelection);
  const exportJson = useGridStore((s) => s.exportJson);
  const zoom = useGridStore((s) => s.zoom);
  const zoomIn = useGridStore((s) => s.zoomIn);
  const zoomOut = useGridStore((s) => s.zoomOut);
  const undo = useGridStore((s) => s.undo);
  const redo = useGridStore((s) => s.redo);
  const history = useGridStore((s) => s.history);
  const historyIndex = useGridStore((s) => s.historyIndex);
  const grid = useGridStore((s) => s.grid);
  const documentName = useGridStore((s) => s.documentName);
  const setDocumentName = useGridStore((s) => s.setDocumentName);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(documentName);
  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editingName) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [editingName]);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const lastSavedSnapshotRef = useRef<string | null>(null);

  function checkDirty(): boolean {
    if (lastSavedSnapshotRef.current === null) {
      return Object.keys(grid).length > 0;
    }
    return exportJson() !== lastSavedSnapshotRef.current;
  }

  const btnClass =
    "p-1.5 rounded border transition-colors border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-50 disabled:pointer-events-none";

  const handleNew = () => {
    if (checkDirty()) {
      const discard = window.confirm(
        "You have unsaved changes. Discard and start a new diagram?"
      );
      if (!discard) return;
    }
    const emptyJson = exportGridToJson({}, { name: "Untitled" });
    useGridStore.getState().loadFromJson(emptyJson);
    lastSavedSnapshotRef.current = emptyJson;
    toast.show("New diagram");
  };

  const handleLoadExample = () => {
    if (checkDirty()) {
      const discard = window.confirm(
        "You have unsaved changes. Discard and load example anyway?"
      );
      if (!discard) return;
    }
    useGridStore.getState().loadFromJson(exampleJson);
    lastSavedSnapshotRef.current = exportJson();
  };

  const saveAsFilename = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `irrigation-plan-${y}-${m}-${d}-${h}-${min}.json`;
  };

  function downloadAsFile(json: string, filename: string) {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".json") ? filename : `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleSaveAs = () => {
    const json = exportJson();
    downloadAsFile(json, saveAsFilename());
  };

  const handleSave = () => {
    if (documentName === "Untitled") {
      const name = window.prompt("Enter a name for this diagram (file will be downloaded):");
      if (name == null) return;
      const trimmed = name.trim();
      const fileStem = trimmed
        ? trimmed.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
        : saveAsFilename().replace(/\.json$/i, "");
      const displayName = trimmed || fileStem;
      setDocumentName(displayName);
      const json = exportJson();
      downloadAsFile(json, fileStem);
      lastSavedSnapshotRef.current = json;
      toast.show("Saved");
      return;
    }
    const json = exportJson();
    const fileStem = documentName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") || saveAsFilename().replace(/\.json$/i, "");
    downloadAsFile(json, fileStem);
    lastSavedSnapshotRef.current = json;
    toast.show("Saved");
  };

  const loadFromJson = useGridStore((s) => s.loadFromJson);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    file.text().then(
      (text) => {
        if (checkDirty()) {
          const discard = window.confirm(
            "You have unsaved changes. Discard and load from file anyway?"
          );
          if (!discard) return;
        }
        try {
          loadFromJson(text);
          lastSavedSnapshotRef.current = exportJson();
          toast.show("Loaded");
        } catch {
          toast.show("Invalid file");
        }
      },
      () => toast.show("Invalid file")
    );
  };

  const saveHandlerRef = useRef(handleSave);
  saveHandlerRef.current = handleSave;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveHandlerRef.current();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
        e.preventDefault();
        removeSelection();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [removeSelection]);

  return (
    <>
      {toast.message && (
        <div
          role="status"
          className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-sm font-medium transition-opacity duration-200"
        >
          {toast.message}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
      {editingName ? (
        <input
          ref={nameInputRef}
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={() => {
            setDocumentName(nameInput);
            setEditingName(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setDocumentName(nameInput);
              setEditingName(false);
              nameInputRef.current?.blur();
            }
            if (e.key === "Escape") {
              setNameInput(documentName);
              setEditingName(false);
              nameInputRef.current?.blur();
            }
          }}
          className="text-sm font-medium text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded px-1.5 py-0.5 min-w-[6rem] max-w-[12rem] focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400"
          aria-label="Document name"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setNameInput(documentName);
            setEditingName(true);
          }}
          className="text-sm font-medium text-stone-600 dark:text-stone-400 truncate max-w-[12rem] text-left hover:text-stone-800 dark:hover:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 rounded px-0.5 -mx-0.5"
          title={`${documentName} (click to rename)`}
        >
          {documentName}
        </button>
      )}
      <span className="text-sm text-stone-500 dark:text-stone-500" title="Grid size">
        {GRID_WIDTH}×{GRID_HEIGHT}
      </span>
      <span className="w-px h-6 bg-stone-300 dark:bg-stone-600" />
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
      {catalog.map((c, index) => (
        <button
          key={c.id}
          type="button"
          title={c.name}
          data-tour={index === 0 ? "place-pipe" : undefined}
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
      {selectedCells.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => moveSelection(-1, 0)}
            className="px-2 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
            title="Move left"
          >
            Left
          </button>
          <button
            type="button"
            onClick={() => moveSelection(1, 0)}
            className="px-2 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
            title="Move right"
          >
            Right
          </button>
          <button
            type="button"
            onClick={() => moveSelection(0, -1)}
            className="px-2 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
            title="Move up"
          >
            Up
          </button>
          <button
            type="button"
            onClick={() => moveSelection(0, 1)}
            className="px-2 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
            title="Move down"
          >
            Down
          </button>
          <button
            type="button"
            onClick={() => rotateSelection()}
            title="Rotate selection 90°"
            className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
          >
            Rotate
          </button>
          <button
            type="button"
            onClick={() => removeSelection()}
            title="Remove selection"
            className="px-3 py-1.5 rounded text-sm border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300"
          >
            Remove
          </button>
        </>
      )}
      <span className="flex-1" />
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleLoadFile}
      />
      <button
        type="button"
        onClick={handleNew}
        title="Start a new diagram"
        className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
      >
        New
      </button>
      <button
        type="button"
        onClick={handleSave}
        title="Save (download JSON file) (Ctrl+S)"
        className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
        data-tour="save"
      >
        Save
      </button>
      <button
        type="button"
        onClick={handleSaveAs}
        title="Download plan as JSON file"
        className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
      >
        Save As
      </button>
      <button
        type="button"
        onClick={handleLoadClick}
        title="Load plan from file"
        className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
      >
        Load
      </button>
      <button
        type="button"
        onClick={handleLoadExample}
        title="Load example irrigation plan"
        className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
        data-tour="load-example"
      >
        Load example
      </button>
      <button
        type="button"
        onClick={() => import("@/lib/tour").then((m) => m.startTour())}
        title="Show guided tour"
        className="px-3 py-1.5 rounded text-sm border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
      >
        Help
      </button>
      <div className="relative flex items-center justify-center rounded border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50 w-9 h-9">
        <span className="pointer-events-none text-stone-500 dark:text-stone-400" aria-hidden>
          {theme === "light" && <SunIcon className="size-5" />}
          {theme === "dark" && <MoonIcon className="size-5" />}
          {theme === "system" && <ComputerIcon className="size-5" />}
        </span>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          title="Theme: Light, Dark, or System"
          aria-label="Theme"
        >
          {THEME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
    </>
  );
}
