export type GamePhase = 'idle' | 'countdown' | 'playing' | 'finished';
export type { CharClass } from '../data/classes';

export interface GameResult {
  playerSlaps: number;
  opponentSlaps: number;
  winner: 'player' | 'opponent' | 'tie';
  botLevel: number;
}

export interface PlayerStats {
  strength: number;
  dexterity: number;
  vitality: number;
  energy: number;
}

export interface PlayerProfile {
  level: number;
  xp: number;
  xpToNext: number;
  wins: number;
  losses: number;
  statPoints: number;
  skillPoints: number;
  stats: PlayerStats;
  gold: number;
  heroClass: import('../data/classes').CharClass;
}
