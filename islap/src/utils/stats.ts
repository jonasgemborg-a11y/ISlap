import { PlayerProfile, PlayerStats } from '../types/game';
import { GearSlotId, Item, sumGearMod } from '../types/item';
import { CLASS_DEFS } from '../data/classes';

export function calcMaxHp(profile: PlayerProfile, gear: Partial<Record<GearSlotId, Item>>): number {
  const cls      = CLASS_DEFS[profile.heroClass ?? 'barbarian'];
  const fromLvl  = (profile.level - 1) * cls.hpPerLevel;
  const fromVit  = profile.stats.vitality * cls.hpPerVit;
  const fromGear = sumGearMod(gear, 'life');
  return Math.round(cls.hpBase + fromLvl + fromVit + fromGear);
}

export function calcMaxMana(profile: PlayerProfile, gear: Partial<Record<GearSlotId, Item>>): number {
  const cls     = CLASS_DEFS[profile.heroClass ?? 'barbarian'];
  const fromLvl = (profile.level - 1) * cls.manaPerLevel;
  const fromEne = profile.stats.energy * cls.manaPerEne;
  const fromGear = sumGearMod(gear, 'mana');
  return Math.round(cls.manaBase + fromLvl + fromEne + fromGear);
}

// Amazon passive: base 15% + DEX×0.15% dodge vs bot attacks
export function calcDodgeChance(profile: PlayerProfile): number {
  if ((profile.heroClass ?? 'barbarian') !== 'amazon') return 0;
  return Math.min(40, 15 + profile.stats.dexterity * 0.15);
}

// Weapon damage range (before rolling)
export function calcDamageRange(
  profile: PlayerProfile,
  gear: Partial<Record<GearSlotId, Item>>,
): { min: number; max: number } {
  const weaponSlots: GearSlotId[] = ['hand_l', 'hand_r'];

  // Best weapon base damage
  let baseDmgMin = 1, baseDmgMax = 2;
  for (const slotId of weaponSlots) {
    const item = gear[slotId];
    if (item?.baseDmgMin != null && item?.baseDmgMax != null) {
      if (item.baseDmgMax > baseDmgMax) {
        baseDmgMin = item.baseDmgMin;
        baseDmgMax = item.baseDmgMax;
      }
    }
  }

  const edPct   = sumGearMod(gear, 'enhancedDamage', weaponSlots);
  const flatMin = sumGearMod(gear, 'minDamage', weaponSlots);
  const flatMax = sumGearMod(gear, 'maxDamage', weaponSlots);

  // Strength gives +1% ED per point (D2 Barbarian rule)
  const totalStats = calcTotalStats(profile.stats, gear);
  const strBonus = totalStats.strength;
  const totalPct = edPct + strBonus;

  const finalMin = Math.max(1, Math.round((baseDmgMin + flatMin) * (1 + totalPct / 100)));
  const finalMax = Math.max(finalMin, Math.round((baseDmgMax + flatMax) * (1 + totalPct / 100)));
  return { min: finalMin, max: finalMax };
}

export function rollSlapDamage(
  profile: PlayerProfile,
  gear: Partial<Record<GearSlotId, Item>>,
): number {
  const { min, max } = calcDamageRange(profile, gear);
  return Math.round(min + Math.random() * (max - min));
}

// Armor defense total
export function calcDefense(
  profile: PlayerProfile,
  gear: Partial<Record<GearSlotId, Item>>,
): number {
  const armorSlots: GearSlotId[] = ['helm', 'armor', 'gloves', 'belt', 'boots'];
  const totalStats = calcTotalStats(profile.stats, gear);

  let def = 0;
  for (const slotId of armorSlots) {
    const item = gear[slotId];
    if (!item) continue;
    const base    = item.baseDefense ?? 0;
    const enhPct  = sumGearMod({ [slotId]: item } as Partial<Record<GearSlotId, Item>>, 'enhancedDefense');
    const flat    = sumGearMod({ [slotId]: item } as Partial<Record<GearSlotId, Item>>, 'flatDefense');
    def += Math.round(base * (1 + enhPct / 100)) + flat;
  }

  // DEX gives 0.25 defense per point (D2 Barbarian)
  def += Math.floor(totalStats.dexterity * 0.25);
  return def;
}

// Attack Rating
export function calcAttackRating(
  profile: PlayerProfile,
  gear: Partial<Record<GearSlotId, Item>>,
): number {
  const totalStats = calcTotalStats(profile.stats, gear);
  const baseAR = totalStats.dexterity * 5;
  const gearAR = sumGearMod(gear, 'attackRating');
  return baseAR + gearAR;
}

// Hit chance: D2 formula 2*AR / (AR+Def), clamped 5%–95%
export function calcHitChance(ar: number, targetDefense: number): number {
  if (ar + targetDefense === 0) return 0.95;
  return Math.max(0.05, Math.min(0.95, (2 * ar) / (ar + targetDefense)));
}

// Deadly Strike %
export function calcDeadlyStrike(gear: Partial<Record<GearSlotId, Item>>): number {
  return sumGearMod(gear, 'deadlyStrike');
}

// DR %  (capped at 50%)
export function calcDamageReduced(gear: Partial<Record<GearSlotId, Item>>): number {
  return Math.min(50, sumGearMod(gear, 'damageReduced'));
}

// Life Steal %
export function calcLifeSteal(gear: Partial<Record<GearSlotId, Item>>): number {
  return sumGearMod(gear, 'lifeSteal');
}

// Swipe threshold: higher DEX = more sensitive (smaller threshold)
export function calcSwipeThreshold(dexterity: number): number {
  return Math.max(8, 30 - dexterity * 0.3);
}

export interface Resistances {
  fire: number;
  cold: number;
  lightning: number;
  poison: number;
}

// D2: resistances cap at 75%, floor at -100%
export function calcResistances(gear: Partial<Record<GearSlotId, Item>>): Resistances {
  const all = sumGearMod(gear, 'allResist');
  const clamp = (v: number) => Math.min(75, Math.max(-100, v));
  return {
    fire:      clamp(all + sumGearMod(gear, 'fireResist')),
    cold:      clamp(all + sumGearMod(gear, 'coldResist')),
    lightning: clamp(all + sumGearMod(gear, 'lightningResist')),
    poison:    clamp(all + sumGearMod(gear, 'poisonResist')),
  };
}

// Total stats (base + allStats mods from gear)
export function calcTotalStats(
  base: PlayerStats,
  gear: Partial<Record<GearSlotId, Item>>,
): PlayerStats {
  const allStats = sumGearMod(gear, 'allStats');
  return {
    strength:  base.strength  + sumGearMod(gear, 'strength')  + allStats,
    dexterity: base.dexterity + sumGearMod(gear, 'dexterity') + allStats,
    vitality:  base.vitality  + sumGearMod(gear, 'vitality')  + allStats,
    energy:    base.energy    + sumGearMod(gear, 'energy')     + allStats,
  };
}

// Bot profile
export type MonsterType = 'normal' | 'champion' | 'elite';

export interface BotProfile {
  level: number;
  monsterType: MonsterType;
  stats: PlayerStats;
  maxHp: number;
  attackInterval: number;
  damage: number;
  defense: number;
  attackRating: number;
  avatar: string;
}

const BOT_AVATARS: { maxLevel: number; pool: string[] }[] = [
  { maxLevel: 5,        pool: ['😐','😑','🙂','😶'] },
  { maxLevel: 10,       pool: ['😤','😠','😒','😤'] },
  { maxLevel: 20,       pool: ['😡','🤬','👊','💢'] },
  { maxLevel: 35,       pool: ['👹','👺','😈','🤡'] },
  { maxLevel: 55,       pool: ['💀','👾','🤖','☠️'] },
  { maxLevel: Infinity, pool: ['🔥','👿','☠️','🌑'] },
];

export function generateBot(playerLevel: number, forceType?: MonsterType): BotProfile {
  // Roll monster type: 10% elite, 20% champion, 70% normal (D2-ish rates)
  const roll = Math.random();
  const monsterType: MonsterType = forceType ?? (roll < 0.10 ? 'elite' : roll < 0.30 ? 'champion' : 'normal');

  // Base level = player level; champions +2, elites +4
  const levelBonus = monsterType === 'elite' ? 4 : monsterType === 'champion' ? 2 : 0;
  const level = Math.max(1, Math.min(99, playerLevel + levelBonus));

  // D2: 5 stat points per level, distributed randomly
  const totalPoints = (level - 1) * 5;
  const stats: PlayerStats = { strength:10, dexterity:10, vitality:10, energy:10 };
  const keys = Object.keys(stats) as (keyof PlayerStats)[];
  for (let i = 0; i < totalPoints; i++) stats[keys[Math.floor(Math.random() * keys.length)]]++;

  // Champions get +50% HP, elites get +100% HP (like D2)
  const baseHp = 55 + (level - 1) * 2 + stats.vitality * 4;
  const hpMult = monsterType === 'elite' ? 2.0 : monsterType === 'champion' ? 1.5 : 1.0;
  const maxHp  = Math.round(baseHp * hpMult);

  const attackInterval = Math.max(280, 1200 - level * 32);
  const damage        = Math.ceil(5 + level * 0.6 + level * level * 0.025);
  const defense       = level * 15;
  const attackRating  = level * 20;

  const pool   = BOT_AVATARS.find(t => level <= t.maxLevel)!.pool;
  const avatar = pool[Math.floor(Math.random() * pool.length)];

  return { level, monsterType, stats, maxHp, attackInterval, damage, defense, attackRating, avatar };
}

// Legacy shims used by a few UI components
export function calcAttack(
  profile: PlayerProfile,
  gear: Partial<Record<GearSlotId, Item>>,
): number {
  const { min, max } = calcDamageRange(profile, gear);
  return Math.round((min + max) / 2);
}
