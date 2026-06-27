import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'ISlap — The Proximity Slap Game',
  description: 'Challenge players IRL via Bluetooth & GPS. Fight your way through dungeons. Trade loot. Climb the leaderboards.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
