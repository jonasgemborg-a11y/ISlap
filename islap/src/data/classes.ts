import { PlayerStats } from '../types/game';

export type CharClass = 'barbarian' | 'sorceress' | 'paladin' | 'necromancer' | 'druid' | 'amazon';

export interface ClassDef {
  id: CharClass;
  label: string;
  icon: string;
  description: string;
  passiveLabel: string;
  passiveDesc: string;
  startStats: PlayerStats;
  hpBase: number;
  hpPerLevel: number;
  hpPerVit: number;
  manaBase: number;
  manaPerLevel: number;
  manaPerEne: number;
}

export const CLASS_DEFS: Record<CharClass, ClassDef> = {
  barbarian: {
    id: 'barbarian', label: 'Barbarian', icon: '💪',
    description: 'Master of melee. Raw power and endurance.',
    passiveLabel: 'War Cry',
    passiveDesc: 'Every 5th hit deals double damage.',
    startStats: { strength: 30, dexterity: 20, vitality: 25, energy: 10 },
    hpBase: 55, hpPerLevel: 2, hpPerVit: 4,
    manaBase: 10, manaPerLevel: 1, manaPerEne: 1.5,
  },
  sorceress: {
    id: 'sorceress', label: 'Sorceress', icon: '🔥',
    description: 'Fragile but devastating. Builds up spell charges.',
    passiveLabel: 'Charged Fireball',
    passiveDesc: 'Every 6 swipes charge a fireball. At full charge the next hit deals 3× damage and always hits.',
    startStats: { strength: 10, dexterity: 25, vitality: 10, energy: 35 },
    hpBase: 40, hpPerLevel: 1, hpPerVit: 2,
    manaBase: 25, manaPerLevel: 2, manaPerEne: 2,
  },
  paladin: {
    id: 'paladin', label: 'Paladin', icon: '✝️',
    description: 'Holy warrior. Divine power strikes without fail.',
    passiveLabel: 'Holy Bolt',
    passiveDesc: 'Every 5th hit fires a Holy Bolt — always hits, ignores defense, deals bonus holy damage.',
    startStats: { strength: 25, dexterity: 20, vitality: 25, energy: 15 },
    hpBase: 45, hpPerLevel: 2, hpPerVit: 3,
    manaBase: 15, manaPerLevel: 1.5, manaPerEne: 1.5,
  },
  necromancer: {
    id: 'necromancer', label: 'Necromancer', icon: '💀',
    description: 'Commands the undead. Skeletons fight alongside you.',
    passiveLabel: 'Raise Skeleton',
    passiveDesc: 'Skeletons auto-attack enemies each fight. More skeletons at higher levels (max 3).',
    startStats: { strength: 15, dexterity: 25, vitality: 15, energy: 25 },
    hpBase: 40, hpPerLevel: 1.5, hpPerVit: 2,
    manaBase: 25, manaPerLevel: 2, manaPerEne: 2,
  },
  druid: {
    id: 'druid', label: 'Druid', icon: '🐺',
    description: 'Shape-shifter. Adapts form to the flow of battle.',
    passiveLabel: 'Shape Shift',
    passiveDesc: '5 hits in a row → Werewolf (+30% dmg, faster). 3 bot hits in a row → Werebear (+20% DR).',
    startStats: { strength: 15, dexterity: 20, vitality: 25, energy: 20 },
    hpBase: 45, hpPerLevel: 1.5, hpPerVit: 3,
    manaBase: 20, manaPerLevel: 1.5, manaPerEne: 2,
  },
  amazon: {
    id: 'amazon', label: 'Amazon', icon: '🏹',
    description: 'Swift and deadly. High damage with a chance to dodge.',
    passiveLabel: 'Dodge',
    passiveDesc: 'Passive dodge chance (15% + DEX×0.15%) vs enemy attacks. +15% base damage.',
    startStats: { strength: 20, dexterity: 25, vitality: 20, energy: 15 },
    hpBase: 50, hpPerLevel: 2, hpPerVit: 3,
    manaBase: 15, manaPerLevel: 1, manaPerEne: 1.5,
  },
};

export const CLASS_LIST = Object.values(CLASS_DEFS);
export const HERO_CLASS_KEY = 'islap_hero_class';
