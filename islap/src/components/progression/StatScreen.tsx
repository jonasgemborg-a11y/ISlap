import React from 'react';
import { PlayerProfile, PlayerStats } from '../../types/game';

interface StatScreenProps {
  profile: PlayerProfile;
  onSpend: (stat: keyof PlayerStats) => void;
  onClose: () => void;
}

const STATS: { key: keyof PlayerStats; label: string; description: string }[] = [
  { key: 'strength',  label: 'Strength',  description: '+1% weapon damage per point' },
  { key: 'dexterity', label: 'Dexterity', description: '+5 attack rating, +0.25 defense per point' },
  { key: 'vitality',  label: 'Vitality',  description: '+4 max life per point' },
  { key: 'energy',    label: 'Energy',    description: '+1.5 max mana per point' },
];

export function StatScreen({ profile, onSpend, onClose }: StatScreenProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 24, zIndex: 100,
    }}>
      <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>LEVEL UP!</div>
      <div style={{ color: '#ff6a00', fontWeight: 700, fontSize: 16 }}>
        {profile.statPoints} points to spend
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
        {STATS.map(s => (
          <div key={s.key} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#111', borderRadius: 12, padding: '14px 16px',
            border: '1px solid #222',
          }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                {s.label} <span style={{ color: '#ff6a00' }}>{profile.stats[s.key]}</span>
              </div>
              <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>{s.description}</div>
            </div>
            <button
              onClick={() => onSpend(s.key)}
              disabled={profile.statPoints <= 0}
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: profile.statPoints > 0 ? 'linear-gradient(135deg, #ff6a00, #ee0979)' : '#222',
                color: '#fff', border: 'none', cursor: profile.statPoints > 0 ? 'pointer' : 'default',
                fontSize: 20, fontWeight: 900, lineHeight: 1,
              }}
            >
              +
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop: 8, padding: '12px 40px', fontSize: 15, fontWeight: 700,
          background: 'transparent', color: '#555', border: '1px solid #333',
          borderRadius: 10, cursor: 'pointer',
        }}
      >
        {profile.statPoints > 0 ? 'Save for later' : 'Close'}
      </button>
    </div>
  );
}
