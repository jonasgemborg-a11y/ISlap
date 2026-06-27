import React, { useState } from 'react';
import { PlayerProfile, PlayerStats } from '../../types/game';
import { calcMaxHp, calcMaxMana, calcDamageRange, calcDefense, calcAttackRating, calcTotalStats, calcDeadlyStrike, calcResistances } from '../../utils/stats';
import { GearSlots } from './GearSlots';
import { Inventory } from './Inventory';
import { ItemPopup } from './ItemPopup';
import { Item, GearSlotId, Potion } from '../../types/item';
import { calcItemSellValue } from '../../utils/pricing';
import { CLASS_DEFS } from '../../data/classes';

interface CharacterScreenProps {
  profile: PlayerProfile;
  onSpend: (stat: keyof PlayerStats) => void;
  onAddGold: (amount: number) => void;
  onClose: () => void;
  slots: (Item | null)[];
  gear: Partial<Record<GearSlotId, Item>>;
  potionBelt: (Potion | null)[];
  onEquip: (index: number) => void;
  onUnequip: (slotId: GearSlotId) => void;
  onDiscard: (source: { from: 'inventory'; index: number } | { from: 'gear'; slotId: GearSlotId }) => void;
  onIdentify: (source: { from: 'inventory'; index: number } | { from: 'gear'; slotId: GearSlotId }) => void;
  onOpenSkillTree?: () => void;
}

const STATS: { key: keyof PlayerStats; label: string; description: string; emoji: string }[] = [
  { key: 'strength',  label: 'Strength',  description: '+1% weapon damage per point',           emoji: '💪' },
  { key: 'dexterity', label: 'Dexterity', description: '+5 attack rating, +0.25 defense',        emoji: '🎯' },
  { key: 'vitality',  label: 'Vitality',  description: '+4 max life per point',                  emoji: '❤️' },
  { key: 'energy',    label: 'Energy',    description: '+1.5 max mana per point',                emoji: '💙' },
];

export function CharacterScreen({ profile, onSpend, onAddGold, onClose, slots, gear, potionBelt, onEquip, onUnequip, onDiscard, onIdentify, onOpenSkillTree }: CharacterScreenProps) {
  const [popup, setPopup] = useState<{
    item: Item;
    source: { from: 'inventory'; index: number } | { from: 'gear'; slotId: GearSlotId };
  } | null>(null);

  const xpPct       = (profile.xp / profile.xpToNext) * 100;
  const maxHp       = calcMaxHp(profile, gear);
  const maxMana     = calcMaxMana(profile, gear);
  const dmgRange    = calcDamageRange(profile, gear);
  const defense     = calcDefense(profile, gear);
  const ar          = calcAttackRating(profile, gear);
  const ds          = calcDeadlyStrike(gear);
  const resists     = calcResistances(gear);
  const totalStats  = calcTotalStats(profile.stats, gear);
  const totalMatches = profile.wins + profile.losses;
  const winRate     = totalMatches > 0 ? Math.round((profile.wins / totalMatches) * 100) : 0;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#f0e8d8',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflowY: 'auto', padding: '40px 20px 60px', gap: 24,
    }}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#8a7060', fontSize: 13, letterSpacing: 2 }}>CHARACTER</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onOpenSkillTree && (
            <button
              onClick={onOpenSkillTree}
              style={{
                background: 'none', border: '1px solid #3a2a14',
                color: (profile.skillPoints ?? 0) > 0 ? '#c85020' : '#8a7060',
                fontSize: 12, letterSpacing: 1, padding: '4px 10px',
                borderRadius: 2, cursor: 'pointer',
                borderColor: (profile.skillPoints ?? 0) > 0 ? '#c85020' : '#3a2a14',
              }}
            >
              ⚡ Skills{(profile.skillPoints ?? 0) > 0 ? ` (${profile.skillPoints})` : ''}
            </button>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8a7060', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>
      </div>

      {/* Avatar + level */}
      {(() => {
        const cls = CLASS_DEFS[profile.heroClass ?? 'barbarian'];
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 80 }}>{cls.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#1a1208', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>
              LVL {profile.level}
            </div>
            <div style={{ color: '#8b6e14', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' }}>{cls.label}</div>
            <div style={{
              background: '#1a1410', border: '1px solid #3a2a14',
              borderRadius: 3, padding: '6px 12px',
              textAlign: 'center', maxWidth: 300,
            }}>
              <div style={{ color: '#c8a020', fontSize: 10, letterSpacing: 2, marginBottom: 2 }}>⚡ {cls.passiveLabel}</div>
              <div style={{ color: '#6a5a48', fontSize: 10 }}>{cls.passiveDesc}</div>
            </div>
          </div>
        );
      })()}

      {/* XP bar */}
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#6a5a48', fontSize: 12, letterSpacing: 1 }}>XP</span>
          <span style={{ color: '#8a7060', fontSize: 12 }}>{profile.xp} / {profile.xpToNext}</span>
        </div>
        <div style={{ width: '100%', height: 10, background: '#d8ccb8', overflow: 'hidden' }}>
          <div style={{ width: `${xpPct}%`, height: '100%', background: '#8b6e14', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Gold */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#e8dcc8', border: '1px solid #c0a860', borderRadius: 4, padding: '10px 20px' }}>
        <span style={{ fontSize: 20 }}>💰</span>
        <span style={{ color: '#8b6e14', fontWeight: 900, fontSize: 20 }}>{profile.gold}</span>
        <span style={{ color: '#8a7060', fontSize: 13 }}>Gold</span>
      </div>

      {/* Combat stats */}
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <StatRow label="❤️ Life"    value={`${maxHp}`}          detail="55 + (lvl-1)×2 + VIT×4 + gear" />
        <StatRow label="💙 Mana"    value={`${maxMana}`}         detail="10 + lvl-1 + ENE×1.5 + gear" />
        <StatRow label="⚔️ Damage"  value={`${dmgRange.min}–${dmgRange.max}`} detail="weapon × (1 + STR% + ED%)" />
        <StatRow label="🛡️ Defense" value={`${defense}`}         detail="armor × (1 + ED%) + DEX×0.25" />
        <StatRow label="🎯 Attack Rating" value={`${ar}`}        detail="DEX×5 + gear" />
        {ds > 0 && <StatRow label="💥 Deadly Strike" value={`${ds}%`} detail="double damage chance" />}
      </div>

      {/* Resistances */}
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ color: '#8a7060', fontSize: 12, letterSpacing: 2 }}>RESISTANCES</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <ResistRow label="🔥 Fire"      value={resists.fire} />
          <ResistRow label="❄️ Cold"      value={resists.cold} />
          <ResistRow label="⚡ Lightning" value={resists.lightning} />
          <ResistRow label="☠️ Poison"   value={resists.poison} />
        </div>
      </div>

      {/* W/L */}
      <div style={{ display: 'flex', gap: 32 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#3a6e48', fontFamily: "'Bebas Neue', sans-serif" }}>{profile.wins}</div>
          <div style={{ color: '#8a7060', fontSize: 11, letterSpacing: 1 }}>WINS</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#1a1208', fontFamily: "'Bebas Neue', sans-serif" }}>{winRate}%</div>
          <div style={{ color: '#8a7060', fontSize: 11, letterSpacing: 1 }}>WIN RATE</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#8b2020', fontFamily: "'Bebas Neue', sans-serif" }}>{profile.losses}</div>
          <div style={{ color: '#8a7060', fontSize: 11, letterSpacing: 1 }}>LOSSES</div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 360, borderTop: '1px solid #c8b8a0' }} />

      {profile.statPoints > 0 && (
        <div style={{ background: 'rgba(139,110,20,0.1)', border: '1px solid #8b6e14', borderRadius: 4, padding: '10px 20px', color: '#8b6e14', fontWeight: 700, fontSize: 14 }}>
          {profile.statPoints} stat points available
        </div>
      )}

      {/* Attributes */}
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STATS.map(s => (
          <div key={s.key} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#e8dcc8', borderRadius: 4, padding: '12px 14px', border: '1px solid #c8b8a0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{s.emoji}</span>
              <div>
                <div style={{ color: '#1a1208', fontWeight: 700, fontSize: 14 }}>{s.label}</div>
                <div style={{ color: '#8a7060', fontSize: 11, marginTop: 1 }}>{s.description}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#8b6e14', fontFamily: "'Bebas Neue', sans-serif" }}>
                  {totalStats[s.key]}
                </span>
                {totalStats[s.key] !== profile.stats[s.key] && (
                  <div style={{ fontSize: 10, color: '#8a7060' }}>base {profile.stats[s.key]}</div>
                )}
              </div>
              <button
                onClick={() => onSpend(s.key)}
                disabled={profile.statPoints <= 0}
                style={{
                  width: 34, height: 34, borderRadius: 4,
                  background: profile.statPoints > 0 ? '#7a1a0e' : '#d8ccb8',
                  color: profile.statPoints > 0 ? '#f0e8d8' : '#b0a090',
                  border: 'none', cursor: profile.statPoints > 0 ? 'pointer' : 'default',
                  fontSize: 20, fontWeight: 900, lineHeight: 1,
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 360, borderTop: '1px solid #c8b8a0' }} />

      <GearSlots
        gear={gear}
        potionBelt={potionBelt}
        onClickItem={(item, slotId) => setPopup({ item, source: { from: 'gear', slotId } })}
      />

      <Inventory
        slots={slots}
        onClickItem={(item, index) => setPopup({ item, source: { from: 'inventory', index } })}
      />

      {popup && (
        <ItemPopup
          item={popup.item}
          source={popup.source}
          isEquipped={popup.source.from === 'gear'}
          playerLevel={profile.level}
          playerStrength={totalStats.strength}
          onEquip={() => { if (popup.source.from === 'inventory') onEquip(popup.source.index); setPopup(null); }}
          onUnequip={() => { if (popup.source.from === 'gear') onUnequip(popup.source.slotId); setPopup(null); }}
          onSell={() => { onDiscard(popup.source); onAddGold(calcItemSellValue(popup.item)); setPopup(null); }}
          onIdentify={() => { onIdentify(popup.source); setPopup(null); }}
          sellValue={calcItemSellValue(popup.item)}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

function ResistRow({ label, value }: { label: string; value: number }) {
  const color = value >= 75 ? '#c8a020' : value >= 0 ? '#3a6e48' : '#8b2020';
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: '#e8dcc8', borderRadius: 4, padding: '8px 12px', border: '1px solid #c8b8a0',
    }}>
      <span style={{ color: '#1a1208', fontSize: 13 }}>{label}</span>
      <span style={{ color, fontWeight: 900, fontSize: 16, fontFamily: "'Bebas Neue', sans-serif" }}>
        {value}%
      </span>
    </div>
  );
}

function StatRow({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: '#e8dcc8', borderRadius: 4, padding: '10px 14px', border: '1px solid #c8b8a0',
    }}>
      <div>
        <div style={{ color: '#1a1208', fontWeight: 700, fontSize: 14 }}>{label}</div>
        <div style={{ color: '#8a7060', fontSize: 10 }}>{detail}</div>
      </div>
      <div style={{ color: '#8b6e14', fontWeight: 900, fontSize: 18, fontFamily: "'Bebas Neue', sans-serif" }}>{value}</div>
    </div>
  );
}
