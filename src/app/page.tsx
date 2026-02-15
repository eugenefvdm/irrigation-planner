"use client";

import { Toolbar } from "@/components/Toolbar";
import { GridCanvas } from "@/components/GridCanvas";
import { useGridStore } from "@/store/useGridStore";

export default function Home() {
  const zoom = useGridStore((s) => s.zoom);
  return (
    <main className="min-h-screen flex flex-col">
      <Toolbar />
      <div className="flex-1 p-4 overflow-auto flex justify-center items-start">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          className="inline-block"
        >
          <GridCanvas />
        </div>
      </div>
    </main>
  );
}
