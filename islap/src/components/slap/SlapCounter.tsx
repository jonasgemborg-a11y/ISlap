import React from 'react';

interface SlapCounterProps {
  count: number;
}

export function SlapCounter({ count }: SlapCounterProps) {
  return (
    <div style={{
      fontSize: 80,
      fontWeight: 900,
      color: '#fff',
      lineHeight: 1,
      textShadow: '0 0 30px rgba(255,100,0,0.8)',
    }}>
      {count}
    </div>
  );
}
