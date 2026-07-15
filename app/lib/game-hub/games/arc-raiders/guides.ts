import type { FaqItem, BeginnerGuide } from '@/app/lib/game-hub/types';

const WEAPONS = 'https://arc-raiders.fandom.com/wiki/Weapons';
const SHIELDS = 'https://arc-raiders.fandom.com/wiki/Shields';
const AUGMENTS = 'https://arc-raiders.fandom.com/wiki/Augments';
const GADGETS = 'https://arc-raiders.fandom.com/wiki/Gadgets';
const ARC = 'https://arc-raiders.fandom.com/wiki/ARC';

export const FAQ: FaqItem[] = [
  {
    question: 'Is ARC Raiders crossplay?',
    answer:
      'Yes — ARC Raiders supports crossplay across PC, PlayStation 5 and Xbox Series X|S, and you can squad up in duos or trios across platforms. (Highest-volume community question at ~18K/mo.)',
    sources: [
      "sem question keyword 'is arc raiders crossplay' 18.1K",
      'IGDB platforms: PC, PS5, Xbox Series X|S',
      "GPBot item 'You CAN Squad Up Anywhere in Arc Raiders – Here's How Crossplay & Duos Really Work'",
    ],
  },
  {
    question: 'What is ARC Raiders?',
    answer:
      'A third-person PvPvE extraction shooter by Embark Studios where you scavenge the surface Rust Belt for loot, fight robotic ARC machines and rival Raiders, and extract before losing your haul. Released October 30, 2025.',
    sources: ['IGDB game 185258', 'https://arc-raiders.fandom.com/wiki/Maps'],
  },
  {
    question: 'What are the best weapons in ARC Raiders?',
    answer:
      'For raw ARC-killing power the Legendary energy weapons stand out — the Equalizer (Very Strong armor penetration) and Aphelion/Jupiter — while heavy-ammo guns like the Ferro (a cheap Common) and Bettina reliably crack armored machines. For PvP, well-rounded automatics like the Tempest and close-range Bobcat/Vulcano are favored.',
    sources: [WEAPONS, "sem keyword 'arc raiders best weapons' 1.0K / 'best pvp weapons' 480"],
  },
  {
    question: 'Which map has the most Bastions?',
    answer:
      'Bastions are heavily armored minigun ARC that spawn on the larger surface maps; players specifically track which rotation has the most (a ~1.3K/mo question), so a Bastion-spawn map guide is a high-intent module.',
    sources: ["sem question 'which map has the most bastion arc raiders' 1.3K", ARC],
  },
  {
    question: 'How do shields work?',
    answer:
      'Shields deflect a percentage of incoming damage rather than adding HP, so you can still be downed with shield remaining. Light gives 40% mitigation at no movement penalty; Heavy gives 52.5% but a 15% slow. Recharge them with Shield Rechargers or ARC PowerCells dropped by machines.',
    sources: [SHIELDS],
  },
  {
    question: 'Which maps does the Leaper spawn on?',
    answer:
      'The Leaper is a large armored jumping ARC; its spawn maps are a frequent community question (~720/mo), making a per-map ARC spawn table valuable. Fight it with heavy ammo and dodge its shockwave.',
    sources: ["sem question 'what maps does leaper spawn on in arc raiders' 720", ARC],
  },
];

export const BEGINNER: BeginnerGuide = {
  summary:
    'New Raiders should treat every run as risk-vs-reward: bring cheap gear you can afford to lose, learn ARC alert states (keep machines White/Blue by managing noise and line of sight), carry heavy ammo or an energy weapon for armored ARC, and prioritize reaching an Extraction Point over greedy looting. Your free kit already includes a Light Shield, so early deaths cost little — use them to learn map layouts and extraction points.',
  picks: [
    {
      name: 'Ferro (Common Break-Action)',
      note: 'Cheap Common with Strong ARC armor penetration and ~40 base body damage — an affordable way to crack armored machines while learning the game.',
      sources: [WEAPONS, SHIELDS],
    },
    {
      name: 'Light Shield',
      note: 'Free with every starter kit; 40% damage mitigation with zero movement penalty and trivial repair cost (4x Plastic Parts).',
      sources: [SHIELDS],
    },
    {
      name: 'Looting MK.1 / MK.2 augment',
      note: 'More backpack slots and weight capacity so a survived run pays off; MK.2 also auto-shakes off Ticks.',
      sources: [AUGMENTS],
    },
    {
      name: 'Barricade Kit',
      note: 'Deployable 500-HP cover that gives you instant protection in open ARC or PvP fights and can be recovered.',
      sources: [GADGETS],
    },
    {
      name: 'Aim for scanner beams / weak points',
      note: 'Watch ARC scanner colors and target unarmored capsules (e.g. Sentinel arm capsule); loot ARC PowerCells to refill shields mid-run.',
      sources: [ARC],
    },
  ],
};
