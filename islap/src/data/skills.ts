import { CharClass } from './classes';

export interface SkillDef {
  id: string;
  classId: CharClass;
  tree: number;        // 0 | 1 | 2
  tier: number;        // 0 = top row, 1 = middle, 2 = bottom
  prereqId?: string;   // must have ≥1 point in this skill to unlock
  name: string;
  icon: string;
  maxLevel: number;
  desc: (level: number) => string;
}

// ─── SORCERESS ──────────────────────────────────────────────────────────────
// Tree 0: Fire  |  Tree 1: Cold  |  Tree 2: Lightning

const sorceressSkills: SkillDef[] = [
  // ── Fire ──
  {
    id: 'fireball', classId: 'sorceress', tree: 0, tier: 0,
    name: 'Fireball', icon: '🔥', maxLevel: 20,
    desc: lvl => `Every ${Math.max(2, 6 - Math.floor(lvl / 4))} swipes → Fireball (${(3 + lvl * 0.15).toFixed(1)}× dmg, always hits).`,
  },
  {
    id: 'fire_mastery', classId: 'sorceress', tree: 0, tier: 1, prereqId: 'fireball',
    name: 'Fire Mastery', icon: '🌋', maxLevel: 20,
    desc: lvl => `+${lvl * 6}% bonus damage to all fire spells.`,
  },
  {
    id: 'meteor', classId: 'sorceress', tree: 0, tier: 2, prereqId: 'fire_mastery',
    name: 'Meteor', icon: '☄️', maxLevel: 20,
    desc: lvl => `Every 10th slap calls a Meteor: ${20 + lvl * 8} fire damage to all enemies.`,
  },

  // ── Cold ──
  {
    id: 'ice_bolt', classId: 'sorceress', tree: 1, tier: 0,
    name: 'Ice Bolt', icon: '🧊', maxLevel: 20,
    desc: lvl => `${10 + lvl * 3}% chance on hit to slow enemy attacks by 40% for 3 s.`,
  },
  {
    id: 'cold_mastery', classId: 'sorceress', tree: 1, tier: 1, prereqId: 'ice_bolt',
    name: 'Cold Mastery', icon: '❄️', maxLevel: 20,
    desc: lvl => `Ice Bolt deals +${lvl * 4} bonus cold damage per hit.`,
  },
  {
    id: 'blizzard', classId: 'sorceress', tree: 1, tier: 2, prereqId: 'cold_mastery',
    name: 'Blizzard', icon: '🌨️', maxLevel: 20,
    desc: lvl => `Every 8th slap triggers Blizzard: ${15 + lvl * 6} cold damage to ALL enemies.`,
  },

  // ── Lightning ──
  {
    id: 'chain_lightning', classId: 'sorceress', tree: 2, tier: 0,
    name: 'Chain Lightning', icon: '⚡', maxLevel: 20,
    desc: lvl => `On hit, bounces to next enemy for ${40 + lvl * 5}% of the original damage.`,
  },
  {
    id: 'lightning_mastery', classId: 'sorceress', tree: 2, tier: 1, prereqId: 'chain_lightning',
    name: 'Lightning Mastery', icon: '🌩️', maxLevel: 20,
    desc: lvl => `+${lvl * 5}% bonus damage to all lightning skills.`,
  },
  {
    id: 'thunder_clap', classId: 'sorceress', tree: 2, tier: 2, prereqId: 'lightning_mastery',
    name: 'Thunder Clap', icon: '🌪️', maxLevel: 20,
    desc: lvl => `Every 12th slap stuns all enemies for ${0.5 + lvl * 0.1}s (pauses their attacks).`,
  },
];

// ─── BARBARIAN ──────────────────────────────────────────────────────────────
// Tree 0: Combat Skills  |  Tree 1: Masteries  |  Tree 2: Warcries

const barbarianSkills: SkillDef[] = [
  { id: 'bash',          classId: 'barbarian', tree: 0, tier: 0, name: 'Bash',           icon: '👊', maxLevel: 20, desc: lvl => `+${lvl * 8}% damage and knocks back on every 4th hit.` },
  { id: 'stun',          classId: 'barbarian', tree: 0, tier: 1, prereqId: 'bash',        name: 'Stun',           icon: '💫', maxLevel: 20, desc: lvl => `${5 + lvl * 3}% chance per hit to stun enemy for ${0.3 + lvl * 0.05}s.` },
  { id: 'berserk',       classId: 'barbarian', tree: 0, tier: 2, prereqId: 'stun',        name: 'Berserk',        icon: '😡', maxLevel: 20, desc: lvl => `Every 6th hit enters Berserk: ${lvl * 10}% more damage, ignores defense for 3 hits.` },

  { id: 'sword_mastery', classId: 'barbarian', tree: 1, tier: 0,                           name: 'Sword Mastery', icon: '⚔️', maxLevel: 20, desc: lvl => `+${lvl * 5}% attack rating and +${lvl * 3}% weapon damage.` },
  { id: 'axe_mastery',   classId: 'barbarian', tree: 1, tier: 1, prereqId: 'sword_mastery',name: 'Axe Mastery',   icon: '🪓', maxLevel: 20, desc: lvl => `+${lvl * 4}% deadly strike chance.` },
  { id: 'iron_skin',     classId: 'barbarian', tree: 1, tier: 2, prereqId: 'axe_mastery',  name: 'Iron Skin',     icon: '🛡️', maxLevel: 20, desc: lvl => `+${lvl * 8} bonus defense.` },

  { id: 'war_cry',       classId: 'barbarian', tree: 2, tier: 0,                           name: 'War Cry',       icon: '📢', maxLevel: 20, desc: lvl => `Every 5th hit: ×${(2 + lvl * 0.05).toFixed(2)} damage. Bonus scales with level.` },
  { id: 'battle_orders', classId: 'barbarian', tree: 2, tier: 1, prereqId: 'war_cry',      name: 'Battle Orders', icon: '📯', maxLevel: 20, desc: lvl => `+${lvl * 3}% max HP at fight start.` },
  { id: 'ancient_call',  classId: 'barbarian', tree: 2, tier: 2, prereqId: 'battle_orders',name: "Ancient's Call", icon: '⚡', maxLevel: 20, desc: lvl => `Every 15th hit summons an Ancient for 1 attack (${10 + lvl * 5} dmg).` },
];

// ─── PALADIN ────────────────────────────────────────────────────────────────
// Tree 0: Combat  |  Tree 1: Offensive Auras  |  Tree 2: Defensive Auras

const paladinSkills: SkillDef[] = [
  { id: 'zeal',        classId: 'paladin', tree: 0, tier: 0,                          name: 'Zeal',       icon: '⚔️', maxLevel: 20, desc: lvl => `Every 3rd hit deals +${lvl * 10}% extra damage.` },
  { id: 'vengeance',   classId: 'paladin', tree: 0, tier: 1, prereqId: 'zeal',        name: 'Vengeance',  icon: '🔱', maxLevel: 20, desc: lvl => `Adds ${lvl * 5} elemental damage (fire/cold/lightning) per hit.` },
  { id: 'holy_shield', classId: 'paladin', tree: 0, tier: 2, prereqId: 'vengeance',   name: 'Holy Shield',icon: '🛡️', maxLevel: 20, desc: lvl => `+${lvl * 5}% chance to block incoming hits.` },

  { id: 'might',       classId: 'paladin', tree: 1, tier: 0,                          name: 'Might',      icon: '💪', maxLevel: 20, desc: lvl => `Passive aura: +${lvl * 8}% damage.` },
  { id: 'holy_fire',   classId: 'paladin', tree: 1, tier: 1, prereqId: 'might',       name: 'Holy Fire',  icon: '🔥', maxLevel: 20, desc: lvl => `Passive aura: each enemy attack triggers ${lvl * 3} fire retaliation.` },
  { id: 'fanaticism',  classId: 'paladin', tree: 1, tier: 2, prereqId: 'holy_fire',   name: 'Fanaticism', icon: '🌟', maxLevel: 20, desc: lvl => `Passive: +${lvl * 4}% attack rating and +${lvl * 6}% damage.` },

  { id: 'defiance',    classId: 'paladin', tree: 2, tier: 0,                          name: 'Defiance',   icon: '🏛️', maxLevel: 20, desc: lvl => `Passive aura: +${lvl * 10} defense.` },
  { id: 'holy_bolt',   classId: 'paladin', tree: 2, tier: 1, prereqId: 'defiance',    name: 'Holy Bolt',  icon: '✨', maxLevel: 20, desc: lvl => `Every 5th hit fires a Holy Bolt: ${10 + lvl * 3} holy damage (always hits).` },
  { id: 'salvation',   classId: 'paladin', tree: 2, tier: 2, prereqId: 'holy_bolt',   name: 'Salvation',  icon: '🙏', maxLevel: 20, desc: lvl => `+${lvl * 3}% all resistances.` },
];

// ─── NECROMANCER ────────────────────────────────────────────────────────────
// Tree 0: Summoning  |  Tree 1: Poison & Bone  |  Tree 2: Curses

const necromancerSkills: SkillDef[] = [
  { id: 'raise_skeleton',   classId: 'necromancer', tree: 0, tier: 0,                                  name: 'Raise Skeleton',   icon: '💀', maxLevel: 20, desc: lvl => `${Math.min(5, 1 + Math.floor(lvl / 4))} skeleton(s) auto-attack enemies. Dmg: ${5 + lvl * 2}.` },
  { id: 'skeleton_mastery', classId: 'necromancer', tree: 0, tier: 1, prereqId: 'raise_skeleton',      name: 'Skeleton Mastery', icon: '🦴', maxLevel: 20, desc: lvl => `+${lvl * 15}% skeleton HP and damage.` },
  { id: 'revive',           classId: 'necromancer', tree: 0, tier: 2, prereqId: 'skeleton_mastery',    name: 'Revive',           icon: '🔄', maxLevel: 20, desc: lvl => `${lvl * 3}% chance on kill to revive enemy as temporary ally.` },

  { id: 'poison_dagger',    classId: 'necromancer', tree: 1, tier: 0,                                  name: 'Poison Dagger',    icon: '🗡️', maxLevel: 20, desc: lvl => `${10 + lvl * 3}% chance per hit to poison enemy: ${lvl * 2} dmg/s for 4s.` },
  { id: 'bone_spear',       classId: 'necromancer', tree: 1, tier: 1, prereqId: 'poison_dagger',       name: 'Bone Spear',       icon: '🦷', maxLevel: 20, desc: lvl => `Every 7th hit fires a bone spear: ${15 + lvl * 5} physical dmg.` },
  { id: 'bone_spirit',      classId: 'necromancer', tree: 1, tier: 2, prereqId: 'bone_spear',          name: 'Bone Spirit',      icon: '👻', maxLevel: 20, desc: lvl => `Every 10th hit: ${30 + lvl * 8} magic damage (ignores defense).` },

  { id: 'weaken',           classId: 'necromancer', tree: 2, tier: 0,                                  name: 'Weaken',           icon: '🌀', maxLevel: 20, desc: lvl => `${8 + lvl * 2}% chance to curse enemy: -${lvl * 5}% their damage for 5s.` },
  { id: 'decrepify',        classId: 'necromancer', tree: 2, tier: 1, prereqId: 'weaken',              name: 'Decrepify',        icon: '💤', maxLevel: 20, desc: lvl => `${5 + lvl * 2}% chance to decrepify: slows enemy 50% and -${lvl * 3}% damage.` },
  { id: 'amplify_damage',   classId: 'necromancer', tree: 2, tier: 2, prereqId: 'decrepify',           name: 'Amplify Damage',   icon: '🔊', maxLevel: 20, desc: lvl => `Every 8th hit: enemy takes +${20 + lvl * 5}% damage for 4s.` },
];

// ─── DRUID ──────────────────────────────────────────────────────────────────
// Tree 0: Elemental  |  Tree 1: Shape Shifting  |  Tree 2: Summoning

const druidSkills: SkillDef[] = [
  { id: 'firestorm',    classId: 'druid', tree: 0, tier: 0,                              name: 'Firestorm',    icon: '🌊', maxLevel: 20, desc: lvl => `${10 + lvl * 3}% chance on hit: fire wave for ${lvl * 5} damage.` },
  { id: 'molten_boulder', classId: 'druid', tree: 0, tier: 1, prereqId: 'firestorm',    name: 'Molten Boulder', icon: '🪨', maxLevel: 20, desc: lvl => `Every 8th hit rolls a boulder: ${20 + lvl * 6} damage to all enemies.` },
  { id: 'tornado',     classId: 'druid', tree: 0, tier: 2, prereqId: 'molten_boulder',  name: 'Tornado',      icon: '🌪️', maxLevel: 20, desc: lvl => `Every 10th hit: tornado for ${25 + lvl * 7} wind damage (ignores defense).` },

  { id: 'werewolf',    classId: 'druid', tree: 1, tier: 0,                               name: 'Werewolf',     icon: '🐺', maxLevel: 20, desc: lvl => `After 5 consecutive hits: Werewolf form. +${20 + lvl * 2}% damage, faster attacks.` },
  { id: 'werebear',    classId: 'druid', tree: 1, tier: 1, prereqId: 'werewolf',         name: 'Werebear',     icon: '🐻', maxLevel: 20, desc: lvl => `After 3 consecutive enemy hits: Werebear form. +${15 + lvl * 2}% DR.` },
  { id: 'fury',        classId: 'druid', tree: 1, tier: 2, prereqId: 'werebear',         name: 'Fury',         icon: '🦅', maxLevel: 20, desc: lvl => `In Werewolf form: every 4th hit is a Fury strike (+${lvl * 10}% damage).` },

  { id: 'raven',       classId: 'druid', tree: 2, tier: 0,                               name: 'Raven',        icon: '🐦', maxLevel: 20, desc: lvl => `${Math.min(3, 1 + Math.floor(lvl / 7))} raven(s) peck enemies for ${3 + lvl} damage/s.` },
  { id: 'spirit_wolf', classId: 'druid', tree: 2, tier: 1, prereqId: 'raven',            name: 'Spirit Wolf',  icon: '🐕', maxLevel: 20, desc: lvl => `1 spirit wolf companion, auto-attacks for ${5 + lvl * 2} damage.` },
  { id: 'grizzly',     classId: 'druid', tree: 2, tier: 2, prereqId: 'spirit_wolf',      name: 'Grizzly',      icon: '🐻', maxLevel: 20, desc: lvl => `Summon a grizzly bear: ${15 + lvl * 4} damage, ${50 + lvl * 10} HP.` },
];

// ─── AMAZON ─────────────────────────────────────────────────────────────────
// Tree 0: Javelin & Spear  |  Tree 1: Bow & Crossbow  |  Tree 2: Passive & Magic

const amazonSkills: SkillDef[] = [
  { id: 'jab',              classId: 'amazon', tree: 0, tier: 0,                               name: 'Jab',              icon: '🗡️', maxLevel: 20, desc: lvl => `Every 4th slap: triple-hit for ${lvl * 5}% extra damage total.` },
  { id: 'lightning_bolt',   classId: 'amazon', tree: 0, tier: 1, prereqId: 'jab',              name: 'Lightning Bolt',   icon: '⚡', maxLevel: 20, desc: lvl => `${8 + lvl * 2}% chance per hit: ${10 + lvl * 5} lightning damage.` },
  { id: 'lightning_fury',   classId: 'amazon', tree: 0, tier: 2, prereqId: 'lightning_bolt',   name: 'Lightning Fury',   icon: '🌩️', maxLevel: 20, desc: lvl => `Every 10th hit: ${20 + lvl * 8} lightning to ALL enemies.` },

  { id: 'magic_arrow',      classId: 'amazon', tree: 1, tier: 0,                               name: 'Magic Arrow',      icon: '🏹', maxLevel: 20, desc: lvl => `${10 + lvl * 3}% chance on hit: bonus ${5 + lvl * 3} magic damage (no ammo cost).` },
  { id: 'multiple_shot',    classId: 'amazon', tree: 1, tier: 1, prereqId: 'magic_arrow',      name: 'Multiple Shot',    icon: '🎯', maxLevel: 20, desc: lvl => `Every 6th hit fires an extra arrow hitting a random enemy for ${lvl * 8}% damage.` },
  { id: 'strafe',           classId: 'amazon', tree: 1, tier: 2, prereqId: 'multiple_shot',    name: 'Strafe',           icon: '💥', maxLevel: 20, desc: lvl => `Every 8th hit: rapid fire burst, ${2 + Math.floor(lvl / 5)} arrows, ${30 + lvl * 3}% dmg each.` },

  { id: 'inner_sight',      classId: 'amazon', tree: 2, tier: 0,                               name: 'Inner Sight',      icon: '👁️', maxLevel: 20, desc: lvl => `-${lvl * 4} enemy defense (passive).` },
  { id: 'dodge',            classId: 'amazon', tree: 2, tier: 1, prereqId: 'inner_sight',      name: 'Dodge',            icon: '🌀', maxLevel: 20, desc: lvl => `+${5 + lvl * 2}% dodge chance vs enemy attacks.` },
  { id: 'valkyrie',         classId: 'amazon', tree: 2, tier: 2, prereqId: 'dodge',            name: 'Valkyrie',         icon: '⚔️', maxLevel: 20, desc: lvl => `Summon a Valkyrie companion with ${30 + lvl * 5} HP, deals ${5 + lvl * 2} damage.` },
];

export const ALL_SKILLS: SkillDef[] = [
  ...sorceressSkills,
  ...barbarianSkills,
  ...paladinSkills,
  ...necromancerSkills,
  ...druidSkills,
  ...amazonSkills,
];

export const TREE_NAMES: Record<CharClass, [string, string, string]> = {
  sorceress:   ['Fire',           'Cold',            'Lightning'],
  barbarian:   ['Combat Skills',  'Masteries',       'Warcries'],
  paladin:     ['Combat',         'Offensive Auras', 'Defensive Auras'],
  necromancer: ['Summoning',      'Poison & Bone',   'Curses'],
  druid:       ['Elemental',      'Shape Shifting',  'Summoning'],
  amazon:      ['Javelin & Spear','Bow & Crossbow',  'Passive & Magic'],
};

export const TREE_ICONS: Record<CharClass, [string, string, string]> = {
  sorceress:   ['🔥', '🧊', '⚡'],
  barbarian:   ['⚔️', '🛡️', '📢'],
  paladin:     ['⚔️', '✨', '🛡️'],
  necromancer: ['💀', '🦴', '🌀'],
  druid:       ['🌿', '🐺', '🐦'],
  amazon:      ['🗡️', '🏹', '👁️'],
};

export type AllocatedSkills = Record<string, number>; // skillId → level
export const SKILLS_KEY = 'islap_skills';
