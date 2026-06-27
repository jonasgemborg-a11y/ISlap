import styles from '@/styles/hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>The Proximity Slap Game</p>
        <h1 className={styles.title}>ISlap</h1>
        <div className={styles.divider} />
        <p className={styles.subtitle}>
          Meet thy enemies in the flesh. Challenge them to mortal combat.<br />
          Slap thy way to glory — or die trying.
        </p>
        <div className={styles.actions}>
          <button className={styles.btnPrimary}>Enter the Arena</button>
          <a href="/wiki" className={styles.btnSecondary}>Read the Lore</a>
        </div>
      </div>
      <span className={styles.scroll}>▼ Scroll ▼</span>
    </section>
  );
}
