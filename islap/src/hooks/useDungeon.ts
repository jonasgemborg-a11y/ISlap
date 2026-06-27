import { useState, useCallback } from 'react';
import {
  DungeonState, DungeonLevel, RoomState, Dir,
  COLS, ROWS, DELTA, OPPOSITE, inBounds,
} from '../types/dungeon';

const STORAGE_KEY = 'islap_dungeon';

function makeRoom(col: number, row: number): RoomState {
  return { col, row, visited: false, cleared: false, hasStairsUp: false, hasStairsDown: false };
}

function generateLevel(depth: number, entryPos?: { col: number; row: number }): DungeonLevel {
  const rooms: RoomState[][] = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => makeRoom(c, r))
  );

  // Entry position: depth 1 enters from top-center, otherwise from entryPos
  const entry = entryPos ?? { col: 2, row: 0 };
  rooms[entry.row][entry.col].hasStairsUp = true;

  // Place stairs down somewhere not at entry (pick random, avoid entry)
  let sd: { col: number; row: number };
  do {
    sd = { col: Math.floor(Math.random() * COLS), row: Math.floor(Math.random() * ROWS) };
  } while (sd.col === entry.col && sd.row === entry.row);
  rooms[sd.row][sd.col].hasStairsDown = true;

  return { depth, rooms, entryPos: entry, stairsDownPos: sd };
}

function load(): DungeonState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function save(s: DungeonState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function fresh(): DungeonState {
  const level = generateLevel(1);
  const entry = level.entryPos;
  level.rooms[entry.row][entry.col].visited = true;
  return {
    depth: 1,
    pos: entry,
    facingDir: 'S', // entered from the north (surface), looking south
    prevPos: null,
    levels: { 1: level },
  };
}

export function useDungeon() {
  const [state, setState] = useState<DungeonState>(() => load() ?? fresh());

  const update = useCallback((next: DungeonState) => {
    save(next);
    setState(next);
  }, []);

  const currentLevel = state.levels[state.depth];
  const currentRoom  = currentLevel.rooms[state.pos.row][state.pos.col];

  // Available doors from current position (excludes direction we came from)
  const availableDoors = useCallback((): Dir[] => {
    const cameFrom = state.prevPos
      ? (Object.keys(DELTA) as Dir[]).find(d => {
          const nb = DELTA[d];
          return state.prevPos!.col === state.pos.col + nb.dc &&
                 state.prevPos!.row === state.pos.row + nb.dr;
        })
      : undefined;

    return (['N', 'S', 'E', 'W'] as Dir[]).filter(d => {
      if (d === cameFrom) return false; // that's the "back" direction
      const nb = DELTA[d];
      return inBounds(state.pos.col + nb.dc, state.pos.row + nb.dr);
    });
  }, [state]);

  // Direction the player came from (for the back button)
  const cameFromDir = useCallback((): Dir | null => {
    if (!state.prevPos) return null;
    return (Object.keys(DELTA) as Dir[]).find(d => {
      const nb = DELTA[d];
      return state.prevPos!.col === state.pos.col + nb.dc &&
             state.prevPos!.row === state.pos.row + nb.dr;
    }) ?? null;
  }, [state]);

  // Move to an adjacent room in direction d
  const moveDir = useCallback((d: Dir) => {
    const nb = DELTA[d];
    const newCol = state.pos.col + nb.dc;
    const newRow = state.pos.row + nb.dr;
    if (!inBounds(newCol, newRow)) return;

    const level = state.levels[state.depth];
    const rooms = level.rooms.map(row => row.map(r => ({ ...r })));
    rooms[newRow][newCol].visited = true;

    const next: DungeonState = {
      ...state,
      pos: { col: newCol, row: newRow },
      facingDir: d,
      prevPos: state.pos,
      levels: {
        ...state.levels,
        [state.depth]: { ...level, rooms },
      },
    };
    update(next);
  }, [state, update]);

  // Go back to previous room
  const goBack = useCallback(() => {
    if (!state.prevPos) return;
    const backDir = cameFromDir();
    if (!backDir) return;

    const next: DungeonState = {
      ...state,
      pos: state.prevPos,
      facingDir: OPPOSITE[backDir],
      prevPos: null, // lose back-history (can only go back one step)
    };
    update(next);
  }, [state, cameFromDir, update]);

  // Mark current room as cleared
  const clearRoom = useCallback(() => {
    const level = state.levels[state.depth];
    const rooms = level.rooms.map(row => row.map(r => ({ ...r })));
    rooms[state.pos.row][state.pos.col].cleared = true;
    update({
      ...state,
      levels: { ...state.levels, [state.depth]: { ...level, rooms } },
    });
  }, [state, update]);

  // Descend stairs
  const descend = useCallback(() => {
    const newDepth = state.depth + 1;
    if (newDepth > 99) return;

    let nextLevel = state.levels[newDepth];
    if (!nextLevel) {
      // Generate fresh level; entry comes from a random edge position
      nextLevel = generateLevel(newDepth);
    }
    const entry = nextLevel.entryPos;
    const rooms = nextLevel.rooms.map(row => row.map(r => ({ ...r })));
    rooms[entry.row][entry.col].visited = true;

    const next: DungeonState = {
      ...state,
      depth: newDepth,
      pos: entry,
      facingDir: 'S',
      prevPos: null,
      levels: { ...state.levels, [newDepth]: { ...nextLevel, rooms } },
    };
    update(next);
  }, [state, update]);

  // Ascend stairs (go up one level or back to town if depth === 1)
  const ascend = useCallback((): 'town' | 'level' => {
    if (state.depth === 1) {
      // Back to town — keep dungeon state so player can return
      return 'town';
    }
    const newDepth = state.depth - 1;
    const prevLevel = state.levels[newDepth];
    if (!prevLevel) return 'town';

    const entry = prevLevel.stairsDownPos; // re-enter from where stairs down were
    const next: DungeonState = {
      ...state,
      depth: newDepth,
      pos: entry,
      facingDir: 'N',
      prevPos: null,
      levels: state.levels,
    };
    update(next);
    return 'level';
  }, [state, update]);

  // Reset dungeon (new run)
  const resetDungeon = useCallback(() => {
    const s = fresh();
    update(s);
  }, [update]);

  return {
    state,
    currentLevel,
    currentRoom,
    availableDoors,
    cameFromDir,
    moveDir,
    goBack,
    clearRoom,
    descend,
    ascend,
    resetDungeon,
  };
}
