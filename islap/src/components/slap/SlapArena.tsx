import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GamePhase, GameResult } from '../../types/game';
import { calcMaxHp, calcMaxMana, rollSlapDamage, calcDefense, calcAttackRating, calcSwipeThreshold, calcTotalStats, calcDeadlyStrike, calcDamageReduced, calcLifeSteal, calcHitChance, calcDodgeChance, generateBot, BotProfile } from '../../utils/stats';
import { CLASS_DEFS } from '../../data/classes';
import { useSkills } from '../../hooks/useSkills';
import { SkillTree } from '../progression/SkillTree';
import { useSwipeDetector, SwipeType } from '../../hooks/useSwipeDetector';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';
import { Avatar } from './Avatar';
import { SlapCounter } from './SlapCounter';
import { LevelBadge } from '../progression/LevelBadge';
import { StatScreen } from '../progression/StatScreen';
import { CharacterScreen } from '../character/CharacterScreen';
import { LootScreen } from './LootScreen';
import { generateLoot, LootResult } from '../../utils/loot';
import { useInventory } from '../../hooks/useInventory';
import { Item } from '../../types/item';
import { ShopScreen } from '../character/ShopScreen';
import { ArenaScreen } from '../town/ArenaScreen';
import { ExploreScreen } from '../town/ExploreScreen';

interface SlapArenaProps {
  onEnterDungeon?: () => void;
  // Dungeon mode: fight specific bots (1 or 2), call back when done
  forcedBots?: BotProfile[];
  dungeonDepth?: number;
  onDungeonFightEnd?: (winner: 'player' | 'opponent') => void;
}

export function SlapArena({ onEnterDungeon, forcedBots, dungeonDepth, onDungeonFightEnd }: SlapArenaProps = {}) {
  const { profile, applyResult, spendPoint, spendSkillPoint, addGold, setLevel } = usePlayerProfile();
  const { allocated, allocate, getLevel: getSkillLevel } = useSkills(profile.heroClass ?? 'barbarian');
  const { slots, gear, potionBelt, equip, unequip, discard, identify, addItem, addPotion, consumePotion } = useInventory();
  const maxHp   = calcMaxHp(profile, gear);
  const maxMana = calcMaxMana(profile, gear);
  const totalStats = calcTotalStats(profile.stats, gear);
  const playerDefense = calcDefense(profile, gear);
  const playerAR = calcAttackRating(profile, gear);
  const swipeThreshold = calcSwipeThreshold(profile.stats.dexterity);
  const deadlyStrikePct = calcDeadlyStrike(gear);
  const drPct = calcDamageReduced(gear);
  const lifeStealPct = calcLifeSteal(gear);
  const dodgeChancePct = calcDodgeChance(profile);

  const [phase, setPhase] = useState<GamePhase>('idle');
  const [countdown, setCountdown] = useState(3);
  const [slaps, setSlaps] = useState(0);
  const [slapped, setSlapped] = useState<number | null>(null); // which bot index got slapped
  const [hitKey, setHitKey]   = useState(0);
  const [missKey, setMissKey] = useState(0);
  const [critKey, setCritKey] = useState(0);
  const [spellFlash, setSpellFlash] = useState<{ key: number; icon: string; name: string; color: string } | null>(null);
  const [playerHp, setPlayerHp]     = useState(maxHp);
  const [playerMana, setPlayerMana] = useState(maxMana);
  const manaRef = useRef(maxMana);
  const [bots, setBots] = useState<BotProfile[]>([]);
  const [botHps, setBotHps] = useState<number[]>([]);
  const [targetIdx, setTargetIdx] = useState(0); // which bot the player is targeting
  const [result, setResult] = useState<GameResult | null>(null);
  const [showStats, setShowStats]   = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showChar, setShowChar]     = useState(false);
  const [showShop, setShowShop]     = useState(false);
  const [showArena, setShowArena]   = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showTrading, setShowTrading] = useState(false);
  const [shopKey, setShopKey] = useState(0);
  const [loot, setLoot] = useState<LootResult | null>(null);

  // ── Class skill state ──────────────────────────────────────────────────────
  const heroClass = profile.heroClass ?? 'barbarian';
  const clsDef    = CLASS_DEFS[heroClass];
  // Sorceress charge (0–6 swipes per fireball)
  const [spellCharge, setSpellCharge]   = useState(0);
  // Paladin hit counter (bolt every 5 hits)
  const [holyBoltCounter, setHolyBoltCounter] = useState(0);
  // Druid form
  type DruidForm = 'human' | 'werewolf' | 'werebear';
  const [druidForm, setDruidForm]       = useState<DruidForm>('human');
  // Necromancer skeleton count (scales with level)
  const skeletonCount = heroClass === 'necromancer'
    ? Math.min(3, Math.floor(profile.level / 5) + 1)
    : 0;
  // Dodge flash
  const [dodgeKey, setDodgeKey]         = useState(0);

  const classRef = useRef({
    spellCharge:     0,
    holyBoltCounter: 0,
    druidConsecHits: 0,
    druidBotHits:    0,
    druidForm:       'human' as DruidForm,
    skeletonTimers:  [] as (NodeJS.Timeout | null)[],
  });

  const fightCountRef = useRef(0);
  const botTimersRef = useRef<(NodeJS.Timeout | null)[]>([]);
  const phaseRef = useRef<GamePhase>('idle');
  const botsRef = useRef<BotProfile[]>([]);
  const botHpsRef = useRef<number[]>([]);
  const playerHpRef = useRef(maxHp);
  const targetIdxRef = useRef(0);
  const slapsRef = useRef(0);
  const playerDefenseRef = useRef(playerDefense);
  const playerARRef = useRef(playerAR);
  const deadlyStrikeRef = useRef(deadlyStrikePct);
  const drPctRef = useRef(drPct);
  const lifeStealRef = useRef(lifeStealPct);
  const dodgeChanceRef = useRef(dodgeChancePct);

  phaseRef.current = phase;
  playerDefenseRef.current = playerDefense;
  playerARRef.current = playerAR;
  deadlyStrikeRef.current = deadlyStrikePct;
  drPctRef.current = drPct;
  lifeStealRef.current = lifeStealPct;
  dodgeChanceRef.current = dodgeChancePct;
  targetIdxRef.current = targetIdx;

  const endGame = useCallback((winner: 'player' | 'opponent', finalSlaps: number) => {
    botTimersRef.current.forEach(t => { if (t) clearTimeout(t); });
    const primaryBot = botsRef.current[0];
    const r: GameResult = { playerSlaps: finalSlaps, opponentSlaps: 0, winner, botLevel: primaryBot?.level ?? 1 };
    applyResult(r);
    setResult(r);
    if (winner === 'player') {
      const drops = botsRef.current.map(b => generateLoot(b.level, profile.level));
      const totalGold = drops.reduce((sum, d) => sum + d.gold, 0);
      const items = drops.map(d => d.item).filter((i): i is Item => !!i);
      setLoot({ gold: totalGold, item: items[0], extraItems: items.slice(1) });
    }
    setShopKey(k => k + 1);
    setPhase('finished');
    // onDungeonFightEnd is called when player leaves the result screen, not here,
    // so the loot screen has time to show first.
  }, [applyResult]);

  const handleSlap = useCallback((swipeType: SwipeType) => {
    if (phaseRef.current !== 'playing') return;
    slapsRef.current += 1;
    setSlaps(slapsRef.current);

    const ti = targetIdxRef.current;
    const targetBot = botsRef.current[ti];
    if (!targetBot || botHpsRef.current[ti] <= 0) return;

    const cs = classRef.current;
    const isSkillSwipe = swipeType === 'skill';

    // ── Sorceress skill levels ─────────────────────────────────────────────
    const sk = heroClass === 'sorceress' ? {
      fireball:          getSkillLevel('fireball'),
      fire_mastery:      getSkillLevel('fire_mastery'),
      meteor:            getSkillLevel('meteor'),
      ice_bolt:          getSkillLevel('ice_bolt'),
      cold_mastery:      getSkillLevel('cold_mastery'),
      blizzard:          getSkillLevel('blizzard'),
      chain_lightning:   getSkillLevel('chain_lightning'),
      lightning_mastery: getSkillLevel('lightning_mastery'),
      thunder_clap:      getSkillLevel('thunder_clap'),
    } : null;

    // ── Sorceress: vertical swipe = cast active spell ──────────────────
    // Horizontal swipe = physical staff hit (base damage, no spells)
    let isSorceressFireball  = false;
    let isSorceressIceBolt   = false;
    let isSorceressLightning = false;

    if (heroClass === 'sorceress' && isSkillSwipe) {
      // Pick whichever tree has the most points as the active skill
      const firePts  = (sk!.fireball + sk!.fire_mastery + sk!.meteor);
      const coldPts  = (sk!.ice_bolt + sk!.cold_mastery + sk!.blizzard);
      const lightPts = (sk!.chain_lightning + sk!.lightning_mastery + sk!.thunder_clap);
      const maxPts   = Math.max(firePts, coldPts, lightPts);

      if (maxPts === 0) {
        // No skills allocated — vertical swipe does nothing, show hint
        setMissKey(k => k + 1);
        return;
      }
      if (firePts >= coldPts && firePts >= lightPts && sk!.fireball > 0) isSorceressFireball  = true;
      else if (coldPts >= lightPts && sk!.ice_bolt > 0)                   isSorceressIceBolt   = true;
      else if (sk!.chain_lightning > 0)                                    isSorceressLightning = true;
      else { setMissKey(k => k + 1); return; }
    }

    const isSpell = isSorceressFireball || isSorceressIceBolt || isSorceressLightning;

    // ── Mana cost for spells ──────────────────────────────────────────────
    if (isSpell) {
      const manaCost = isSorceressFireball  ? 6  + Math.floor(sk!.fireball * 0.5)
                     : isSorceressIceBolt   ? 3  + Math.floor(sk!.ice_bolt * 0.4)
                     :                        7  + Math.floor(sk!.chain_lightning * 0.6);
      if (manaRef.current < manaCost) {
        setMissKey(k => k + 1); // no-mana flash
        return;
      }
      const nextMana = manaRef.current - manaCost;
      manaRef.current = nextMana;
      setPlayerMana(nextMana);
    }

    // ── Hit check (spells always hit, physical uses AR/Defense) ──────────
    const hitChance = calcHitChance(playerARRef.current, targetBot.defense);
    const hit = isSpell || Math.random() <= hitChance;
    if (!hit) {
      setMissKey(k => k + 1);
      if (heroClass === 'druid') { cs.druidConsecHits = 0; cs.druidBotHits = 0; }
      return;
    }

    // ── Damage — two completely separate formulas ─────────────────────────
    // Skill swipe: based purely on skill level + Energy stat
    // Weapon swipe: based on weapon stats + Strength
    let baseDmg: number;
    let dmg: number;

    if (isSkillSwipe && isSpell && heroClass === 'sorceress') {
      // Energy boosts spell damage like D2 (1% per point above base 35)
      const energyBonus = 1 + Math.max(0, totalStats.energy - 35) * 0.005;

      if (isSorceressFireball) {
        const lvl = sk!.fireball;
        // lv1: 4–7, lv10: 22–38, lv20: 42–74
        const min = 2 + lvl * 2;
        const max = 4 + Math.round(lvl * 3.5);
        const firePct = 1 + (sk!.fire_mastery * 3) / 100;
        dmg = Math.round((min + Math.random() * (max - min)) * firePct * energyBonus);
      } else if (isSorceressIceBolt) {
        const lvl = sk!.ice_bolt;
        // lv1: 3–5, lv10: 17–28, lv20: 32–53
        const min = 2 + Math.round(lvl * 1.5);
        const max = 3 + Math.round(lvl * 2.5);
        const coldPct = 1 + (sk!.cold_mastery * 3) / 100;
        dmg = Math.round((min + Math.random() * (max - min)) * coldPct * energyBonus);
      } else { // chain lightning
        const lvl = sk!.chain_lightning;
        // lv1: 4–9, lv10: 26–49, lv20: 52–89
        const min = 2 + Math.round(lvl * 2.5);
        const max = 5 + Math.round(lvl * 4.2);
        const lightPct = 1 + (sk!.lightning_mastery * 3) / 100;
        dmg = Math.round((min + Math.random() * (max - min)) * lightPct * energyBonus);
      }
      baseDmg = dmg; // used for bounce calculations below
    } else {
      // Physical weapon attack
      baseDmg = rollSlapDamage(profile, gear);

      // Amazon: +15% base damage
      if (heroClass === 'amazon') baseDmg = Math.round(baseDmg * 1.15);

      // Druid Werewolf: +30% damage
      if (heroClass === 'druid' && cs.druidForm === 'werewolf') baseDmg = Math.round(baseDmg * 1.3);

      // Barbarian War Cry: every 5th weapon hit = double damage
      let isWarCry = false;
      if (heroClass === 'barbarian') {
        cs.holyBoltCounter += 1;
        setHolyBoltCounter(cs.holyBoltCounter);
        if (cs.holyBoltCounter >= 5) { cs.holyBoltCounter = 0; setHolyBoltCounter(0); isWarCry = true; }
      }

      const isDS = Math.random() * 100 < deadlyStrikeRef.current;
      dmg = isWarCry || isDS ? baseDmg * 2 : baseDmg;
      if (isWarCry || isDS) setCritKey(k => k + 1);
    }

    // Paladin: skill swipe = Holy Bolt (skill-based, not weapon)
    let holyBoltDmg = 0;
    if (heroClass === 'paladin' && isSkillSwipe) {
      const holyLvl = getSkillLevel('holy_bolt');
      holyBoltDmg = Math.round(10 + Math.max(profile.level, holyLvl * 2) * 2);
    }

    // Druid consecutive hit tracking
    if (heroClass === 'druid') {
      cs.druidConsecHits += 1;
      cs.druidBotHits = 0;
      if (cs.druidConsecHits >= 5 && cs.druidForm !== 'werewolf') {
        cs.druidForm = 'werewolf';
        setDruidForm('werewolf');
      }
    }

    setSlapped(ti);
    if (isSpell) {
      const spellInfo = isSorceressFireball  ? { icon: '🔥', name: 'FIREBALL',  color: '#ff6020' }
                      : isSorceressIceBolt   ? { icon: '🧊', name: 'ICE BOLT',  color: '#40a8e0' }
                      :                        { icon: '⚡', name: 'LIGHTNING', color: '#f0c010' };
      setSpellFlash(f => ({ key: (f?.key ?? 0) + 1, ...spellInfo }));
    } else setHitKey(k => k + 1);
    setTimeout(() => setSlapped(null), 80);

    // Life steal heals player
    if (lifeStealRef.current > 0) {
      const healed = Math.round(dmg * lifeStealRef.current / 100);
      if (healed > 0) {
        const healedHp = Math.min(maxHp, playerHpRef.current + healed);
        playerHpRef.current = healedHp;
        setPlayerHp(healedHp);
      }
    }

    let totalDmg = dmg + holyBoltDmg;

    // ── Sorceress extra effects on skill swipe ───────────────────────────
    if (heroClass === 'sorceress' && sk && isSkillSwipe) {
      // Chain Lightning: bounce to other bots when using lightning skill
      if (isSorceressLightning) {
        const others = botHpsRef.current.map((_, i) => i).filter(i => i !== ti && botHpsRef.current[i] > 0);
        if (others.length > 0) {
          const lightPct = (40 + sk.chain_lightning * 5) / 100;
          const bounceDmg = Math.round(totalDmg * lightPct);
          const target2 = others[Math.floor(Math.random() * others.length)];
          const chainHps = [...botHpsRef.current];
          chainHps[target2] = Math.max(0, chainHps[target2] - bounceDmg);
          botHpsRef.current = chainHps;
          setBotHps([...chainHps]);
          if (chainHps[target2] === 0) {
            const alive = chainHps.findIndex(h => h > 0);
            if (alive === -1) { endGame('player', slapsRef.current); return; }
            if (target2 === targetIdxRef.current) { setTargetIdx(alive); targetIdxRef.current = alive; }
          }
        }
      }
      // Blizzard: AoE on cold skill swipe (when cold mastery unlocked)
      if (isSorceressIceBolt && sk.blizzard > 0) {
        const blizzDmg = Math.round((15 + sk.blizzard * 6) * (1 + sk.cold_mastery * 4 / 100));
        const blizzHps = [...botHpsRef.current];
        blizzHps.forEach((hp, i) => { if (hp > 0 && i !== ti) blizzHps[i] = Math.max(0, hp - blizzDmg); });
        botHpsRef.current = blizzHps;
        setBotHps([...blizzHps]);
      }
      // Meteor: extra AoE on fire skill swipe (when meteor unlocked)
      if (isSorceressFireball && sk.meteor > 0) {
        const meteorDmg = Math.round((20 + sk.meteor * 8) * (1 + sk.fire_mastery * 6 / 100));
        const metHps = [...botHpsRef.current];
        metHps.forEach((hp, i) => { if (hp > 0 && i !== ti) metHps[i] = Math.max(0, hp - meteorDmg); });
        botHpsRef.current = metHps;
        setBotHps([...metHps]);
      }
    }

    const newHps = [...botHpsRef.current];
    newHps[ti] = Math.max(0, newHps[ti] - totalDmg);
    botHpsRef.current = newHps;
    setBotHps([...newHps]);

    if (newHps[ti] === 0) {
      const alive = newHps.findIndex(hp => hp > 0);
      if (alive === -1) {
        endGame('player', slapsRef.current);
      } else {
        setTargetIdx(alive);
        targetIdxRef.current = alive;
      }
    }
  }, [endGame, profile, gear, maxHp, heroClass, getSkillLevel]);

  const { onPointerMove, onPointerDown, onPointerUp } = useSwipeDetector(handleSlap, swipeThreshold);



  // In dungeon mode, auto-start the fight on mount
  useEffect(() => {
    if (forcedBots) startGame(forcedBots);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startGame = (forced?: BotProfile[]) => {
    fightCountRef.current += 1;
    const dual = !forced && Math.random() < 0.3;
    const newBots = forced
      ? forced
      : dual
        ? [generateBot(profile.level), generateBot(profile.level)]
        : [generateBot(profile.level)];

    botsRef.current = newBots;
    botHpsRef.current = newBots.map(b => b.maxHp);
    setBots(newBots);
    setBotHps(newBots.map(b => b.maxHp));
    setTargetIdx(0);
    targetIdxRef.current = 0;

    slapsRef.current = 0;
    setSlaps(0);
    playerHpRef.current = maxHp;
    setPlayerHp(maxHp);
    manaRef.current = maxMana;
    setPlayerMana(maxMana);

    // Reset class state
    classRef.current = { spellCharge: 0, holyBoltCounter: 0, druidConsecHits: 0, druidBotHits: 0, druidForm: 'human', skeletonTimers: [] };
    setSpellCharge(0);
    setHolyBoltCounter(0);
    setDruidForm('human');
    setResult(null);
    setCountdown(3);
    setPhase('countdown');
  };

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown === 0) { setPhase('playing'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Mana regeneration: 2% of max mana per second, tick every 250ms
  useEffect(() => {
    if (phase !== 'playing') return;
    const regenPerTick = maxMana * 0.02 * 0.25;
    const t = setInterval(() => {
      if (manaRef.current >= maxMana) return;
      const next = Math.min(maxMana, manaRef.current + regenPerTick);
      manaRef.current = next;
      setPlayerMana(next);
    }, 250);
    return () => clearInterval(t);
  }, [phase, maxMana]);

  // Each bot gets its own independent attack loop
  useEffect(() => {
    if (phase !== 'playing') return;
    botTimersRef.current.forEach(t => { if (t) clearTimeout(t); });

    const scheduleBot = (botIndex: number) => {
      const bot = botsRef.current[botIndex];
      if (!bot) return;
      const interval = bot.attackInterval;
      const baseDmg  = bot.damage;
      const delay = interval * (0.2 + Math.random() * 2);
      const damage = Math.max(1, Math.round(baseDmg * (0.2 + Math.random() * 2)));

      botTimersRef.current[botIndex] = setTimeout(() => {
        if (phaseRef.current !== 'playing') return;
        // Only attack if this bot is still alive
        if (botHpsRef.current[botIndex] <= 0) return;

        // D2 hit chance for bot: 2*botAR / (botAR + playerDefense)
        const botHitChance = calcHitChance(bot.attackRating, playerDefenseRef.current);
        if (Math.random() > botHitChance) {
          scheduleBot(botIndex);
          return;
        }
        // Amazon: dodge chance
        if (dodgeChanceRef.current > 0 && Math.random() * 100 < dodgeChanceRef.current) {
          setDodgeKey(k => k + 1);
          scheduleBot(botIndex);
          return;
        }

        // Druid Werebear: track consecutive bot hits
        if (heroClass === 'druid') {
          classRef.current.druidBotHits += 1;
          classRef.current.druidConsecHits = 0;
          if (classRef.current.druidBotHits >= 3 && classRef.current.druidForm !== 'werebear') {
            classRef.current.druidForm = 'werebear';
            setDruidForm('werebear');
          }
        }

        const baseDR = drPctRef.current + (heroClass === 'druid' && classRef.current.druidForm === 'werebear' ? 20 : 0);
        const reduced = Math.round(damage * (1 - Math.min(50, baseDR) / 100));
        const next = Math.max(0, playerHpRef.current - Math.max(1, reduced));
        playerHpRef.current = next;
        setPlayerHp(next);
        if (next === 0) endGame('opponent', slapsRef.current);
        scheduleBot(botIndex);
      }, delay);
    };

    botsRef.current.forEach((_, i) => scheduleBot(i));

    // Necromancer: skeletons auto-attack bots
    if (heroClass === 'necromancer') {
      const skelDmg = 5 + profile.level;
      classRef.current.skeletonTimers.forEach(t => { if (t) clearTimeout(t); });
      classRef.current.skeletonTimers = [];
      for (let s = 0; s < skeletonCount; s++) {
        const scheduleSkeleton = () => {
          const delay = 2000 + s * 400 + Math.random() * 500;
          const t = setTimeout(() => {
            if (phaseRef.current !== 'playing') return;
            // Find a living target
            const target = botHpsRef.current.findIndex(hp => hp > 0);
            if (target === -1) return;
            const newHps = [...botHpsRef.current];
            newHps[target] = Math.max(0, newHps[target] - skelDmg);
            botHpsRef.current = newHps;
            setBotHps([...newHps]);
            if (newHps[target] === 0) {
              const alive = newHps.findIndex(hp => hp > 0);
              if (alive === -1) { endGame('player', slapsRef.current); return; }
              setTargetIdx(alive);
              targetIdxRef.current = alive;
            }
            scheduleSkeleton();
          }, delay);
          classRef.current.skeletonTimers[s] = t;
        };
        scheduleSkeleton();
      }
    }

    return () => {
      botTimersRef.current.forEach(t => { if (t) clearTimeout(t); });
      classRef.current.skeletonTimers.forEach(t => { if (t) clearTimeout(t); });
    };
  }, [phase, endGame, heroClass, skeletonCount, profile.level]);

  const prevLevelRef = useRef(profile.level);
  useEffect(() => {
    if (profile.level > prevLevelRef.current && profile.statPoints > 0) setShowStats(true);
    prevLevelRef.current = profile.level;
  }, [profile.level, profile.statPoints]);

  const isDual = bots.length > 1;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', gap: 12,
      background: '#f0e8d8', touchAction: 'none',
      position: 'relative', overflow: 'hidden',
    }}>

      {showStats && <StatScreen profile={profile} onSpend={spendPoint} onClose={() => setShowStats(false)} />}
      {showSkills && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <SkillTree
            profile={profile}
            allocated={allocated}
            onAllocate={skillId => allocate(skillId, profile.skillPoints ?? 0, spendSkillPoint)}
            onClose={() => setShowSkills(false)}
          />
        </div>
      )}
      {showArena && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <ArenaScreen onClose={() => setShowArena(false)} />
        </div>
      )}
      {showExplore && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <ExploreScreen onClose={() => setShowExplore(false)} />
        </div>
      )}
      {showTrading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: '#0e0c0a', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <div style={{ fontSize: 64 }}>🤝</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#f0e8d8', letterSpacing: 4 }}>THE TRADING GROUND</div>
          <div style={{ color: '#6a5a48', fontSize: 13, textAlign: 'center', maxWidth: 260, lineHeight: 1.6 }}>
            Trade items with other players. Coming in a future update.
          </div>
          <button onClick={() => setShowTrading(false)} style={{ ...charBtnStyle, marginTop: 16 }}>← Back</button>
        </div>
      )}
      {showShop && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <ShopScreen
            profile={profile}
            stockKey={shopKey}
            gear={gear}
            potionBelt={potionBelt}
            playerStrength={totalStats.strength}
            onBuy={(item, price) => { addItem(item); addGold(-price); }}
            onBuyPotion={(potion) => { addPotion(potion); addGold(-potion.price); }}
            onClose={() => setShowShop(false)}
          />
        </div>
      )}
      {showChar && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <CharacterScreen
            profile={profile}
            onSpend={spendPoint}
            onAddGold={addGold}
            onClose={() => setShowChar(false)}
            slots={slots}
            gear={gear}
            potionBelt={potionBelt}
            onEquip={equip}
            onUnequip={unequip}
            onDiscard={discard}
            onIdentify={identify}
            onOpenSkillTree={() => { setShowChar(false); setShowSkills(true); }}
          />
        </div>
      )}
      {loot && (
        <LootScreen
          loot={loot}
          onClose={() => {
            addGold(loot.gold);
            if (loot.item) addItem(loot.item);
            loot.extraItems?.forEach(i => addItem(i));
            setLoot(null);
          }}
        />
      )}

      {phase === 'playing' && hitKey > 0 && (
        <span key={hitKey} className="hit-label">SLAP!</span>
      )}
      {phase === 'playing' && missKey > 0 && (
        <span key={`m${missKey}`} className="miss-label">MISS</span>
      )}
      {phase === 'playing' && critKey > 0 && (
        <span key={`c${critKey}`} className="crit-label">CRIT!</span>
      )}
      {phase === 'playing' && spellFlash && (
        <span
          key={`spell${spellFlash.key}`}
          className="spell-label"
          style={{ color: spellFlash.color, textShadow: `0 0 16px ${spellFlash.color}80` }}
        >
          {spellFlash.icon} {spellFlash.name}
        </span>
      )}

      {/* TOWN */}
      {phase === 'idle' && (
        <div style={{
          width: '100%', maxWidth: 380,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 12, padding: '0 16px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#1a1208', letterSpacing: 6, lineHeight: 1 }}>
              TOWN
            </div>
            <LevelBadge profile={profile} />
          </div>

          {(profile.statPoints > 0 || (profile.skillPoints ?? 0) > 0) && (
            <div style={{ display: 'flex', gap: 8 }}>
              {profile.statPoints > 0 && (
                <button onClick={() => setShowStats(true)} style={pointsBtnStyle}>
                  +{profile.statPoints} stat pts
                </button>
              )}
              {(profile.skillPoints ?? 0) > 0 && (
                <button onClick={() => setShowSkills(true)} style={{ ...pointsBtnStyle, color: '#c85020', borderColor: '#c85020' }}>
                  +{profile.skillPoints} skill pts
                </button>
              )}
            </div>
          )}

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <TownZone onClick={onEnterDungeon ?? (() => {})} title="Dungeon" subtitle="Explore rooms · fight monsters · earn loot" borderColor="#5a3a1a" accentColor="#8b6e14" badge={null}>
              <Door small />
            </TownZone>
            <TownZone onClick={() => setShowArena(true)} title="The Arena" subtitle="Player vs Player · ranked matches" borderColor="#6a1a1a" accentColor="#8b2020" badge="COMING SOON">
              <ArenaIcon />
            </TownZone>
            <TownZone onClick={() => setShowExplore(true)} title="Adventure" subtitle="GPS combat · fight real players nearby" borderColor="#1a3a28" accentColor="#2a6a48" badge="COMING SOON">
              <ExploreIcon />
            </TownZone>
            <TownZone onClick={() => setShowTrading(true)} title="The Trading Ground" subtitle="Trade items with other players" borderColor="#2a1a4a" accentColor="#6a3a9a" badge="COMING SOON">
              <TradingIcon />
            </TownZone>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowChar(true)} style={charBtnStyle}>👤 Character</button>
            <button onClick={() => setShowSkills(true)} style={charBtnStyle}>⚡ Skills</button>
            <button onClick={() => setShowShop(true)} style={charBtnStyle}>🛒 Shop</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setLevel(profile.level - 1)} style={debugBtn}>−</button>
            <span style={{ color: '#b0a090', fontSize: 11, letterSpacing: 1 }}>DBG {profile.level}</span>
            <button onClick={() => setLevel(profile.level + 1)} style={debugBtn}>+</button>
          </div>
        </div>
      )}

      {/* COUNTDOWN */}
      {phase === 'countdown' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {isDual && (
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 4,
              color: '#8b2020', border: '1px solid #8b2020',
              padding: '4px 16px', borderRadius: 2,
            }}>
              ⚔️ TWO ENEMIES ⚔️
            </div>
          )}
          <div style={{ color: '#8a7060', fontSize: 12, letterSpacing: 3 }}>
            {isDual ? 'OPPONENTS' : 'OPPONENT'}
          </div>
          <div style={{ display: 'flex', gap: isDual ? 32 : 0, alignItems: 'flex-start' }}>
            {bots.map((bot, i) => {
              const typeColor = bot.monsterType === 'elite' ? '#c8a020' : bot.monsterType === 'champion' ? '#4169e1' : null;
              return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                {typeColor && (
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 3,
                    color: typeColor, border: `1px solid ${typeColor}`,
                    padding: '1px 10px', borderRadius: 2,
                  }}>
                    {bot.monsterType === 'elite' ? '💀 ELITE' : '⚡ CHAMPION'}
                  </div>
                )}
                <div style={{ fontSize: isDual ? 60 : 80 }}>{bot.avatar}</div>
                <div style={{ color: '#1a1208', fontWeight: 900, fontSize: 16 }}>LVL {bot.level}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#8b2020', fontWeight: 700, fontSize: 13 }}>{bot.maxHp}</div>
                    <div style={{ color: '#8a7060', fontSize: 9, letterSpacing: 1 }}>HP</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#b03020', fontWeight: 700, fontSize: 13 }}>{bot.damage}</div>
                    <div style={{ color: '#8a7060', fontSize: 9, letterSpacing: 1 }}>DMG</div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 88, color: '#1a1208', letterSpacing: 4, lineHeight: 1 }}>
            {countdown === 0 ? 'GO!' : countdown}
          </div>
        </div>
      )}

      {/* PLAYING + FINISHED */}
      {(phase === 'playing' || phase === 'finished') && (
        <>
          {/* HP + Mana bars */}
          <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 6, padding: '0 20px' }}>
            <HpBar label="HP" hp={playerHp} max={maxHp} color="#3a6e48" />
            {maxMana > 0 && (
              <HpBar label="MANA" hp={Math.round(playerMana)} max={maxMana} color="#204880" />
            )}
            {bots.map((bot, i) => (
              <HpBar
                key={i}
                label={isDual ? `FOE ${i + 1} LVL ${bot.level}` : `FOE LVL ${bot.level}`}
                hp={botHps[i] ?? 0}
                max={bot.maxHp}
                color="#8b2020"
                dim={botHps[i] === 0}
              />
            ))}
          </div>

          {/* Avatars — tappable to switch target */}
          <div style={{ display: 'flex', gap: isDual ? 24 : 0, alignItems: 'center' }}>
            {bots.map((bot, i) => (
              <div
                key={i}
                onClick={() => { if (botHps[i] > 0) { setTargetIdx(i); targetIdxRef.current = i; } }}
                onPointerDown={i === targetIdx && botHps[i] > 0 ? onPointerDown : undefined}
                onPointerMove={i === targetIdx && phase === 'playing' && botHps[i] > 0 ? onPointerMove : undefined}
                onPointerUp={i === targetIdx && botHps[i] > 0 ? onPointerUp : undefined}
                style={{
                  cursor: botHps[i] === 0 ? 'default' : i === targetIdx ? 'grab' : 'pointer',
                  opacity: botHps[i] === 0 ? 0.25 : 1,
                  outline: isDual && i === targetIdx && botHps[i] > 0
                    ? '2px solid #8b6e14'
                    : 'none',
                  borderRadius: 8,
                  transition: 'opacity 0.2s, outline 0.15s',
                }}
              >
                <Avatar slapped={slapped === i} emoji={bot.avatar} />
              </div>
            ))}
          </div>

          <SlapCounter count={slaps} />
          <div style={{ color: '#8a7060', fontSize: 13 }}>slaps</div>

          {/* Class skill indicator */}
          {phase === 'playing' && (() => {
            if (heroClass === 'sorceress') {
              const fbLvl   = getSkillLevel('fireball');
              const iceLvl  = getSkillLevel('ice_bolt');
              const lgtLvl  = getSkillLevel('chain_lightning');
              const firePts  = fbLvl + getSkillLevel('fire_mastery') + getSkillLevel('meteor');
              const coldPts  = iceLvl + getSkillLevel('cold_mastery') + getSkillLevel('blizzard');
              const lightPts = lgtLvl + getSkillLevel('lightning_mastery') + getSkillLevel('thunder_clap');
              const maxPts   = Math.max(firePts, coldPts, lightPts);
              const activeSkill = maxPts === 0 ? null
                : firePts >= coldPts && firePts >= lightPts
                  ? { icon: '🔥', name: 'FIREBALL',        color: '#c85020', cost: 6  + Math.floor(fbLvl  * 0.5) }
                : coldPts >= lightPts
                  ? { icon: '🧊', name: 'ICE BOLT',        color: '#4080c0', cost: 3  + Math.floor(iceLvl * 0.4) }
                  : { icon: '⚡', name: 'CHAIN LIGHTNING', color: '#c8a020', cost: 7  + Math.floor(lgtLvl * 0.6) };
              const noMana = activeSkill && playerMana < activeSkill.cost;
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  {activeSkill
                    ? <div style={{ color: noMana ? '#8b2020' : activeSkill.color, fontSize: 10, letterSpacing: 2 }}>
                        {activeSkill.icon} {activeSkill.name} ({activeSkill.cost} mana) {noMana ? '— NO MANA' : '↕'}
                      </div>
                    : <div style={{ color: '#6a5a48', fontSize: 10, letterSpacing: 1 }}>No skill — allocate points first</div>
                  }
                  <div style={{ color: '#6a5a48', fontSize: 9, letterSpacing: 1 }}>↔ swipe for weapon</div>
                </div>
              );
            }
            if (heroClass === 'barbarian') return (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ color: '#8b4a10', fontSize: 10, letterSpacing: 2 }}>⚡ WAR CRY {holyBoltCounter}/5 — ↔ weapon</div>
                <div style={{ color: '#6a5a48', fontSize: 9, letterSpacing: 1 }}>↕ swipe for skill (coming soon)</div>
              </div>
            );
            if (heroClass === 'paladin') return (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ color: '#c8a020', fontSize: 10, letterSpacing: 2 }}>✨ HOLY BOLT — ↕ swipe</div>
                <div style={{ color: '#6a5a48', fontSize: 9, letterSpacing: 1 }}>↔ swipe for weapon</div>
              </div>
            );
            if (heroClass === 'druid') return (
              <div style={{ color: druidForm === 'werewolf' ? '#8b4010' : druidForm === 'werebear' ? '#4a6a8b' : '#6a5a48', fontSize: 10, letterSpacing: 2, fontWeight: 700 }}>
                {druidForm === 'human' ? '🧍 HUMAN' : druidForm === 'werewolf' ? '🐺 WEREWOLF +30% DMG' : '🐻 WEREBEAR +20% DR'}
              </div>
            );
            if (heroClass === 'necromancer') return (
              <div style={{ color: '#8060a8', fontSize: 10, letterSpacing: 2 }}>
                💀 SKELETONS: {skeletonCount}
              </div>
            );
            if (heroClass === 'amazon') return dodgeKey > 0 ? (
              <div key={dodgeKey} style={{
                color: '#3a6e48', fontSize: 14, fontWeight: 900, letterSpacing: 3,
                animation: 'hitAnim 0.5s ease-out forwards',
              }}>
                DODGE!
              </div>
            ) : (
              <div style={{ color: '#3a8060', fontSize: 10, letterSpacing: 2 }}>
                🏹 DODGE {Math.round(dodgeChancePct)}%
              </div>
            );
            return null;
          })()}

          {/* Potion belt */}
          {phase === 'playing' && (
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {potionBelt.map((potion, i) => (
                <button
                  key={i}
                  disabled={!potion}
                  onClick={() => {
                    const p = potionBelt[i];
                    if (!p) return;
                    consumePotion(i);
                    setPlayerHp(hp => Math.min(maxHp, hp + p.healAmount));
                  }}
                  style={{
                    width: 56, height: 56, borderRadius: 4,
                    border: `1px solid ${potion ? '#6a8040' : '#d0c4b0'}`,
                    background: '#e8dcc8',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 2,
                    cursor: potion ? 'pointer' : 'default', padding: 0,
                  }}
                >
                  {potion ? (
                    <>
                      <span style={{ fontSize: 22 }}>{potion.icon}</span>
                      <span style={{ fontSize: 9, color: '#3a6e48', fontWeight: 700 }}>+{potion.healAmount}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 20, opacity: 0.2 }}>🧪</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* RESULT */}
      {phase === 'finished' && result && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 52, letterSpacing: 4,
            color: result.winner === 'player' ? '#3a6e48' : '#8b2020',
          }}>
            {result.winner === 'player' ? 'KO — VICTORY' : 'KO — DEFEATED'}
          </div>
          <div style={{ color: '#8b6e14', fontSize: 13, fontWeight: 600 }}>
            +{result.winner === 'player'
              ? Math.max(25, result.botLevel * 10)
              : Math.max(10, result.botLevel * 2)} XP
          </div>
          <LevelBadge profile={profile} />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              onClick={() => onDungeonFightEnd ? onDungeonFightEnd(result.winner === 'tie' ? 'opponent' : result.winner) : setPhase('idle')}
              style={charBtnStyle}
            >
              {onDungeonFightEnd ? '← Back to Dungeon' : '← Home'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TownZone({ onClick, title, subtitle, borderColor, accentColor, badge, children }: {
  onClick: () => void;
  title: string;
  subtitle: string;
  borderColor: string;
  accentColor: string;
  badge: string | null;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '100%', background: '#1a1410',
        border: `1px solid ${borderColor}`,
        borderRadius: 4, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 16,
        cursor: 'pointer', userSelect: 'none',
        transition: 'border-color 0.15s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ flexShrink: 0 }}>{children}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, color: '#f0e8d8', lineHeight: 1 }}>
          {title}
        </div>
        <div style={{ color: '#6a5a48', fontSize: 11, marginTop: 3 }}>{subtitle}</div>
      </div>
      {badge && (
        <div style={{
          fontSize: 9, letterSpacing: 2, color: accentColor,
          border: `1px solid ${accentColor}`, borderRadius: 2,
          padding: '2px 6px', flexShrink: 0,
        }}>
          {badge}
        </div>
      )}
      {!badge && (
        <div style={{ color: borderColor, fontSize: 20, flexShrink: 0 }}>›</div>
      )}
    </div>
  );
}

function Door({ small }: { small?: boolean }) {
  const w = small ? 48 : 110;
  const h = small ? 70 : 160;
  const s = small ? 48 / 110 : 1;
  return (
    <svg width={w} height={h} viewBox="0 0 110 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="106" height="156" rx="3" fill="#2a1208" />
      <rect x="6" y="6" width="98" height="148" rx="2" fill="#3d1e0a" />
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x="7" y={7 + i * 24} width="96" height="22" fill={i % 2 === 0 ? '#5a2e0e' : '#4e2808'} />
      ))}
      {[20, 35, 55, 75, 90].map(x => (
        <line key={x} x1={x} y1="7" x2={x} y2="151" stroke="#3d1e0a" strokeWidth="1" opacity="0.5" />
      ))}
      <rect x="7" y="50" width="96" height="6" fill="#2a1208" opacity="0.6" />
      <rect x="7" y="104" width="96" height="6" fill="#2a1208" opacity="0.6" />
      <rect x="7" y="18" width="18" height="10" rx="1" fill="#1a1208" />
      <rect x="7" y="22" width="18" height="2" fill="#4a4030" />
      <rect x="7" y="118" width="18" height="10" rx="1" fill="#1a1208" />
      <rect x="7" y="122" width="18" height="2" fill="#4a4030" />
      <circle cx="78" cy="82" r="9" fill="#1a1208" />
      <circle cx="78" cy="82" r="6" fill="#c9a84c" />
      <circle cx="78" cy="82" r="3" fill="#8b6e14" />
      <circle cx="78" cy="100" r="4" fill="#1a1208" />
      <rect x="76" y="101" width="4" height="6" rx="1" fill="#1a1208" />
      <rect x="2" y="2" width="106" height="156" rx="3" fill="none" stroke="#8b5a20" strokeWidth="2" />
      <rect x="6" y="6" width="98" height="148" rx="2" fill="none" stroke="#2a1208" strokeWidth="1" />
      <rect x="7" y="149" width="96" height="5" fill="#c9a84c" opacity="0.12" />
    </svg>
  );
}

function ArenaIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="28" rx="20" ry="12" fill="#1a0808" stroke="#5a1a1a" strokeWidth="1.5"/>
      <ellipse cx="24" cy="25" rx="14" ry="8" fill="#0e0606" stroke="#3a1010" strokeWidth="1"/>
      {[0,1,2,3,4,5].map(i => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i} x1={24 + Math.cos(a)*14} y1={25 + Math.sin(a)*8} x2={24 + Math.cos(a)*20} y2={28 + Math.sin(a)*12} stroke="#3a1010" strokeWidth="1"/>;
      })}
      <text x="24" y="29" textAnchor="middle" dominantBaseline="middle" fontSize="14">⚔️</text>
      <rect x="10" y="10" width="3" height="12" fill="#6a1a1a"/>
      <rect x="8" y="10" width="7" height="4" fill="#c9a84c"/>
      <rect x="35" y="10" width="3" height="12" fill="#6a1a1a"/>
      <rect x="33" y="10" width="7" height="4" fill="#c9a84c"/>
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" fill="#0a1410" stroke="#1a3a28" strokeWidth="1.5"/>
      <circle cx="24" cy="24" r="12" fill="none" stroke="#1a3a28" strokeWidth="1" strokeDasharray="2 3"/>
      <circle cx="24" cy="24" r="6" fill="none" stroke="#1a3a28" strokeWidth="1"/>
      <line x1="24" y1="6" x2="24" y2="42" stroke="#1a3a28" strokeWidth="1"/>
      <line x1="6" y1="24" x2="42" y2="24" stroke="#1a3a28" strokeWidth="1"/>
      <circle cx="24" cy="24" r="3" fill="#3a8060"/>
      <circle cx="24" cy="24" r="2" fill="#3a8060" opacity="0.6"/>
      {/* North marker */}
      <text x="24" y="13" textAnchor="middle" fontSize="7" fill="#3a8060" fontWeight="bold">N</text>
    </svg>
  );
}

function TradingIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="14" width="18" height="12" rx="2" fill="#1a0e2a" stroke="#3a1a6a" strokeWidth="1.5"/>
      <rect x="26" y="22" width="18" height="12" rx="2" fill="#1a0e2a" stroke="#3a1a6a" strokeWidth="1.5"/>
      <polyline points="8,14 8,8 36,8 36,22" stroke="#6a3a9a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <polyline points="12,10 8,6 4,10" stroke="#6a3a9a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="32,26 36,30 40,26" stroke="#6a3a9a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="13" cy="20" r="3" fill="#9a6ac8"/>
      <circle cx="35" cy="28" r="3" fill="#9a6ac8"/>
    </svg>
  );
}

function HpBar({ label, hp, max, color, dim }: { label: string; hp: number; max: number; color: string; dim?: boolean }) {
  const pct = (hp / max) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: dim ? 0.35 : 1, transition: 'opacity 0.3s' }}>
      <span style={{ color: '#8a7060', fontSize: 10, letterSpacing: 1, width: 52, textAlign: 'right', textTransform: 'uppercase', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: '#d8ccb8', borderRadius: 0, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: color,
          borderRadius: 0, transition: 'width 0.1s ease',
        }} />
      </div>
      <span style={{ color: '#6a5a48', fontSize: 11, width: 30, fontVariantNumeric: 'tabular-nums' }}>{hp}</span>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '14px 52px', fontSize: 22, fontWeight: 900, letterSpacing: 4,
  background: '#7a1a0e',
  color: '#f0e8d8', border: 'none', borderRadius: 2, cursor: 'pointer',
  textTransform: 'uppercase' as const,
  fontFamily: "'Bebas Neue', sans-serif",
  boxShadow: '0 4px 0 #3d0c06',
};

const charBtnStyle: React.CSSProperties = {
  padding: '6px 14px', fontSize: 12, fontWeight: 700, letterSpacing: 1,
  background: 'transparent', color: '#6a5a48', border: '1px solid #c0b090',
  borderRadius: 2, cursor: 'pointer', textTransform: 'uppercase' as const,
};

const debugBtn: React.CSSProperties = {
  width: 24, height: 24, fontSize: 14, fontWeight: 900,
  background: 'transparent', color: '#b0a090', border: '1px solid #d0c4b0',
  borderRadius: 2, cursor: 'pointer', lineHeight: 1, padding: 0,
};

const pointsBtnStyle: React.CSSProperties = {
  padding: '6px 14px', fontSize: 12, fontWeight: 700, letterSpacing: 1,
  background: 'transparent', color: '#8b6e14', border: '1px solid #8b6e14',
  borderRadius: 2, cursor: 'pointer', textTransform: 'uppercase' as const,
};
