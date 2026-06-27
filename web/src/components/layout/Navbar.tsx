'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/navbar.module.css';

const NAV_LINKS = [
  { href: '/',            label: 'Home' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/wiki',        label: 'Wiki' },
  { href: '/forum',       label: 'Forum' },
  { href: '/auction',     label: 'Auction House' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <span className={styles.logo}>ISLAP</span>
        <ul className={styles.links}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={pathname === href ? styles.active : ''}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <button className={styles.cta}>Play Now</button>
      </div>
    </nav>
  );
}
