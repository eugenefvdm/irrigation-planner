import type { GridState } from "@/lib/types";
import { importGridFromJson } from "@/lib/export";
import exampleData from "./example.json";

/** Example plan as JSON string — same format as Export/Import. Load via store.loadFromJson(exampleJson). */
export const exampleJson = JSON.stringify(exampleData);

export function getExampleGrid(): GridState {
  return importGridFromJson(exampleJson).grid;
}
