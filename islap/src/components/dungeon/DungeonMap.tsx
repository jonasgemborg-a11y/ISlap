import React from 'react';
import { DungeonLevel, DungeonState, COLS, ROWS, getTheme, THEME_COLORS } from '../../types/dungeon';

interface Props {
  dungeon: DungeonState;
  level: DungeonLevel;
  onClose: () => void;
}

const CELL = 44;
const GAP  = 3;

export function DungeonMap({ dungeon, level, onClose }: Props) {
  const theme  = getTheme(dungeon.depth);
  const colors = THEME_COLORS[theme];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
    }}>
      {/* Header */}
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 4, color: colors.accent }}>
        DEPTH {dungeon.depth} — MAP
      </div>
      <div style={{ color: colors.text, fontSize: 11, letterSpacing: 2, opacity: 0.7 }}>
        {dungeon.pos.col + 1},{dungeon.pos.row + 1}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
        gap: GAP,
      }}>
        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const room = level.rooms[row][col];
            const isCurrent = dungeon.pos.col === col && dungeon.pos.row === row;

            const bg = !room.visited  ? '#1a1410'
              : room.hasStairsDown    ? colors.accent
              : room.hasStairsUp      ? '#4a7abf'
              : room.cleared          ? colors.panel
              : '#5a1010';

            return (
              <div key={`${col}-${row}`} style={{
                width: CELL, height: CELL,
                background: bg,
                border: isCurrent ? `2px solid ${colors.accent}` : `1px solid ${room.visited ? '#3a2e24' : '#1a1410'}`,
                borderRadius: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                transition: 'background 0.2s',
              }}>
                {room.visited && room.hasStairsDown && (
                  <span style={{ fontSize: 18 }}>▼</span>
                )}
                {room.visited && room.hasStairsUp && (
                  <span style={{ fontSize: 18 }}>▲</span>
                )}
                {isCurrent && (
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: colors.accent,
                    boxShadow: `0 0 6px ${colors.accent}`,
                    position: 'absolute',
                  }} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, fontSize: 10, color: colors.text, opacity: 0.6, letterSpacing: 1 }}>
        <span>● YOU</span>
        <span>▼ STAIRS DOWN</span>
        <span>▲ STAIRS UP</span>
        <span style={{ color: '#5a1010' }}>■ MONSTER</span>
      </div>

      <button onClick={onClose} style={{
        background: 'transparent', border: `1px solid ${colors.accent}`,
        color: colors.accent, padding: '8px 32px', borderRadius: 2,
        fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3,
        cursor: 'pointer',
      }}>
        CLOSE MAP
      </button>
    </div>
  );
}
