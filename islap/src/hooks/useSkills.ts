import { useState, useCallback } from 'react';
import { AllocatedSkills, ALL_SKILLS, SKILLS_KEY } from '../data/skills';
import { CharClass } from '../data/classes';

function load(): AllocatedSkills {
  try {
    const raw = localStorage.getItem(SKILLS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function save(allocated: AllocatedSkills) {
  localStorage.setItem(SKILLS_KEY, JSON.stringify(allocated));
}

export function useSkills(heroClass: CharClass) {
  const [allocated, setAllocated] = useState<AllocatedSkills>(load);

  const allocate = useCallback((skillId: string, skillPoints: number, spendPoint: () => void) => {
    const def = ALL_SKILLS.find(s => s.id === skillId);
    if (!def || def.classId !== heroClass) return false;
    if (skillPoints <= 0) return false;

    const current = allocated[skillId] ?? 0;
    if (current >= def.maxLevel) return false;

    // Check prereq
    if (def.prereqId && (allocated[def.prereqId] ?? 0) < 1) return false;

    const next = { ...allocated, [skillId]: current + 1 };
    save(next);
    setAllocated(next);
    spendPoint();
    return true;
  }, [allocated, heroClass]);

  const getLevel = useCallback((skillId: string) => allocated[skillId] ?? 0, [allocated]);

  const reset = useCallback(() => {
    save({});
    setAllocated({});
  }, []);

  return { allocated, allocate, getLevel, reset };
}
