import type { NamedCollection } from '@/app/lib/game-hub/types';

// ---------------------------------------------------------------------------
// Shared source constants. Cite-or-drop: every entry links out to an
// authority (base facts) and/or a FinalBoss 2026 article (Free Lanes /
// Terran Armada / Shattered Space / X-Tech layer). No fabricated URLs.
// ---------------------------------------------------------------------------

// FinalBoss.io — 2026 state layer
const FB_SHIPS = 'https://finalboss.io/starfield-best-ships-in-2026-after-free-lanes';
const FB_BUILDS = 'https://finalboss.io/starfield-best-builds-in-2026-5-meta-setups';
const FB_TERRAN = 'https://finalboss.io/starfield-terran-armada-ship-parts-builds-nasa-tactical';
const FB_DELTA = 'https://finalboss.io/starfield-delta-companion-guide-why-you-cant-recruit';

// Companions — authority
const GAME8_COMPANIONS = 'https://game8.co/games/Starfield/archives/420589';
const GAME8_SS_COMPANIONS = 'https://game8.co/games/Starfield/archives/476914';
const IGN_SS_COMPANIONS = 'https://www.ign.com/wikis/starfield/All_Shattered_Space_Companions_and_Crew';
const INARA_COMPANIONS = 'https://inara.cz/starfield/companions/';
const SCREENRANT_COMPANIONS =
  'https://screenrant.com/starfield-every-companion-name-location-ranked-worst-best/';
const GAMESPOT_TERRAN_CREW =
  'https://www.gamespot.com/articles/how-to-recruit-all-terran-armada-crewmates-in-starfield/1100-6539286/';
const SIXTHAXIS_FREELANES =
  'https://www.thesixthaxis.com/2026/03/17/starfield-free-lanes-terran-armada-everything-to-know-about-the-biggest-updates-yet/';
const GAMERANT_TERRAN = 'https://gamerant.com/starfield-reasons-to-play-terran-armada-free-lanes-2026/';

// Ships — authority
const GAMESPOT_SHIPS = 'https://www.gamespot.com/gallery/the-best-starfield-ships-to-buy-steal-or-earn/2900-4857/';
const RPS_SHIPS = 'https://www.rockpapershotgun.com/starfield-best-ships';
const GAME8_KEPLER = 'https://game8.co/games/Starfield/archives/424697';
const FANDOM_KEPLER = 'https://starfield.fandom.com/wiki/Kepler_R';
const SCREENRANT_SHIPS = 'https://screenrant.com/starfield-best-ships-unlock-locations/';
const DESTRUCTOID_NARWHAL = 'https://www.destructoid.com/where-to-get-the-narwhal-class-c-spaceship-in-starfield/';
const INARA_NARWHAL = 'https://inara.cz/starfield/ship/1017/';

// Builds — authority
const RPS_BUILDS = 'https://www.rockpapershotgun.com/starfield-best-builds';
const GAMESGG_BUILDS = 'https://games.gg/starfield/guides/starfield-best-builds/';

// Starborn Powers — authority
const FANDOMWIRE_POWERS = 'https://fandomwire.com/starfield-special-powers-explained-and-how-to-use-them/';
const EXPUTER_POWERS = 'https://exputer.com/guides/starfield-powers/';
const SCREENRANT_POWERS = 'https://screenrant.com/starfield-best-powers-ranked-starborn-abilities/';
const SILICONERA_POWERS = 'https://www.siliconera.com/all-starborn-powers-and-how-to-get-them-in-starfield/';
const FANDOM_POWERS = 'https://starfield.fandom.com/wiki/Powers';

export const COLLECTIONS: NamedCollection[] = [
  {
    key: 'companions',
    label: 'Companions',
    entries: [
      {
        name: 'Sarah Morgan',
        summary:
          "Constellation's leader and best all-round travel companion — top-tier Astrodynamics (★★★★) for grav-jump range and fuel efficiency, plus Lasers (★★★), Leadership (★★) and Botany (★). Fully romanceable and counts toward the Starcrossed achievement; disapproves of theft and needless cruelty.",
        sources: [GAME8_COMPANIONS, INARA_COMPANIONS, SCREENRANT_COMPANIONS],
      },
      {
        name: 'Sam Coe',
        summary:
          'Ex-Freestar Ranger and the best pilot companion — Piloting (★★★★) lets you field higher-class ships earlier, backed by Rifle Certification (★★★), Payloads (★★) and Geology (★). Fully romanceable (Starcrossed-eligible); rated alongside Sarah as a best-in-any-situation companion.',
        sources: [GAME8_COMPANIONS, INARA_COMPANIONS],
      },
      {
        name: 'Barrett',
        summary:
          'Veteran Constellation explorer and premier ship-crew engineer — Starship Engineering (★★★★) boosts shields and repair, plus Particle Beam Weapon Systems (★★★), Robotics (★★) and Gastronomy (★). Fully romanceable; the go-to permanent crew pick for surviving Terran Armada and NG+ space battles.',
        sources: [GAME8_COMPANIONS, INARA_COMPANIONS, SCREENRANT_COMPANIONS],
      },
      {
        name: 'Andreja',
        summary:
          'Va’ruun-aligned mystic and the best stealth companion — maxed Stealth (★★★★) with Particle Beams (★★★), Energy Weapon Systems (★★) and Theft (★). Fully romanceable and far more tolerant of morally grey actions than Sarah or Sam, making her ideal for stealth, thief and pirate runs.',
        sources: [GAME8_COMPANIONS, INARA_COMPANIONS, SCREENRANT_COMPANIONS],
      },
      {
        name: 'Vasco',
        summary:
          "Constellation's Model A EVA robot and your earliest companion — sturdy, immortal utility crew with solid ship-system bonuses, useful as a permanent crew member. Not romanceable and carries no relationship arc.",
        sources: [INARA_COMPANIONS, SCREENRANT_COMPANIONS],
      },
      {
        name: 'The Adoring Fan',
        summary:
          'A comedic starstruck follower unlocked only by taking the Hero Worshipped trait at character creation. He tags along carrying gifts and loot but is a weak combatant with negligible skills; not romanceable.',
        sources: [SCREENRANT_COMPANIONS, INARA_COMPANIONS],
      },
      {
        name: 'Delta (Terran Armada)',
        summary:
          'The Terran robot companion added with the Terran Armada expansion — pitched by Bethesda as "not evil, but definitely not good," the perfect sidekick for a morally-grey captain where Constellation crew would disapprove. Recruited by completing "Lost Luxury," the expansion’s second mission; not romanceable.',
        sources: [FB_DELTA, GAMESPOT_TERRAN_CREW, GAMERANT_TERRAN, SIXTHAXIS_FREELANES],
      },
      {
        name: 'Sahima Ka’dic (Shattered Space)',
        summary:
          'A House Ka’dic crew member added in Shattered Space, valued as a ship-systems specialist — EM Weapon Systems (★★), Aneutronic Fusion (★) for extra reactor power, and Sniper Certification (★). Recruited at House Ka’dic on Va’ruun’kai after "Zealous Overreach"; not romanceable (Shattered Space adds no new romances).',
        sources: [IGN_SS_COMPANIONS, GAME8_SS_COMPANIONS],
      },
    ],
  },
  {
    key: 'ships',
    label: 'Ships',
    entries: [
      {
        name: 'Star Eagle (Class A)',
        summary:
          'Still the best free combat ship in 2026 — strong hull, shields and a mixed weapon set, and an ideal lean platform for Free Lanes cruise-mode upgrades. Awarded for completing the Freestar Rangers faction questline (e.g. "Hammer Falls").',
        sources: [FB_SHIPS, GAMESPOT_SHIPS, RPS_SHIPS],
      },
      {
        name: 'Razorleaf (Class A)',
        summary:
          'The best early-game combat and boarding ship, with good shields, weapons and built-in shielded cargo for smuggling. Earned by completing "The Mantis" after finding the Secret Outpost datapad on a Spacer.',
        sources: [FB_SHIPS, GAMESPOT_SHIPS],
      },
      {
        name: 'Kepler R (Class C)',
        summary:
          'A free Class C powerhouse and excellent endgame build base. Reward for the "Overdesigned" side quest from Walter Stroud at the Lodge — choose the larger "kitchen sink" budget and pass the persuasion/feedback checks to get the R over the smaller Kepler S.',
        sources: [GAME8_KEPLER, FANDOM_KEPLER],
      },
      {
        name: 'Shieldbreaker (Class B)',
        summary:
          'A heavily-armed mid-game combat cruiser and a solid one-ship all-rounder. Bought from the New Atlantis Ship Services Technician once you reach Piloting Rank 3.',
        sources: [SCREENRANT_SHIPS],
      },
      {
        name: 'Narwhal (Class C)',
        summary:
          'The best overall stock ship — huge hull and shields, a ~36-power reactor, big crew/cargo and strong default weapons, making it the prime base for X-Tech shield/weapon optimization. Bought for ~450,000 credits from Veronica Young (Taiyo) in the Ryujin Tower on Neon.',
        sources: [FB_SHIPS, DESTRUCTOID_NARWHAL, INARA_NARWHAL, SCREENRANT_SHIPS],
      },
      {
        name: 'Abyss Trekker (Class C)',
        summary:
          'The best pure-DPS gunship — a glass cannon with concentrated forward-firing weapons for fast kills, pairing well with Terran Armada schematics and X-Tech damage upgrades. Available to buy as a stock Class C combat ship.',
        sources: [FB_SHIPS, GAMESPOT_SHIPS],
      },
      {
        name: 'Terran Armada hulls (e.g. Saladin)',
        summary:
          'Elite endgame combat platforms from the Terran Armada expansion. They cannot be bought — you commandeer them in Armada encounters, and destroying them drops new module schematics like the evasive stealth drive (near-invisibility, previously Starborn-only) and micro reactor.',
        sources: [FB_TERRAN, GAMESPOT_TERRAN_CREW, SIXTHAXIS_FREELANES, FB_SHIPS],
      },
      {
        name: 'Vanquisher (Class C)',
        summary:
          'The best off-the-shelf purchasable Class C if you skip the Narwhal — broadly high stats (~1,000 shields, ~4,000 cargo, 6 crew, ~29 LY grav range, tri-weapon setup) and an excellent upgrade platform for higher-tier shields, grav drives and Terran/X-Tech weapons.',
        sources: [FB_SHIPS, GAMESPOT_SHIPS],
      },
    ],
  },
  {
    key: 'builds',
    label: 'Meta Builds',
    entries: [
      {
        name: 'Ronin Melee Assassin',
        summary:
          'Hyper-lethal stealth melee for planetary content, chaining power attacks and sneak-attack multipliers. Key skills: Dueling/Martial Arts, Stealth, Concealment, Isolation, plus Fitness/Gymnastics for O2. Best weapon: swords/melee (no ammo dependency). Background: Ronin; Traits: Alien DNA, Introvert, Wanted.',
        sources: [FB_BUILDS, RPS_BUILDS, GAMESGG_BUILDS],
      },
      {
        name: 'Stealth Sniper Infiltrator',
        summary:
          'Long-range one-shot specialist, one of the strongest all-round combat builds in 2026. Key skills: Stealth, Sniper Certification, Concealment, Ballistics, Sharpshooting. Best weapon: ballistic snipers (Magsniper / Hard Target). Background: Cyber Runner (Stealth/Security/Theft); Traits: Introvert, Wanted, Alien DNA.',
        sources: [FB_BUILDS, RPS_BUILDS],
      },
      {
        name: 'Ballistic Bounty Hunter',
        summary:
          'Versatile ground-and-space contract build tuned for Free Lanes loops. Key skills: Ballistics, Pistol & Rifle Certification, Boost Pack Training, Security, Targeting Control Systems. Best weapon: ballistic pistols/rifles (Keelhauler, Revenant). Background: Bounty Hunter (Piloting/Targeting/Boost Pack); Traits: Alien DNA, Introvert, Wanted.',
        sources: [FB_BUILDS, GAMESGG_BUILDS],
      },
      {
        name: 'Laser / Particle Beam Specialist',
        summary:
          'Ranged energy DPS that melts the heavily-armored Shattered Space and Terran Armada enemies via armor-ignoring beams. Key skills: Lasers, Particle Beams, Weapon Engineering, plus Science nodes. Best weapon: energy rifles (Unmitigated Violence, Va’Ruun Inflictor). Background: Explorer (Lasers/Astrodynamics/Surveying); Traits: Alien DNA, Terra Firma or Spaced, Extrovert.',
        sources: [FB_BUILDS, RPS_BUILDS],
      },
      {
        name: 'Ship Combat Ace',
        summary:
          'Space-first build for dogfights, cruise-mode battles and Terran Armada fleets, with ground combat as an afterthought. Key skills: Piloting, Targeting Control Systems, Starship Design/Engineering, Shield Systems. Best "weapon": ship loadout (6× Vanguard Obliterators + 6× Vanguard Hellfires). Background: Bounty Hunter; Traits: Alien DNA, Wanted.',
        sources: [FB_BUILDS],
      },
    ],
  },
  {
    key: 'powers',
    label: 'Starborn Powers',
    entries: [
      {
        name: 'Anti-Gravity Field',
        summary:
          'Generates a localized field of intense low gravity that lifts enemies into zero-g where they can’t respond for a time — one of the strongest and rare among powers for being area-based crowd control. Worth ranking up across New Game Plus as reliable, ammo-free CC against groups.',
        sources: [FANDOMWIRE_POWERS, EXPUTER_POWERS, SCREENRANT_POWERS],
      },
      {
        name: 'Personal Atmosphere',
        summary:
          'Instantly refills your O2 and clears CO2. It doubles as an encumbrance workaround, letting you sprint while heavily over-loaded to hoard materials — a quality-of-life staple you re-collect and stack each NG+ cycle.',
        sources: [FANDOMWIRE_POWERS, EXPUTER_POWERS],
      },
      {
        name: 'Sense Star Stuff',
        summary:
          'For 15 energy, reveals every living entity nearby — human, alien or Starborn — as a glowing silhouette through walls. A cheap, always-useful scouting and combat-awareness tool that stays relevant at every rank.',
        sources: [FANDOMWIRE_POWERS, SILICONERA_POWERS],
      },
      {
        name: 'Parallel Self',
        summary:
          'Summons a copy of yourself (learned at Temple Sigma) to fight alongside you for a time, adding damage and drawing aggro. Scaling it up across NG+ turns your clone into a genuine second gun in tough fights.',
        sources: [FANDOMWIRE_POWERS, SILICONERA_POWERS],
      },
      {
        name: 'Gravity Wave',
        summary:
          'Launches a wave that staggers and knocks down nearby adversaries, buying breathing room in melee-range chaos. A strong panic button that gets more reliable at higher ranks earned through NG+ temple runs.',
        sources: [FANDOM_POWERS, SILICONERA_POWERS],
      },
      {
        name: 'Elemental Pull',
        summary:
          'Breaks up inorganic resources and pulls them toward you, streamlining mining and material farming. A pure-utility pick that speeds up the outpost/crafting loop and X-Tech gathering — handy to keep stacked between universes.',
        sources: [FANDOM_POWERS, SILICONERA_POWERS],
      },
      {
        name: 'Grav Dash',
        summary:
          'Pushes you forward with great force while boosting your damage output — a mobility-plus-offense power for closing gaps and opening a burst. Ranking it up in NG+ makes it a strong aggressive opener for melee and shotgun builds.',
        sources: [FANDOM_POWERS, SILICONERA_POWERS],
      },
      {
        name: 'Reactive Shield',
        summary:
          'Projects a shield that protects you from incoming enemy projectiles for a duration. A defensive staple worth stacking through NG+ so higher ranks keep pace with the tougher Shattered Space and Terran Armada enemies.',
        sources: [FANDOM_POWERS, SILICONERA_POWERS],
      },
    ],
  },
];
