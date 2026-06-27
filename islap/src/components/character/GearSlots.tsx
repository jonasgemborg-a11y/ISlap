import React from 'react';
import { GearSlotId, Item, Potion, QUALITY_COLOR } from '../../types/item';

interface SlotDef {
  id: GearSlotId;
  label: string;
  icon: string;
  gridRow: number;
  gridCol: number;
}

const SLOTS: SlotDef[] = [
  { id: 'helm',    label: 'Helm',    icon: '⛑️', gridRow: 1, gridCol: 1 },
  { id: 'armor',   label: 'Armor',   icon: '🦺', gridRow: 1, gridCol: 2 },
  { id: 'amulet',  label: 'Amulet',  icon: '📿', gridRow: 1, gridCol: 3 },
  { id: 'hand_l',  label: 'Left',    icon: '🥊', gridRow: 2, gridCol: 1 },
  { id: 'hand_r',  label: 'Right',   icon: '🥊', gridRow: 2, gridCol: 3 },
  { id: 'ring_l',  label: 'Ring',    icon: '💍', gridRow: 3, gridCol: 1 },
  { id: 'ring_r',  label: 'Ring',    icon: '💍', gridRow: 3, gridCol: 3 },
  { id: 'gloves',  label: 'Gloves',  icon: '🧤', gridRow: 4, gridCol: 1 },
  { id: 'boots',   label: 'Boots',   icon: '👟', gridRow: 4, gridCol: 3 },
];

interface GearSlotsProps {
  gear: Partial<Record<GearSlotId, Item>>;
  potionBelt: (Potion | null)[];
  onClickItem: (item: Item, slotId: GearSlotId) => void;
}

export function GearSlots({ gear, potionBelt, onClickItem }: GearSlotsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '72px 100px 72px',
        gridTemplateRows: 'repeat(4, 72px)',
        gap: 8,
        alignItems: 'center',
        justifyItems: 'center',
      }}>
        <div style={{
          gridRow: '2 / 4', gridColumn: '2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 64,
        }}>
          😐
        </div>

        {SLOTS.map(slot => {
          const item = gear[slot.id];
          const borderColor = item?.quality ? QUALITY_COLOR[item.quality] : item ? '#a09080' : '#c8b8a0';
          return (
            <div
              key={slot.id}
              onClick={() => item && onClickItem(item, slot.id)}
              style={{
                gridRow: slot.gridRow, gridColumn: slot.gridCol,
                width: 64, height: 64,
                border: `1px solid ${borderColor}`,
                borderRadius: 4, background: '#e8dcc8',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 2, cursor: item ? 'pointer' : 'default',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => { if (item) e.currentTarget.style.borderColor = '#8b6e14'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
            >
              <span style={{ fontSize: 22, opacity: item ? 1 : 0.3 }}>{item ? item.icon : slot.icon}</span>
              <span style={{ fontSize: 9, color: '#6a5a48', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {item ? item.label : slot.label}
              </span>
              {item?.quality && item.quality !== 'normal' && (
                <span style={{ fontSize: 8, color: '#8b6e14', letterSpacing: 0.5 }}>{item.quality.toUpperCase()}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Potion belt */}
      <div style={{
        position: 'relative',
        width: 320,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Belt strap */}
        <div style={{
          width: '100%', height: 56,
          background: 'linear-gradient(180deg, #6b3e1a 0%, #4e2c10 40%, #5a3318 60%, #3d2008 100%)',
          borderRadius: 6,
          border: '2px solid #2a1208',
          boxShadow: 'inset 0 2px 4px rgba(255,200,100,0.15), inset 0 -2px 4px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center',
          padding: '0 10px',
          gap: 8,
          position: 'relative',
        }}>
          {/* Buckle */}
          <div style={{
            width: 28, height: 28, flexShrink: 0,
            background: 'linear-gradient(135deg, #d4a830 0%, #8b6e14 50%, #c9a84c 100%)',
            border: '2px solid #5a4008',
            borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '1px 1px 0 #2a1208',
          }}>
            <div style={{
              width: 10, height: 10,
              border: '2px solid #5a4008',
              borderRadius: 1,
            }} />
          </div>

          {/* Stitching line top */}
          <div style={{
            position: 'absolute', top: 7, left: 46, right: 8,
            borderTop: '1px dashed rgba(200,160,80,0.3)',
            pointerEvents: 'none',
          }} />
          {/* Stitching line bottom */}
          <div style={{
            position: 'absolute', bottom: 7, left: 46, right: 8,
            borderTop: '1px dashed rgba(200,160,80,0.3)',
            pointerEvents: 'none',
          }} />

          {/* Potion pouches */}
          <div style={{ display: 'flex', gap: 8, flex: 1, justifyContent: 'center' }}>
            {potionBelt.map((potion, i) => (
              <div key={i} style={{
                width: 50, height: 42,
                background: potion
                  ? 'linear-gradient(180deg, #5a3318 0%, #3d2008 100%)'
                  : 'linear-gradient(180deg, #4e2c10 0%, #331a06 100%)',
                border: `1px solid ${potion ? '#8b5a20' : '#4a2c0e'}`,
                borderRadius: 4,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 1,
                boxShadow: potion
                  ? 'inset 0 1px 2px rgba(255,200,100,0.1), 0 2px 3px rgba(0,0,0,0.5)'
                  : 'inset 0 2px 4px rgba(0,0,0,0.4)',
                position: 'relative',
              }}>
                {/* Pouch flap */}
                <div style={{
                  position: 'absolute', top: -4, left: 4, right: 4, height: 6,
                  background: potion ? '#6b3e1a' : '#4e2c10',
                  border: `1px solid ${potion ? '#8b5a20' : '#4a2c0e'}`,
                  borderBottom: 'none',
                  borderRadius: '3px 3px 0 0',
                }} />
                {potion ? (
                  <>
                    <span style={{ fontSize: 18 }}>{potion.icon}</span>
                    <span style={{ fontSize: 8, color: '#c9a84c', fontWeight: 700 }}>+{potion.healAmount}</span>
                  </>
                ) : (
                  <span style={{ fontSize: 16, opacity: 0.2 }}>🧪</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
