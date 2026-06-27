import { Item, D2Stat, getAllMods } from '../types/item';

// D2 base item costs (gold, approximate vendor buy price)
const BASE_COST: Record<string, number> = {
  // Weapons — Normal
  short_sword: 750,   hand_axe: 750,    club: 350,
  morning_star: 750,  long_sword: 1350, broad_sword: 1350,
  // Weapons — Exceptional
  crystal_sword: 2000, rune_sword: 3500, battle_hammer: 2500, knout: 1800,
  // Weapons — Elite
  phase_blade: 24000, cryptic_sword: 8000, thunder_maul: 8000, colossus_blade: 9000,
  // Shields (hand_l)
  buckler: 400, small_shield: 600, kite_shield: 900, monarch: 5000, sacred_rondache: 8000,
  // Helms — Normal
  cap: 200, skull_cap: 250, helm: 350, full_helm: 400, great_helm: 500,
  // Helms — Exceptional
  war_hat: 1500, casque: 1800, armet: 2500,
  // Helms — Elite
  shako: 5000, bone_visage: 5500, corona: 6000, diadem: 10000,
  // Armor — Normal
  quilted_armor: 300, leather_armor: 450, hard_leather: 600, studded_leather: 750, ring_mail: 900,
  // Armor — Exceptional
  ghost_armor: 2800, serpentskin: 3000, demonhide_armor: 2800, wyrmhide_armor: 3200,
  // Armor — Elite
  archon_plate: 8000, dusk_shroud: 7000, sacred_armor: 15000,
  // Jewelry (no tiers, affixes do the work)
  amulet: 1500, ring: 900,
  // Gloves — Normal
  leather_gloves: 200, heavy_gloves: 300, chain_gloves: 400,
  // Gloves — Exceptional
  sharkskin_gl: 700, heavy_bracers: 800,
  // Gloves — Elite
  vampirebone_gl: 1800, vambraces: 2200,
  // Belt — Normal
  sash: 200, light_belt: 250, belt: 300,
  // Belt — Exceptional
  sharkskin_belt: 700, mesh_belt: 800,
  // Belt — Elite
  troll_belt: 2000, mithril_coil: 1800,
  // Boots — Normal
  boots: 200, heavy_boots: 300, chain_boots: 400,
  // Boots — Exceptional
  sharkskin_boots: 700, mesh_boots: 800,
  // Boots — Elite
  wyrmhide_boots: 1800, boneweave_boots: 2200,
};

// Per-unit gold contribution of each mod stat
function modGoldPerUnit(stat: D2Stat): number {
  switch (stat) {
    case 'enhancedDamage':   return 15;   // +100% ED = 1500g
    case 'minDamage':        return 80;
    case 'maxDamage':        return 60;
    case 'enhancedDefense':  return 10;   // +100% ED = 1000g
    case 'flatDefense':      return 8;
    case 'life':             return 4;    // +100 life = 400g
    case 'mana':             return 2;
    case 'strength':         return 50;   // +10 str = 500g
    case 'dexterity':        return 50;
    case 'vitality':         return 50;
    case 'energy':           return 30;
    case 'allStats':         return 200;  // +10 all = 2000g
    case 'attackRating':     return 2;
    case 'lifeSteal':        return 120;  // % LL valuable
    case 'manaSteal':        return 60;
    case 'deadlyStrike':     return 70;
    case 'crushingBlow':     return 80;
    case 'openWounds':       return 50;
    case 'allResist':        return 50;   // +25 all res = 1250g
    case 'fireResist':       return 15;
    case 'coldResist':       return 15;
    case 'lightningResist':  return 15;
    case 'poisonResist':     return 10;
    case 'magicFind':        return 40;   // % MF very valuable
    case 'goldFind':         return 8;
    case 'fasterAttack':     return 30;
    case 'fasterHitRecovery':return 20;
    case 'damageReduced':    return 100;
    case 'magicDamageReduced':return 60;
    default:                 return 10;
  }
}

// Quality multiplier for vendor buy price (D2 approximate)
function qualityBuyMult(quality: string): number {
  switch (quality) {
    case 'magic':  return 1.5;
    case 'rare':   return 4;
    case 'unique': return 10;
    default:       return 1;
  }
}

// Vendor buy price (what the shop charges)
export function calcItemBuyValue(item: Item): number {
  const baseCost   = BASE_COST[item.baseId] ?? 500;
  const affixCost  = getAllMods(item).reduce((sum, m) => sum + m.value * modGoldPerUnit(m.stat), 0);
  return Math.max(10, Math.round((baseCost + affixCost) * qualityBuyMult(item.quality)));
}

// Vendor sell price = what the player gets (D2: 1/4 of buy, min 1)
export function calcItemSellValue(item: Item): number {
  return Math.max(1, Math.floor(calcItemBuyValue(item) / 4));
}
