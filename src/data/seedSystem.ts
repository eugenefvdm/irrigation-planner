import type { GridState } from "@/lib/types";
import { importGridFromJson } from "@/lib/export";

const seedJson = `{"version":1,"gridWidth":20,"gridHeight":20,"placed":[{"componentId":"male_adapter","x":3,"y":5,"rotation":0},{"componentId":"pipe_straight","x":4,"y":5,"rotation":0},{"componentId":"tee","x":5,"y":5,"rotation":0},{"componentId":"elbow_90","x":6,"y":5,"rotation":0},{"componentId":"drip_emitter_2lph","x":6,"y":6,"rotation":180}]}`;

export function getSeedGrid(): GridState {
  return importGridFromJson(seedJson);
}

export const seedJsonString = seedJson;
