export type GearSlotId = 'helm' | 'armor' | 'amulet' | 'hand_l' | 'hand_r' | 'ring_l' | 'ring_r' | 'gloves' | 'belt' | 'boots';
export type GearAffinity = 'weapon' | 'armor' | 'jewelry';

export const SLOT_AFFINITY: Record<GearSlotId, GearAffinity> = {
  hand_l: 'weapon', hand_r: 'weapon',
  helm: 'armor', armor: 'armor', gloves: 'armor', boots: 'armor', belt: 'armor',
  amulet: 'jewelry', ring_l: 'jewelry', ring_r: 'jewelry',
};

export type ItemQuality = 'normal' | 'magic' | 'rare' | 'unique';

export const QUALITY_LABEL: Record<ItemQuality, string> = {
  normal: 'Normal', magic: 'Magic', rare: 'Rare', unique: 'Unique',
};

export const QUALITY_COLOR: Record<ItemQuality, string> = {
  normal: '#c8bca8',
  magic:  '#4169e1',
  rare:   '#c8a020',
  unique: '#8b4513',
};

// All possible mod stats
export type D2Stat =
  | 'enhancedDamage'     // % weapon damage bonus
  | 'enhancedDefense'    // % armor defense bonus
  | 'flatDefense'        // flat defense
  | 'minDamage'          // flat min damage
  | 'maxDamage'          // flat max damage
  | 'life'               // flat life
  | 'mana'               // flat mana
  | 'strength'
  | 'dexterity'
  | 'vitality'
  | 'energy'
  | 'allStats'           // +all four stats
  | 'attackRating'
  | 'lifeSteal'          // % life leech
  | 'manaSteal'          // % mana leech
  | 'crushingBlow'       // % chance of CB
  | 'openWounds'         // % chance of OW
  | 'deadlyStrike'       // % chance to double damage
  | 'fireResist'
  | 'coldResist'
  | 'lightningResist'
  | 'poisonResist'
  | 'allResist'
  | 'magicFind'
  | 'goldFind'
  | 'fasterAttack'       // IAS %
  | 'fasterHitRecovery'  // FHR %
  | 'damageReduced'      // DR %
  | 'magicDamageReduced';

export interface StatMod {
  stat: D2Stat;
  value: number;
}

export interface AffixInstance {
  affixId: string;
  name: string;
  isPrefix: boolean;
  mods: StatMod[];
}

export interface Item {
  id: string;
  baseId: string;
  type: GearSlotId;
  label: string;        // display name (may include affixes for magic/rare)
  baseName: string;     // always the base item name e.g. "Long Sword"
  icon: string;
  quality: ItemQuality;
  identified: boolean;  // false = stats hidden until identified (D2-style)
  reqLevel: number;
  reqStr?: number;
  reqDex?: number;
  prefixes: AffixInstance[];
  suffixes: AffixInstance[];
  // base combat stats (rolled at generation from base def/dmg range)
  baseDefense?: number;
  baseDmgMin?: number;
  baseDmgMax?: number;
  // unique-specific
  uniqueId?: string;
  uniqueName?: string;
  uniqueMods?: StatMod[];
}

// Helpers to sum a mod stat across an item
export function getItemModSum(item: Item, stat: D2Stat): number {
  let total = 0;
  for (const p of item.prefixes) for (const m of p.mods) if (m.stat === stat) total += m.value;
  for (const s of item.suffixes) for (const m of s.mods) if (m.stat === stat) total += m.value;
  if (item.uniqueMods) for (const m of item.uniqueMods) if (m.stat === stat) total += m.value;
  return total;
}

export function sumGearMod(gear: Partial<Record<GearSlotId, Item>>, stat: D2Stat, slots?: GearSlotId[]): number {
  let total = 0;
  for (const [slotId, item] of Object.entries(gear) as [GearSlotId, Item | undefined][]) {
    if (!item) continue;
    if (slots && !slots.includes(slotId)) continue;
    total += getItemModSum(item, stat);
  }
  return total;
}

// All mods on an item flattened
export function getAllMods(item: Item): StatMod[] {
  const mods: StatMod[] = [];
  for (const p of item.prefixes) mods.push(...p.mods);
  for (const s of item.suffixes) mods.push(...s.mods);
  if (item.uniqueMods) mods.push(...item.uniqueMods);
  return mods;
}

export const INVENTORY_SIZE = 20;

export interface Potion {
  id: string;
  label: string;
  icon: string;
  healAmount: number;
  price: number;
}

export const POTION_DEFS: Potion[] = [
  { id: 'potion_s', label: 'Small',  icon: '🧪', healAmount: 30,  price: 15 },
  { id: 'potion_m', label: 'Medium', icon: '⚗️',  healAmount: 60,  price: 35 },
  { id: 'potion_l', label: 'Large',  icon: '🫧',  healAmount: 100, price: 60 },
];

export const POTION_BELT_SIZE = 4;
