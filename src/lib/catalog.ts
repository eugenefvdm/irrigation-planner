import type { PipeComponent } from "./types";

export const COMPONENT_CATALOG: PipeComponent[] = [
  {
    id: "pipe_straight",
    name: "Straight (Coupling) horizontal",
    category: "connector",
    ports: [
      { id: "p1", type: "slip", direction: "west" },
      { id: "p2", type: "slip", direction: "east" },
    ],
  },
  {
    id: "pipe_straight_v",
    name: "Straight (Coupling) vertical",
    category: "connector",
    ports: [
      { id: "p1", type: "slip", direction: "north" },
      { id: "p2", type: "slip", direction: "south" },
    ],
  },
  {
    id: "elbow_90",
    name: "90° Elbow (E–S)",
    category: "fitting",
    ports: [
      { id: "p1", type: "slip", direction: "east" },
      { id: "p2", type: "slip", direction: "south" },
    ],
  },
  {
    id: "elbow_90_ne",
    name: "90° Elbow (N–E)",
    category: "fitting",
    ports: [
      { id: "p1", type: "slip", direction: "north" },
      { id: "p2", type: "slip", direction: "east" },
    ],
  },
  {
    id: "elbow_90_sw",
    name: "90° Elbow (S–W)",
    category: "fitting",
    ports: [
      { id: "p1", type: "slip", direction: "south" },
      { id: "p2", type: "slip", direction: "west" },
    ],
  },
  {
    id: "elbow_90_wn",
    name: "90° Elbow (W–N)",
    category: "fitting",
    ports: [
      { id: "p1", type: "slip", direction: "west" },
      { id: "p2", type: "slip", direction: "north" },
    ],
  },
  {
    id: "tee",
    name: "Tee (branch S)",
    category: "fitting",
    ports: [
      { id: "p1", type: "slip", direction: "east" },
      { id: "p2", type: "slip", direction: "west" },
      { id: "p3", type: "slip", direction: "south" },
    ],
  },
  {
    id: "tee_e",
    name: "Tee (branch E)",
    category: "fitting",
    ports: [
      { id: "p1", type: "slip", direction: "south" },
      { id: "p2", type: "slip", direction: "north" },
      { id: "p3", type: "slip", direction: "east" },
    ],
  },
  {
    id: "tee_n",
    name: "Tee (branch N)",
    category: "fitting",
    ports: [
      { id: "p1", type: "slip", direction: "east" },
      { id: "p2", type: "slip", direction: "west" },
      { id: "p3", type: "slip", direction: "north" },
    ],
  },
  {
    id: "tee_w",
    name: "Tee (branch W)",
    category: "fitting",
    ports: [
      { id: "p1", type: "slip", direction: "south" },
      { id: "p2", type: "slip", direction: "north" },
      { id: "p3", type: "slip", direction: "west" },
    ],
  },
  {
    id: "male_adapter",
    name: "Male Adapter",
    category: "connector",
    ports: [{ id: "p1", type: "male_thread", direction: "east" }],
  },
  {
    id: "drip_emitter_2lph",
    name: "Drip Emitter (2 L/h)",
    category: "emitter",
    ports: [{ id: "p1", type: "barb", direction: "south" }],
  },
  {
    id: "drip_emitter_4lph",
    name: "Drip Emitter (4 L/h)",
    category: "emitter",
    ports: [{ id: "p1", type: "barb", direction: "south" }],
  },
  {
    id: "drip_emitter_8lph",
    name: "Drip Emitter (8 L/h)",
    category: "emitter",
    ports: [{ id: "p1", type: "barb", direction: "south" }],
  },
  {
    id: "tap",
    name: "Tap",
    category: "connector",
    ports: [{ id: "p1", type: "female_thread", direction: "east" }],
  },
];

export function getComponentById(id: string): PipeComponent | undefined {
  return COMPONENT_CATALOG.find((c) => c.id === id);
}
