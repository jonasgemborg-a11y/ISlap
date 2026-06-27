import React from 'react';
import { PlayerProfile } from '../../types/game';

interface LevelBadgeProps {
  profile: PlayerProfile;
}

export function LevelBadge({ profile }: LevelBadgeProps) {
  const pct = (profile.xp / profile.xpToNext) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ color: '#1a1208', fontWeight: 700, fontSize: 14 }}>LVL {profile.level}</span>
        <span style={{ color: '#8a7060', fontSize: 12 }}>{profile.xp} / {profile.xpToNext} XP</span>
      </div>
      <div style={{ width: '100%', height: 8, background: '#d8ccb8', borderRadius: 0, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: '#8b6e14',
          borderRadius: 0,
          transition: 'width 0.6s ease',
        }} />
      </div>
      <div style={{ color: '#8a7060', fontSize: 11 }}>{profile.wins} wins — {profile.losses} losses</div>
    </div>
  );
}
