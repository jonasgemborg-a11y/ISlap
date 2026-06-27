import React from 'react';
import { Item, GearSlotId, SLOT_AFFINITY, QUALITY_LABEL, QUALITY_COLOR, getAllMods, D2Stat } from '../../types/item';

interface ItemPopupProps {
  item: Item;
  source: { from: 'inventory'; index: number } | { from: 'gear'; slotId: GearSlotId };
  isEquipped: boolean;
  playerLevel: number;
  playerStrength: number;
  onEquip: () => void;
  onUnequip: () => void;
  onSell: () => void;
  onIdentify: () => void;
  sellValue: number;
  onClose: () => void;
}

const AFFINITY_LABEL: Record<string, string> = {
  weapon:  '⚔️ Weapon slot',
  armor:   '🛡️ Armor slot',
  jewelry: '✨ Jewelry slot',
};

const MOD_LABEL: Partial<Record<D2Stat, string>> = {
  enhancedDamage:    '% Enhanced Damage',
  enhancedDefense:   '% Enhanced Defense',
  flatDefense:       'Defense',
  minDamage:         'to Minimum Damage',
  maxDamage:         'to Maximum Damage',
  life:              'to Life',
  mana:              'to Mana',
  strength:          'to Strength',
  dexterity:         'to Dexterity',
  vitality:          'to Vitality',
  energy:            'to Energy',
  allStats:          'to All Attributes',
  attackRating:      'to Attack Rating',
  lifeSteal:         '% Life Stolen Per Hit',
  manaSteal:         '% Mana Stolen Per Hit',
  crushingBlow:      '% Chance of Crushing Blow',
  openWounds:        '% Chance of Open Wounds',
  deadlyStrike:      '% Deadly Strike',
  fireResist:        '% Fire Resist',
  coldResist:        '% Cold Resist',
  lightningResist:   '% Lightning Resist',
  poisonResist:      '% Poison Resist',
  allResist:         '% to All Resistances',
  magicFind:         '% Better Chance of Magic Items',
  goldFind:          '% Extra Gold from Monsters',
  fasterAttack:      '% Increased Attack Speed',
  fasterHitRecovery: '% Faster Hit Recovery',
  damageReduced:     '% Damage Reduced',
  magicDamageReduced:'Magic Damage Reduced',
};

function modColor(stat: D2Stat): string {
  if (stat === 'life' || stat === 'vitality')                    return '#3a6e48';
  if (stat === 'enhancedDamage' || stat === 'minDamage' || stat === 'maxDamage') return '#b03020';
  if (stat === 'enhancedDefense' || stat === 'flatDefense')      return '#4a7abf';
  if (stat === 'strength' || stat === 'dexterity' || stat === 'energy' || stat === 'allStats') return '#8b6e14';
  if (stat === 'lifeSteal' || stat === 'manaSteal')              return '#8b2060';
  if (stat === 'deadlyStrike' || stat === 'crushingBlow')        return '#c03020';
  if (stat.includes('Resist') || stat === 'allResist')           return '#6a3a8a';
  if (stat === 'damageReduced' || stat === 'magicDamageReduced') return '#4a7abf';
  return '#8a7060';
}

export function ItemPopup({ item, isEquipped, playerLevel, playerStrength, onEquip, onUnequip, onSell, onIdentify, sellValue, onClose }: ItemPopupProps) {
  const affinity  = SLOT_AFFINITY[item.type];
  const meetsLevel = playerLevel >= (item.reqLevel ?? 1);
  const meetsStr   = !item.reqStr || playerStrength >= item.reqStr;
  const canEquip   = meetsLevel && meetsStr;
  const qColor     = QUALITY_COLOR[item.quality];

  const displayName = item.identified
    ? (item.uniqueName ?? item.label)
    : item.baseName;

  // Damage range line
  const hasDmg = item.baseDmgMin != null && item.baseDmgMax != null;

  const mods = item.identified ? getAllMods(item) : [];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(20,14,6,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1a1410',
          border: `1px solid ${qColor}`,
          borderRadius: 4, padding: 24, width: 300,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}
      >
        <div style={{ fontSize: 48 }}>{item.icon}</div>

        {/* Name + quality */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 18, fontWeight: 900, color: qColor,
            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1,
          }}>
            {displayName}
          </div>
          <div style={{ fontSize: 11, color: qColor, letterSpacing: 2, marginTop: 2 }}>
            {QUALITY_LABEL[item.quality].toUpperCase()}
          </div>
        </div>

        <div style={{ fontSize: 11, color: '#8a7060', letterSpacing: 1 }}>
          {AFFINITY_LABEL[affinity]}
        </div>

        {/* Base damage */}
        {hasDmg && (
          <div style={{ color: '#c8b8a0', fontSize: 13, textAlign: 'center' }}>
            Damage: {item.baseDmgMin}–{item.baseDmgMax}
          </div>
        )}

        {/* Base defense */}
        {item.baseDefense != null && (
          <div style={{ color: '#c8b8a0', fontSize: 13, textAlign: 'center' }}>
            Defense: {item.baseDefense}
          </div>
        )}

        {/* Requirements */}
        {(item.reqLevel > 1 || item.reqStr || item.reqDex) && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {item.reqLevel > 1 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: meetsLevel ? '#8a7060' : '#8b2020' }}>
                Req Lvl {item.reqLevel}
              </span>
            )}
            {item.reqStr && (
              <span style={{ fontSize: 11, fontWeight: 700, color: meetsStr ? '#8a7060' : '#8b2020' }}>
                Req Str {item.reqStr}
              </span>
            )}
            {item.reqDex && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#8a7060' }}>
                Req Dex {item.reqDex}
              </span>
            )}
          </div>
        )}

        {/* Unidentified banner */}
        {!item.identified && (
          <div style={{
            width: '100%', background: '#2a1e14', borderRadius: 3,
            padding: '10px 14px', textAlign: 'center',
            border: '1px solid #5a3a1a',
          }}>
            <div style={{ color: '#c8a020', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
              Unidentified
            </div>
            <div style={{ color: '#6a5a48', fontSize: 11, marginTop: 4 }}>
              Properties hidden until identified
            </div>
          </div>
        )}

        {/* Affix names (identified magic/rare items) */}
        {item.identified && item.quality === 'magic' && (
          <div style={{ width: '100%', borderTop: '1px solid #2a2018', paddingTop: 8 }}>
            {item.prefixes.map(p => (
              <div key={p.affixId} style={{ color: '#4169e1', fontSize: 12, textAlign: 'center' }}>{p.name}</div>
            ))}
            {item.suffixes.map(s => (
              <div key={s.affixId} style={{ color: '#4169e1', fontSize: 12, textAlign: 'center' }}>{s.name}</div>
            ))}
          </div>
        )}

        {/* Mods (identified only) */}
        {item.identified && mods.length > 0 && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {mods.map((m, i) => {
              const label = MOD_LABEL[m.stat] ?? m.stat;
              const isPct  = label.startsWith('%');
              const color  = modColor(m.stat);
              return (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  background: '#221c14', borderRadius: 3, padding: '5px 10px',
                }}>
                  <span style={{ color: '#8a7060', fontSize: 12 }}>{isPct ? '' : '+'}{m.value}{isPct ? label : ''}</span>
                  <span style={{ color, fontSize: 12, fontWeight: 700 }}>{isPct ? '' : label}</span>
                </div>
              );
            })}
          </div>
        )}

        {item.identified && mods.length === 0 && item.quality === 'normal' && (
          <div style={{ color: '#6a5a48', fontSize: 12 }}>No magic properties</div>
        )}

        {/* Buttons */}
        <button
          onClick={isEquipped ? onUnequip : (canEquip ? onEquip : undefined)}
          disabled={!isEquipped && !canEquip}
          style={{
            width: '100%', padding: '11px 0', fontSize: 14, fontWeight: 700,
            background: isEquipped ? 'transparent' : canEquip ? '#7a1a0e' : '#2a1e14',
            color: isEquipped ? '#8a7060' : canEquip ? '#f0e8d8' : '#4a3a2a',
            border: isEquipped ? `1px solid ${qColor}44` : 'none',
            borderRadius: 3, cursor: isEquipped || canEquip ? 'pointer' : 'not-allowed',
            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2,
          }}
        >
          {isEquipped ? 'Unequip' : canEquip ? 'Equip' : 'Requirements not met'}
        </button>

        {!item.identified && (
          <button
            onClick={onIdentify}
            style={{
              width: '100%', padding: '11px 0', fontSize: 14, fontWeight: 700,
              background: '#1a3a2a', color: '#4aae6e',
              border: '1px solid #2a6a3a', borderRadius: 3, cursor: 'pointer',
              fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2,
            }}
          >
            🔍 Identify
          </button>
        )}

        <button
          onClick={onSell}
          style={{
            width: '100%', padding: '9px 0', fontSize: 12, fontWeight: 600,
            background: 'transparent', color: '#8b6e14',
            border: '1px solid #5a4010', borderRadius: 3, cursor: 'pointer',
          }}
        >
          💰 Sell for {sellValue} Gold
        </button>

        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a3a2a', fontSize: 12, cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  );
}
