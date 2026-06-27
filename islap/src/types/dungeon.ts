export type Dir = 'N' | 'S' | 'E' | 'W';

export interface RoomState {
  col: number;
  row: number;
  visited: boolean;
  cleared: boolean;    // monster defeated (or no monster)
  hasStairsUp: boolean;   // entry room — stairs back to surface/town
  hasStairsDown: boolean; // one per level — leads deeper
}

export interface DungeonLevel {
  depth: number;           // 1–99
  rooms: RoomState[][];    // [row][col], 5×5
  entryPos: { col: number; row: number };
  stairsDownPos: { col: number; row: number };
}

export interface DungeonState {
  depth: number;
  pos: { col: number; row: number };
  facingDir: Dir;         // direction player is looking (came FROM opposite)
  prevPos: { col: number; row: number } | null;
  levels: Record<number, DungeonLevel>; // keyed by depth, persisted as explored
}

// Directional helpers
export const OPPOSITE: Record<Dir, Dir> = { N: 'S', S: 'N', E: 'W', W: 'E' };

export const DELTA: Record<Dir, { dc: number; dr: number }> = {
  N: { dc:  0, dr: -1 },
  S: { dc:  0, dr:  1 },
  E: { dc:  1, dr:  0 },
  W: { dc: -1, dr:  0 },
};

// Left/right relative to a facing direction
export const TURN_LEFT:  Record<Dir, Dir> = { N: 'W', W: 'S', S: 'E', E: 'N' };
export const TURN_RIGHT: Record<Dir, Dir> = { N: 'E', E: 'S', S: 'W', W: 'N' };

export const COLS = 5;
export const ROWS = 5;

export function inBounds(col: number, row: number) {
  return col >= 0 && col < COLS && row >= 0 && row < ROWS;
}

// Theme by depth
export type DungeonTheme = 'cathedral' | 'catacombs' | 'caves' | 'hell';
export function getTheme(depth: number): DungeonTheme {
  if (depth <= 24) return 'cathedral';
  if (depth <= 49) return 'catacombs';
  if (depth <= 74) return 'caves';
  return 'hell';
}

export const THEME_LABEL: Record<DungeonTheme, string> = {
  cathedral:  'The Cathedral',
  catacombs:  'The Catacombs',
  caves:      'The Caves',
  hell:       'Hell',
};

export const THEME_COLORS: Record<DungeonTheme, { bg: string; panel: string; accent: string; text: string }> = {
  cathedral: { bg: '#1a1410', panel: '#2a1e14', accent: '#c9a84c', text: '#e8d8b8' },
  catacombs: { bg: '#14141a', panel: '#1e1428', accent: '#8a70b8', text: '#d8d0e8' },
  caves:     { bg: '#101814', panel: '#142014', accent: '#4a8a50', text: '#c8e0c8' },
  hell:      { bg: '#1a0a08', panel: '#2a1008', accent: '#c84020', text: '#e8c0b0' },
};
