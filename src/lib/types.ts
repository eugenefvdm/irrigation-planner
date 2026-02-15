export type PortType = "slip" | "male_thread" | "female_thread" | "barb";
export type Direction = "north" | "south" | "east" | "west";
export type Rotation = 0 | 90 | 180 | 270;
export type ComponentCategory = "fitting" | "connector" | "emitter";

export interface Port {
  id: string;
  type: PortType;
  direction: Direction;
}

export interface PipeComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  ports: Port[];
}

export interface PlacedComponent {
  componentId: string;
  x: number;
  y: number;
  rotation: Rotation;
}

export type GridState = Record<string, PlacedComponent>;

export interface ConnectionEnd {
  x: number;
  y: number;
  portId: string;
}

export interface Connection {
  from: ConnectionEnd;
  to: ConnectionEnd;
}

export interface ValidConnectionTarget {
  x: number;
  y: number;
  portId: string;
}

export interface ExportData {
  version: number;
  gridWidth: number;
  gridHeight: number;
  placed: PlacedComponent[];
}
