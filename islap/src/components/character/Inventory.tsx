import React from 'react';
import { Item, QUALITY_COLOR } from '../../types/item';

interface InventoryProps {
  slots: (Item | null)[];
  onClickItem: (item: Item, index: number) => void;
}

export function Inventory({ slots, onClickItem }: InventoryProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '100%', maxWidth: 360 }}>
      <span style={{ color: '#8a7060', fontSize: 12, letterSpacing: 2, alignSelf: 'flex-start', paddingLeft: 4 }}>INVENTORY</span>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 64px)',
        gridTemplateRows: 'repeat(5, 64px)',
        gap: 6,
      }}>
        {slots.map((item, i) => (
          <div
            key={i}
            onClick={() => item && onClickItem(item, i)}
            style={{
              width: 64, height: 64,
              border: `1px solid ${item?.quality ? QUALITY_COLOR[item.quality] : item ? '#a09080' : '#c8b8a0'}`,
              borderRadius: 4, background: '#e8dcc8',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 2, cursor: item ? 'pointer' : 'default',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => { if (item) e.currentTarget.style.borderColor = '#8b6e14'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = item?.quality ? QUALITY_COLOR[item.quality] : item ? '#a09080' : '#c8b8a0'; }}
          >
            {item && (
              <>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span style={{ fontSize: 9, color: '#6a5a48', letterSpacing: 0.5, textTransform: 'uppercase' }}>{item.identified ? item.label : item.baseName}</span>
                {!item.identified ? (
                  <span style={{ fontSize: 8, color: '#c8a020', fontStyle: 'italic' }}>?</span>
                ) : item.quality !== 'normal' && (
                  <span style={{ fontSize: 8, color: QUALITY_COLOR[item.quality] }}>{item.quality.toUpperCase()}</span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
