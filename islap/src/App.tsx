import React, { useState } from 'react';
import { SlapArena } from './components/slap/SlapArena';
import { DungeonScreen } from './components/dungeon/DungeonScreen';
import { LoginScreen } from './components/LoginScreen';
import { CharClass, HERO_CLASS_KEY } from './data/classes';

type AppView = 'town' | 'dungeon';

const HERO_NAME_KEY = 'islap_hero_name';

function App() {
  const [heroName, setHeroName] = useState<string | null>(
    () => localStorage.getItem(HERO_NAME_KEY)
  );
  const [view, setView] = useState<AppView>('town');

  const handleLogin = (name: string, heroClass: CharClass) => {
    localStorage.setItem(HERO_NAME_KEY, name);
    localStorage.setItem(HERO_CLASS_KEY, heroClass);
    // Reset profile so class starting stats are applied fresh
    const existing = localStorage.getItem('islap_profile');
    if (!existing) {
      // First time — usePlayerProfile will initialize with correct class
    } else {
      // Patch heroClass onto existing profile without wiping progress
      try {
        const parsed = JSON.parse(existing);
        if (!parsed.heroClass) {
          parsed.heroClass = heroClass;
          localStorage.setItem('islap_profile', JSON.stringify(parsed));
        }
      } catch {}
    }
    setHeroName(name);
  };

  if (!heroName) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (view === 'dungeon') {
    return <DungeonScreen onExitToTown={() => setView('town')} />;
  }

  return <SlapArena onEnterDungeon={() => setView('dungeon')} />;
}

export default App;
