import type { Direction, GridState, PlacedComponent, Port, PortType, Rotation } from "./types";
import type { Connection, ValidConnectionTarget } from "./types";
import { GRID_HEIGHT, GRID_WIDTH } from "./constants";
import { getComponentById } from "./catalog";

const DIRECTIONS: Direction[] = ["north", "east", "south", "west"];
const DIRECTION_INDEX: Record<Direction, number> = {
  north: 0,
  east: 1,
  south: 2,
  west: 3,
};

export function rotateDirection(direction: Direction, degrees: Rotation): Direction {
  const idx = (DIRECTION_INDEX[direction] + degrees / 90) % 4;
  return DIRECTIONS[idx < 0 ? idx + 4 : idx];
}

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function arePortTypesCompatible(a: PortType, b: PortType): boolean {
  if (a === b) return true;
  if ((a === "male_thread" && b === "female_thread") || (a === "female_thread" && b === "male_thread"))
    return true;
  if ((a === "barb" && b === "slip") || (a === "slip" && b === "barb")) return true;
  return false;
}

function getAdjacentCell(x: number, y: number, direction: Direction): { x: number; y: number } {
  switch (direction) {
    case "north":
      return { x, y: y - 1 };
    case "south":
      return { x, y: y + 1 };
    case "east":
      return { x: x + 1, y };
    case "west":
      return { x: x - 1, y };
  }
}

function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case "north":
      return "south";
    case "south":
      return "north";
    case "east":
      return "west";
    case "west":
      return "east";
  }
}

export function getWorldDirection(port: Port, rotation: Rotation): Direction {
  return rotateDirection(port.direction, rotation);
}

export function placeComponent(
  grid: GridState,
  componentId: string,
  x: number,
  y: number,
  rotation: Rotation = 0
): GridState {
  if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return grid;
  const key = cellKey(x, y);
  if (grid[key]) return grid;
  const component = getComponentById(componentId);
  if (!component) return grid;
  const next = { ...grid };
  next[key] = { componentId, x, y, rotation };
  return next;
}

export function removeComponent(grid: GridState, x: number, y: number): GridState {
  const key = cellKey(x, y);
  if (!grid[key]) return grid;
  const next = { ...grid };
  delete next[key];
  return next;
}

export function rotateComponent(grid: GridState, x: number, y: number): GridState {
  const key = cellKey(x, y);
  const placed = grid[key];
  if (!placed) return grid;
  const rotations: Rotation[] = [0, 90, 180, 270];
  const idx = rotations.indexOf(placed.rotation);
  const nextRotation = rotations[(idx + 1) % 4];
  const next = { ...grid };
  next[key] = { ...placed, rotation: nextRotation };
  return next;
}

export function getConnections(grid: GridState): Connection[] {
  const connections: Connection[] = [];
  const added = new Set<string>();

  function pairKey(from: { x: number; y: number; portId: string }, to: { x: number; y: number; portId: string }) {
    const a = `${from.x},${from.y},${from.portId}`;
    const b = `${to.x},${to.y},${to.portId}`;
    return a < b ? `${a}|${b}` : `${b}|${a}`;
  }

  for (const key of Object.keys(grid)) {
    const placed = grid[key]!;
    const component = getComponentById(placed.componentId);
    if (!component) continue;
    for (const port of component.ports) {
      const worldDir = getWorldDirection(port, placed.rotation);
      const adj = getAdjacentCell(placed.x, placed.y, worldDir);
      if (adj.x < 0 || adj.x >= GRID_WIDTH || adj.y < 0 || adj.y >= GRID_HEIGHT) continue;
      const otherKey = cellKey(adj.x, adj.y);
      const otherPlaced = grid[otherKey];
      if (!otherPlaced) continue;
      const otherComponent = getComponentById(otherPlaced.componentId);
      if (!otherComponent) continue;
      const oppositeDir = getOppositeDirection(worldDir);
      const otherPort = otherComponent.ports.find(
        (p) => getWorldDirection(p, otherPlaced.rotation) === oppositeDir
      );
      if (!otherPort || !arePortTypesCompatible(port.type, otherPort.type)) continue;
      const pk = pairKey(
        { x: placed.x, y: placed.y, portId: port.id },
        { x: otherPlaced.x, y: otherPlaced.y, portId: otherPort.id }
      );
      if (added.has(pk)) continue;
      added.add(pk);
      connections.push({
        from: { x: placed.x, y: placed.y, portId: port.id },
        to: { x: otherPlaced.x, y: otherPlaced.y, portId: otherPort.id },
      });
    }
  }
  return connections;
}

export function getValidConnectionTargets(
  grid: GridState,
  x: number,
  y: number,
  portId?: string
): ValidConnectionTarget[] {
  const placed = grid[cellKey(x, y)];
  if (!placed) return [];
  const component = getComponentById(placed.componentId);
  if (!component) return [];
  const ports = portId ? component.ports.filter((p) => p.id === portId) : component.ports;
  const targets: ValidConnectionTarget[] = [];
  for (const port of ports) {
    const worldDir = getWorldDirection(port, placed.rotation);
    const adj = getAdjacentCell(placed.x, placed.y, worldDir);
    if (adj.x < 0 || adj.x >= GRID_WIDTH || adj.y < 0 || adj.y >= GRID_HEIGHT) continue;
    const otherKey = cellKey(adj.x, adj.y);
    const otherPlaced = grid[otherKey];
    if (!otherPlaced) continue;
    const otherComponent = getComponentById(otherPlaced.componentId);
    if (!otherComponent) continue;
    const oppositeDir = getOppositeDirection(worldDir);
    const otherPort = otherComponent.ports.find(
      (p) => getWorldDirection(p, otherPlaced.rotation) === oppositeDir
    );
    if (otherPort && arePortTypesCompatible(port.type, otherPort.type)) {
      targets.push({ x: adj.x, y: adj.y, portId: otherPort.id });
    }
  }
  return targets;
}
