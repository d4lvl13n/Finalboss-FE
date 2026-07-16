import type { SystemRecord } from '@/app/lib/game-hub/types';

// --- Shared source constants (verified reachable, 2026-07) ---
// IGN Starfield wiki (authority: skills, powers, outposts, factions, crafting)
const IGN_SKILLS = 'https://www.ign.com/wikis/starfield/All_Skills_and_Rank_Challenges';
const IGN_POWERS = 'https://www.ign.com/wikis/starfield/All_Starfield_Powers_and_How_to_Unlock';
const IGN_OUTPOSTS = 'https://www.ign.com/wikis/starfield/Outposts';
const IGN_FACTIONS = 'https://www.ign.com/wikis/starfield/Factions';
const IGN_VANGUARD = 'https://www.ign.com/wikis/starfield/UC_Vanguard_Side_Missions_Walkthrough';
const IGN_FREESTAR = 'https://www.ign.com/wikis/starfield/Freestar_Collective_Side_Missions_Walkthrough';
const IGN_CRIMSON = 'https://www.ign.com/wikis/starfield/Crimson_Fleet_Side_Missions_Walkthrough';
const IGN_CRAFTING = 'https://www.ign.com/wikis/starfield/How_to_Get_Crafting_Resources';

// Game8 Starfield wiki (authority: skill trees, ship building, ships, unity, starborn, factions)
const G8_SKILLS = 'https://game8.co/games/Starfield/archives/421231'; // List of All Skills and Skill Trees
const G8_SHIP = 'https://game8.co/games/Starfield/archives/421283'; // Ship Building and Customization Guide
const G8_SHIPS_LIST = 'https://game8.co/games/Starfield/archives/423506'; // List of All Ships
const G8_UNITY = 'https://game8.co/games/Starfield/archives/423453'; // Unity Walkthrough and Rewards
const G8_STARBORN = 'https://game8.co/games/Starfield/archives/423448'; // Starborn Walkthrough and Choices
const G8_FACTIONS = 'https://game8.co/games/Starfield/archives/421393'; // List of All Factions and Faction Questlines

// GameSpot (authority: Shattered Space update — quantum essence powers, shared container)
const GAMESPOT_SHATTERED =
  'https://www.gamespot.com/articles/starfields-first-expansion-shattered-space-arrives-alongside-major-update/1100-6526796/';
// TheSixthAxis (authority: Free Lanes + Terran Armada 2026 overview)
const SIXTHAXIS_FREELANES =
  'https://www.thesixthaxis.com/2026/03/17/starfield-free-lanes-terran-armada-everything-to-know-about-the-biggest-updates-yet/';

// FinalBoss.io (2026 layer: Free Lanes outposts, NG+ quantum device, Terran Armada, best ships)
const FB_OUTPOSTS = 'https://finalboss.io/starfield-how-to-build-efficient-outposts-free-lanes';
const FB_NGPLUS = 'https://finalboss.io/starfield-how-to-master-new-game-plus-in';
const FB_TERRAN = 'https://finalboss.io/starfield-terran-armada-dlc-complete-overview-whats-new';
const FB_SHIPS = 'https://finalboss.io/starfield-best-ships-in-2026-after-free-lanes';

export const SYSTEMS: SystemRecord[] = [
  {
    slug: 'skills-five-trees',
    name: 'Skills & the Five Trees',
    summary:
      'Starfield has no fixed classes: your build is defined entirely by five skill trees — Physical, Social, Combat, Science and Tech — with each level-up granting one skill point to spend. Every skill has four ranks, and unlocking a higher rank requires both enough points already invested in that tree and completing a skill challenge (such as a kill or usage quota) for that specific skill. This gates power behind actually playing your intended style, so early investment shapes whether you become a gunslinger, ship engineer, outpost baron or stealth infiltrator.',
    sources: [IGN_SKILLS, G8_SKILLS],
  },
  {
    slug: 'ship-building',
    name: 'Ship Building',
    summary:
      'At any Ship Services Technician or shipyard you enter the ship builder and snap modules — cockpits, habs, reactors, grav drives, engines, shields, weapons and landing/docking gear — onto a hull, with the reactor’s output capping how many powered systems you can run at once. Ships are graded Class A, B or C by reactor and mass, and flying the heavier B- and C-class hulls requires ranks in the Piloting skill. The 2026 Free Lanes update layered on ship optimization via the scavenged resource X-Tech, letting you push modules and weapons into new Superior and Exceptional quality tiers.',
    sources: [G8_SHIP, FB_SHIPS, G8_SHIPS_LIST],
  },
  {
    slug: 'outposts',
    name: 'Outposts',
    summary:
      'You claim a site by dropping an Outpost Beacon on a scanned world, then build extractors over resource veins for automated extraction, powered by generators and fed into storage, with cargo links shipping materials between outposts and up to orbit. The April 2026 Free Lanes update turned this from a chore into a logistics layer by adding cross-outpost (shared) storage, a resource/planet Database index and smarter cargo links, enabling a hub-and-spoke network where lean mining bases feed one main crafting hub. That cross-storage change is the single biggest quality-of-life fix, removing most of the manual hauling between bases.',
    sources: [IGN_OUTPOSTS, FB_OUTPOSTS, SIXTHAXIS_FREELANES],
  },
  {
    slug: 'new-game-plus',
    name: 'New Game Plus',
    summary:
      'Completing the main quest and stepping into the Unity begins New Game Plus in a freshly generated universe: you keep your character level, all skills and ranks, traits, every Starborn power (and its upgraded ranks) and the Frontier, while inventory, credits, other ships, outposts and companion relationships all reset. A small pool of rare, unique universe variations can appear on any given jump, giving each run a chance at a radically different Constellation. Free Lanes added the Quantum Entanglement Device at the Constellation Lodge — a capped cross-universe stash — so a limited set of chosen items can now travel with you through the Unity instead of everything being wiped.',
    sources: [FB_NGPLUS, G8_UNITY],
  },
  {
    slug: 'crafting-research',
    name: 'Crafting & Research',
    summary:
      'Crafting is gated behind the Research Laboratory: you spend gathered resources on Research Projects to unlock blueprints, then use the Weapon, Spacesuit and Industrial workbenches to install weapon mods, spacesuit/pack mods and armor upgrades. Resources come from mining, looting, buying or automated outpost extraction, which is why outpost and skill investment feed directly into gear quality. In 2026, Terran Armada added X-Tech as a scavengeable high-end resource used to craft legendary Superior and Exceptional effects onto weapons and gear within the base game.',
    sources: [IGN_CRAFTING, FB_TERRAN],
  },
  {
    slug: 'powers-temples',
    name: 'Powers & Temples',
    summary:
      'Starborn Powers are the game’s magic-like abilities, each unlocked by tracking down a Temple — anomalies scattered across the galaxy, located via Constellation research and orbital scanning — and completing its zero-gravity ritual to absorb the power inside. Historically the only way to strengthen a power was to re-enter its temple in successive New Game Plus universes, stacking its rank across the Unity loop. The Shattered Space-era update softened that grind by letting you upgrade powers with Quantum Essence (farmed from Starborn ships), reducing the need to repeatedly replay temples just to max a power.',
    sources: [IGN_POWERS, GAMESPOT_SHATTERED, G8_STARBORN],
  },
  {
    slug: 'factions',
    name: 'Factions',
    summary:
      'Starfield’s major factions each run a self-contained questline that gates unique gear, ships and companions: the UC Vanguard (join the United Colonies military and earn full citizenship), the Freestar Rangers (frontier lawmen whose line rewards the Star Eagle ship), the Crimson Fleet (pirates, entered through a UC SysDef double-agent choice) and Ryujin Industries (corporate espionage climbing the ladder in Neon). Because rewards, reputation and even some romances hinge on choices made inside these arcs, the faction questlines are among the strongest reasons to build a character a certain way. They can be run largely in parallel with the main story and remain the primary source of standout non-crafted equipment.',
    sources: [IGN_FACTIONS, G8_FACTIONS, IGN_VANGUARD, IGN_FREESTAR, IGN_CRIMSON],
  },
];
