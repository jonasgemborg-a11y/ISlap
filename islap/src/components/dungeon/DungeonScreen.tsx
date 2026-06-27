import React, { useState, useCallback } from 'react';
import { useDungeon } from '../../hooks/useDungeon';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';
import { useInventory } from '../../hooks/useInventory';
import { useSkills } from '../../hooks/useSkills';
import { RoomView } from './RoomView';
import { DungeonMap } from './DungeonMap';
import { SlapArena } from '../slap/SlapArena';
import { CharacterScreen } from '../character/CharacterScreen';
import { SkillTree } from '../progression/SkillTree';
import { generateBot, BotProfile, MonsterType } from '../../utils/stats';
import { getTheme, THEME_COLORS } from '../../types/dungeon';

interface Props {
  onExitToTown: () => void;
}

type DungeonPhase = 'room' | 'fighting';

export function DungeonScreen({ onExitToTown }: Props) {
  const dungeon  = useDungeon();
  const { profile, spendPoint, spendSkillPoint, addGold } = usePlayerProfile();
  const { slots, gear, potionBelt, equip, unequip, discard, identify, refresh: refreshInventory } = useInventory();
  const { allocated, allocate } = useSkills(profile.heroClass ?? 'barbarian');
  const [phase, setPhase] = useState<DungeonPhase>('room');
  const [showMap, setShowMap] = useState(false);
  const [showChar, setShowChar] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [fightBots, setFightBots] = useState<BotProfile[] | null>(null);
  const [roomMonsterType, setRoomMonsterType] = useState<MonsterType>('normal');

  const { currentLevel, currentRoom, availableDoors, cameFromDir, state } = dungeon;

  // Roll monster type when entering a new uncleared room
  const prevPosRef = React.useRef<string>('');
  React.useEffect(() => {
    const posKey = `${state.pos.col},${state.pos.row},${state.depth}`;
    if (posKey !== prevPosRef.current && currentRoom && !currentRoom.cleared) {
      prevPosRef.current = posKey;
      const roll = Math.random();
      setRoomMonsterType(roll < 0.10 ? 'elite' : roll < 0.30 ? 'champion' : 'normal');
    }
  }, [state.pos, state.depth, currentRoom]);

  // Normal monsters match player level; champions/elites get bonus levels via generateBot
  const spawnMonster = useCallback((): BotProfile => {
    return generateBot(profile.level, roomMonsterType);
  }, [profile.level, roomMonsterType]);

  const handleStartFight = useCallback(() => {
    const dual = Math.random() < 0.3;
    const bots = dual ? [spawnMonster(), spawnMonster()] : [spawnMonster()];
    setFightBots(bots);
    setPhase('fighting');
  }, [spawnMonster]);

  const handleFightEnd = useCallback((winner: 'player' | 'opponent') => {
    setPhase('room');
    setFightBots(null);
    if (winner === 'player') {
      dungeon.clearRoom();
    } else {
      // Lost — flee back to previous room; if no previous room (entry room), exit to town
      if (state.prevPos) {
        dungeon.goBack();
      } else {
        onExitToTown();
      }
    }
    refreshInventory();
  }, [dungeon, refreshInventory]);

  const handleAscend = useCallback(() => {
    const result = dungeon.ascend();
    if (result === 'town') {
      onExitToTown();
    }
  }, [dungeon, onExitToTown]);

  if (phase === 'fighting' && fightBots) {
    return (
      <SlapArena
        forcedBots={fightBots}
        dungeonDepth={state.depth}
        onDungeonFightEnd={handleFightEnd}
      />
    );
  }

  return (
    <>
      <RoomView
        dungeon={state}
        room={currentRoom}
        availableDoors={availableDoors()}
        cameFrom={cameFromDir()}
        onMoveDir={dungeon.moveDir}
        onGoBack={dungeon.goBack}
        onDescend={dungeon.descend}
        onAscend={handleAscend}
        monsterType={roomMonsterType}
        onOpenMap={() => setShowMap(true)}
        onOpenChar={() => setShowChar(true)}
        onStartFight={handleStartFight}
      />

      {showMap && (
        <DungeonMap
          dungeon={state}
          level={currentLevel}
          onClose={() => setShowMap(false)}
        />
      )}

      {showChar && (
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
      )}

      {showSkills && (
        <SkillTree
          profile={profile}
          allocated={allocated}
          onAllocate={skillId => allocate(skillId, profile.skillPoints ?? 0, spendSkillPoint)}
          onClose={() => setShowSkills(false)}
        />
      )}
    </>
  );
}
