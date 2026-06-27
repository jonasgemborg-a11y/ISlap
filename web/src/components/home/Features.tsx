import styles from '@/styles/features.module.css';

const FEATURES = [
  {
    icon: '⚔️',
    title: 'Proximity Duels',
    desc: 'Challenge real players nearby via Bluetooth & GPS. Face them IRL in real-time slap battles to the death.',
  },
  {
    icon: '🏰',
    title: 'Dungeon Crawler',
    desc: '99 levels of procedurally generated dungeons. Cathedral, Catacombs, Caves, Hell — inspired by the depths of Diablo.',
  },
  {
    icon: '🎒',
    title: 'Deep Item System',
    desc: 'Normal, Magic, Rare and Unique items with deadly affixes. Arm thyself across 10 equipment slots.',
  },
  {
    icon: '⚡',
    title: 'Class Skills',
    desc: 'Six unique classes — Barbarian, Sorceress, Paladin, Druid, Necromancer, Amazon — each with a full skill tree.',
  },
  {
    icon: '🤝',
    title: 'Trading Ground',
    desc: 'Barter with other warriors. Find that perfect rare drop and trade it for something worthy of thy legend.',
  },
  {
    icon: '💀',
    title: 'Leaderboards',
    desc: 'Thy deeds shall be recorded in blood. Climb the rankings. Season resets keep the slaughter eternal.',
  },
];

export function Features() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>What Awaits Thee</h2>
      <p className={styles.headingSub}>— Six pillars of carnage —</p>
      <div className={styles.grid}>
        {FEATURES.map(({ icon, title, desc }) => (
          <div key={title} className={styles.card}>
            <span className={styles.icon}>{icon}</span>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDesc}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
