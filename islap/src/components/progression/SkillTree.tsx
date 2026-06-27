import React, { useState } from 'react';
import { PlayerProfile } from '../../types/game';
import { ALL_SKILLS, TREE_NAMES, TREE_ICONS, AllocatedSkills } from '../../data/skills';

interface Props {
  profile: PlayerProfile;
  allocated: AllocatedSkills;
  onAllocate: (skillId: string) => boolean;
  onClose: () => void;
}

export function SkillTree({ profile, allocated, onAllocate, onClose }: Props) {
  const heroClass = profile.heroClass ?? 'barbarian';
  const [activeTree, setActiveTree] = useState(0);
  const [flashId, setFlashId] = useState<string | null>(null);

  const treeNames = TREE_NAMES[heroClass];
  const treeIcons = TREE_ICONS[heroClass];
  const skillPoints = profile.skillPoints ?? 0;

  const classSkills = ALL_SKILLS.filter(s => s.classId === heroClass);
  const treeSkills  = classSkills.filter(s => s.tree === activeTree);
  const tiers       = [0, 1, 2] as const;

  const canAllocate = (skillId: string): boolean => {
    const def = classSkills.find(s => s.id === skillId)!;
    if (skillPoints <= 0) return false;
    if ((allocated[skillId] ?? 0) >= def.maxLevel) return false;
    if (def.prereqId && (allocated[def.prereqId] ?? 0) < 1) return false;
    return true;
  };

  const handleClick = (skillId: string) => {
    if (!canAllocate(skillId)) return;
    const ok = onAllocate(skillId);
    if (ok) { setFlashId(skillId); setTimeout(() => setFlashId(null), 300); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0a0806',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        width: '100%', maxWidth: 400,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 20px 0',
      }}>
        <div>
          <div style={{ color: '#8a7060', fontSize: 11, letterSpacing: 3 }}>SKILL TREE</div>
          <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 700 }}>
            {skillPoints} point{skillPoints !== 1 ? 's' : ''} available
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8a7060', fontSize: 22, cursor: 'pointer' }}>✕</button>
      </div>

      {/* Tree tabs */}
      <div style={{
        display: 'flex', gap: 0, marginTop: 16,
        width: '100%', maxWidth: 400,
        borderBottom: '1px solid #2a1e14',
      }}>
        {treeNames.map((name, i) => (
          <button
            key={i}
            onClick={() => setActiveTree(i)}
            style={{
              flex: 1, padding: '10px 4px',
              background: activeTree === i ? '#1a1410' : 'transparent',
              border: 'none',
              borderBottom: activeTree === i ? '2px solid #c9a84c' : '2px solid transparent',
              color: activeTree === i ? '#c9a84c' : '#6a5a48',
              fontSize: 10, letterSpacing: 1, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}
          >
            <span style={{ fontSize: 18 }}>{treeIcons[i]}</span>
            <span>{name.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Skill tiers */}
      <div style={{
        width: '100%', maxWidth: 400,
        padding: '24px 20px 60px',
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        {tiers.map(tier => {
          const skill = treeSkills.find(s => s.tier === tier);
          if (!skill) return null;

          const level     = allocated[skill.id] ?? 0;
          const maxed     = level >= skill.maxLevel;
          const unlocked  = !skill.prereqId || (allocated[skill.prereqId] ?? 0) >= 1;
          const canAdd    = canAllocate(skill.id);
          const isFlash   = flashId === skill.id;

          const prereqSkill = skill.prereqId ? classSkills.find(s => s.id === skill.prereqId) : null;

          return (
            <div key={skill.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Connector line from previous tier */}
              {tier > 0 && (
                <div style={{
                  width: 2, height: 28,
                  background: unlocked ? '#5a3a1a' : '#2a1e14',
                  transition: 'background 0.3s',
                }} />
              )}

              {/* Skill card */}
              <div
                onClick={() => handleClick(skill.id)}
                style={{
                  width: '100%',
                  background: isFlash ? '#2a2000' : unlocked ? '#1e1810' : '#141008',
                  border: `1px solid ${isFlash ? '#c9a84c' : maxed ? '#c9a84c' : unlocked && canAdd ? '#8b6e14' : '#3a2a18'}`,
                  borderRadius: 4,
                  padding: '14px 16px',
                  cursor: unlocked && canAdd ? 'pointer' : 'default',
                  opacity: unlocked ? 1 : 0.5,
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 4,
                  background: '#0e0a06',
                  border: `1px solid ${level > 0 ? '#c9a84c' : '#3a2a18'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, flexShrink: 0,
                  boxShadow: level > 0 ? '0 0 10px #8b6e1460' : 'none',
                }}>
                  {skill.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <span style={{
                      color: level > 0 ? '#f0e8d8' : unlocked ? '#c0b090' : '#6a5a48',
                      fontSize: 13, fontWeight: 700, letterSpacing: 1,
                    }}>
                      {skill.name}
                    </span>
                    <span style={{
                      color: maxed ? '#c9a84c' : level > 0 ? '#c9a84c' : '#8a7060',
                      fontSize: 11, flexShrink: 0,
                    }}>
                      {level}/{skill.maxLevel}
                    </span>
                  </div>

                  {/* Pip bar */}
                  <div style={{ display: 'flex', gap: 2, marginTop: 5, flexWrap: 'wrap' }}>
                    {Array.from({ length: Math.min(skill.maxLevel, 20) }, (_, i) => (
                      <div key={i} style={{
                        width: `calc(${100 / Math.min(skill.maxLevel, 20)}% - 2px)`,
                        height: 4, borderRadius: 1,
                        background: i < level ? '#c9a84c' : '#3a2a18',
                        transition: 'background 0.2s',
                        minWidth: 6,
                      }} />
                    ))}
                  </div>

                  {/* Description */}
                  <div style={{ color: unlocked ? '#a09070' : '#6a5a48', fontSize: 10, marginTop: 5, lineHeight: 1.4 }}>
                    {unlocked
                      ? skill.desc(Math.max(1, level))
                      : prereqSkill
                        ? `Requires 1 point in ${prereqSkill.name}`
                        : 'Locked'}
                  </div>
                </div>

                {/* Allocate button */}
                {canAdd && (
                  <div style={{
                    width: 28, height: 28, borderRadius: 2,
                    background: '#7a1a0e', color: '#f0e8d8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 900, flexShrink: 0,
                    boxShadow: '0 2px 0 #3d0c06',
                  }}>
                    +
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
