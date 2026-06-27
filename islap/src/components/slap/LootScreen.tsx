import React from 'react';
import { LootResult } from '../../utils/loot';
import { Item, QUALITY_COLOR, QUALITY_LABEL } from '../../types/item';

interface LootScreenProps {
  loot: LootResult;
  onClose: () => void;
}

export function LootScreen({ loot, onClose }: LootScreenProps) {
  const allItems = [loot.item, ...(loot.extraItems ?? [])].filter((i): i is Item => !!i);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 150,
      background: 'rgba(20,14,6,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#f0e8d8', border: '1px solid #c0a860',
        borderRadius: 4, padding: 32, width: 300,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ fontSize: 13, color: '#8a7060', letterSpacing: 2, fontFamily: "'Bebas Neue', sans-serif" }}>
          LOOT
        </div>

        {/* Gold */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#e8dcc8', borderRadius: 4, padding: '12px 24px',
          border: '1px solid #c0a860', width: '100%', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 28 }}>💰</span>
          <span style={{ color: '#8b6e14', fontWeight: 900, fontSize: 26, fontFamily: "'Bebas Neue', sans-serif" }}>+{loot.gold}</span>
          <span style={{ color: '#8a7060', fontSize: 13 }}>Gold</span>
        </div>

        {/* Items */}
        {allItems.map((item, idx) => {
          const qColor = QUALITY_COLOR[item.quality];
          // Unidentified: show only the base item name, never affix names or unique name
          const displayName = item.identified
            ? (item.uniqueName ?? item.label)
            : item.baseName;
          return (
            <div key={idx} style={{
              background: '#1a1410', borderRadius: 4, padding: '14px 18px',
              border: `1px solid ${qColor}`, width: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <div style={{ fontSize: 10, color: '#8a7060', letterSpacing: 2 }}>
                {allItems.length > 1 ? `ITEM ${idx + 1} FOUND` : 'ITEM FOUND'}
              </div>
              <span style={{ fontSize: 36 }}>{item.icon}</span>
              <span style={{ color: qColor, fontWeight: 700, fontSize: 15 }}>{displayName}</span>
              <span style={{ fontSize: 11, color: qColor, letterSpacing: 2, opacity: 0.8 }}>
                {QUALITY_LABEL[item.quality].toUpperCase()}
              </span>
              {!item.identified && (
                <span style={{ fontSize: 11, color: '#6a5a48', letterSpacing: 1, fontStyle: 'italic' }}>
                  Unidentified
                </span>
              )}
            </div>
          );
        })}

        <button onClick={onClose} style={{
          width: '100%', padding: '14px 0', fontSize: 20, fontWeight: 900,
          background: '#7a1a0e',
          color: '#f0e8d8', border: 'none', borderRadius: 4, cursor: 'pointer',
          letterSpacing: 3, fontFamily: "'Bebas Neue', sans-serif",
        }}>
          COLLECT
        </button>
      </div>
    </div>
  );
}
