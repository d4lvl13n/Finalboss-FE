import type { ClassRecord } from '@/app/lib/game-hub/types';

// Grand Theft Auto VI confirmed cast. open_world characters carry no meta —
// only slug/name/role/sources plus a PRE-LAUNCH overview drawn from officially
// confirmed Rockstar material (trailers + character bios). GTA VI is UNRELEASED
// (launches Nov 19, 2026); no gameplay exists, so there are no builds, tiers,
// stats, or strengths/weaknesses here. Every entry is a Rockstar-named
// character with at least two sources (cite-or-drop).
export const CHARACTERS: ClassRecord[] = [
  {
    slug: 'lucia-caminos',
    name: 'Lucia Caminos',
    role: 'Playable protagonist',
    overview:
      "Lucia Caminos is one of GTA VI's two playable protagonists and the mainline series' first non-optional female lead. Rockstar's official bio establishes that she learned to defend herself young, faced constant hardship protecting her family, and served time at Leonida Penitentiary before her release. Fresh out of prison and determined to shift the odds in her favor, she becomes Jason's partner in crime.",
    coreMechanic:
      'One half of the confirmed dual-protagonist structure: Lucia and Jason are a criminal couple whose relationship is central to the story, and Rockstar has confirmed the game lets players play as both leads.',
    sources: [
      'https://www.cbsnews.com/news/gta-6-trailer-2-release-grand-theft-auto-rockstar-vice-city/',
      'https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI',
      'https://www.gtaboom.com/gta-6-characters-d04f',
      'https://thegamepost.com/grand-theft-auto-6-full-characters-list-bios-roles-explained/',
    ],
  },
  {
    slug: 'jason-duval',
    name: 'Jason Duval',
    role: 'Playable protagonist',
    overview:
      "Jason Duval is one of GTA VI's two playable protagonists and Lucia's partner. Per Rockstar's official bio, he was raised around con artists and criminals, served in the military to escape his troubled youth, and afterward ended up in the Leonida Keys working for local drug runners. He aspires to a simpler life, but his environment keeps pulling him back into crime.",
    coreMechanic:
      'One half of the confirmed dual-protagonist structure: Jason and Lucia are a criminal couple at the heart of the story, and Rockstar has confirmed players can play as both leads.',
    sources: [
      'https://www.cbsnews.com/news/gta-6-trailer-2-release-grand-theft-auto-rockstar-vice-city/',
      'https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI',
      'https://thegamepost.com/grand-theft-auto-6-full-characters-list-bios-roles-explained/',
      'https://gta.fandom.com/wiki/Jason_Duval',
    ],
  },
  {
    slug: 'cal-hampton',
    name: 'Cal Hampton',
    role: 'Supporting character',
    overview:
      "Cal Hampton is Jason's paranoid friend and an associate of drug runner Brian Heder. Rockstar's official material paints him as preferring a low-profile, stay-at-home lifestyle — listening in on Coast Guard communications, drinking, and browsing online — his casual paranoia contrasting with Jason's larger ambitions.",
    sources: [
      'https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI',
      'https://thegamepost.com/grand-theft-auto-6-full-characters-list-bios-roles-explained/',
      'https://www.gtaboom.com/gta-6-characters-d04f',
    ],
  },
  {
    slug: 'boobie-ike',
    name: 'Boobie Ike',
    role: 'Supporting character',
    overview:
      "Boobie Ike is a Vice City business and music-industry figure, described in Rockstar's official material as a local legend who turned street experience into an empire spanning real estate, strip clubs, and a recording studio. A major player in the city's rap scene, he co-owns the record label Only Raw Records with Dre'Quan Priest.",
    sources: [
      'https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI',
      'https://thegamepost.com/grand-theft-auto-6-full-characters-list-bios-roles-explained/',
      'https://www.gtaboom.com/gta-6-characters-d04f',
    ],
  },
  {
    slug: 'drequan-priest',
    name: "Dre'Quan Priest",
    role: 'Supporting character',
    overview:
      "Dre'Quan Priest is an aspiring music mogul and entrepreneur who, per Rockstar's official material, co-owns the record label Only Raw Records with Boobie Ike. Official summaries frame him as looking to move away from dealing and deeper into music and business, using the label as his path forward.",
    sources: [
      'https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI',
      'https://thegamepost.com/grand-theft-auto-6-full-characters-list-bios-roles-explained/',
      'https://www.gtaboom.com/gta-6-characters-d04f',
    ],
  },
  {
    slug: 'real-dimez',
    name: 'Real Dimez (Bae-Luxe and Roxy)',
    role: 'Supporting characters',
    overview:
      "Real Dimez is a two-person rap and social-media duo made up of Bae-Luxe and Roxy. Rockstar's official material identifies them as viral online personalities signed to Boobie Ike and Dre'Quan Priest's label, Only Raw Records, tying them into Vice City's contemporary rap scene.",
    sources: [
      'https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI',
      'https://thegamepost.com/grand-theft-auto-6-full-characters-list-bios-roles-explained/',
      'https://www.gtaboom.com/gta-6-characters-d04f',
    ],
  },
  {
    slug: 'raul-bautista',
    name: 'Raul Bautista',
    role: 'Supporting character',
    overview:
      "Raul Bautista is a seasoned bank robber with a storied criminal record. Outlets citing Rockstar's official material position him as a veteran planner behind major robberies in the Leonida underworld.",
    sources: [
      'https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI',
      'https://thegamepost.com/grand-theft-auto-6-full-characters-list-bios-roles-explained/',
      'https://www.gtaboom.com/gta-6-characters-d04f',
    ],
  },
];
