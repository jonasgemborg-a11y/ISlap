import React, { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
}

// Fake nearby players for UI preview
const FAKE_NEARBY = [
  { name: 'SlapKing', level: 12, distance: 42, class: '⚔️' },
  { name: 'IceWitch', level: 8,  distance: 87, class: '🔥' },
  { name: 'BoneRaiser', level: 15, distance: 134, class: '💀' },
];

export function ExploreScreen({ onClose }: Props) {
  const [scanning, setScanning] = useState(false);
  const [scanDots, setScanDots] = useState(0);

  useEffect(() => {
    if (!scanning) return;
    const t = setInterval(() => setScanDots(d => (d + 1) % 4), 500);
    return () => clearInterval(t);
  }, [scanning]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#060a08',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: 20, right: 20,
        background: 'none', border: 'none', color: '#4a6a58', fontSize: 22, cursor: 'pointer',
        zIndex: 10,
      }}>✕</button>

      {/* Map radar */}
      <div style={{ marginTop: 48, position: 'relative', width: 220, height: 220, flexShrink: 0 }}>
        {/* Radar rings */}
        {[1, 0.67, 0.33].map((scale, i) => (
          <div key={i} style={{
            position: 'absolute',
            inset: `${(1 - scale) * 50}%`,
            border: '1px solid #1a3a28',
            borderRadius: '50%',
          }}/>
        ))}
        {/* Sweep line */}
        {scanning && (
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              width: '50%', height: '50%',
              top: '50%', left: '50%',
              transformOrigin: '0% 0%',
              background: 'linear-gradient(135deg, #1a4a2880 0%, transparent 70%)',
              animation: 'radar-sweep 2s linear infinite',
            }}/>
          </div>
        )}
        {/* Cardinal lines */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', height: 1, background: '#1a3a28' }}/>
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ height: '100%', width: 1, background: '#1a3a28' }}/>
        </div>
        {/* Center dot (you) */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 12, height: 12, borderRadius: '50%',
          background: '#3a8060',
          boxShadow: '0 0 10px #3a806080',
        }}/>
        {/* Fake nearby blips */}
        {scanning && FAKE_NEARBY.map((p, i) => {
          const angle = [30, 130, 250][i] * (Math.PI / 180);
          const r = [0.28, 0.55, 0.78][i];
          const x = 50 + r * 50 * Math.cos(angle);
          const y = 50 + r * 50 * Math.sin(angle);
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              width: 10, height: 10, borderRadius: '50%',
              background: '#8b2020',
              boxShadow: '0 0 8px #8b202080',
              animation: `blip-pulse 1.5s ease-in-out ${i * 0.4}s infinite`,
            }}/>
          );
        })}
        {/* Distance rings labels */}
        <div style={{ position: 'absolute', top: '4%', left: '52%', color: '#1a4a30', fontSize: 9 }}>50m</div>
        <div style={{ position: 'absolute', top: '20%', left: '52%', color: '#1a4a30', fontSize: 9 }}>100m</div>
        <div style={{ position: 'absolute', top: '36%', left: '52%', color: '#1a4a30', fontSize: 9 }}>150m</div>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 44, letterSpacing: 6, color: '#3a8060', lineHeight: 1,
        }}>EXPLORE</div>
        <div style={{ color: '#2a5a40', fontSize: 11, letterSpacing: 3 }}>GPS PROXIMITY COMBAT</div>
      </div>

      {/* Scan button */}
      <button
        onClick={() => setScanning(s => !s)}
        style={{
          marginTop: 20,
          padding: '12px 36px',
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 4,
          background: scanning ? '#1a3a28' : '#0e2018',
          color: scanning ? '#3a8060' : '#2a5a40',
          border: `1px solid ${scanning ? '#3a8060' : '#1a3a28'}`,
          borderRadius: 3, cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {scanning ? `SCANNING${'...'.slice(0, scanDots)}` : 'START SCAN'}
      </button>

      {/* Coming soon / nearby list */}
      <div style={{
        width: '100%', maxWidth: 340,
        padding: '20px 20px 60px',
        display: 'flex', flexDirection: 'column', gap: 10,
        marginTop: 8,
      }}>
        {scanning ? (
          <>
            <div style={{ color: '#2a5a40', fontSize: 10, letterSpacing: 3, marginBottom: 4 }}>
              NEARBY PLAYERS (DEMO)
            </div>
            {FAKE_NEARBY.map((p, i) => (
              <div key={i} style={{
                background: '#0a1410', border: '1px solid #1a3a28',
                borderRadius: 3, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: 0.5,
              }}>
                <div style={{ fontSize: 24 }}>{p.class}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#4a8060', fontSize: 13, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ color: '#2a5a40', fontSize: 10 }}>LVL {p.level} · {p.distance}m away</div>
                </div>
                <div style={{
                  padding: '4px 10px', border: '1px solid #1a3a28',
                  borderRadius: 2, color: '#2a5a40', fontSize: 10, letterSpacing: 1,
                }}>
                  CHALLENGE
                </div>
              </div>
            ))}
            <div style={{
              background: '#0a1410', border: '1px solid #1a3a28',
              borderRadius: 3, padding: '16px',
              textAlign: 'center', marginTop: 8,
            }}>
              <div style={{ color: '#3a6048', fontSize: 11, letterSpacing: 1 }}>🚧 GPS + Bluetooth required</div>
              <div style={{ color: '#1a3a28', fontSize: 10, marginTop: 4 }}>Real matchmaking coming in a future update</div>
            </div>
          </>
        ) : (
          <div style={{
            background: '#0a1410', border: '1px solid #1a3a28',
            borderRadius: 3, padding: '20px', textAlign: 'center',
          }}>
            <div style={{ color: '#2a5a40', fontSize: 13, marginBottom: 8 }}>
              Walk around the real world and challenge players you pass by.
            </div>
            <div style={{ color: '#1a3a28', fontSize: 11, lineHeight: 1.6 }}>
              Requires location access & Bluetooth. Battles happen in real time when two players are within 50m of each other.
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes blip-pulse {
          0%, 100% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 0.4; transform: translate(-50%,-50%) scale(1.6); }
        }
      `}</style>
    </div>
  );
}
