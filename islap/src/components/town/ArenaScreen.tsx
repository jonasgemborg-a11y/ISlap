import React from 'react';

interface Props {
  onClose: () => void;
}

export function ArenaScreen({ onClose }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0a0806',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 28, padding: 32,
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: 20, right: 20,
        background: 'none', border: 'none', color: '#8a7060', fontSize: 22, cursor: 'pointer',
      }}>✕</button>

      {/* Colosseum SVG */}
      <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="70" cy="60" rx="68" ry="36" fill="#1a1208" stroke="#5a3a1a" strokeWidth="2"/>
        <ellipse cx="70" cy="56" rx="52" ry="26" fill="#0e0a06" stroke="#3a2010" strokeWidth="1.5"/>
        <ellipse cx="70" cy="56" rx="28" ry="14" fill="#2a1208" stroke="#8b6e14" strokeWidth="1"/>
        {[0,1,2,3,4,5,6,7].map(i => {
          const angle = (i / 8) * Math.PI * 2;
          const x1 = 70 + Math.cos(angle) * 52;
          const y1 = 56 + Math.sin(angle) * 26;
          const x2 = 70 + Math.cos(angle) * 68;
          const y2 = 60 + Math.sin(angle) * 36;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a2010" strokeWidth="1.5"/>;
        })}
        <text x="70" y="60" textAnchor="middle" dominantBaseline="middle" fontSize="22">⚔️</text>
        {/* Banners */}
        <rect x="18" y="20" width="8" height="28" fill="#7a1a0e"/>
        <rect x="18" y="20" width="14" height="10" fill="#c9a84c"/>
        <rect x="114" y="20" width="8" height="28" fill="#7a1a0e"/>
        <rect x="108" y="20" width="14" height="10" fill="#c9a84c"/>
      </svg>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 48, letterSpacing: 6, color: '#c9a84c', lineHeight: 1,
        }}>THE ARENA</div>
        <div style={{ color: '#6a5a48', fontSize: 12, letterSpacing: 3, marginTop: 4 }}>
          PLAYER VS PLAYER
        </div>
      </div>

      <div style={{
        background: '#1a1410', border: '1px solid #3a2a14',
        borderRadius: 4, padding: '20px 28px', maxWidth: 300, textAlign: 'center',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ color: '#8b6e14', fontSize: 28 }}>🚧</div>
        <div style={{ color: '#c0b090', fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>
          COMING SOON
        </div>
        <div style={{ color: '#6a5a48', fontSize: 12, lineHeight: 1.6 }}>
          Challenge real players via Bluetooth proximity. Ranked matches, leaderboards, seasonal rewards.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 280 }}>
        {['Ranked 1v1', 'Unranked Practice', 'Tournament Mode'].map(mode => (
          <div key={mode} style={{
            background: '#0e0a06', border: '1px solid #2a1e14',
            borderRadius: 3, padding: '10px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: '#4a3a28', fontSize: 12, letterSpacing: 1 }}>{mode}</span>
            <span style={{ color: '#3a2a18', fontSize: 10 }}>LOCKED</span>
          </div>
        ))}
      </div>
    </div>
  );
}
