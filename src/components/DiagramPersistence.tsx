"use client";

import { useEffect, useRef } from "react";
import { useGridStore } from "@/store/useGridStore";

const STORAGE_KEY = "irrigation-diagram";

/**
 * Restores diagram from localStorage on mount (e.g. after refresh).
 * Auto-saves to localStorage on every change so a refresh doesn't lose work.
 */
export function DiagramPersistence() {
  const grid = useGridStore((s) => s.grid);
  const history = useGridStore((s) => s.history);
  const historyIndex = useGridStore((s) => s.historyIndex);
  const zoom = useGridStore((s) => s.zoom);
  const documentName = useGridStore((s) => s.documentName);
  const isFirstSaveRun = useRef(true);

  useEffect(() => {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) {
      useGridStore.getState().loadFromJson(json);
    }
  }, []);

  useEffect(() => {
    if (isFirstSaveRun.current) {
      isFirstSaveRun.current = false;
      return;
    }
    const json = useGridStore.getState().exportJson();
    localStorage.setItem(STORAGE_KEY, json);
  }, [grid, history, historyIndex, zoom, documentName]);

  return null;
}
