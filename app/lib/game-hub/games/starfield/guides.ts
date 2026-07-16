import type { FaqItem, BeginnerGuide } from '@/app/lib/game-hub/types';

// Sources: FinalBoss's own current (2026) Starfield guides + UESP (the reference
// Bethesda wiki) + IGDB. FAQ answers are grounded in these, not base-game memory.
const FB_BUILDS = 'https://finalboss.io/starfield-best-builds-in-2026-5-meta-setups';
const FB_WEAPONS = 'https://finalboss.io/starfield-best-weapons-after-free-lanes-superior-exceptional';
const FB_SHIPS = 'https://finalboss.io/starfield-best-ships-in-2026-after-free-lanes';
const FB_NGPLUS = 'https://finalboss.io/starfield-how-to-master-new-game-plus-in';
const FB_TERRAN = 'https://finalboss.io/starfield-terran-armada-dlc-complete-overview-whats-new';
const FB_PS5 = 'https://finalboss.io/starfield-best-ps5-settings-guide-graphics-hdr-controls';
const UESP = 'https://en.uesp.net/wiki/Starfield';
const IGDB = 'https://www.igdb.com/games/starfield';

export const FAQ: FaqItem[] = [
  {
    question: 'Is Starfield on PS5?',
    answer:
      'Yes. Starfield originally launched on PC and Xbox Series X|S in September 2023 and later came to PlayStation 5 in 2026. The PS5 port had a rocky launch that Bethesda followed with hotfixes, so check the recommended PS5 settings for the smoothest experience.',
    sources: [FB_PS5, IGDB],
  },
  {
    question: 'What are the best weapons in Starfield in 2026?',
    answer:
      'After the Free Lanes update the meta favours high-tier ballistic and particle weapons with Superior/Exceptional and X-Tech qualities. Rerolling for the right damage type and quality matters more than the base gun. See the full current tier list for the top picks.',
    sources: [FB_WEAPONS],
  },
  {
    question: 'What is the best build in Starfield?',
    answer:
      'There is no single best build — the current meta centres on a handful of setups (stealth-sniper, combat-tank, ship-combat, outpost-industrialist and a Starborn power build), each pairing a starting Background and Traits with a focused skill path. See the five meta setups for details.',
    sources: [FB_BUILDS],
  },
  {
    question: 'How does New Game Plus work in Starfield?',
    answer:
      'Completing the main story takes your character through the Unity into New Game Plus, resetting the world and quests but keeping your level, skills and Starborn Powers — which rank up each cycle. There are roughly ten rare NG+ variations of the Unity to discover across runs.',
    sources: [FB_NGPLUS, UESP],
  },
  {
    question: 'What is Terran Armada?',
    answer:
      "Terran Armada is Starfield's second major expansion (\"Expansion 2\"), adding new endgame content, ship parts and builds on top of the earlier Shattered Space story DLC. It reshaped parts of the 2026 ship and gear meta.",
    sources: [FB_TERRAN],
  },
  {
    question: 'Can you romance companions in Starfield?',
    answer:
      'Yes. The four main Constellation companions — Sarah Morgan, Sam Coe, Barrett and Andreja — are romanceable through repeated approval and their personal quests. Other followers (Vasco, hireable crew) can join your ship but are not romance options.',
    sources: [UESP],
  },
  {
    question: 'How many planets are in Starfield?',
    answer:
      'Starfield features over 1,000 planets and moons across roughly 100 star systems in the Settled Systems, a mix of hand-crafted locations and procedurally generated surfaces you can land on, survey and build outposts on.',
    sources: [IGDB, UESP],
  },
];

export const BEGINNER: BeginnerGuide = {
  summary:
    'Starfield front-loads two choices that shape your whole run — your Background (which grants three starting skills) and your Traits. Pick to match how you want to play, then invest early skill points in the fundamentals below before specialising.',
  picks: [
    {
      name: 'Background: Bounty Hunter or Combat-focused start',
      note: 'Combat-leaning Backgrounds give early Ballistics/Boost Pack/piloting skills that carry both on-foot and in ship fights — the most universally useful opening for a first run.',
      sources: [FB_BUILDS, UESP],
    },
    {
      name: 'Early skill: Boost Pack Training',
      note: 'A Physical-tree staple — unlocks jetpack use and is one of the highest-impact quality-of-life and combat mobility skills in the early game.',
      sources: [UESP],
    },
    {
      name: 'Early skill: Weight Lifting + Ballistics/Pistol Certification',
      note: 'More carry capacity plus a damage skill for your main weapon type keeps you effective while you learn the systems.',
      sources: [FB_BUILDS, UESP],
    },
    {
      name: 'Do a few faction questlines',
      note: 'The UC Vanguard, Freestar Rangers, Crimson Fleet and Ryujin questlines are among the best content and reward strong gear, credits and companions.',
      sources: [UESP],
    },
  ],
};
