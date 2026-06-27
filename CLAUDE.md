# ISlap Project

## Projektöversikt
ISlap är en proximity-baserad slåssapp. Spelare möter varandra IRL via Bluetooth/GPS och utmanar varandra i slap-dueller. Fungerar även ensam mot bottar.

## Struktur
```
C:\Users\jonas\ISlap\
├── CLAUDE.md
├── islap\          ← Frontend (React + TypeScript), port 3000
│   └── src\
│       ├── App.tsx            ← AppView ('town'|'dungeon'), renderar SlapArena eller DungeonScreen
│       ├── index.tsx
│       ├── index.css          ← HIT!-animation keyframes
│       ├── types\
│       │   ├── game.ts        ← GamePhase, GameResult, PlayerProfile, PlayerStats
│       │   ├── item.ts        ← Item, GearSlotId, SLOT_AFFINITY, ItemStatBonuses
│       │   └── dungeon.ts     ← Dir, RoomState, DungeonLevel, DungeonState, DungeonTheme, TURN_LEFT/RIGHT, DELTA, OPPOSITE, getTheme, THEME_COLORS, THEME_LABEL
│       ├── hooks\
│       │   ├── usePlayerProfile.ts   ← XP, level, stats, gold (localStorage)
│       │   ├── useSwipeDetector.ts   ← swipe-detection via pointer events
│       │   ├── useInventory.ts       ← inventory + gear state (localStorage); exporterar refresh()
│       │   └── useDungeon.ts         ← dungeon-state (localStorage 'islap_dungeon'); generateLevel, moveDir, goBack, clearRoom, descend, ascend, resetDungeon
│       ├── utils\
│       │   ├── stats.ts       ← calcMaxHp, calcAttack, calcDefense, calcTotalStats, generateBot, BotProfile
│       │   └── loot.ts        ← generateLoot → { gold, item? }
│       └── components\
│           ├── slap\
│           │   ├── SlapArena.tsx     ← Huvudkomponent; props: forcedBot?, dungeonDepth?, onDungeonFightEnd?, onEnterDungeon?
│           │   ├── Avatar.tsx        ← Emoji-avatar med slap-animation, tar emoji-prop
│           │   ├── SlapCounter.tsx   ← Slap-räknare
│           │   └── LootScreen.tsx    ← Loot-popup efter vinst
│           ├── progression\
│           │   ├── LevelBadge.tsx    ← LVL + XP-bar + vinster/förluster
│           │   └── StatScreen.tsx    ← Popup för att fördela stat-poäng
│           ├── character\
│           │   ├── CharacterScreen.tsx  ← Helsidesskärm: stats, HP, guld, attack/def, gear, inventory
│           │   ├── GearSlots.tsx        ← D2R-inspirerad gear-layout (10 slots + avatar i mitten)
│           │   ├── Inventory.tsx        ← 4×5 inventory-grid
│           │   └── ItemPopup.tsx        ← Item-detaljer + utrusta/ta av/sälj
│           └── dungeon\
│               ├── DungeonScreen.tsx ← Orkestrator: phase ('room'|'fighting'), instansierar usePlayerProfile + useInventory för CharacterScreen
│               ├── RoomView.tsx      ← Rumsillustration (SVG), dörrknappar (LEFT/FORWARD/RIGHT), FIGHT-knapp, MAP/👤-knappar i topbar
│               └── DungeonMap.tsx    ← 5×5 minimap med temafarger, trappikoner, nuvarande position
└── server\
    └── ISlap\      ← .NET Web API (ej påbörjad)
```

## Spelmekanik
- **HP-baserat** (ej tid): båda börjar med HP, första till 0 förlorar
- Spelaren swipar fram och tillbaka över motståndarens avatar → varje riktningsbyte = 1 slap = 5 damage
- Boten attackerar automatiskt med intervall och damage baserat på sin level
- 3-2-1 countdown visar motståndarens avatar, level, HP, attack/s och damage

## Progression
- **XP**: vinst = botLevel×10 (min 25), förlust = botLevel×2 (min 10)
- **Level**: 1 stat-poäng per level-up
- **Stats** (allokerbara, inga caps): Snabbhet, Styrka, Uthållighet, Reflexer
- **HP**: 100 + level×10 + uthållighet×2
- **Attack**: 10 + styrka×5 + snabbhet×2 + gear-bonusar
- **Försvar**: 10 + uthållighet×5 + reflexer×2 + gear-bonusar
- **Gold**: Slapennys, tjänas via loot och item-försäljning (5 Slapennys/item just nu)

## Bot-system
- Level: spelarens level ±5 (min 1)
- Stats: slumpmässigt fördelade poäng (level-1 st)
- HP: samma formel som spelaren (100 + level×10 + uthållighet×2)
- Attack-intervall: max(400, 1200 - level×25) ms
- Damage: ceil(5 + level×0.4)
- Avatar: emoji baserat på level-tier (😐 → 😠 → 👹 → 💀 → 🔥)

## Loot (endast vid vinst)
- Guld: random mellan botLevel×2 och botLevel×5
- Item: 50% chans, slumpad slot-typ
- Item-stats: 1–4 rolls beroende på botLevel (1 vid ≤5, 4 vid >15)
- Rolls kan ge attackBonus, defenseBonus, eller statBonuses (snabbhet/styrka/uthållighet/reflexer)
- Stat-chans ökar med botLevel: min(0.7, 0.2 + botLevel×0.02)

## Item-system
- 10 gear-slots: helm, armor, amulet, hand_l, hand_r, ring_l, ring_r, gloves, belt, boots
- SLOT_AFFINITY: hand_l/hand_r=attack, helm/armor/gloves/boots/belt=defense, amulet/ring=both
- Items har: attackBonus?, defenseBonus?, statBonuses?
- Sälj för 5 Slapennys (fast pris just nu)
- useInventory hanterar ALLT inventory-state — instansieras ENDAST i SlapArena, skickas som props till CharacterScreen

## Dungeon crawler
- **99 nivåer** (Diablo 1-inspirerat): Cathedral 1–24, Catacombs 25–49, Caves 50–74, Hell 75–99
- **5×5 rumsrutnät** per nivå, genereras procedurellt med `generateLevel(depth, entryPos?)`
- **Navigation**: relativt `facingDir` — LEFT/FORWARD/RIGHT + BACK-pil; `availableDoors()` utesluter cameFrom-riktning och ut-ur-gräns
- **Monster**: varje rum har monster tills `cleared`; monster level = depth ± 1
- **Trappor**: stairsUp alltid i startrummet (entryPos), stairsDown slumpmässigt placerat; descend skapar ny nivå, ascend vid depth=1 → town
- **Fight-flöde**: DungeonScreen sätter `phase='fighting'`, renderar SlapArena med `forcedBot`; efter fight → `handleFightEnd` → `clearRoom()` + `refreshInventory()`
- **Loot-timing**: `onDungeonFightEnd` anropas INTE i `endGame` utan på "← Back to Dungeon"-knappen, så loot-skärmen visas fullständigt innan dungeon-state återupptas
- **Town = startskärmen** (SlapArena idle): shops m.m. ska byggas ut här senare

## D2-stat system
- **Attribut**: Strength / Dexterity / Vitality / Energy (D2 Barbarian-start: 30/20/25/10)
- **5 stat-poäng per level-up** (D2-standard)
- **HP** = 55 + (level-1)×2 + vitality×4 + gear life-bonusar
- **Damage** = weapon base × (1 + ED%/100 + STR/100), rullas per slap
- **Defense** = summa armor × (1 + ED%/100) + flatDef + DEX×0.25
- **Attack Rating** = DEX×5 + gear AR-bonusar
- **Hit Chance** = min(95%, max(5%, 2×AR / (AR + targetDef))) — D2-formeln
- **Bots** har `defense` och `attackRating` som skalas med level (×15 och ×20)
- **DR%** (Damage Reduced) från gear reducerar inkommande skada, cap 50%
- **Life Steal** — helar spelaren för % av utdelad skada

## D2 Item System
- **Kvaliteter**: Normal (vit) / Magic (blå) / Rare (gul) / Unique (brun) — inga sets/runewords än
- **iLvl** = bot-level; affix-pool filtreras på `minALvl <= iLvl`
- **Magic**: 0–1 prefix + 0–1 suffix (minst ett)
- **Rare**: 2–3 prefix + 2–3 suffix, inga dubbla grupper, random namn från rare-namnstabeller
- **Unique**: fasta `uniqueMods: StatMod[]` per item, `uniqueName` visas istället för base-namn
- **Required Level** = max(base reqLevel, max affix minALvl)
- **Affix-grupper** förhindrar dubbla bonusar (t.ex. två olika +life-affixes)
- Datafiler: `src/data/bases.ts` (base items), `src/data/affixes.ts` (prefix/suffix-tabeller), `src/data/uniques.ts` (~50 ikoniska D2 uniques)

## Viktigt: State-arkitektur
- `useInventory` INSTANSIERAS PÅ TVÅ STÄLLEN (SlapArena + DungeonScreen) — detta är ett medvetet undantag för CharacterScreen i dungeon. DungeonScreen anropar `refresh()` efter varje fight för att synka med SlapArenas skrivningar till localStorage.
- `usePlayerProfile` anropas i SlapArena OCH DungeonScreen (samma localStorage-nyckel, inga konflikter eftersom bara läsning sker i DungeonScreen)
- Dungeon-state sparas i `localStorage['islap_dungeon']`
- All state sparas i localStorage

## Starta lokalt
1. Kör `npm start` i `C:\Users\jonas\ISlap\islap`
2. Appen finns på http://localhost:3000 (eller 3001 om D4AH körs)
3. Backend ej påbörjad — allt är localStorage just nu

## Nästa steg (planerat)
- [ ] Town-skärmen: NPC-butiker (smed, healare, häxa) istället för bara SlapArena idle
- [ ] Rumsvariation: inte varje rum ska ha monster (tomma rum, skattkammare, osv.)
- [ ] Spelaren-stats påverkar faktisk damage (Styrka → mer damage per slap)
- [ ] Shop i town där man kan köpa items för Slapennys
- [ ] Item-värden baserade på faktiska stats (inte fast 5)
- [ ] Diminishing returns på stats
- [ ] Backend + databas för persistent state
- [ ] Proximity/Bluetooth för riktiga spelare
- [ ] Skins & monetisering
