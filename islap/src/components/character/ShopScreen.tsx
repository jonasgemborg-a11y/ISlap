import React, { useState, useEffect } from 'react';
import { Item, GearSlotId, QUALITY_COLOR, QUALITY_LABEL, Potion, POTION_DEFS, POTION_BELT_SIZE, getAllMods, D2Stat } from '../../types/item';
import { generateItem } from '../../utils/loot';
import { PlayerProfile } from '../../types/game';
import { calcItemBuyValue } from '../../utils/pricing';

interface ShopItem {
  item: Item;
  price: number;
  sold: boolean;
}

const KEY_MODS: D2Stat[] = ['enhancedDamage', 'flatDefense', 'enhancedDefense', 'life', 'strength', 'dexterity', 'vitality', 'allStats'];

function generateShopStock(playerLevel: number): ShopItem[] {
  const effectiveLevel = Math.max(playerLevel, 8);
  return Array.from({ length: 10 }, () => {
    const item = generateItem(effectiveLevel);
    return { item, price: calcItemBuyValue(item), sold: false };
  });
}

const MOD_SHORT: Partial<Record<D2Stat, string>> = {
  enhancedDamage:  '% Enhanced Damage',
  enhancedDefense: '% Enhanced Defense',
  flatDefense:     'Defense',
  minDamage:       'Min Dmg',
  maxDamage:       'Max Dmg',
  life:            'Life',
  strength:        'Strength',
  dexterity:       'Dexterity',
  vitality:        'Vitality',
  energy:          'Energy',
  allStats:        'All Attributes',
  attackRating:    'Attack Rating',
  lifeSteal:       '% Life Steal',
  deadlyStrike:    '% Deadly Strike',
  allResist:       '% All Resist',
  magicFind:       '% MF',
  damageReduced:   '% DR',
};

interface Props {
  profile: PlayerProfile;
  stockKey: number;
  gear: Partial<Record<GearSlotId, Item>>;
  potionBelt: (Potion | null)[];
  playerStrength: number;
  onBuy: (item: Item, price: number) => void;
  onBuyPotion: (potion: Potion) => void;
  onClose: () => void;
}

export function ShopScreen({ profile, stockKey, gear, potionBelt, playerStrength, onBuy, onBuyPotion, onClose }: Props) {
  const [stock, setStock] = useState<ShopItem[]>(() => generateShopStock(profile.level));

  useEffect(() => {
    setStock(generateShopStock(profile.level));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockKey]);

  const handleBuy = (index: number) => {
    const entry = stock[index];
    const ml = profile.level >= (entry.item.reqLevel ?? 1);
    const ms = !entry.item.reqStr || playerStrength >= entry.item.reqStr;
    if (entry.sold || profile.gold < entry.price || !ml || !ms) return;
    onBuy(entry.item, entry.price);
    setStock(s => s.map((e, i) => i === index ? { ...e, sold: true } : e));
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f0e8d8', display: 'flex', flexDirection: 'column', zIndex: 100, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #c8b8a0', flexShrink: 0 }}>
        <div>
          <div style={{ color: '#1a1208', fontWeight: 900, fontSize: 20, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>🛒 The Merchant</div>
          <div style={{ color: '#8b6e14', fontSize: 13, fontWeight: 700 }}>💰 {profile.gold} Gold</div>
        </div>
        <button onClick={onClose} style={closeBtn}>✕</button>
      </div>

      {/* Potions */}
      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ color: '#8a7060', fontSize: 11, letterSpacing: 2 }}>POTIONS — BELT ({potionBelt.filter(Boolean).length}/{POTION_BELT_SIZE})</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {POTION_DEFS.map(potion => {
            const beltFull = potionBelt.every(s => s !== null);
            const canAfford = profile.gold >= potion.price;
            const disabled = beltFull || !canAfford;
            return (
              <div key={potion.id} style={{ flex: 1, background: '#e8dcc8', border: '1px solid #c8b8a0', borderRadius: 4, padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 28 }}>{potion.icon}</span>
                <span style={{ color: '#3a6e48', fontWeight: 700, fontSize: 12 }}>+{potion.healAmount} HP</span>
                <span style={{ color: '#8a7060', fontSize: 11 }}>{potion.label}</span>
                <button
                  onClick={() => { if (!disabled) onBuyPotion(potion); }}
                  disabled={disabled}
                  style={{ marginTop: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, background: disabled ? '#d8ccb8' : '#7a1a0e', color: disabled ? '#b0a090' : '#f0e8d8', border: 'none', borderRadius: 4, cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                  {beltFull ? 'Full' : `${potion.price} 💰`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ color: '#8a7060', fontSize: 11, letterSpacing: 2 }}>GEAR</div>
        {stock.map((entry, i) => {
          const canAfford  = profile.gold >= entry.price;
          const meetsLevel = profile.level >= (entry.item.reqLevel ?? 1);
          const meetsStr   = !entry.item.reqStr || playerStrength >= entry.item.reqStr;
          const canBuy     = canAfford && meetsLevel && meetsStr;
          const qColor     = QUALITY_COLOR[entry.item.quality];
          const borderColor = entry.sold ? '#d8ccb8' : qColor;
          const mods = getAllMods(entry.item);
          const keyMods = mods.filter(m => KEY_MODS.includes(m.stat)).slice(0, 4);
          const displayName = entry.item.uniqueName ?? entry.item.label;

          return (
            <div key={entry.item.id} style={{ background: entry.sold ? '#e8e0d0' : '#e8dcc8', border: `1px solid ${borderColor}`, borderRadius: 4, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 12, opacity: entry.sold ? 0.5 : 1 }}>
              <div style={{ fontSize: 32, flexShrink: 0, marginTop: 2 }}>{entry.item.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ color: qColor, fontWeight: 700, fontSize: 14 }}>{displayName}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: qColor, background: `${qColor}22`, padding: '1px 6px', borderRadius: 2 }}>
                    {QUALITY_LABEL[entry.item.quality].toUpperCase()}
                  </span>
                </div>

                {/* Base stats */}
                {entry.item.baseDmgMin != null && (
                  <div style={{ color: '#8a7060', fontSize: 11, marginTop: 3 }}>
                    Dmg: {entry.item.baseDmgMin}–{entry.item.baseDmgMax}
                  </div>
                )}
                {entry.item.baseDefense != null && (
                  <div style={{ color: '#8a7060', fontSize: 11, marginTop: 3 }}>
                    Def: {entry.item.baseDefense}
                  </div>
                )}

                {/* Key mods */}
                <div style={{ fontSize: 12, marginTop: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {keyMods.map((m, j) => {
                    const label = MOD_SHORT[m.stat] ?? m.stat;
                    const isPct = label.startsWith('%');
                    return (
                      <span key={j} style={{ color: '#6a8040', fontWeight: 600 }}>
                        {isPct ? `${m.value}${label}` : `+${m.value} ${label}`}
                      </span>
                    );
                  })}
                  {mods.length > keyMods.length && (
                    <span style={{ color: '#8a7060', fontSize: 11 }}>+{mods.length - keyMods.length} more...</span>
                  )}
                  {mods.length === 0 && <span style={{ color: '#8a7060' }}>Normal item</span>}
                </div>

                {/* Requirements */}
                {!entry.sold && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    {(entry.item.reqLevel ?? 1) > 1 && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: meetsLevel ? '#8a7060' : '#8b2020' }}>LVL {entry.item.reqLevel}</span>
                    )}
                    {entry.item.reqStr && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: meetsStr ? '#8a7060' : '#8b2020' }}>STR {entry.item.reqStr}</span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: '#8b6e14', fontWeight: 700, fontSize: 13 }}>{entry.sold ? 'SOLD' : `${entry.price} 💰`}</div>
                {!entry.sold && (
                  <button
                    onClick={() => handleBuy(i)}
                    disabled={!canBuy}
                    style={{ marginTop: 6, padding: '5px 12px', fontSize: 12, fontWeight: 700, background: canBuy ? '#7a1a0e' : '#d8ccb8', color: canBuy ? '#f0e8d8' : '#b0a090', border: 'none', borderRadius: 4, cursor: canBuy ? 'pointer' : 'not-allowed' }}
                  >
                    Buy
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const closeBtn: React.CSSProperties = {
  padding: '6px 12px', fontSize: 16, fontWeight: 900,
  background: 'transparent', color: '#6a5a48', border: '1px solid #c8b8a0',
  borderRadius: 4, cursor: 'pointer',
};
