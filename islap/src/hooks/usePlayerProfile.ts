import { useState, useCallback } from 'react';
import { PlayerProfile, PlayerStats, GameResult } from '../types/game';
import { CharClass, CLASS_DEFS, HERO_CLASS_KEY } from '../data/classes';

function calcXp(won: boolean, botLevel: number): number {
  return won ? Math.max(25, botLevel * 10) : Math.max(10, botLevel * 2);
}
const xpToNext = (level: number) => Math.floor(50 * Math.pow(level, 2.5));

function defaultProfile(heroClass: CharClass): PlayerProfile {
  const cls = CLASS_DEFS[heroClass];
  return {
    level: 1, xp: 0, xpToNext: 150, wins: 0, losses: 0, statPoints: 0, skillPoints: 0,
    stats: { ...cls.startStats },
    gold: 0,
    heroClass,
  };
}

function migrateStats(stats: any): PlayerStats {
  if ('snabbhet' in stats || 'styrka' in stats) {
    return {
      strength:  (stats.styrka      ?? 0) + 30,
      dexterity: (stats.snabbhet    ?? 0) + 20,
      vitality:  (stats.uthallighet ?? 0) + 25,
      energy:    (stats.reflexer    ?? 0) + 10,
    };
  }
  return stats as PlayerStats;
}

function load(): PlayerProfile {
  const heroClass: CharClass = (localStorage.getItem(HERO_CLASS_KEY) as CharClass) ?? 'barbarian';
  const fallback = defaultProfile(heroClass);
  try {
    const raw = localStorage.getItem('islap_profile');
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      heroClass: parsed.heroClass ?? heroClass,
      stats: migrateStats(parsed.stats ?? {}),
    };
  } catch {
    return fallback;
  }
}

function save(profile: PlayerProfile) {
  localStorage.setItem('islap_profile', JSON.stringify(profile));
}

export function usePlayerProfile() {
  const [profile, setProfile] = useState<PlayerProfile>(load);

  const applyResult = useCallback((result: GameResult) => {
    setProfile(prev => {
      const won = result.winner === 'player';
      let { level, xp, wins, losses, statPoints } = prev;

      if (won) {
        xp   += calcXp(true, result.botLevel);
        wins += 1;
      } else {
        losses += 1;
        if (level > 50) xp = Math.max(0, xp - Math.floor(xpToNext(level) * 0.25));
      }

      let skillPoints = prev.skillPoints ?? 0;
      while (xp >= xpToNext(level)) {
        xp -= xpToNext(level);
        level++;
        statPoints += 5;
        skillPoints += 1;
      }

      const next: PlayerProfile = { ...prev, level, xp, xpToNext: xpToNext(level), wins, losses, statPoints, skillPoints };
      save(next);
      return next;
    });
  }, []);

  const spendPoint = useCallback((stat: keyof PlayerStats) => {
    setProfile(prev => {
      if (prev.statPoints <= 0) return prev;
      const next: PlayerProfile = {
        ...prev,
        statPoints: prev.statPoints - 1,
        stats: { ...prev.stats, [stat]: prev.stats[stat] + 1 },
      };
      save(next);
      return next;
    });
  }, []);

  const addGold = useCallback((amount: number) => {
    setProfile(prev => {
      const next = { ...prev, gold: prev.gold + amount };
      save(next);
      return next;
    });
  }, []);

  const spendSkillPoint = useCallback(() => {
    setProfile(prev => {
      if ((prev.skillPoints ?? 0) <= 0) return prev;
      const next: PlayerProfile = { ...prev, skillPoints: (prev.skillPoints ?? 0) - 1 };
      save(next);
      return next;
    });
  }, []);

  const setLevel = useCallback((level: number) => {
    setProfile(prev => {
      const next: PlayerProfile = { ...prev, level: Math.max(1, level), xpToNext: xpToNext(Math.max(1, level)) };
      save(next);
      return next;
    });
  }, []);

  return { profile, applyResult, spendPoint, spendSkillPoint, addGold, setLevel };
}
