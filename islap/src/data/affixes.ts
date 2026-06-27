import { D2Stat, GearSlotId, GearAffinity } from '../types/item';

export type AffixSlotFilter = 'all' | 'weapons' | 'armor' | 'jewelry' | GearSlotId[];

export interface AffixDef {
  id: string;
  name: string;
  isPrefix: boolean;
  group: string;
  minALvl: number;
  weight: number;
  slots: AffixSlotFilter;
  mods: { stat: D2Stat; min: number; max: number }[];
}

const W = 'weapons' as const;
const A = 'armor'   as const;
const J = 'jewelry' as const;

export const AFFIXES: AffixDef[] = [
  // ── PREFIXES ──────────────────────────────────────────────────────────────

  // Enhanced Damage — weapons only
  { id:'p_ed_1',  name:'Steel',      isPrefix:true,  group:'enhDmg', minALvl:1,  weight:10, slots:W, mods:[{stat:'enhancedDamage',min:1,  max:15 }] },
  { id:'p_ed_2',  name:'Blessed',    isPrefix:true,  group:'enhDmg', minALvl:5,  weight:8,  slots:W, mods:[{stat:'enhancedDamage',min:15, max:30 }] },
  { id:'p_ed_3',  name:'Jagged',     isPrefix:true,  group:'enhDmg', minALvl:7,  weight:8,  slots:W, mods:[{stat:'enhancedDamage',min:25, max:50 }] },
  { id:'p_ed_4',  name:'Deadly',     isPrefix:true,  group:'enhDmg', minALvl:13, weight:6,  slots:W, mods:[{stat:'enhancedDamage',min:40, max:65 }] },
  { id:'p_ed_5',  name:'Vicious',    isPrefix:true,  group:'enhDmg', minALvl:20, weight:5,  slots:W, mods:[{stat:'enhancedDamage',min:60, max:100}] },
  { id:'p_ed_6',  name:'Brutal',     isPrefix:true,  group:'enhDmg', minALvl:30, weight:4,  slots:W, mods:[{stat:'enhancedDamage',min:100,max:150}] },
  { id:'p_ed_7',  name:'Massive',    isPrefix:true,  group:'enhDmg', minALvl:40, weight:3,  slots:W, mods:[{stat:'enhancedDamage',min:150,max:200}] },
  { id:'p_ed_8',  name:'Savage',     isPrefix:true,  group:'enhDmg', minALvl:50, weight:2,  slots:W, mods:[{stat:'enhancedDamage',min:150,max:250}] },
  { id:'p_ed_9',  name:'Merciless',  isPrefix:true,  group:'enhDmg', minALvl:60, weight:2,  slots:W, mods:[{stat:'enhancedDamage',min:200,max:300}] },
  { id:'p_ed_10', name:'Cruel',      isPrefix:true,  group:'enhDmg', minALvl:70, weight:1,  slots:W, mods:[{stat:'enhancedDamage',min:270,max:320}] },

  // Flat Damage — weapons only
  { id:'p_fd_1',  name:'Sharp',      isPrefix:true,  group:'minDmg', minALvl:1,  weight:8,  slots:W, mods:[{stat:'minDamage',min:1,max:2},{stat:'maxDamage',min:1,max:3}] },
  { id:'p_fd_2',  name:'Fine',       isPrefix:true,  group:'minDmg', minALvl:8,  weight:6,  slots:W, mods:[{stat:'minDamage',min:2,max:4},{stat:'maxDamage',min:2,max:5}] },
  { id:'p_fd_3',  name:'Honed',      isPrefix:true,  group:'minDmg', minALvl:18, weight:5,  slots:W, mods:[{stat:'minDamage',min:3,max:6},{stat:'maxDamage',min:4,max:8}] },
  { id:'p_fd_4',  name:'Polished',   isPrefix:true,  group:'minDmg', minALvl:30, weight:4,  slots:W, mods:[{stat:'minDamage',min:5,max:9},{stat:'maxDamage',min:6,max:11}] },
  { id:'p_fd_5',  name:'Tempered',   isPrefix:true,  group:'minDmg', minALvl:45, weight:2,  slots:W, mods:[{stat:'minDamage',min:7,max:12},{stat:'maxDamage',min:9,max:15}] },

  // Enhanced Defense — armor only
  { id:'p_def_1', name:'Sturdy',     isPrefix:true,  group:'enhDef', minALvl:1,  weight:10, slots:A, mods:[{stat:'enhancedDefense',min:10, max:20 }] },
  { id:'p_def_2', name:'Strong',     isPrefix:true,  group:'enhDef', minALvl:7,  weight:8,  slots:A, mods:[{stat:'enhancedDefense',min:20, max:30 }] },
  { id:'p_def_3', name:'Glorious',   isPrefix:true,  group:'enhDef', minALvl:13, weight:6,  slots:A, mods:[{stat:'enhancedDefense',min:30, max:40 }] },
  { id:'p_def_4', name:'Blessed',    isPrefix:true,  group:'enhDef', minALvl:20, weight:5,  slots:A, mods:[{stat:'enhancedDefense',min:40, max:55 }] },
  { id:'p_def_5', name:'Saintly',    isPrefix:true,  group:'enhDef', minALvl:30, weight:4,  slots:A, mods:[{stat:'enhancedDefense',min:50, max:65 }] },
  { id:'p_def_6', name:'Holy',       isPrefix:true,  group:'enhDef', minALvl:40, weight:3,  slots:A, mods:[{stat:'enhancedDefense',min:60, max:80 }] },
  { id:'p_def_7', name:'Godly',      isPrefix:true,  group:'enhDef', minALvl:52, weight:2,  slots:A, mods:[{stat:'enhancedDefense',min:80, max:100}] },

  // Flat Defense — armor only
  { id:'p_fdef_1',name:'Stout',      isPrefix:true,  group:'flatDef',minALvl:1,  weight:8,  slots:A, mods:[{stat:'flatDefense',min:5,  max:15 }] },
  { id:'p_fdef_2',name:'Tough',      isPrefix:true,  group:'flatDef',minALvl:10, weight:6,  slots:A, mods:[{stat:'flatDefense',min:15, max:30 }] },
  { id:'p_fdef_3',name:'Rugged',     isPrefix:true,  group:'flatDef',minALvl:20, weight:5,  slots:A, mods:[{stat:'flatDefense',min:30, max:50 }] },
  { id:'p_fdef_4',name:'Stalwart',   isPrefix:true,  group:'flatDef',minALvl:32, weight:3,  slots:A, mods:[{stat:'flatDefense',min:50, max:80 }] },
  { id:'p_fdef_5',name:'Chosen',     isPrefix:true,  group:'flatDef',minALvl:47, weight:2,  slots:A, mods:[{stat:'flatDefense',min:80, max:120}] },

  // Life prefix — weapons & jewelry
  { id:'p_life_1',name:'Hale',       isPrefix:true,  group:'lifeP',  minALvl:1,  weight:8,  slots:['hand_l','hand_r','amulet','ring_l','ring_r'], mods:[{stat:'life',min:5,  max:15 }] },
  { id:'p_life_2',name:'Healthy',    isPrefix:true,  group:'lifeP',  minALvl:10, weight:6,  slots:['hand_l','hand_r','amulet','ring_l','ring_r'], mods:[{stat:'life',min:16, max:25 }] },
  { id:'p_life_3',name:'Glowing',    isPrefix:true,  group:'lifeP',  minALvl:22, weight:4,  slots:['hand_l','hand_r','amulet','ring_l','ring_r'], mods:[{stat:'life',min:26, max:40 }] },
  { id:'p_life_4',name:'Radiant',    isPrefix:true,  group:'lifeP',  minALvl:35, weight:3,  slots:['hand_l','hand_r','amulet','ring_l','ring_r'], mods:[{stat:'life',min:40, max:60 }] },
  { id:'p_life_5',name:'Blessed',    isPrefix:true,  group:'lifeP',  minALvl:50, weight:2,  slots:['hand_l','hand_r','amulet','ring_l','ring_r'], mods:[{stat:'life',min:60, max:100}] },

  // Attack Rating prefix — weapons
  { id:'p_ar_1',  name:'Bronze',     isPrefix:true,  group:'arP',    minALvl:1,  weight:8,  slots:W, mods:[{stat:'attackRating',min:10, max:30 }] },
  { id:'p_ar_2',  name:'Iron',       isPrefix:true,  group:'arP',    minALvl:8,  weight:6,  slots:W, mods:[{stat:'attackRating',min:30, max:60 }] },
  { id:'p_ar_3',  name:'Cobalt',     isPrefix:true,  group:'arP',    minALvl:20, weight:4,  slots:W, mods:[{stat:'attackRating',min:60, max:100}] },
  { id:'p_ar_4',  name:'Mithril',    isPrefix:true,  group:'arP',    minALvl:35, weight:3,  slots:W, mods:[{stat:'attackRating',min:100,max:150}] },
  { id:'p_ar_5',  name:'Adamantine', isPrefix:true,  group:'arP',    minALvl:50, weight:2,  slots:W, mods:[{stat:'attackRating',min:150,max:250}] },

  // IAS prefix — weapons
  { id:'p_ias_1', name:'Swift',      isPrefix:true,  group:'ias',    minALvl:5,  weight:6,  slots:W, mods:[{stat:'fasterAttack',min:5, max:10}] },
  { id:'p_ias_2', name:'Quick',      isPrefix:true,  group:'ias',    minALvl:15, weight:4,  slots:W, mods:[{stat:'fasterAttack',min:10,max:20}] },
  { id:'p_ias_3', name:'Hasty',      isPrefix:true,  group:'ias',    minALvl:28, weight:3,  slots:W, mods:[{stat:'fasterAttack',min:20,max:30}] },

  // ── SUFFIXES ──────────────────────────────────────────────────────────────

  // Life suffix — all
  { id:'s_life_1', name:'of the Jackal',   isPrefix:false, group:'life', minALvl:1,  weight:10, slots:'all', mods:[{stat:'life',min:1,  max:5  }] },
  { id:'s_life_2', name:'of the Fox',      isPrefix:false, group:'life', minALvl:4,  weight:8,  slots:'all', mods:[{stat:'life',min:6,  max:15 }] },
  { id:'s_life_3', name:'of the Wolf',     isPrefix:false, group:'life', minALvl:8,  weight:7,  slots:'all', mods:[{stat:'life',min:16, max:25 }] },
  { id:'s_life_4', name:'of the Tiger',    isPrefix:false, group:'life', minALvl:15, weight:6,  slots:'all', mods:[{stat:'life',min:26, max:40 }] },
  { id:'s_life_5', name:'of the Mammoth',  isPrefix:false, group:'life', minALvl:23, weight:5,  slots:'all', mods:[{stat:'life',min:41, max:60 }] },
  { id:'s_life_6', name:'of the Colossus', isPrefix:false, group:'life', minALvl:35, weight:4,  slots:'all', mods:[{stat:'life',min:61, max:100}] },
  { id:'s_life_7', name:'of the Whale',    isPrefix:false, group:'life', minALvl:50, weight:2,  slots:'all', mods:[{stat:'life',min:101,max:150}] },

  // Strength suffix
  { id:'s_str_1', name:'of Strength',      isPrefix:false, group:'str', minALvl:1,  weight:10, slots:'all', mods:[{stat:'strength',min:1, max:2 }] },
  { id:'s_str_2', name:'of Might',         isPrefix:false, group:'str', minALvl:8,  weight:7,  slots:'all', mods:[{stat:'strength',min:3, max:5 }] },
  { id:'s_str_3', name:'of the Ox',        isPrefix:false, group:'str', minALvl:15, weight:5,  slots:'all', mods:[{stat:'strength',min:6, max:9 }] },
  { id:'s_str_4', name:'of the Giant',     isPrefix:false, group:'str', minALvl:24, weight:4,  slots:'all', mods:[{stat:'strength',min:10,max:15}] },
  { id:'s_str_5', name:'of the Titan',     isPrefix:false, group:'str', minALvl:40, weight:2,  slots:'all', mods:[{stat:'strength',min:16,max:20}] },
  { id:'s_str_6', name:'of the Leviathan', isPrefix:false, group:'str', minALvl:60, weight:1,  slots:'all', mods:[{stat:'strength',min:21,max:30}] },

  // Dexterity suffix
  { id:'s_dex_1', name:'of Dexterity',     isPrefix:false, group:'dex', minALvl:1,  weight:10, slots:'all', mods:[{stat:'dexterity',min:1, max:2 }] },
  { id:'s_dex_2', name:'of Skill',         isPrefix:false, group:'dex', minALvl:8,  weight:7,  slots:'all', mods:[{stat:'dexterity',min:3, max:5 }] },
  { id:'s_dex_3', name:'of Accuracy',      isPrefix:false, group:'dex', minALvl:15, weight:5,  slots:'all', mods:[{stat:'dexterity',min:6, max:9 }] },
  { id:'s_dex_4', name:'of Precision',     isPrefix:false, group:'dex', minALvl:24, weight:4,  slots:'all', mods:[{stat:'dexterity',min:10,max:15}] },
  { id:'s_dex_5', name:'of Perfection',    isPrefix:false, group:'dex', minALvl:40, weight:2,  slots:'all', mods:[{stat:'dexterity',min:16,max:20}] },
  { id:'s_dex_6', name:'of Nirvana',       isPrefix:false, group:'dex', minALvl:60, weight:1,  slots:'all', mods:[{stat:'dexterity',min:21,max:30}] },

  // Vitality suffix
  { id:'s_vit_1', name:'of Vitality',      isPrefix:false, group:'vit', minALvl:1,  weight:10, slots:'all', mods:[{stat:'vitality',min:1, max:3 }] },
  { id:'s_vit_2', name:'of Sustenance',    isPrefix:false, group:'vit', minALvl:8,  weight:7,  slots:'all', mods:[{stat:'vitality',min:4, max:7 }] },
  { id:'s_vit_3', name:'of Regrowth',      isPrefix:false, group:'vit', minALvl:18, weight:5,  slots:'all', mods:[{stat:'vitality',min:8, max:12}] },
  { id:'s_vit_4', name:'of Regeneration',  isPrefix:false, group:'vit', minALvl:32, weight:3,  slots:'all', mods:[{stat:'vitality',min:13,max:18}] },
  { id:'s_vit_5', name:'of Life Everlasting',isPrefix:false,group:'vit',minALvl:50, weight:1,  slots:'all', mods:[{stat:'vitality',min:19,max:25}] },

  // Energy suffix
  { id:'s_ene_1', name:'of Energy',        isPrefix:false, group:'ene', minALvl:1,  weight:8,  slots:'all', mods:[{stat:'energy',min:1, max:3 }] },
  { id:'s_ene_2', name:'of the Mind',      isPrefix:false, group:'ene', minALvl:8,  weight:6,  slots:'all', mods:[{stat:'energy',min:4, max:7 }] },
  { id:'s_ene_3', name:'of Brilliance',    isPrefix:false, group:'ene', minALvl:20, weight:4,  slots:'all', mods:[{stat:'energy',min:8, max:12}] },
  { id:'s_ene_4', name:'of Sorcery',       isPrefix:false, group:'ene', minALvl:35, weight:2,  slots:'all', mods:[{stat:'energy',min:13,max:18}] },
  { id:'s_ene_5', name:'of Wizardry',      isPrefix:false, group:'ene', minALvl:55, weight:1,  slots:'all', mods:[{stat:'energy',min:19,max:25}] },

  // All Stats suffix — jewelry mostly
  { id:'s_all_1', name:'of Worth',         isPrefix:false, group:'allStats', minALvl:15, weight:5, slots:['amulet','ring_l','ring_r'], mods:[{stat:'allStats',min:3,max:5}] },
  { id:'s_all_2', name:'of Excellence',    isPrefix:false, group:'allStats', minALvl:35, weight:3, slots:['amulet','ring_l','ring_r'], mods:[{stat:'allStats',min:6,max:9}] },
  { id:'s_all_3', name:'of Perfection',    isPrefix:false, group:'allStats', minALvl:55, weight:1, slots:['amulet','ring_l','ring_r'], mods:[{stat:'allStats',min:10,max:15}] },

  // Attack Rating suffix — all armor & jewelry
  { id:'s_ar_1', name:'of Craftsmanship',  isPrefix:false, group:'arS', minALvl:1,  weight:8, slots:'all', mods:[{stat:'attackRating',min:10, max:30 }] },
  { id:'s_ar_2', name:'of Quality',        isPrefix:false, group:'arS', minALvl:8,  weight:6, slots:'all', mods:[{stat:'attackRating',min:30, max:60 }] },
  { id:'s_ar_3', name:'of Maiming',        isPrefix:false, group:'arS', minALvl:20, weight:4, slots:'all', mods:[{stat:'attackRating',min:60, max:100}] },
  { id:'s_ar_4', name:'of Slaughter',      isPrefix:false, group:'arS', minALvl:35, weight:2, slots:'all', mods:[{stat:'attackRating',min:100,max:150}] },

  // Life Steal suffix — weapons only
  { id:'s_ls_1', name:'of the Leech',      isPrefix:false, group:'lifeSteal', minALvl:10, weight:5, slots:W, mods:[{stat:'lifeSteal',min:3,max:5}] },
  { id:'s_ls_2', name:'of Vileness',       isPrefix:false, group:'lifeSteal', minALvl:25, weight:3, slots:W, mods:[{stat:'lifeSteal',min:5,max:8}] },
  { id:'s_ls_3', name:'of Vampirism',      isPrefix:false, group:'lifeSteal', minALvl:45, weight:1, slots:W, mods:[{stat:'lifeSteal',min:8,max:12}] },

  // Deadly Strike suffix — weapons & jewelry
  { id:'s_ds_1', name:'of Fortune',        isPrefix:false, group:'ds', minALvl:20, weight:4, slots:['hand_l','hand_r','amulet'], mods:[{stat:'deadlyStrike',min:5, max:10}] },
  { id:'s_ds_2', name:'of Slaying',        isPrefix:false, group:'ds', minALvl:40, weight:2, slots:['hand_l','hand_r','amulet'], mods:[{stat:'deadlyStrike',min:10,max:20}] },

  // Resistance suffixes — all
  { id:'s_fr_1', name:'of the Flame',      isPrefix:false, group:'fr', minALvl:5,  weight:6, slots:'all', mods:[{stat:'fireResist',min:5, max:15}] },
  { id:'s_fr_2', name:'of the Inferno',    isPrefix:false, group:'fr', minALvl:20, weight:3, slots:'all', mods:[{stat:'fireResist',min:15,max:30}] },
  { id:'s_cr_1', name:'of the Tundra',     isPrefix:false, group:'cr', minALvl:5,  weight:6, slots:'all', mods:[{stat:'coldResist',min:5, max:15}] },
  { id:'s_cr_2', name:'of the Glacier',    isPrefix:false, group:'cr', minALvl:20, weight:3, slots:'all', mods:[{stat:'coldResist',min:15,max:30}] },
  { id:'s_lr_1', name:'of Storms',         isPrefix:false, group:'lr', minALvl:5,  weight:6, slots:'all', mods:[{stat:'lightningResist',min:5, max:15}] },
  { id:'s_lr_2', name:'of the Thunder',    isPrefix:false, group:'lr', minALvl:20, weight:3, slots:'all', mods:[{stat:'lightningResist',min:15,max:30}] },
  { id:'s_pr_1', name:'of Blight',         isPrefix:false, group:'pr', minALvl:5,  weight:6, slots:'all', mods:[{stat:'poisonResist',min:5, max:15}] },
  { id:'s_ar2_1',name:'of Balance',        isPrefix:false, group:'allRes', minALvl:20, weight:4, slots:'all', mods:[{stat:'allResist',min:5, max:10}] },
  { id:'s_ar2_2',name:'of the Sentinel',   isPrefix:false, group:'allRes', minALvl:40, weight:2, slots:'all', mods:[{stat:'allResist',min:10,max:20}] },

  // Magic Find suffix — all
  { id:'s_mf_1', name:'of the Apprentice', isPrefix:false, group:'mf', minALvl:5,  weight:5, slots:'all', mods:[{stat:'magicFind',min:5, max:15}] },
  { id:'s_mf_2', name:'of the Journeyman', isPrefix:false, group:'mf', minALvl:20, weight:3, slots:'all', mods:[{stat:'magicFind',min:15,max:30}] },
  { id:'s_mf_3', name:'of the Adept',      isPrefix:false, group:'mf', minALvl:40, weight:1, slots:'all', mods:[{stat:'magicFind',min:30,max:50}] },

  // FHR suffix — armor
  { id:'s_fhr_1',name:'of Balance',        isPrefix:false, group:'fhr', minALvl:5,  weight:5, slots:A, mods:[{stat:'fasterHitRecovery',min:5, max:10}] },
  { id:'s_fhr_2',name:'of Stability',      isPrefix:false, group:'fhr', minALvl:20, weight:3, slots:A, mods:[{stat:'fasterHitRecovery',min:10,max:20}] },
  { id:'s_fhr_3',name:'of Equilibrium',    isPrefix:false, group:'fhr', minALvl:40, weight:1, slots:A, mods:[{stat:'fasterHitRecovery',min:20,max:30}] },

  // Damage Reduced — armor & jewelry
  { id:'s_dr_1', name:'of the Soldier',    isPrefix:false, group:'dr', minALvl:10, weight:4, slots:A, mods:[{stat:'damageReduced',min:3, max:5}] },
  { id:'s_dr_2', name:'of the Knight',     isPrefix:false, group:'dr', minALvl:25, weight:3, slots:A, mods:[{stat:'damageReduced',min:5, max:8}] },
  { id:'s_dr_3', name:'of the Paladin',    isPrefix:false, group:'dr', minALvl:45, weight:1, slots:A, mods:[{stat:'damageReduced',min:8, max:15}] },

  // Crushing Blow — weapons
  { id:'s_cb_1', name:'of Shattering',     isPrefix:false, group:'cb', minALvl:25, weight:3, slots:W, mods:[{stat:'crushingBlow',min:5, max:10}] },
  { id:'s_cb_2', name:'of Rupture',        isPrefix:false, group:'cb', minALvl:50, weight:1, slots:W, mods:[{stat:'crushingBlow',min:10,max:20}] },

  // Gold Find — all
  { id:'s_gf_1', name:'of Greed',          isPrefix:false, group:'gf', minALvl:5,  weight:4, slots:'all', mods:[{stat:'goldFind',min:20, max:50 }] },
  { id:'s_gf_2', name:'of Avarice',        isPrefix:false, group:'gf', minALvl:20, weight:2, slots:'all', mods:[{stat:'goldFind',min:50, max:100}] },
];

// Rare name tables (D2-style)
const RARE_PREFIXES = [
  'Grim','Bitter','Vile','Foul','Dire','Deadly','Vicious','Brutal',
  'Cruel','Dark','Storm','Iron','Shadow','Blood','Bone','Death',
  'Dread','Doom','Pain','Wrath','Hate','Ruin','Grief','Plague',
];
const RARE_SUFFIXES = [
  'Beak','Bite','Claw','Gash','Mark','Word','Thirst','Wound',
  'Blow','Spike','Branch','Fist','Claw','Horn','Grasp','Hunger',
  'Whisper','Scream','Shriek','Voice','Song','Shout','Cry','Toll',
];

export function rollRareName(): string {
  const p = RARE_PREFIXES[Math.floor(Math.random() * RARE_PREFIXES.length)];
  const s = RARE_SUFFIXES[Math.floor(Math.random() * RARE_SUFFIXES.length)];
  return `${p} ${s}`;
}

export function getEligibleAffixes(
  aLvl: number,
  affinity: 'weapon' | 'armor' | 'jewelry',
  type: GearSlotId,
  isPrefix: boolean,
): AffixDef[] {
  return AFFIXES.filter(a => {
    if (a.isPrefix !== isPrefix) return false;
    if (a.minALvl > aLvl) return false;
    if (a.slots === 'all') return true;
    if (a.slots === 'weapons') return affinity === 'weapon';
    if (a.slots === 'armor')   return affinity === 'armor';
    if (a.slots === 'jewelry') return affinity === 'jewelry';
    return (a.slots as GearSlotId[]).includes(type);
  });
}

export function weightedPick<T extends { weight: number }>(pool: T[]): T | null {
  if (pool.length === 0) return null;
  const total = pool.reduce((s, a) => s + a.weight, 0);
  let r = Math.random() * total;
  for (const a of pool) {
    r -= a.weight;
    if (r <= 0) return a;
  }
  return pool[pool.length - 1];
}

export function rollAffix(def: AffixDef): import('../types/item').AffixInstance {
  const mods = def.mods.map(m => ({
    stat: m.stat,
    value: Math.round(m.min + Math.random() * (m.max - m.min)),
  }));
  return { affixId: def.id, name: def.name, isPrefix: def.isPrefix, mods };
}
