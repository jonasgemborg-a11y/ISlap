import React from 'react';

interface AvatarProps {
  slapped: boolean;
  emoji?: string;
}

export function Avatar({ slapped, emoji = '😐' }: AvatarProps) {
  return (
    <div style={{
      fontSize: 120,
      userSelect: 'none',
      transition: 'transform 0.05s ease',
      transform: slapped ? 'rotate(-15deg) translateX(-20px)' : 'rotate(0deg) translateX(0px)',
      filter: slapped ? 'brightness(1.4)' : 'brightness(1)',
    }}>
      {emoji}
    </div>
  );
}
