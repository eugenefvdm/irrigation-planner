"use client";

import { useEffect } from "react";
import { Toolbar } from "@/components/Toolbar";
import { GridCanvas } from "@/components/GridCanvas";
import { DiagramPersistence } from "@/components/DiagramPersistence";
import { useGridStore } from "@/store/useGridStore";

export default function Home() {
  const zoom = useGridStore((s) => s.zoom);
  useEffect(() => {
    if (typeof window !== "undefined" && !window.localStorage.getItem("tour-done")) {
      import("@/lib/tour").then((m) => m.runTourIfFirstTime());
    }
  }, []);
  return (
    <main className="min-h-screen flex flex-col">
      <DiagramPersistence />
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
