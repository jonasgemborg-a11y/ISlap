import React, { useState } from 'react';
import { CharClass, CLASS_LIST } from '../data/classes';

interface Props {
  onLogin: (heroName: string, heroClass: CharClass) => void;
}

export function LoginScreen({ onLogin }: Props) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharClass>('barbarian');
  const [error, setError] = useState('');

  const cls = CLASS_LIST.find(c => c.id === selectedClass)!;

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) { setError('Name must be at least 2 characters'); return; }
    if (trimmed.length > 16) { setError('Max 16 characters'); return; }
    onLogin(trimmed, selectedClass);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0e0a06',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 28, padding: 24, overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 72, letterSpacing: 8,
          color: '#c9a84c', lineHeight: 1,
          textShadow: '0 0 40px #8b6e1480',
        }}>
          ISLAP
        </div>
        <div style={{ color: '#6a5a48', fontSize: 13, letterSpacing: 4 }}>
          PROXIMITY COMBAT
        </div>
      </div>

      <div style={{
        background: '#1a1410', border: '1px solid #5a3a1a',
        borderRadius: 4, padding: '28px 24px',
        width: '100%', maxWidth: 360,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div style={{ color: '#8a7060', fontSize: 11, letterSpacing: 3 }}>CREATE HERO</div>

        {/* Class grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ color: '#6a5a48', fontSize: 10, letterSpacing: 2 }}>CLASS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {CLASS_LIST.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedClass(c.id)}
                style={{
                  padding: '10px 4px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  background: selectedClass === c.id ? '#2a1e14' : '#0e0a06',
                  border: `1px solid ${selectedClass === c.id ? '#c9a84c' : '#2a1e14'}`,
                  borderRadius: 3, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 9, color: selectedClass === c.id ? '#c9a84c' : '#6a5a48', letterSpacing: 1 }}>
                  {c.label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Selected class description */}
          <div style={{
            background: '#0e0a06', border: '1px solid #2a1e14',
            borderRadius: 3, padding: '10px 12px',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ color: '#c9a84c', fontSize: 12, fontWeight: 700 }}>
              {cls.icon} {cls.label}
            </div>
            <div style={{ color: '#6a5a48', fontSize: 11 }}>{cls.description}</div>
            <div style={{ color: '#8a7060', fontSize: 11, marginTop: 2 }}>
              <span style={{ color: '#c8a020' }}>⚡ {cls.passiveLabel}:</span> {cls.passiveDesc}
            </div>
          </div>
        </div>

        {/* Hero name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ color: '#6a5a48', fontSize: 10, letterSpacing: 2 }}>HERO NAME</div>
          <input
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter your name..."
            maxLength={16}
            autoFocus
            style={{
              background: '#0e0a06', border: '1px solid #5a3a1a',
              color: '#f0e8d8', padding: '12px 14px',
              fontSize: 16, borderRadius: 3, outline: 'none',
              fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
            }}
          />
          {error && <div style={{ color: '#8b2020', fontSize: 11 }}>{error}</div>}
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%', padding: '14px 0',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 4,
            background: name.trim().length >= 2 ? '#7a1a0e' : '#2a1e14',
            color: name.trim().length >= 2 ? '#f0e8d8' : '#4a3a2a',
            border: 'none', borderRadius: 3,
            cursor: name.trim().length >= 2 ? 'pointer' : 'default',
            transition: 'background 0.2s',
          }}
        >
          ENTER THE ARENA
        </button>
      </div>

      <div style={{ color: '#3a2e24', fontSize: 11, letterSpacing: 2 }}>ALL DATA STORED LOCALLY</div>
    </div>
  );
}
