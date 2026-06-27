import { Item, GearSlotId, SLOT_AFFINITY, AffixInstance } from '../types/item';
import { BaseItem, selectBase } from '../data/bases';
import { AFFIXES, getEligibleAffixes, weightedPick, rollAffix, rollRareName } from '../data/affixes';
import { UNIQUES, getUniqueForSlot } from '../data/uniques';

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type Quality = 'normal' | 'magic' | 'rare' | 'unique';

function rollQuality(iLvl: number, forceMinMagic = false): Quality {
  const r = Math.random();
  const uniqueChance  = Math.min(0.05, 0.005 + iLvl * 0.0004);
  const rareChance    = Math.min(0.20, 0.05  + iLvl * 0.001);
  const magicChance   = Math.min(0.45, 0.20  + iLvl * 0.002);

  if (r < uniqueChance)                              return 'unique';
  if (r < uniqueChance + rareChance)                 return 'rare';
  if (r < uniqueChance + rareChance + magicChance)  return 'magic';
  return forceMinMagic ? 'magic' : 'normal';
}

// Jewelry always drops magic or better in D2
const JEWELRY_SLOTS: GearSlotId[] = ['amulet', 'ring_l', 'ring_r'];

// Roll affixes for magic/rare items
function pickAffixes(
  count: number,
  isPrefix: boolean,
  aLvl: number,
  affinity: 'weapon' | 'armor' | 'jewelry',
  type: GearSlotId,
  usedGroups: Set<string>,
): AffixInstance[] {
  const result: AffixInstance[] = [];
  for (let i = 0; i < count; i++) {
    const pool = getEligibleAffixes(aLvl, affinity, type, isPrefix)
      .filter(a => !usedGroups.has(a.group));
    const pick = weightedPick(pool);
    if (!pick) break;
    usedGroups.add(pick.group);
    result.push(rollAffix(pick));
  }
  return result;
}

function buildItemFromBase(
  base: BaseItem,
  quality: Quality,
  iLvl: number,
  type: GearSlotId,
): Item {
  const affinity = SLOT_AFFINITY[type];
  const aLvl = iLvl;
  const usedGroups = new Set<string>();

  // Roll base defense/damage
  const baseDefense = base.defMin != null && base.defMax != null
    ? rand(base.defMin, base.defMax)
    : undefined;
  const baseDmgMin = base.dmgMin;
  const baseDmgMax = base.dmgMax;

  let prefixes: AffixInstance[] = [];
  let suffixes: AffixInstance[] = [];
  let label = base.label;

  if (quality === 'magic') {
    // 0 or 1 prefix, 0 or 1 suffix (at least one)
    const pfxCount = Math.random() < 0.8 ? 1 : 0;
    const sfxCount = Math.random() < 0.8 ? 1 : 0;
    prefixes = pickAffixes(pfxCount || (sfxCount === 0 ? 1 : 0), true, aLvl, affinity, type, usedGroups);
    suffixes = pickAffixes(sfxCount, false, aLvl, affinity, type, usedGroups);

    const pfxName = prefixes[0]?.name ?? '';
    const sfxName = suffixes[0]?.name ? `${base.label} ${suffixes[0].name}` : base.label;
    label = pfxName ? `${pfxName} ${sfxName}` : sfxName;

  } else if (quality === 'rare') {
    const pfxCount = rand(2, 3);
    const sfxCount = rand(2, 3);
    prefixes = pickAffixes(pfxCount, true,  aLvl, affinity, type, usedGroups);
    suffixes = pickAffixes(sfxCount, false, aLvl, affinity, type, usedGroups);
    label = rollRareName();
  }

  // D2 formula: affix contributes ceil(minALvl * 0.75) to required level, not minALvl directly
  const affixLvls = [...prefixes, ...suffixes].map(a => {
    const def = AFFIXES.find(d => d.id === a.affixId);
    return def ? Math.ceil(def.minALvl * 0.75) : 0;
  });
  const reqLevel = Math.max(base.reqLevel, ...affixLvls);

  return {
    id: `${type}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    baseId: base.id,
    type,
    label,
    baseName: base.label,
    icon: base.icon,
    quality,
    identified: quality === 'normal',
    reqLevel,
    reqStr: base.reqStr,
    reqDex: base.reqDex,
    prefixes,
    suffixes,
    baseDefense,
    baseDmgMin,
    baseDmgMax,
  };
}

export function generateItem(iLvl: number, forceSlot?: GearSlotId): Item {
  const SLOTS: GearSlotId[] = ['helm','armor','amulet','hand_l','hand_r','ring_l','ring_r','gloves','belt','boots'];
  const type = forceSlot ?? SLOTS[Math.floor(Math.random() * SLOTS.length)];
  const affinity = SLOT_AFFINITY[type];
  let quality = rollQuality(iLvl, JEWELRY_SLOTS.includes(type));

  // Try to generate a unique
  if (quality === 'unique') {
    const eligibleUniques = getUniqueForSlot(type, iLvl);
    if (eligibleUniques.length > 0) {
      const uDef = eligibleUniques[Math.floor(Math.random() * eligibleUniques.length)];
      const baseDefense = uDef.baseDefMin != null && uDef.baseDefMax != null
        ? rand(uDef.baseDefMin, uDef.baseDefMax)
        : undefined;
      return {
        id: `unique_${uDef.id}_${Date.now()}`,
        baseId: uDef.id,
        type,
        label: uDef.baseName,
        baseName: uDef.baseName,
        icon: uDef.icon,
        quality: 'unique',
        identified: false,
        reqLevel: uDef.reqLevel,
        reqStr:   uDef.reqStr,
        reqDex:   uDef.reqDex,
        prefixes: [],
        suffixes: [],
        baseDefense,
        baseDmgMin: uDef.baseDmgMin,
        baseDmgMax: uDef.baseDmgMax,
        uniqueId:   uDef.id,
        uniqueName: uDef.uniqueName,
        uniqueMods: uDef.mods,
      };
    }
    // No eligible unique → downgrade to rare
    quality = 'rare';
  }

  const base = selectBase(iLvl, type);
  return buildItemFromBase(base, quality, iLvl, type);
}

export interface LootResult {
  gold: number;
  item?: Item;
  extraItems?: Item[];
}

export { generateItem as generateItemForShop };

export function generateLoot(botLevel: number, _playerLevel: number): LootResult {
  const gold = rand(botLevel * 2, botLevel * 5);
  const item = Math.random() < 0.5 ? generateItem(botLevel) : undefined;
  return { gold, item };
}
