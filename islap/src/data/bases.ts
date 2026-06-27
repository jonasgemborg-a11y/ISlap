import { GearSlotId, GearAffinity, SLOT_AFFINITY } from '../types/item';

export interface BaseItem {
  id: string;
  type: GearSlotId;
  label: string;
  icon: string;
  tier: 1 | 2 | 3;       // 1=Normal, 2=Exceptional, 3=Elite
  reqLevel: number;
  reqStr?: number;
  reqDex?: number;
  defMin?: number;        // armor
  defMax?: number;
  dmgMin?: number;        // weapons
  dmgMax?: number;
}

const BASES: BaseItem[] = [
  // ── HELMS ──────────────────────────────────────────────────────
  { id:'cap',         type:'helm', label:'Cap',          icon:'⛑️', tier:1, reqLevel:1,  reqStr:0,   defMin:3,   defMax:5   },
  { id:'skull_cap',   type:'helm', label:'Skull Cap',    icon:'⛑️', tier:1, reqLevel:3,  reqStr:15,  defMin:4,   defMax:6   },
  { id:'helm',        type:'helm', label:'Helm',         icon:'⛑️', tier:1, reqLevel:6,  reqStr:26,  defMin:6,   defMax:9   },
  { id:'full_helm',   type:'helm', label:'Full Helm',    icon:'⛑️', tier:1, reqLevel:10, reqStr:41,  defMin:9,   defMax:12  },
  { id:'great_helm',  type:'helm', label:'Great Helm',   icon:'⛑️', tier:1, reqLevel:14, reqStr:63,  defMin:12,  defMax:15  },
  { id:'war_hat',     type:'helm', label:'War Hat',      icon:'🪖', tier:2, reqLevel:22, reqStr:20,  defMin:20,  defMax:24  },
  { id:'casque',      type:'helm', label:'Casque',       icon:'🪖', tier:2, reqLevel:25, reqStr:59,  defMin:25,  defMax:30  },
  { id:'armet',       type:'helm', label:'Armet',        icon:'🪖', tier:2, reqLevel:32, reqStr:105, defMin:50,  defMax:58  },
  { id:'shako',       type:'helm', label:'Shako',        icon:'👑', tier:3, reqLevel:43, reqStr:50,  defMin:98,  defMax:141 },
  { id:'bone_visage', type:'helm', label:'Bone Visage',  icon:'💀', tier:3, reqLevel:63, reqStr:106, defMin:100, defMax:157 },
  { id:'corona',      type:'helm', label:'Corona',       icon:'👑', tier:3, reqLevel:66, reqStr:174, defMin:111, defMax:159 },
  { id:'diadem',      type:'helm', label:'Diadem',       icon:'👑', tier:3, reqLevel:64, reqStr:0,   defMin:50,  defMax:60  },

  // ── ARMOR ──────────────────────────────────────────────────────
  { id:'quilted_armor',   type:'armor', label:'Quilted Armor',   icon:'🦺', tier:1, reqLevel:1,  reqStr:12,  defMin:8,   defMax:11  },
  { id:'leather_armor',   type:'armor', label:'Leather Armor',   icon:'🦺', tier:1, reqLevel:3,  reqStr:15,  defMin:14,  defMax:17  },
  { id:'hard_leather',    type:'armor', label:'Hard Leather',    icon:'🦺', tier:1, reqLevel:6,  reqStr:20,  defMin:28,  defMax:31  },
  { id:'studded_leather', type:'armor', label:'Studded Leather', icon:'🦺', tier:1, reqLevel:12, reqStr:27,  defMin:32,  defMax:35  },
  { id:'ring_mail',       type:'armor', label:'Ring Mail',       icon:'🦺', tier:1, reqLevel:15, reqStr:36,  defMin:45,  defMax:48  },
  { id:'ghost_armor',     type:'armor', label:'Ghost Armor',     icon:'🧥', tier:2, reqLevel:22, reqStr:38,  defMin:102, defMax:113 },
  { id:'serpentskin',     type:'armor', label:'Serpentskin',     icon:'🧥', tier:2, reqLevel:24, reqStr:43,  defMin:111, defMax:124 },
  { id:'demonhide_armor', type:'armor', label:'Demonhide Armor', icon:'🧥', tier:2, reqLevel:26, reqStr:50,  defMin:101, defMax:110 },
  { id:'wyrmhide_armor',  type:'armor', label:'Wyrmhide',        icon:'🧥', tier:2, reqLevel:32, reqStr:84,  defMin:108, defMax:118 },
  { id:'archon_plate',    type:'armor', label:'Archon Plate',    icon:'🛡️', tier:3, reqLevel:63, reqStr:103, defMin:410, defMax:524 },
  { id:'dusk_shroud',     type:'armor', label:'Dusk Shroud',     icon:'🛡️', tier:3, reqLevel:49, reqStr:77,  defMin:361, defMax:467 },
  { id:'sacred_armor',    type:'armor', label:'Sacred Armor',    icon:'🛡️', tier:3, reqLevel:68, reqStr:232, defMin:487, defMax:600 },

  // ── AMULET (single tier — affixes do the work) ─────────────────
  { id:'amulet', type:'amulet', label:'Amulet', icon:'📿', tier:1, reqLevel:1 },

  // ── WEAPONS (hand_l / hand_r) ──────────────────────────────────
  // Normal
  { id:'short_sword',   type:'hand_r', label:'Short Sword',   icon:'⚔️', tier:1, reqLevel:1,  reqStr:25,  dmgMin:2,  dmgMax:7   },
  { id:'hand_axe',      type:'hand_r', label:'Hand Axe',      icon:'🪓', tier:1, reqLevel:1,  reqStr:46,  dmgMin:3,  dmgMax:6   },
  { id:'club',          type:'hand_r', label:'Club',          icon:'🏏', tier:1, reqLevel:1,  reqStr:25,  dmgMin:1,  dmgMax:6   },
  { id:'morning_star',  type:'hand_r', label:'Morning Star',  icon:'🏏', tier:1, reqLevel:7,  reqStr:36,  dmgMin:7,  dmgMax:16  },
  { id:'long_sword',    type:'hand_r', label:'Long Sword',    icon:'⚔️', tier:1, reqLevel:14, reqStr:55,  dmgMin:3,  dmgMax:14  },
  { id:'broad_sword',   type:'hand_r', label:'Broad Sword',   icon:'⚔️', tier:1, reqLevel:12, reqStr:48,  dmgMin:7,  dmgMax:14  },
  // Exceptional
  { id:'crystal_sword', type:'hand_r', label:'Crystal Sword', icon:'⚔️', tier:2, reqLevel:25, reqStr:43,  dmgMin:5,  dmgMax:15  },
  { id:'rune_sword',    type:'hand_r', label:'Rune Sword',    icon:'⚔️', tier:2, reqLevel:35, reqStr:103, dmgMin:10, dmgMax:22  },
  { id:'battle_hammer', type:'hand_r', label:'Battle Hammer', icon:'🔨', tier:2, reqLevel:28, reqStr:100, dmgMin:30, dmgMax:35  },
  { id:'knout',         type:'hand_r', label:'Knout',         icon:'🏏', tier:2, reqLevel:25, reqStr:45,  dmgMin:13, dmgMax:27  },
  // Elite
  { id:'phase_blade',   type:'hand_r', label:'Phase Blade',   icon:'⚔️', tier:3, reqLevel:54, reqStr:25,  reqDex:136, dmgMin:31, dmgMax:35 },
  { id:'cryptic_sword', type:'hand_r', label:'Cryptic Sword', icon:'⚔️', tier:3, reqLevel:61, reqStr:99,  dmgMin:5,  dmgMax:20  },
  { id:'thunder_maul',  type:'hand_r', label:'Thunder Maul',  icon:'🔨', tier:3, reqLevel:65, reqStr:179, dmgMin:33, dmgMax:180 },
  { id:'colossus_blade',type:'hand_r', label:'Colossus Blade',icon:'⚔️', tier:3, reqLevel:63, reqStr:189, dmgMin:25, dmgMax:65  },

  // Off-hand mirrors (same items but in hand_l slot for dual-wield display)
  { id:'buckler',       type:'hand_l', label:'Buckler',       icon:'🛡️', tier:1, reqLevel:1,  reqStr:12,  defMin:4,  defMax:6   },
  { id:'small_shield',  type:'hand_l', label:'Small Shield',  icon:'🛡️', tier:1, reqLevel:7,  reqStr:22,  defMin:8,  defMax:10  },
  { id:'kite_shield',   type:'hand_l', label:'Kite Shield',   icon:'🛡️', tier:1, reqLevel:14, reqStr:47,  defMin:16, defMax:20  },
  { id:'monarch',       type:'hand_l', label:'Monarch',       icon:'🛡️', tier:2, reqLevel:54, reqStr:156, defMin:133,defMax:148 },
  { id:'sacred_rondache',type:'hand_l',label:'Sacred Rondache',icon:'🛡️',tier:3, reqLevel:66, reqStr:109, reqDex:76, defMin:258,defMax:295},

  // ── RINGS ──────────────────────────────────────────────────────
  { id:'ring', type:'ring_l', label:'Ring', icon:'💍', tier:1, reqLevel:1 },

  // ── GLOVES ─────────────────────────────────────────────────────
  { id:'leather_gloves', type:'gloves', label:'Leather Gloves', icon:'🧤', tier:1, reqLevel:1,  reqStr:0,   defMin:2,  defMax:3   },
  { id:'heavy_gloves',   type:'gloves', label:'Heavy Gloves',   icon:'🧤', tier:1, reqLevel:7,  reqStr:0,   defMin:5,  defMax:6   },
  { id:'chain_gloves',   type:'gloves', label:'Chain Gloves',   icon:'🧤', tier:1, reqLevel:12, reqStr:25,  defMin:8,  defMax:9   },
  { id:'sharkskin_gl',   type:'gloves', label:'Sharkskin Gloves',icon:'🧤',tier:2, reqLevel:25, reqStr:0,   defMin:39, defMax:47  },
  { id:'heavy_bracers',  type:'gloves', label:'Heavy Bracers',  icon:'🧤', tier:2, reqLevel:28, reqStr:58,  defMin:37, defMax:44  },
  { id:'vampirebone_gl', type:'gloves', label:'Vampirebone Gloves',icon:'🧤',tier:3,reqLevel:61,reqStr:50,  defMin:56, defMax:65  },
  { id:'vambraces',      type:'gloves', label:'Vambraces',      icon:'🧤', tier:3, reqLevel:66, reqStr:106, defMin:66, defMax:75  },

  // ── BELT ───────────────────────────────────────────────────────
  { id:'sash',           type:'belt', label:'Sash',            icon:'🪢', tier:1, reqLevel:1,  reqStr:0,   defMin:2,  defMax:2   },
  { id:'light_belt',     type:'belt', label:'Light Belt',      icon:'🪢', tier:1, reqLevel:5,  reqStr:0,   defMin:3,  defMax:3   },
  { id:'belt',           type:'belt', label:'Belt',            icon:'🪢', tier:1, reqLevel:10, reqStr:25,  defMin:5,  defMax:5   },
  { id:'sharkskin_belt', type:'belt', label:'Sharkskin Belt',  icon:'🪢', tier:2, reqLevel:25, reqStr:0,   defMin:31, defMax:36  },
  { id:'mesh_belt',      type:'belt', label:'Mesh Belt',       icon:'🪢', tier:2, reqLevel:28, reqStr:58,  defMin:35, defMax:40  },
  { id:'troll_belt',     type:'belt', label:'Troll Belt',      icon:'🪢', tier:3, reqLevel:61, reqStr:151, defMin:72, defMax:83  },
  { id:'mithril_coil',   type:'belt', label:'Mithril Coil',    icon:'🪢', tier:3, reqLevel:58, reqStr:106, defMin:58, defMax:65  },

  // ── BOOTS ──────────────────────────────────────────────────────
  { id:'boots',          type:'boots', label:'Boots',          icon:'👟', tier:1, reqLevel:1,  reqStr:0,   defMin:2,  defMax:3   },
  { id:'heavy_boots',    type:'boots', label:'Heavy Boots',    icon:'👟', tier:1, reqLevel:6,  reqStr:0,   defMin:5,  defMax:6   },
  { id:'chain_boots',    type:'boots', label:'Chain Boots',    icon:'👟', tier:1, reqLevel:12, reqStr:30,  defMin:8,  defMax:9   },
  { id:'sharkskin_boots',type:'boots', label:'Sharkskin Boots',icon:'👟', tier:2, reqLevel:25, reqStr:0,   defMin:30, defMax:35  },
  { id:'mesh_boots',     type:'boots', label:'Mesh Boots',     icon:'👟', tier:2, reqLevel:28, reqStr:58,  defMin:37, defMax:44  },
  { id:'wyrmhide_boots', type:'boots', label:'Wyrmhide Boots', icon:'👟', tier:3, reqLevel:45, reqStr:98,  defMin:56, defMax:65  },
  { id:'boneweave_boots',type:'boots', label:'Boneweave Boots',icon:'👟', tier:3, reqLevel:61, reqStr:148, defMin:77, defMax:90  },
];

export function getBasesForSlot(type: GearSlotId): BaseItem[] {
  // For ring_r, use ring bases (same base as ring_l)
  const lookupType = type === 'ring_r' ? 'ring_l' : type === 'hand_l' ? 'hand_l' : type;
  return BASES.filter(b => b.type === lookupType || (lookupType === 'ring_l' && b.id === 'ring'));
}

export function selectBase(iLvl: number, type: GearSlotId): BaseItem {
  // Fix ring_r → ring_l lookup
  const slotType: GearSlotId = type === 'ring_r' ? 'ring_l' : type;
  const all = BASES.filter(b => b.type === slotType);

  // Only bases whose reqLevel <= iLvl can drop (D2: items can't drop before their req level)
  let eligible = all.filter(b => b.reqLevel <= iLvl);

  // Bias toward higher tiers
  const maxTier = iLvl >= 45 ? 3 : iLvl >= 25 ? 2 : 1;
  const tierWeights: Record<number, number> = { 1: 1, 2: maxTier >= 2 ? 3 : 0, 3: maxTier >= 3 ? 5 : 0 };

  const weighted: BaseItem[] = [];
  for (const b of eligible) {
    const w = tierWeights[b.tier] ?? 1;
    for (let i = 0; i < w; i++) weighted.push(b);
  }

  if (weighted.length === 0) return all[0];
  return weighted[Math.floor(Math.random() * weighted.length)];
}

export { BASES };
