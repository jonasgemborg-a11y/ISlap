import React from 'react';
import { Dir, RoomState, DungeonState, TURN_LEFT, TURN_RIGHT, getTheme, THEME_COLORS, THEME_LABEL } from '../../types/dungeon';
import { MonsterType } from '../../utils/stats';

interface Props {
  dungeon: DungeonState;
  room: RoomState;
  availableDoors: Dir[];
  cameFrom: Dir | null;
  monsterType: MonsterType;
  onMoveDir: (d: Dir) => void;
  onGoBack: () => void;
  onDescend: () => void;
  onAscend: () => void;
  onOpenMap: () => void;
  onOpenChar: () => void;
  onStartFight: () => void;
}

const MONSTER_LABEL: Record<MonsterType, string> = {
  normal:   'A FOE LURKS HERE',
  champion: '⚡ CHAMPION',
  elite:    '💀 ELITE',
};

const MONSTER_COLOR: Record<MonsterType, string> = {
  normal:   '#c84020',
  champion: '#4169e1',
  elite:    '#c8a020',
};

export function RoomView({
  dungeon, room, availableDoors, cameFrom, monsterType,
  onMoveDir, onGoBack, onDescend, onAscend, onOpenMap, onOpenChar, onStartFight,
}: Props) {
  const theme  = getTheme(dungeon.depth);
  const colors = THEME_COLORS[theme];
  const facing = dungeon.facingDir;

  // Compute relative door directions
  const forwardDir = facing;
  const leftDir    = TURN_LEFT[facing];
  const rightDir   = TURN_RIGHT[facing];

  const hasForward = availableDoors.includes(forwardDir);
  const hasLeft    = availableDoors.includes(leftDir);
  const hasRight   = availableDoors.includes(rightDir);
  const hasBack    = !!cameFrom;

  const monsterAlive = !room.cleared && !room.hasStairsUp && !room.hasStairsDown
    ? false // rooms without special content still need a monster — handled below
    : false;

  // Room has a monster if not cleared
  const hasMonster = !room.cleared;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: colors.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '24px 20px 20px',
      touchAction: 'none',
    }}>
      {/* Top bar */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: colors.accent, fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 3 }}>
            {THEME_LABEL[theme]}
          </div>
          <div style={{ color: colors.text, fontSize: 10, opacity: 0.5, letterSpacing: 1 }}>
            DEPTH {dungeon.depth} · ROOM {dungeon.pos.col + 1},{dungeon.pos.row + 1}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onOpenChar} style={mapBtnStyle(colors.text)}>👤</button>
          <button onClick={onOpenMap} style={mapBtnStyle(colors.accent)}>MAP</button>
        </div>
      </div>

      {/* Room illustration */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <RoomIllustration theme={theme} room={room} hasMonster={hasMonster} colors={colors} />

        {/* Status text */}
        {hasMonster && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {monsterType !== 'normal' && (
              <div style={{
                color: MONSTER_COLOR[monsterType],
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 4,
                border: `1px solid ${MONSTER_COLOR[monsterType]}`,
                padding: '2px 16px', borderRadius: 2,
              }}>
                {MONSTER_LABEL[monsterType]}
              </div>
            )}
            <div style={{
              color: MONSTER_COLOR[monsterType],
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3,
            }}>
              {monsterType === 'normal' ? 'A FOE LURKS HERE' : 'LURKS HERE'}
            </div>
          </div>
        )}
        {room.hasStairsDown && room.cleared && (
          <div style={{ color: colors.accent, fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3 }}>
            STAIRS DESCEND INTO DARKNESS
          </div>
        )}
        {room.hasStairsUp && room.cleared && (
          <div style={{ color: '#4a7abf', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3 }}>
            {dungeon.depth === 1 ? 'STAIRS TO THE SURFACE' : 'STAIRS ASCENDING'}
          </div>
        )}
      </div>

      {/* Action area */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>

        {/* Fight button if monster present */}
        {hasMonster && (
          <button onClick={onStartFight} style={{
            width: '100%', padding: '16px 0',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 4,
            background: '#7a1a0e', color: '#f0e8d8',
            border: 'none', borderRadius: 2, cursor: 'pointer',
            boxShadow: '0 4px 0 #3d0c06',
          }}>
            ⚔️ FIGHT
          </button>
        )}

        {/* Navigation — only shown after room is cleared */}
        {room.cleared && (
          <>
            {/* Stairs */}
            {room.hasStairsDown && (
              <button onClick={onDescend} style={stairBtnStyle(colors.accent)}>
                ▼ DESCEND
              </button>
            )}
            {room.hasStairsUp && (
              <button onClick={onAscend} style={stairBtnStyle('#4a7abf')}>
                ▲ {dungeon.depth === 1 ? 'RETURN TO TOWN' : 'ASCEND'}
              </button>
            )}

            {/* Door grid: left / forward / right */}
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <DoorBtn label="← LEFT" available={hasLeft} onClick={() => hasLeft && onMoveDir(leftDir)} />
              <DoorBtn label="↑ FORWARD" available={hasForward} onClick={() => hasForward && onMoveDir(forwardDir)} />
              <DoorBtn label="RIGHT →" available={hasRight} onClick={() => hasRight && onMoveDir(rightDir)} />
            </div>
          </>
        )}

        {/* Back arrow — always available so player can flee from a monster */}
        {hasBack && !room.hasStairsUp && (
          <button onClick={onGoBack} style={{
            background: 'transparent', border: `1px solid ${colors.accent}33`,
            color: colors.text, padding: '8px 24px', borderRadius: 2,
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 2,
            cursor: 'pointer', opacity: 0.6,
          }}>
            ← BACK
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────────
function DoorBtn({ label, available, onClick }: { label: string; available: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      style={{
        flex: 1, padding: '12px 4px',
        fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 2,
        background: available ? '#2a1e14' : '#1a1410',
        color: available ? '#c9a84c' : '#3a2e24',
        border: `1px solid ${available ? '#5a3a1a' : '#2a1e14'}`,
        borderRadius: 2, cursor: available ? 'pointer' : 'default',
        transition: 'all 0.15s',
      }}
    >
      {available ? label : '—'}
    </button>
  );
}

function RoomIllustration({ theme, room, hasMonster, colors }: {
  theme: string; room: RoomState; hasMonster: boolean;
  colors: { bg: string; panel: string; accent: string; text: string };
}) {
  // Simple SVG room view — perspective corridor with doors
  const accentColor = colors.accent;
  const wallColor   = theme === 'caves' ? '#2a3a2a' : theme === 'hell' ? '#3a1008' : '#2a1e14';
  const floorColor  = theme === 'caves' ? '#1a2218' : theme === 'hell' ? '#200808' : '#1a1410';

  return (
    <svg width={280} height={180} viewBox="0 0 280 180" style={{ display: 'block' }}>
      {/* Floor */}
      <polygon points="0,180 280,180 200,100 80,100" fill={floorColor} />
      {/* Ceiling */}
      <polygon points="0,0 280,0 200,80 80,80" fill={wallColor} />
      {/* Left wall */}
      <polygon points="0,0 80,80 80,100 0,180" fill={wallColor} opacity={0.8} />
      {/* Right wall */}
      <polygon points="280,0 200,80 200,100 280,180" fill={wallColor} opacity={0.8} />

      {/* Forward door arch */}
      <rect x={105} y={85} width={70} height={45} rx={4} fill={floorColor} stroke={accentColor} strokeWidth={1.5} opacity={0.9} />

      {/* Stairs up */}
      {room.hasStairsUp && (
        <g>
          {[0,1,2,3].map(i => (
            <rect key={i} x={112 + i * 4} y={110 - i * 5} width={56 - i * 8} height={5}
              fill={accentColor} opacity={0.6 + i * 0.1} />
          ))}
          <text x={140} y={76} textAnchor="middle" fontSize={11} fill={accentColor} fontFamily="'Bebas Neue', sans-serif" letterSpacing={2}>▲ UP</text>
        </g>
      )}

      {/* Stairs down */}
      {room.hasStairsDown && room.cleared && (
        <g>
          {[0,1,2,3].map(i => (
            <rect key={i} x={112 + i * 4} y={88 + i * 5} width={56 - i * 8} height={5}
              fill={accentColor} opacity={0.6 + i * 0.1} />
          ))}
          <text x={140} y={76} textAnchor="middle" fontSize={11} fill={accentColor} fontFamily="'Bebas Neue', sans-serif" letterSpacing={2}>▼ DOWN</text>
        </g>
      )}

      {/* Monster silhouette */}
      {hasMonster && (
        <text x={140} y={118} textAnchor="middle" fontSize={36} opacity={0.9}>👹</text>
      )}

      {/* Torch flames left */}
      <text x={30} y={70} fontSize={16}>🔥</text>
      {/* Torch flames right */}
      <text x={242} y={70} fontSize={16}>🔥</text>

      {/* Floor grid lines for depth */}
      <line x1={0} y1={180} x2={140} y2={100} stroke={accentColor} strokeWidth={0.3} opacity={0.2} />
      <line x1={280} y1={180} x2={140} y2={100} stroke={accentColor} strokeWidth={0.3} opacity={0.2} />
      <line x1={0} y1={130} x2={280} y2={130} stroke={accentColor} strokeWidth={0.3} opacity={0.15} />
    </svg>
  );
}

function mapBtnStyle(accent: string): React.CSSProperties {
  return {
    background: 'transparent', border: `1px solid ${accent}`,
    color: accent, padding: '4px 12px', borderRadius: 2,
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 2,
    cursor: 'pointer',
  };
}

function stairBtnStyle(color: string): React.CSSProperties {
  return {
    width: '100%', padding: '12px 0',
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 4,
    background: 'transparent', color,
    border: `1px solid ${color}`, borderRadius: 2, cursor: 'pointer',
  };
}
