import { useState, useCallback } from 'react';
import { Item, GearSlotId, INVENTORY_SIZE, Potion, POTION_BELT_SIZE } from '../types/item';

interface InventoryState {
  slots: (Item | null)[];
  gear: Partial<Record<GearSlotId, Item>>;
  potionBelt: (Potion | null)[];
}

const STARTER_ITEM: Item = {
  id: 'cap_starter',
  baseId: 'cap',
  type: 'helm',
  label: 'Cap',
  baseName: 'Cap',
  icon: '⛑️',
  quality: 'normal',
  identified: true,
  reqLevel: 1,
  prefixes: [],
  suffixes: [],
  baseDefense: 4,
};

const DEFAULT_STATE: InventoryState = {
  slots: [STARTER_ITEM, ...Array(INVENTORY_SIZE - 1).fill(null)],
  gear: {},
  potionBelt: Array(POTION_BELT_SIZE).fill(null),
};

function migrateItem(raw: any): Item | null {
  if (!raw) return null;
  // Old items had attackBonus/defenseBonus/statBonuses instead of prefixes/suffixes
  if (!raw.prefixes) {
    return {
      id:         raw.id       ?? 'migrated_' + Math.random().toString(36).slice(2),
      baseId:     raw.type     ?? 'helm',
      type:       raw.type     ?? 'helm',
      label:      raw.label    ?? 'Item',
      baseName:   raw.label    ?? 'Item',
      icon:       raw.icon     ?? '⚔️',
      quality:    raw.quality === 'epic' ? 'rare' : raw.quality === 'common' ? 'normal' : (raw.quality ?? 'normal'),
      identified: true,
      reqLevel:   raw.levelReq ?? raw.reqLevel ?? 1,
      reqStr:     raw.strReq   ?? raw.reqStr,
      prefixes:   [],
      suffixes:   [],
    } as Item;
  }
  if (raw.identified === undefined) raw.identified = true;
  if (raw.baseName === undefined) raw.baseName = raw.label;
  return raw as Item;
}

function load(): InventoryState {
  try {
    const raw = localStorage.getItem('islap_inventory');
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      slots: (parsed.slots ?? []).map(migrateItem),
      gear: Object.fromEntries(
        Object.entries(parsed.gear ?? {}).map(([k, v]) => [k, migrateItem(v)])
      ) as Partial<Record<GearSlotId, Item>>,
      potionBelt: parsed.potionBelt ?? Array(POTION_BELT_SIZE).fill(null),
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function save(state: InventoryState) {
  localStorage.setItem('islap_inventory', JSON.stringify(state));
}

function firstFreeSlot(slots: (Item | null)[]): number {
  return slots.findIndex(s => s === null);
}

export function useInventory() {
  const [state, setState] = useState<InventoryState>(load);

  const update = useCallback((next: InventoryState) => { save(next); setState(next); }, []);

  const refresh = useCallback(() => { setState(load()); }, []);

  const equip = useCallback((inventoryIndex: number) => {
    setState(prev => {
      const item = prev.slots[inventoryIndex];
      if (!item) return prev;
      const newSlots = [...prev.slots];
      const newGear  = { ...prev.gear };
      const existing = newGear[item.type];
      newSlots[inventoryIndex] = existing ?? null;
      newGear[item.type] = item;
      const next = { ...prev, slots: newSlots, gear: newGear };
      save(next);
      return next;
    });
  }, []);

  const unequip = useCallback((slotId: GearSlotId) => {
    setState(prev => {
      const item = prev.gear[slotId];
      if (!item) return prev;
      const newSlots = [...prev.slots];
      const freeIdx  = firstFreeSlot(newSlots);
      if (freeIdx === -1) return prev;
      newSlots[freeIdx] = item;
      const newGear = { ...prev.gear };
      delete newGear[slotId];
      const next = { ...prev, slots: newSlots, gear: newGear };
      save(next);
      return next;
    });
  }, []);

  const discard = useCallback((source: { from: 'inventory'; index: number } | { from: 'gear'; slotId: GearSlotId }) => {
    setState(prev => {
      let next: InventoryState;
      if (source.from === 'inventory') {
        const newSlots = [...prev.slots];
        newSlots[source.index] = null;
        next = { ...prev, slots: newSlots };
      } else {
        const newGear = { ...prev.gear };
        delete newGear[source.slotId];
        next = { ...prev, gear: newGear };
      }
      save(next);
      return next;
    });
  }, []);

  const identify = useCallback((source: { from: 'inventory'; index: number } | { from: 'gear'; slotId: GearSlotId }) => {
    setState(prev => {
      let next: InventoryState;
      if (source.from === 'inventory') {
        const newSlots = [...prev.slots];
        const item = newSlots[source.index];
        if (!item) return prev;
        newSlots[source.index] = { ...item, identified: true };
        next = { ...prev, slots: newSlots };
      } else {
        const item = prev.gear[source.slotId];
        if (!item) return prev;
        const newGear = { ...prev.gear, [source.slotId]: { ...item, identified: true } };
        next = { ...prev, gear: newGear };
      }
      save(next);
      return next;
    });
  }, []);

  const addItem = useCallback((item: Item) => {
    setState(prev => {
      const newSlots = [...prev.slots];
      const freeIdx  = firstFreeSlot(newSlots);
      if (freeIdx === -1) return prev;
      newSlots[freeIdx] = item;
      const next = { ...prev, slots: newSlots };
      save(next);
      return next;
    });
  }, []);

  const addPotion = useCallback((potion: Potion, slotIndex?: number) => {
    setState(prev => {
      const belt = [...prev.potionBelt];
      const idx  = slotIndex !== undefined ? slotIndex : belt.findIndex(s => s === null);
      if (idx === -1 || belt[idx] !== null) return prev;
      belt[idx] = potion;
      const next = { ...prev, potionBelt: belt };
      save(next);
      return next;
    });
  }, []);

  const consumePotion = useCallback((slotIndex: number): Potion | null => {
    let consumed: Potion | null = null;
    setState(prev => {
      const potion = prev.potionBelt[slotIndex];
      if (!potion) return prev;
      consumed = potion;
      const belt = [...prev.potionBelt];
      belt[slotIndex] = null;
      const next = { ...prev, potionBelt: belt };
      save(next);
      return next;
    });
    return consumed;
  }, []);

  return {
    slots: state.slots, gear: state.gear, potionBelt: state.potionBelt,
    equip, unequip, discard, identify, addItem, addPotion, consumePotion, refresh,
  };
}
