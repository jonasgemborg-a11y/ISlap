import { GearSlotId, StatMod } from '../types/item';

export interface UniqueDef {
  id: string;
  baseName: string;   // display name of base item
  uniqueName: string;
  type: GearSlotId;
  icon: string;
  reqLevel: number;
  reqStr?: number;
  reqDex?: number;
  baseDefMin?: number;
  baseDefMax?: number;
  baseDmgMin?: number;
  baseDmgMax?: number;
  mods: StatMod[];
}

export const UNIQUES: UniqueDef[] = [
  // ── HELMS ──────────────────────────────────────────────────────
  {
    id:'harlequin_crest', baseName:'Shako', uniqueName:"Harlequin Crest",
    type:'helm', icon:'👑', reqLevel:62, reqStr:50,
    baseDefMin:98, baseDefMax:141,
    mods:[
      {stat:'life',        value:50},
      {stat:'allStats',    value:5},
      {stat:'magicFind',   value:50},
      {stat:'damageReduced',value:10},
    ],
  },
  {
    id:'andariels_visage', baseName:'Demonhead', uniqueName:"Andariel's Visage",
    type:'helm', icon:'😈', reqLevel:83, reqStr:102,
    baseDefMin:101, baseDefMax:154,
    mods:[
      {stat:'strength',    value:25},
      {stat:'dexterity',   value:10},
      {stat:'fasterAttack',value:20},
      {stat:'lifeSteal',   value:8},
    ],
  },
  {
    id:'crown_of_ages', baseName:'Corona', uniqueName:"Crown of Ages",
    type:'helm', icon:'👑', reqLevel:82, reqStr:174,
    baseDefMin:111, baseDefMax:159,
    mods:[
      {stat:'enhancedDefense', value:40},
      {stat:'damageReduced',   value:12},
      {stat:'allResist',       value:25},
      {stat:'fasterHitRecovery',value:30},
    ],
  },
  {
    id:'vampire_gaze', baseName:'Grim Helm', uniqueName:"Vampire Gaze",
    type:'helm', icon:'🧛', reqLevel:41, reqStr:58,
    baseDefMin:60, baseDefMax:125,
    mods:[
      {stat:'lifeSteal',    value:7},
      {stat:'manaSteal',    value:6},
      {stat:'damageReduced',value:17},
      {stat:'coldResist',   value:20},
    ],
  },
  {
    id:'rockstopper', baseName:'Sallet', uniqueName:"Rockstopper",
    type:'helm', icon:'⛑️', reqLevel:31, reqStr:43,
    baseDefMin:25, baseDefMax:45,
    mods:[
      {stat:'vitality',       value:15},
      {stat:'enhancedDefense',value:55},
      {stat:'damageReduced',  value:20},
      {stat:'allResist',      value:15},
    ],
  },
  {
    id:'peasant_crown', baseName:'War Hat', uniqueName:"Peasant Crown",
    type:'helm', icon:'🎩', reqLevel:28, reqStr:20,
    baseDefMin:20, baseDefMax:24,
    mods:[
      {stat:'vitality',       value:20},
      {stat:'energy',         value:20},
      {stat:'enhancedDefense',value:30},
      {stat:'life',           value:30},
    ],
  },
  {
    id:'griffons_eye', baseName:'Diadem', uniqueName:"Griffon's Eye",
    type:'helm', icon:'🦅', reqLevel:76, reqStr:0,
    baseDefMin:50, baseDefMax:60,
    mods:[
      {stat:'dexterity',       value:15},
      {stat:'enhancedDefense', value:100},
      {stat:'attackRating',    value:100},
      {stat:'fasterAttack',    value:15},
    ],
  },

  // ── ARMOR ──────────────────────────────────────────────────────
  {
    id:'arkaines_valor', baseName:'Balrog Skin', uniqueName:"Arkaine's Valor",
    type:'armor', icon:'🛡️', reqLevel:85, reqStr:165,
    baseDefMin:425, baseDefMax:517,
    mods:[
      {stat:'enhancedDefense',value:165},
      {stat:'vitality',       value:15},
      {stat:'damageReduced',  value:11},
      {stat:'fasterHitRecovery',value:30},
    ],
  },
  {
    id:'skullders_ire', baseName:'Russet Armor', uniqueName:"Skullder's Ire",
    type:'armor', icon:'🧥', reqLevel:42, reqStr:97,
    baseDefMin:218, baseDefMax:316,
    mods:[
      {stat:'enhancedDefense',value:120},
      {stat:'magicFind',      value:40},
      {stat:'life',           value:30},
      {stat:'allResist',      value:10},
    ],
  },
  {
    id:'gladiators_bane', baseName:'Wire Fleece', uniqueName:"The Gladiator's Bane",
    type:'armor', icon:'⚔️', reqLevel:70, reqStr:111,
    baseDefMin:342, baseDefMax:417,
    mods:[
      {stat:'enhancedDefense',value:170},
      {stat:'damageReduced',  value:17},
      {stat:'fasterHitRecovery',value:20},
      {stat:'life',           value:40},
    ],
  },
  {
    id:'vipermagi', baseName:'Serpentskin Armor', uniqueName:"Skin of the Vipermagi",
    type:'armor', icon:'🐍', reqLevel:29, reqStr:43,
    baseDefMin:111, baseDefMax:124,
    mods:[
      {stat:'enhancedDefense',value:120},
      {stat:'allResist',      value:27},
      {stat:'fasterAttack',   value:20},
      {stat:'life',           value:20},
    ],
  },
  {
    id:'duriels_shell', baseName:'Cuirass', uniqueName:"Duriel's Shell",
    type:'armor', icon:'🦟', reqLevel:41, reqStr:65,
    baseDefMin:230, baseDefMax:270,
    mods:[
      {stat:'enhancedDefense',value:200},
      {stat:'vitality',       value:15},
      {stat:'coldResist',     value:100},
      {stat:'life',           value:50},
    ],
  },
  {
    id:'shaftstop', baseName:'Mesh Armor', uniqueName:"Shaftstop",
    type:'armor', icon:'🪖', reqLevel:38, reqStr:92,
    baseDefMin:198, baseDefMax:228,
    mods:[
      {stat:'enhancedDefense',value:200},
      {stat:'vitality',       value:30},
      {stat:'damageReduced',  value:30},
      {stat:'life',           value:60},
    ],
  },

  // ── AMULETS ────────────────────────────────────────────────────
  {
    id:'maras', baseName:'Amulet', uniqueName:"Mara's Kaleidoscope",
    type:'amulet', icon:'📿', reqLevel:67,
    mods:[
      {stat:'strength',  value:5},
      {stat:'dexterity', value:5},
      {stat:'allResist', value:25},
      {stat:'allStats',  value:5},
    ],
  },
  {
    id:'saracens_chance', baseName:'Amulet', uniqueName:"Saracen's Chance",
    type:'amulet', icon:'📿', reqLevel:47,
    mods:[
      {stat:'allStats',  value:12},
      {stat:'allResist', value:15},
      {stat:'life',      value:25},
    ],
  },
  {
    id:'highlords_wrath', baseName:'Amulet', uniqueName:"Highlord's Wrath",
    type:'amulet', icon:'⚡', reqLevel:65,
    mods:[
      {stat:'allResist',    value:35},
      {stat:'deadlyStrike', value:10},
      {stat:'fasterAttack', value:20},
      {stat:'attackRating', value:100},
    ],
  },
  {
    id:'atmas_scarab', baseName:'Amulet', uniqueName:"Atma's Scarab",
    type:'amulet', icon:'🪲', reqLevel:60,
    mods:[
      {stat:'strength',    value:3},
      {stat:'dexterity',   value:3},
      {stat:'poisonResist',value:15},
      {stat:'deadlyStrike',value:5},
      {stat:'attackRating',value:75},
    ],
  },
  {
    id:'eye_of_etlich', baseName:'Amulet', uniqueName:"The Eye of Etlich",
    type:'amulet', icon:'👁️', reqLevel:15,
    mods:[
      {stat:'lifeSteal',value:4},
      {stat:'life',     value:20},
      {stat:'coldResist',value:15},
      {stat:'attackRating',value:50},
    ],
  },

  // ── RINGS ──────────────────────────────────────────────────────
  {
    id:'soj', baseName:'Ring', uniqueName:"Stone of Jordan",
    type:'ring_l', icon:'💍', reqLevel:29,
    mods:[
      {stat:'energy',    value:20},
      {stat:'mana',      value:25},
      {stat:'life',      value:20},
      {stat:'attackRating',value:50},
    ],
  },
  {
    id:'bul_kathos', baseName:'Ring', uniqueName:"Bul-Kathos' Wedding Band",
    type:'ring_l', icon:'💍', reqLevel:58,
    mods:[
      {stat:'lifeSteal',value:4},
      {stat:'life',     value:50},
      {stat:'strength', value:5},
    ],
  },
  {
    id:'raven_frost', baseName:'Ring', uniqueName:"Raven Frost",
    type:'ring_l', icon:'❄️', reqLevel:45,
    mods:[
      {stat:'dexterity',   value:20},
      {stat:'mana',        value:40},
      {stat:'attackRating',value:200},
      {stat:'coldResist',  value:40},
    ],
  },
  {
    id:'dwarf_star', baseName:'Ring', uniqueName:"Dwarf Star",
    type:'ring_l', icon:'⭐', reqLevel:45,
    mods:[
      {stat:'life',    value:40},
      {stat:'goldFind',value:100},
      {stat:'vitality',value:10},
    ],
  },
  {
    id:'wisp_projector', baseName:'Ring', uniqueName:"Wisp Projector",
    type:'ring_l', icon:'👻', reqLevel:76,
    mods:[
      {stat:'magicFind',      value:20},
      {stat:'lightningResist',value:25},
      {stat:'life',           value:20},
      {stat:'strength',       value:5},
    ],
  },
  {
    id:'nagelring', baseName:'Ring', uniqueName:"Nagelring",
    type:'ring_l', icon:'💍', reqLevel:7,
    mods:[
      {stat:'magicFind',   value:22},
      {stat:'goldFind',    value:30},
      {stat:'attackRating',value:62},
      {stat:'strength',    value:5},
    ],
  },

  // ── GLOVES ─────────────────────────────────────────────────────
  {
    id:'magefist', baseName:'Light Gauntlets', uniqueName:"Magefist",
    type:'gloves', icon:'🧤', reqLevel:23, reqStr:45,
    baseDefMin:24, baseDefMax:26,
    mods:[
      {stat:'fasterAttack',   value:20},
      {stat:'enhancedDefense',value:25},
      {stat:'mana',           value:25},
      {stat:'energy',         value:5},
    ],
  },
  {
    id:'chance_guards', baseName:'Chain Gloves', uniqueName:"Chance Guards",
    type:'gloves', icon:'🧤', reqLevel:15, reqStr:25,
    baseDefMin:8, baseDefMax:9,
    mods:[
      {stat:'goldFind',       value:200},
      {stat:'enhancedDefense',value:32},
      {stat:'mana',           value:20},
      {stat:'magicFind',      value:15},
    ],
  },
  {
    id:'frostburn', baseName:'Gauntlets', uniqueName:"Frostburn",
    type:'gloves', icon:'🥶', reqLevel:29, reqStr:60,
    baseDefMin:16, baseDefMax:20,
    mods:[
      {stat:'energy',    value:15},
      {stat:'mana',      value:40},
      {stat:'coldResist',value:30},
      {stat:'enhancedDefense',value:30},
    ],
  },
  {
    id:'bloodfist', baseName:'Heavy Gloves', uniqueName:"Bloodfist",
    type:'gloves', icon:'👊', reqLevel:9,
    baseDefMin:5, baseDefMax:6,
    mods:[
      {stat:'fasterHitRecovery',value:30},
      {stat:'enhancedDefense', value:25},
      {stat:'life',            value:15},
      {stat:'fasterAttack',    value:10},
    ],
  },
  {
    id:'laying_of_hands', baseName:'Bramble Mitts', uniqueName:"Laying of Hands",
    type:'gloves', icon:'🙌', reqLevel:63, reqStr:50,
    baseDefMin:54, baseDefMax:62,
    mods:[
      {stat:'fasterAttack',    value:20},
      {stat:'fireResist',      value:50},
      {stat:'enhancedDefense', value:50},
      {stat:'attackRating',    value:100},
    ],
  },
  {
    id:'draculs_grasp', baseName:'Vampirebone Gloves', uniqueName:"Dracul's Grasp",
    type:'gloves', icon:'🩸', reqLevel:76, reqStr:50,
    baseDefMin:56, baseDefMax:65,
    mods:[
      {stat:'strength',  value:7},
      {stat:'life',      value:12},
      {stat:'lifeSteal', value:7},
      {stat:'openWounds',value:25},
    ],
  },

  // ── BELT ───────────────────────────────────────────────────────
  {
    id:'verdungos', baseName:'Mithril Coil', uniqueName:"Verdungo's Hearty Cord",
    type:'belt', icon:'🪢', reqLevel:63, reqStr:106,
    baseDefMin:58, baseDefMax:65,
    mods:[
      {stat:'vitality',       value:12},
      {stat:'damageReduced',  value:12},
      {stat:'enhancedDefense',value:35},
      {stat:'life',           value:40},
    ],
  },
  {
    id:'goldwrap', baseName:'Heavy Belt', uniqueName:"Goldwrap",
    type:'belt', icon:'💛', reqLevel:27, reqStr:45,
    baseDefMin:18, baseDefMax:18,
    mods:[
      {stat:'goldFind',       value:40},
      {stat:'magicFind',      value:7},
      {stat:'enhancedDefense',value:50},
      {stat:'life',           value:20},
    ],
  },
  {
    id:'arachnid_mesh', baseName:'Spiderweb Sash', uniqueName:"Arachnid Mesh",
    type:'belt', icon:'🕸️', reqLevel:80, reqStr:50,
    baseDefMin:55, baseDefMax:62,
    mods:[
      {stat:'enhancedDefense',value:105},
      {stat:'fasterAttack',   value:20},
      {stat:'energy',         value:10},
      {stat:'mana',           value:30},
    ],
  },
  {
    id:'string_of_ears', baseName:'Demonhide Sash', uniqueName:"String of Ears",
    type:'belt', icon:'💀', reqLevel:29, reqStr:20,
    baseDefMin:29, baseDefMax:34,
    mods:[
      {stat:'lifeSteal',      value:7},
      {stat:'damageReduced',  value:12},
      {stat:'enhancedDefense',value:165},
      {stat:'life',           value:30},
    ],
  },
  {
    id:'thundergods_vigor', baseName:'War Belt', uniqueName:"Thundergod's Vigor",
    type:'belt', icon:'⚡', reqLevel:47, reqStr:110,
    baseDefMin:41, baseDefMax:48,
    mods:[
      {stat:'vitality',       value:20},
      {stat:'strength',       value:20},
      {stat:'lightningResist',value:25},
      {stat:'enhancedDefense',value:50},
    ],
  },

  // ── BOOTS ──────────────────────────────────────────────────────
  {
    id:'war_traveler', baseName:'Battle Boots', uniqueName:"War Traveler",
    type:'boots', icon:'👢', reqLevel:42, reqStr:95,
    baseDefMin:39, baseDefMax:47,
    mods:[
      {stat:'vitality',       value:10},
      {stat:'strength',       value:10},
      {stat:'enhancedDefense',value:170},
      {stat:'magicFind',      value:32},
      {stat:'life',           value:40},
    ],
  },
  {
    id:'sandstorm_trek', baseName:'Scarabshell Boots', uniqueName:"Sandstorm Trek",
    type:'boots', icon:'🏜️', reqLevel:64, reqStr:91,
    baseDefMin:58, baseDefMax:67,
    mods:[
      {stat:'vitality',        value:12},
      {stat:'strength',        value:12},
      {stat:'enhancedDefense', value:160},
      {stat:'poisonResist',    value:50},
      {stat:'fasterHitRecovery',value:20},
    ],
  },
  {
    id:'gore_rider', baseName:'War Boots', uniqueName:"Gore Rider",
    type:'boots', icon:'🩸', reqLevel:47, reqStr:94,
    baseDefMin:39, baseDefMax:47,
    mods:[
      {stat:'enhancedDefense',value:180},
      {stat:'deadlyStrike',   value:12},
      {stat:'crushingBlow',   value:10},
      {stat:'openWounds',     value:10},
      {stat:'fasterAttack',   value:10},
    ],
  },
  {
    id:'waterwalker', baseName:'Battle Boots', uniqueName:"Waterwalker",
    type:'boots', icon:'💧', reqLevel:32, reqStr:95,
    baseDefMin:39, baseDefMax:47,
    mods:[
      {stat:'dexterity',      value:20},
      {stat:'life',           value:20},
      {stat:'enhancedDefense',value:153},
      {stat:'fireResist',     value:20},
      {stat:'coldResist',     value:20},
    ],
  },
  {
    id:'silkweave', baseName:'Mesh Boots', uniqueName:"Silkweave",
    type:'boots', icon:'🧶', reqLevel:36, reqStr:65,
    baseDefMin:37, baseDefMax:44,
    mods:[
      {stat:'energy',         value:20},
      {stat:'mana',           value:50},
      {stat:'enhancedDefense',value:200},
      {stat:'fasterHitRecovery',value:20},
    ],
  },
  {
    id:'marrowwalk', baseName:'Boneweave Boots', uniqueName:"Marrowwalk",
    type:'boots', icon:'🦴', reqLevel:66, reqStr:148,
    baseDefMin:77, baseDefMax:90,
    mods:[
      {stat:'strength',       value:10},
      {stat:'dexterity',      value:10},
      {stat:'enhancedDefense',value:170},
      {stat:'life',           value:40},
    ],
  },

  // ── WEAPONS ────────────────────────────────────────────────────
  {
    id:'the_grandfather', baseName:'Colossus Blade', uniqueName:"The Grandfather",
    type:'hand_r', icon:'⚔️', reqLevel:81, reqStr:189,
    baseDmgMin:25, baseDmgMax:65,
    mods:[
      {stat:'enhancedDamage',value:175},
      {stat:'strength',      value:20},
      {stat:'dexterity',     value:20},
      {stat:'allResist',     value:15},
      {stat:'life',          value:20},
    ],
  },
  {
    id:'doombringer', baseName:'Champion Sword', uniqueName:"Doombringer",
    type:'hand_r', icon:'🗡️', reqLevel:69, reqStr:163,
    baseDmgMin:20, baseDmgMax:45,
    mods:[
      {stat:'enhancedDamage',value:180},
      {stat:'lifeSteal',     value:8},
      {stat:'strength',      value:30},
      {stat:'allResist',     value:20},
      {stat:'damageReduced', value:10},
    ],
  },
  {
    id:'lightsabre', baseName:'Phase Blade', uniqueName:"Lightsabre",
    type:'hand_r', icon:'⚡', reqLevel:58, reqStr:25, reqDex:136,
    baseDmgMin:31, baseDmgMax:35,
    mods:[
      {stat:'enhancedDamage',value:87},
      {stat:'fasterAttack',  value:20},
      {stat:'attackRating',  value:250},
      {stat:'allResist',     value:10},
    ],
  },
  {
    id:'bonesnap', baseName:'Maul', uniqueName:"Bonesnap",
    type:'hand_r', icon:'💀', reqLevel:22, reqStr:69,
    baseDmgMin:30, baseDmgMax:60,
    mods:[
      {stat:'enhancedDamage',value:170},
      {stat:'crushingBlow',  value:25},
      {stat:'coldResist',    value:30},
      {stat:'fireResist',    value:30},
    ],
  },
  {
    id:'schaeferS_hammer', baseName:'Legend Hammer', uniqueName:"Schaefer's Hammer",
    type:'hand_r', icon:'🔨', reqLevel:79, reqStr:195,
    baseDmgMin:26, baseDmgMax:75,
    mods:[
      {stat:'enhancedDamage',  value:125},
      {stat:'strength',        value:20},
      {stat:'vitality',        value:15},
      {stat:'lightningResist', value:50},
      {stat:'life',            value:30},
    ],
  },
  {
    id:'reapers_toll', baseName:'Thresher', uniqueName:"The Reaper's Toll",
    type:'hand_r', icon:'☠️', reqLevel:75, reqStr:152, reqDex:103,
    baseDmgMin:12, baseDmgMax:77,
    mods:[
      {stat:'enhancedDamage',value:215},
      {stat:'lifeSteal',     value:13},
      {stat:'dexterity',     value:10},
      {stat:'coldResist',    value:20},
      {stat:'attackRating',  value:150},
    ],
  },
  {
    id:'windforce', baseName:'Hydra Bow', uniqueName:"Windforce",
    type:'hand_r', icon:'🏹', reqLevel:73, reqStr:134, reqDex:167,
    baseDmgMin:10, baseDmgMax:48,
    mods:[
      {stat:'enhancedDamage',value:250},
      {stat:'strength',      value:10},
      {stat:'life',          value:15},
      {stat:'attackRating',  value:200},
      {stat:'fasterAttack',  value:10},
    ],
  },
  {
    id:'baranars_star', baseName:'Morning Star', uniqueName:"Baranar's Star",
    type:'hand_r', icon:'⭐', reqLevel:35, reqStr:36,
    baseDmgMin:7, baseDmgMax:16,
    mods:[
      {stat:'enhancedDamage',value:90},
      {stat:'fasterAttack',  value:20},
      {stat:'attackRating',  value:112},
      {stat:'allResist',     value:10},
      {stat:'strength',      value:10},
    ],
  },
  {
    id:'headstriker', baseName:'Battle Sword', uniqueName:"Headstriker",
    type:'hand_r', icon:'🗡️', reqLevel:42, reqStr:92,
    baseDmgMin:16, baseDmgMax:34,
    mods:[
      {stat:'enhancedDamage',value:80},
      {stat:'deadlyStrike',  value:25},
      {stat:'lifeSteal',     value:5},
      {stat:'fasterAttack',  value:10},
      {stat:'strength',      value:10},
    ],
  },
  {
    id:'bul_kathos_charge', baseName:'Colossus Sword', uniqueName:"Bul-Kathos' Sacred Charge",
    type:'hand_r', icon:'⚔️', reqLevel:63, reqStr:189,
    baseDmgMin:25, baseDmgMax:65,
    mods:[
      {stat:'enhancedDamage',value:200},
      {stat:'strength',      value:20},
      {stat:'lifeSteal',     value:5},
      {stat:'crushingBlow',  value:33},
    ],
  },
  {
    id:'azurewrath', baseName:'Phase Blade', uniqueName:"Azurewrath",
    type:'hand_r', icon:'❄️', reqLevel:85, reqStr:25, reqDex:136,
    baseDmgMin:31, baseDmgMax:35,
    mods:[
      {stat:'enhancedDamage',value:190},
      {stat:'strength',      value:20},
      {stat:'dexterity',     value:20},
      {stat:'coldResist',    value:30},
      {stat:'attackRating',  value:200},
    ],
  },
];

export function getUniqueForSlot(type: GearSlotId, iLvl: number): UniqueDef[] {
  const slotType = type === 'ring_r' ? 'ring_l' : type;
  return UNIQUES.filter(u => u.type === slotType && u.reqLevel <= iLvl);
}
