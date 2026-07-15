import type { ClassRecord } from '@/app/lib/game-hub/types';

// Zenless Zone Zero Agent roster. Attribute (element) and Specialty (role) come
// from the Icy Veins Agents database; the single tier (pveTier) is normalized
// from the Game8 3.0 tier list (July 2026): Tier 0 -> "S+", Tier 1+ -> "S",
// Tier 1 -> "A". ZZZ has no arena PvP — the tier reflects the endgame combat
// content (Shiyu Defense / Deadly Assault) those sources rank against. Fields
// are omitted when a source lists no value; every unit carries its sources.
//
// Last enriched 2026-07-15 (Version 3.0). Depth fields (overview, coreMechanic,
// builds, keyItems, strengths, weaknesses, tierRationale, skills) reconcile three
// lanes: a Perplexity cited-synthesis pass (breadth + second opinion), the Game8
// per-Agent build pages (authoritative for W-Engines, Drive Disc sets and skill
// names — each Agent's build archive is cited in its sources), and Prydwen /
// Icy-Veins per-Agent pages as the corroborating secondary authority. Every
// W-Engine, Drive Disc set and skill name below was read off a fetched Game8
// build page (cite-or-drop); low-authority aggregator-only claims were dropped,
// and where the Game8 page and search snippets disagreed on a Drive Disc set the
// Game8 page (the authority, not an aggregator) was trusted.
const G8 = 'https://game8.co/games/Zenless-Zone-Zero/archives/435685';
const IV = 'https://www.icy-veins.com/zenless-zone-zero/agents';

export const CHARACTERS: ClassRecord[] = [
  // ---- Tier 0 (S+) ----
  {
    slug: 'hoshimi-miyabi',
    name: 'Hoshimi Miyabi',
    aliases: ['Miyabi'],
    role: 'Anomaly (Main DPS)',
    rarity: 'S-Rank',
    element: 'Frost',
    pveTier: 'S+',
    overview:
      'A Frost Anomaly specialist from Section 6 who blends Ice and Frostburn damage through her Fallen Frost resource system. Released in v1.4, she remains a benchmark on-field carry through v3.0, still sitting at the very top of the DPS charts.',
    coreMechanic: 'Anomaly DPS — Frost/Frostburn on-field carry layering DoT and burst via Fallen Frost.',
    builds: [
      {
        name: 'Frostburn Anomaly Carry',
        focus: 'Max Ice DMG + Anomaly Proficiency for constant Frostburn uptime.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/436881',
      },
    ],
    keyItems: [
      { name: 'Hailstorm Shrine (W-Engine)', note: 'Signature; +50% CRIT DMG and +20% Ice DMG on EX Special or Anomaly application.' },
      { name: 'Branch & Blade Song (4pc) + Woodpecker Electro (2pc)', note: 'Core anomaly-CRIT disc profile.' },
    ],
    strengths: [
      'Tier 0 DPS with sustained on-field damage across content.',
      'Frostburn + Fallen Frost layers strong burst on top of DoT.',
      'Long-standing meta staple that ages well.',
    ],
    weaknesses: [
      'Wants a dedicated Frost/anomaly-support team to peak.',
      'Fallen Frost management adds rotation complexity.',
    ],
    tierRationale:
      'Rated Tier 0 DPS; a mainstay clear enabler for Shiyu Defense and Deadly Assault since her release.',
    skills: ['Kazahana', 'Shimotsuki', 'Miyuki', 'Hisetsu', "Spring's Call", 'Lingering Snow', 'Searing Cold'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/436881', 'https://www.prydwen.gg/zenless/characters/hoshimi-miyabi', G8, IV],
  },
  {
    slug: 'astra-yao',
    name: 'Astra Yao',
    role: 'Support',
    rarity: 'S-Rank',
    element: 'Ether',
    pveTier: 'S+',
    overview:
      'An Ether Support who pioneered the Chain-swap playstyle: her Idyllic Cadenza state keeps her on-field during ally switches while she pumps team ATK and CRIT DMG. She remains a Tier 0 support benchmark in v3.0 — one of the most universal buffers in the game.',
    coreMechanic: 'Support — team-wide ATK% and CRIT DMG buffs plus Ultimate healing, fueled by rapid Quick-Assist rotations.',
    builds: [
      {
        name: 'Universal Buff Support',
        focus: 'Max ATK + Energy Regen to fuel Quick Assists and Core buffs (~3430 ATK target).',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/490842',
      },
    ],
    keyItems: [
      { name: 'Elegant Vanity (W-Engine)', note: 'Signature BiS; ATK plus a team DMG buff on Quick Assist.' },
      { name: 'Astral Voice (4pc) + Swing Jazz (2pc)', note: 'Astral Voice passes a DMG buff to the next on-field agent, aligning with her swap kit.' },
    ],
    strengths: [
      'Powerful team-wide ATK + CRIT DMG buffs from Core and Special.',
      'Team healing through her Ultimate.',
      'Extremely versatile — fits nearly any team.',
    ],
    weaknesses: [
      'Off-field personal damage is negligible.',
      'Wants high ATK and Energy Regen to hit full buff value.',
    ],
    tierRationale: 'Tier 0 Support; a staple enabler across Shiyu Defense and Deadly Assault comps.',
    skills: ['Capriccio', 'Windchimes & Oaths', 'Tipsy Concerto', 'Fantasian Sonata', 'Graceful Andante'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/490842', 'https://www.prydwen.gg/zenless/characters/astra-yao', G8, IV],
  },
  {
    slug: 'yixuan',
    name: 'Yixuan',
    role: 'Rupture (Main DPS)',
    rarity: 'S-Rank',
    element: 'Auric Ink',
    pveTier: 'S+',
    overview:
      'A Rupture specialist who deals Sheer DMG that ignores enemy DEF and scales off her Sheer Force stat rather than ATK. An HP/CRIT-scaling carry, she anchors Rupture teams at the very top of the v3.0 meta.',
    coreMechanic: 'DPS — Rupture / Sheer DMG on-field carry that bypasses DEF.',
    builds: [
      {
        name: 'Sheer Force Rupture Carry',
        focus: 'HP% + CRIT to maximize Sheer DMG output.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/516115',
      },
    ],
    keyItems: [
      { name: 'Qingming Birdcage (W-Engine)', note: 'Signature; +20% CRIT Rate plus Qingming stacks boosting Ether/Sheer DMG.' },
      { name: 'Yunkui Tales (4pc) + Woodpecker Electro (2pc)', note: 'HP%, CRIT and Sheer DMG scaling on EX/Chain/Ultimate.' },
    ],
    strengths: [
      'Tier 0 overall and DPS.',
      'Sheer DMG ignores DEF — strong versus tanky enemies.',
      'HP-scaling makes stat-building forgiving.',
    ],
    weaknesses: [
      'The Sheer Force scaling model needs the right discs to pay off.',
      'Relies on EX Special uptime for full stack value.',
    ],
    tierRationale: 'Tier 0 overall/DPS; a premier endgame carry for Shiyu Defense and Deadly Assault.',
    skills: ['Cirrus Strike', 'Ink Manifestation', 'Auric Ink Rush', 'Endless Talisman Suppression', 'Grandmaster of Mysticism'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/516115', 'https://www.prydwen.gg/zenless/characters/yixuan', G8, IV],
  },
  {
    slug: 'ye-shunguang',
    name: 'Ye Shunguang',
    role: 'Attack (Main DPS)',
    rarity: 'S-Rank',
    element: 'Honed Edge',
    pveTier: 'S+',
    isNew: true,
    overview:
      'A Honed Edge Attack agent from Yunkui Summit with two forms — normal and the white-haired Enlightened Mind (Qingming) state that sharply raises her damage and unlocks a Decibel-free Ultimate. A CRIT DMG-focused carry sitting Tier 0 in v3.0.',
    coreMechanic: 'DPS — Attack / Honed Edge on-field carry that ramps through her Enlightened Mind form.',
    builds: [
      {
        name: 'Qingming Form CRIT Carry',
        focus: 'CRIT DMG-heavy; innate CRIT Rate from disc + Core frees up substats.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/566448',
      },
    ],
    keyItems: [
      { name: 'Cloudcleave Radiance (W-Engine)', note: 'Signature best-in-slot.' },
      { name: 'White Water Ballad (4pc) + Branch & Blade Song (2pc)', note: 'Best 4-piece supplies innate CRIT Rate; 2pc adds CRIT DMG.' },
    ],
    strengths: [
      'Tier 0 overall DPS.',
      'Enlightened Mind form massively boosts output and gives a Decibel-free Ultimate.',
      'Innate CRIT Rate lets you overload CRIT DMG substats.',
    ],
    weaknesses: [
      'Payoff gated behind entering and maintaining Qingming Form.',
      'Two-form rotation adds execution complexity.',
    ],
    tierRationale: 'Tier 0 DPS; a top clear option for Shiyu Defense and Deadly Assault.',
    skills: ['Swiftedge', 'Enlightened Mind - Soaring Light', 'Enlightened Mind - Lure Thunder', 'Cleaving Heavens', 'Burning Clarity'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/566448', 'https://www.prydwen.gg/zenless/characters/ye-shunguang', G8, IV],
  },
  {
    slug: 'ukinami-yuzuha',
    name: 'Ukinami Yuzuha',
    aliases: ['Yuzuha'],
    role: 'Support',
    rarity: 'S-Rank',
    element: 'Physical',
    pveTier: 'S+',
    overview:
      'A Physical Support built for Anomaly teams. She lands a "Sweet Scare" debuff and accumulates Sugar Points to fire off-field Aftershock attacks while buffing party ATK and anomaly damage. Tier 0, but narrowly specialized to Anomaly/Disorder comps.',
    coreMechanic: 'Support — buffs Anomaly Buildup Rate, Attribute Anomaly DMG and Disorder DMG, plus party ATK and team Energy.',
    builds: [
      {
        name: 'Anomaly Support',
        focus: 'Reach ~3000 ATK and ~200 Anomaly Mastery to max her buffs.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/527726',
      },
    ],
    keyItems: [
      { name: 'Metanukimorphosis (W-Engine)', note: 'Signature BiS; needed to comfortably reach 200 Anomaly Mastery.' },
      { name: "Moonlight Lullaby (4pc) + Phaethon's Melody (2pc)", note: 'Anomaly-support disc profile per Game8 (Astral Voice 4pc is a cited alternative).' },
    ],
    strengths: [
      'Excellent Anomaly application for a support unit.',
      'Raises Attribute Anomaly and Disorder DMG.',
      'Buffs party ATK and restores team Energy via Ultimate.',
    ],
    weaknesses: [
      'Only effective in Anomaly teams — poor fit elsewhere.',
      'Needs high Anomaly Mastery (200), hard to reach without her signature.',
    ],
    tierRationale: 'Tier 0 Support, but value concentrates in Anomaly/Disorder Shiyu Defense and Deadly Assault lineups.',
    skills: ['Gummy Bombardment', 'Cavity Alert', 'Prank Assault', 'Surrender or Suffer the Mischief', 'Whimsical Wonder'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/527726', 'https://www.prydwen.gg/zenless/characters/ukinami-yuzuha', G8, IV],
  },
  {
    slug: 'sunna',
    name: 'Sunna',
    role: 'Support',
    rarity: 'S-Rank',
    element: 'Physical',
    pveTier: 'S+',
    isNew: true,
    overview:
      "A Physical Support from Angels of Delusion who deploys companion Bubblegum to inflict \"Cat's Gaze\" on enemies; the mark detonates when Attack or Anomaly agents strike, adding damage scaled off the triggering agent. Tier 0 support in v3.0.",
    coreMechanic: "Support — Core grants team ATK% and applies Cat's Gaze damage-amp; heals via Ultimate.",
    builds: [
      {
        name: 'ATK / Energy Support',
        focus: 'Stack ATK% and Energy Regen toward ~3500 ATK.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/572600',
      },
    ],
    keyItems: [
      { name: 'Thoughtbop (W-Engine)', note: 'Game8 BiS; Energy Regen plus squad DMG/ATK, with F2P alternatives available.' },
      { name: 'Moonlight Lullaby (4pc) + Astral Voice (2pc)', note: 'Energy Regen and squad DMG on EX/Ultimate.' },
    ],
    strengths: [
      'Strong team ATK buffs.',
      'Healing via Ultimate.',
      'F2P-friendly W-Engine options.',
    ],
    weaknesses: [
      'Best paired with Aria to function in Anomaly teams.',
      'Kit does not synergize with Rupture units.',
    ],
    tierRationale: "Tier 0 Support; strong Cat's Gaze damage-amp in Attack/Anomaly endgame teams, but comp-restricted.",
    skills: ['Cuteness Is Justice', 'Naughty Cat Spotted', 'Bubblegum Barrage', "Don't Mess With the Cat", 'Smash It All!'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/572600', 'https://www.prydwen.gg/zenless/characters/sunna', G8, IV],
  },
  {
    slug: 'lucia',
    name: 'Lucia',
    role: 'Support',
    rarity: 'S-Rank',
    element: 'Ether',
    pveTier: 'S+',
    overview:
      'An Ether Support built specifically for Rupture teams. She banks Dream Points to enter Dream State, applying HP and Sheer Force buffs and firing off-field Aftershocks. A Tier 0 enabler for the Sheer Force / Rupture archetype (Yixuan, Yidhari, Ju Fufu).',
    coreMechanic: 'Support — HP/Sheer-Force buffer whose Ultimate creates a healing zone; scales off HP (~24,000 target).',
    builds: [
      {
        name: 'HP Support',
        focus: 'Stack HP to amplify Special Attack buffs (~24,000 HP target).',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/545821',
      },
    ],
    keyItems: [
      { name: 'Dreamlit Hearth (W-Engine)', note: 'Game8 best-in-slot.' },
      { name: 'Moonlight Lullaby (4pc) + Yunkui Tales (2pc)', note: 'Support/HP-oriented, F2P-friendly.' },
    ],
    strengths: [
      'Provides Sheer Force and DMG buffs tailored to Rupture units.',
      'Ultimate restores HP to allies.',
      'F2P-friendly build options.',
    ],
    weaknesses: [
      'Only works on Rupture teams — dead weight outside the archetype.',
    ],
    tierRationale: 'Tier 0 Support; near-mandatory glue for Sheer Force / Rupture Shiyu Defense and Deadly Assault comps.',
    skills: ['Symphony of the Reaper - Storm', 'Symphony of the Reaper - Daybreak', 'Stage of Brilliance', 'Charge, Great Armor!', 'Lost Nocturne'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/545821', 'https://www.prydwen.gg/zenless/characters/lucia', G8, IV],
  },
  {
    slug: 'dialyn',
    name: 'Dialyn',
    role: 'Stun',
    rarity: 'S-Rank',
    element: 'Physical',
    pveTier: 'S+',
    overview:
      'A Physical Stun agent from the Krampus Compliance Authority who cycles Rock/Paper/Scissors EX Special variants to build Daze while granting squad-wide CRIT DMG. In v3.0 she is a premium Stunner-support hybrid who can even trigger ally Ultimates without spending Decibels.',
    coreMechanic: 'Stunner — cycling EX Special variants apply Daze and extend Stun to open team damage windows.',
    builds: [
      {
        name: 'Stun Support (Crit)',
        focus: 'Stack CRIT Rate to power her Core buffs; sustain the EX/Ultimate loop.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/557173',
      },
    ],
    keyItems: [
      { name: 'Yesterday Calls (W-Engine)', note: 'Off-field Energy Regen plus stacking Daze that grants squad CRIT DMG.' },
      { name: 'King of the Summit (4pc) + Woodpecker Electro (2pc)', note: 'Team CRIT DMG buff plus CRIT Rate toward the 50% threshold.' },
    ],
    strengths: [
      'Increases the damage of the entire squad.',
      'Can activate ally Ultimates without consuming Decibels.',
      'Strong Daze application with Stun-duration extension.',
    ],
    weaknesses: [
      'Requires precise inputs to cycle EX Special variants efficiently.',
      'Rotation timing sensitive for the Stun bonuses.',
    ],
    tierRationale: 'Tier 0 Stunner-support; a top universal control pick that buffs whole-team damage in Shiyu Defense and Deadly Assault.',
    skills: ['Happy to Be of Service', 'Welcome Gesture', 'Welcome Mat', 'Service Stopped for Number Dialed', 'Five-Star Service Hotline'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/557173', 'https://www.prydwen.gg/zenless/characters/dialyn', G8, IV],
  },
  {
    slug: 'ju-fufu',
    name: 'Ju Fufu',
    role: 'Stun',
    rarity: 'S-Rank',
    element: 'Fire',
    pveTier: 'S+',
    overview:
      'A Fire Stun agent from Yunkui Summit who manages Might and Momentum to deal Daze and can enter off-field Chain Attacks. In v3.0 she works as a Stunner-support hybrid, buffing team CRIT DMG for Attack units.',
    coreMechanic: 'Stunner — inflicts Daze including off-field Chain Attacks while buffing team CRIT DMG.',
    builds: [
      {
        name: 'Fire Stun Hybrid',
        focus: '~50% CRIT Rate + ~3400 ATK to max the CRIT DMG buff.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/517404',
      },
    ],
    keyItems: [
      { name: 'Roaring Fur-nace (W-Engine)', note: 'Her signature Stun engine.' },
      { name: 'King of the Summit (4pc) + Woodpecker Electro (2pc)', note: 'Team CRIT DMG buff plus CRIT Rate.' },
    ],
    strengths: [
      'Off-field Chain Attack Daze application.',
      'Buffs team CRIT DMG and Chain/Ultimate damage.',
      'Straightforward Might/Momentum gameplay.',
    ],
    weaknesses: [
      'Loses Daze uptime versus enemies in invulnerable states.',
      'Hard to maximize buffs without her signature W-Engine.',
    ],
    tierRationale: 'Tier 0 Fire Stunner-support; a top control enabler for Attack cores in Shiyu Defense and Deadly Assault.',
    skills: ['Tiger Seven Forms - Flaming Claw', 'Tiger Seven Forms - Mountain-Descending Tiger', 'Tiger Cauldron Collapse', 'Tiger Seven Forms - Raging Tiger Explosion', 'Fu-rocious Might'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/517404', 'https://www.prydwen.gg/zenless/characters/ju-fufu', G8, IV],
  },
  {
    slug: 'norma',
    name: 'Norma',
    role: 'Stun',
    rarity: 'S-Rank',
    element: 'Fire',
    pveTier: 'S+',
    isNew: true,
    overview:
      'A Fire Stun (Strike-type) agent from the Roscaelifer External Strategy Department who deploys turrets to apply Daze off-field and generate resources automatically. In v3.0 she is an off-field Stun specialist that enables flexible comps without heavy field time.',
    coreMechanic: 'Stunner — off-field Daze via deployed turrets, plus triggering extra Chain Attacks for allies.',
    builds: [
      {
        name: 'Off-field Crit Stun',
        focus: 'Stack CRIT Rate toward 100% so her Core converts the excess into CRIT DMG and Daze.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/589810',
      },
    ],
    keyItems: [
      { name: 'Chief Sidekick (W-Engine)', note: 'Signature; Impact plus Fire RES penetration.' },
      { name: 'King of the Summit (4pc) + Woodpecker Electro (2pc)', note: 'Team-wide CRIT DMG buff plus much-needed CRIT Rate.' },
    ],
    strengths: [
      'Remains fully effective from off-field.',
      'Automatic resource generation frees up field time.',
      'Can trigger additional Chain Attacks for allies.',
    ],
    weaknesses: [
      'Needs proper Energy management to keep turrets up.',
      'Very CRIT Rate hungry (wants ~100%) and leans on her signature engine.',
    ],
    tierRationale: 'Tier 0 off-field Stunner; slots cleanly into Shiyu Defense and Deadly Assault teams that want field time for their carry.',
    skills: ['Hat Trick', 'En-Nah Barrage', 'Impact Drill', 'Doctrine of Superior Firepower', 'Precise Guidance'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/589810', 'https://www.prydwen.gg/zenless/characters/norma', G8, IV],
  },
  {
    slug: 'nangong-yu',
    name: 'Nangong Yu',
    role: 'Stun',
    rarity: 'S-Rank',
    element: 'Ether',
    pveTier: 'S+',
    overview:
      'An Ether Stun agent from the Angels of Delusion — an atypical Stunner who scales with Anomaly stats. He spends Downbeats on charged attacks that inflict heavy Daze, then Chain Attacks with the squad to burst Disorder/Abloom. In v3.0 he is a niche Stunner that enhances both Anomaly and Disorder damage.',
    coreMechanic: 'Stunner — Downbeat-fueled charged attacks apply Daze and raise team Anomaly Buildup versus stunned enemies.',
    builds: [
      {
        name: 'Anomaly Stun',
        focus: 'Prioritize Anomaly Mastery/Proficiency and Ether DMG rather than pure CRIT.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/580322',
      },
    ],
    keyItems: [
      { name: 'Neon Fantasies (W-Engine)', note: 'Signature; maximizes his Anomaly Mastery scaling.' },
      { name: "Phaethon's Melody (4pc) + Freedom Blues (2pc)", note: 'Anomaly stat and Ether/Anomaly damage focus.' },
    ],
    strengths: [
      'Unique stun that also enhances Attribute Anomaly and Disorder damage.',
      'Simple gameplay — mainly Downbeat gauge management.',
      'Boosts squad Anomaly Buildup Rate against stunned enemies.',
    ],
    weaknesses: [
      'Needs his signature W-Engine to max Anomaly Mastery.',
      'Optimal only inside anomaly-focused teams.',
    ],
    tierRationale: 'Tier 0 Stunner; a premier control pick for anomaly Shiyu Defense and Deadly Assault comps.',
    skills: ['Adorable Explosive Impact', 'The Unbearable Weight of Love', 'Comet Gravity', 'Meteor Shower', 'Prodigious Idol'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/580322', 'https://www.prydwen.gg/zenless/characters/nangong-yu', G8, IV],
  },
  {
    slug: 'velina',
    name: 'Velina',
    role: 'Anomaly (Main DPS)',
    rarity: 'S-Rank',
    element: 'Wind',
    pveTier: 'S+',
    isNew: true,
    overview:
      "The game's first Wind-attribute Anomaly agent, released in v3.0. She applies the Windswept anomaly and enables Vortex for AoE burst while lowering enemy Anomaly Buildup resistance. Energy Regen is her defining stat, driving frequent EX Special use.",
    coreMechanic: 'Anomaly DPS — Wind / Windswept on-field applier that debuffs enemy anomaly resistance.',
    builds: [
      {
        name: 'Energy Regen Wind Anomaly',
        focus: 'Stack Energy Regen + Anomaly Proficiency for constant EX Special / Windswept.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/594748',
      },
    ],
    keyItems: [
      { name: 'Joyau Dore (W-Engine)', note: 'Signature; up to +60% Energy Regen to max her Core conversion.' },
      { name: 'Wuthering Salon (4pc) + Swing Jazz (2pc)', note: 'Wind Anomaly buffs plus an Energy Regen 2-piece.' },
    ],
    strengths: [
      'First Wind Anomaly enabler; strong AoE via Vortex.',
      'Reduces enemy anomaly buildup resistance (team utility).',
      'High personal anomaly output when Energy-fed.',
    ],
    weaknesses: [
      'Very Energy-Regen dependent; leans on her signature engine.',
      'Brand new (v3.0), so long-term placement is still settling.',
    ],
    tierRationale: 'Overall Tier 0 but DPS Tier 1+; slots into Shiyu Defense and Deadly Assault as a Wind Anomaly enabler more than a raw solo carry.',
    skills: ['Dancing Fans', 'Wind Shear - Triple Deathblow', 'Thousandfold Spiral', 'Heed the Tempest', 'Breeze in Bloom'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/594748', 'https://www.prydwen.gg/zenless/characters/velina', G8, IV],
  },
  {
    slug: 'trigger',
    name: 'Trigger',
    role: 'Stun',
    rarity: 'S-Rank',
    element: 'Electric',
    pveTier: 'S+',
    overview:
      'An Electric Stun agent from Obol Squad who applies Daze at range via sniping and deals off-field Aftershock damage. In v3.0 she is a ranged Stunner whose Stun multiplier keeps ramping even before the enemy is stunned.',
    coreMechanic: 'Stunner — long-range Daze via sniping plus off-field Aftershock, with a continuously building Stun multiplier.',
    builds: [
      {
        name: 'Aftershock Stun',
        focus: 'Push CRIT Rate high (~90%) to unlock the full Additional Ability Daze increase.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/495167',
      },
    ],
    keyItems: [
      { name: 'Spectral Gaze (W-Engine)', note: 'Signature; 24% CRIT Rate substat and DEF reduction on Aftershock hits.' },
      { name: 'Shadow Harmony (4pc) + Woodpecker Electro (2pc)', note: 'Aftershock-focused disc profile per Game8.' },
    ],
    strengths: [
      'Long-range Daze through sniping.',
      'Off-field damage via Aftershock.',
      'Stun multiplier keeps rising even before the enemy is stunned.',
    ],
    weaknesses: [
      'Reliant on her signature W-Engine for optimal performance.',
      'Raw Daze output is lower than some other S-Rank Stunners.',
    ],
    tierRationale: 'Tier 0 ranged Stunner; a flexible control pick for Electric Shiyu Defense and Deadly Assault teams.',
    skills: ['Cold-Bore Shot', 'Flash Burial', 'Stygian Guide', 'Underworld Requiem', 'Soul-Searching Gaze'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/495167', 'https://www.prydwen.gg/zenless/characters/trigger', G8, IV],
  },
  // ---- Tier 1+ (S) ----
  {
    slug: 'evelyn-chevalier',
    name: 'Evelyn Chevalier',
    aliases: ['Evelyn'],
    role: 'Attack (Main DPS)',
    rarity: 'S-Rank',
    element: 'Fire',
    pveTier: 'S',
    overview:
      'A Fire Attack agent who binds and groups enemies with "Binding Seal" chain mechanics, then dumps huge Chain and Ultimate damage. High built-in CRIT Rate means minimal crit investment. She remains a top-tier on-field DPS in v3.0.',
    coreMechanic: 'Attack DPS — on-field carry built around Chain Attacks and binding enemies for CRIT bonuses.',
    builds: [
      {
        name: 'Signature Chain DPS',
        focus: 'Max CRIT and Chain damage via her signature engine.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/490872',
      },
    ],
    keyItems: [
      { name: 'Heartstring Nocturne (W-Engine)', note: 'Signature best-in-slot.' },
      { name: 'Woodpecker Electro (4pc) + Inferno Metal (2pc)', note: 'CRIT profile plus Fire DMG.' },
    ],
    strengths: [
      'Chain Attacks hit extremely hard.',
      'Groups small enemies easily.',
      'High innate CRIT Rate; Additional Ability only needs a Stun or Support teammate.',
    ],
    weaknesses: [
      'Large damage gap between her signature W-Engine and alternatives.',
      'Lacks a fully dedicated Drive Disc set.',
    ],
    tierRationale: 'Game8 Tier 1+ overall and DPS; a strong, reliable Fire carry across Shiyu Defense and Deadly Assault.',
    skills: ['Garrote', 'Binding Sunder', 'Lunalux - Snare', 'Lunalux Garrote', 'Entangle'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/490872', 'https://www.prydwen.gg/zenless/characters/evelyn', G8, IV],
  },
  {
    slug: 'vivian',
    name: 'Vivian',
    role: 'Anomaly',
    rarity: 'S-Rank',
    element: 'Ether',
    pveTier: 'S',
    overview:
      'An Ether Anomaly agent from Angels of Delusion who deals off-field damage via Guard Feathers/Featherbloom while inflicting Corruption and amplifying team Disorder. A premier Anomaly enabler and sub-DPS in v3.0.',
    coreMechanic: 'Anomaly — off-field Ether damage and Disorder amplification.',
    builds: [
      {
        name: 'Anomaly Off-field',
        focus: 'Stack Anomaly Proficiency/Mastery for Disorder output.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/503828',
      },
    ],
    keyItems: [
      { name: 'Flight of Fancy (W-Engine)', note: 'Signature; F2P alternative Rainforest Gourmet noted.' },
      { name: "Phaethon's Melody (4pc) + Chaos Jazz (2pc)", note: 'Anomaly/Disorder disc profile.' },
    ],
    strengths: [
      'Strong Disorder DMG and boosts it for teammates.',
      'Consistent off-field damage via Guard Feathers.',
      'F2P-friendly options.',
    ],
    weaknesses: [
      'Needs a second Anomaly unit to shine.',
      'Team-comp dependent.',
    ],
    tierRationale: 'Game8 Tier 1+ overall and DPS; a staple in dual-Anomaly Shiyu Defense and Deadly Assault teams.',
    skills: ['Featherbloom', 'Song of Silver Wings', 'Violet Requiem', 'Chorus of Celestial Wings', 'Dirge of Destiny'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/503828', 'https://www.prydwen.gg/zenless/characters/vivian', G8, IV],
  },
  {
    slug: 'soldier-0-anby',
    name: 'Soldier 0 - Anby',
    role: 'Attack (Main DPS)',
    rarity: 'S-Rank',
    element: 'Electric',
    pveTier: 'S',
    overview:
      'An Electric Attack DPS who marks enemies with Silver Star and stacks White Thunder, spending stacks on Special Attacks for high-damage Aftershocks. A mobile, on-field ramp carry.',
    coreMechanic: 'Attack DPS — on-field Electric carry via Silver Star / White Thunder stack consumption.',
    builds: [
      {
        name: 'Crit Aftershock DPS',
        focus: 'CRIT DMG engine plus an Aftershock/Dash disc set.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/495109',
      },
    ],
    keyItems: [
      { name: 'Severed Innocence (W-Engine)', note: 'Signature best-in-slot.' },
      { name: 'Shadow Harmony (4pc) + Woodpecker Electro (2pc)', note: 'Aftershock/CRIT disc profile.' },
    ],
    strengths: [
      'Very mobile gameplay.',
      'Huge fully-stacked EX Special damage.',
      'Straightforward stack-building kit that pairs with common Stun/Support.',
    ],
    weaknesses: [
      'Must stay on-field to ramp White Thunder.',
      'Limited off-field presence; wants specific premium teammates for comfort.',
    ],
    tierRationale: 'Game8 Rank S / Tier 1+ overall and DPS; a strong single-target carry in Shiyu Defense and Deadly Assault.',
    skills: ['Penetrating Shock', 'Azure Flash', 'Sundering Bolt', 'Leaping Thunderstrike', 'Voidstrike', 'Voltage Gap'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/495109', 'https://www.icy-veins.com/zenless-zone-zero/soldier-0-anby-guide-best-builds', G8, IV],
  },
  {
    slug: 'tsukishiro-yanagi',
    name: 'Tsukishiro Yanagi',
    aliases: ['Yanagi'],
    role: 'Anomaly (Main DPS)',
    rarity: 'S-Rank',
    element: 'Electric',
    pveTier: 'S',
    overview:
      'An Electric Anomaly DPS centered on "Polarity Disorder" — triggering Disorder without consuming existing Anomalies. She delivers high Disorder output and slots into many Anomaly cores.',
    coreMechanic: 'Anomaly DPS — Electric carry driven by Polarity/Disorder damage.',
    builds: [
      {
        name: 'Mono-Electric Disorder',
        focus: 'Signature engine plus an Electric Anomaly disc setup.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/474448',
      },
    ],
    keyItems: [
      { name: 'Timeweaver (W-Engine)', note: 'Signature; F2P alternative Weeping Gemini.' },
      { name: 'Thunder Metal (4pc) + Chaos Jazz (2pc)', note: 'Chaos Jazz 4pc is the dual-element alternative.' },
    ],
    strengths: [
      'High Disorder DMG.',
      'Synergizes with non-Electric Anomaly units.',
      'Low-energy EX Specials; accessible despite complex kit text.',
    ],
    weaknesses: [
      'Damage drops off outside Disorder scenarios.',
      'Peaks mainly in premium comps.',
    ],
    tierRationale: 'Rated strongly (Game8 Tier 0 overall / Tier 1+ DPS); consistently effective across Shiyu Defense and Deadly Assault.',
    skills: ['Tsukoyomi Kagura', 'Gekka Ruten', 'Celestial Harmony', 'Raiei Tenge', 'Lunar Eclipse'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/474448', 'https://www.prydwen.gg/zenless/characters/yanagi', G8, IV],
  },
  {
    slug: 'burnice-white',
    name: 'Burnice White',
    aliases: ['Burnice'],
    role: 'Anomaly (Sub-DPS)',
    rarity: 'S-Rank',
    element: 'Fire',
    pveTier: 'S',
    overview:
      'A Fire Anomaly agent who applies Burn/Scorched off-field via her Nitro-Fuel Cocktail heat mechanic, providing strong Afterburn supplementary damage. A go-to off-field Fire Anomaly enabler.',
    coreMechanic: 'Anomaly sub-DPS — off-field Fire, Burn/Afterburn application.',
    builds: [
      {
        name: 'Off-field Burn',
        focus: 'Anomaly Proficiency plus off-field energy generation.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/464323',
      },
    ],
    keyItems: [
      { name: 'Flamemaker Shaker (W-Engine)', note: 'Signature best-in-slot.' },
      { name: 'Chaos Jazz (4pc) + Inferno Metal (2pc)', note: 'Anomaly/Fire disc profile (Freedom Blues 2pc also cited).' },
    ],
    strengths: [
      'Easily inflicts Burn.',
      'Strong Afterburn supplementary damage.',
      'Simple, accessible playstyle.',
    ],
    weaknesses: [
      'Needs consistent Energy Regen for rotations.',
      'Best comps often lean on limited units.',
    ],
    tierRationale: 'Game8 Tier 1+ overall and DPS; a durable off-field pick across Shiyu Defense and Deadly Assault.',
    skills: ['Mixed Flame Blend', 'Intense Heat Stirring Method', 'Fuel-Fed Flame', 'Glorious Inferno', 'Nitro-Fuel Cocktail'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/464323', 'https://www.prydwen.gg/zenless/characters/burnice', G8, IV],
  },
  {
    slug: 'lighter',
    name: 'Lighter',
    role: 'Stun',
    rarity: 'S-Rank',
    element: 'Fire',
    pveTier: 'S',
    overview:
      'A Fire Stun agent who builds Morale to enter a powered state, cutting enemy resistance and granting the team Fire/Ice DMG via Elation stacks (up to +75% at 270 Impact). A premier Stunner for Fire/Ice DPS cores.',
    coreMechanic: 'Stunner — Fire Impact enabler that buffs team Fire/Ice DMG.',
    builds: [
      {
        name: 'Impact Stun',
        focus: 'Max Impact and Daze while buffing team Fire/Ice DMG.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/474509',
      },
    ],
    keyItems: [
      { name: 'Blazing Laurel (W-Engine)', note: 'Signature best-in-slot.' },
      { name: 'King of the Summit (4pc) + Swing Jazz (2pc)', note: 'Current Game8 profile (older guides cite Shockstar Disco 4pc).' },
    ],
    strengths: [
      'Strong stun and Daze capability.',
      'Buffs party Fire and Ice DMG.',
      'Smooth skill transitions.',
    ],
    weaknesses: [
      'Only effective on Fire/Ice-centric teams.',
      'Best paired with premium DPS.',
    ],
    tierRationale: 'Game8 Tier 1+; a top Stunner for Hugo and Fire/Ice teams in Deadly Assault.',
    skills: ['L-Form Thundering Fist', 'V-Form Sunrise Uppercut - Full Distance', 'V-Form Scorching Sun', 'W-Form Crowned Inferno', 'Accelerant'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/474509', 'https://www.icy-veins.com/zenless-zone-zero/lighter-guide-best-builds', G8, IV],
  },
  {
    slug: 'hugo-vlad',
    name: 'Hugo Vlad',
    aliases: ['Hugo'],
    role: 'Attack (Main DPS)',
    rarity: 'S-Rank',
    element: 'Ice',
    pveTier: 'S',
    overview:
      "An Ice Attack agent from Mockingbird whose \"Totalize\" burst damage scales with an enemy's remaining stun duration, delivering enormous EX Special and Ultimate hits. A burst-focused DPS that demands a stun-heavy team.",
    coreMechanic: 'Attack DPS — Ice burst carry whose Totalize damage scales on stun duration.',
    builds: [
      {
        name: 'Stun-burst DPS',
        focus: 'Crit-heavy burst under Totalize windows.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/504291',
      },
    ],
    keyItems: [
      { name: 'Myriad Eclipse (W-Engine)', note: 'Signature; F2P alternative Marcato Desire.' },
      { name: 'Woodpecker Electro (4pc) + Branch & Blade Song (2pc)', note: 'CRIT profile (Hormone Punk 4pc is a near-BiS alternative).' },
    ],
    strengths: [
      'Incredibly powerful EX Special and Ultimate.',
      'Self-buffs in Dark Abyss Reverb; Totalize amplifies versus stunned enemies.',
      'Builds Daze during Totalize.',
    ],
    weaknesses: [
      'Reliant on enemies being stunned.',
      'Needs high CRIT Rate for reliable Totalize; team-building limited by scarce Stunners.',
    ],
    tierRationale: 'Game8 Tier 1+ overall and DPS; elite burst in dual-Stun Deadly Assault teams (best with Lighter/Lycaon).',
    skills: ['Dark Abyss Quartet', 'Soul Hunter - Punishment', 'Trick of Fate', 'Blaspheme', 'Terminating Verdict'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/504291', 'https://www.prydwen.gg/zenless/characters/hugo', G8, IV],
  },
  {
    slug: 'alice-thymefield',
    name: 'Alice Thymefield',
    aliases: ['Alice'],
    role: 'Anomaly (Main DPS)',
    rarity: 'S-Rank',
    element: 'Physical',
    pveTier: 'S',
    overview:
      'A Physical Anomaly agent who builds "Blade Etiquette," spending it on charged Basic Attacks for "Polarized Assault" and frequent Assault/Disorder triggers. A strong on-field Physical Anomaly DPS.',
    coreMechanic: 'Anomaly DPS — Physical carry via Blade Etiquette into Assault/Disorder.',
    builds: [
      {
        name: 'Assault Anomaly',
        focus: 'Anomaly Mastery ≥140 plus Physical DMG.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/527839',
      },
    ],
    keyItems: [
      { name: 'Practiced Perfection (W-Engine)', note: 'Signature; Sharpened Stinger a strong alternative.' },
      { name: 'Fanged Metal (4pc) + Freedom Blues (2pc)', note: 'Assault/anomaly disc profile.' },
    ],
    strengths: [
      'Triggers Assault frequently.',
      'Enables Disorder with other Physical Anomaly units.',
      'Easy to play — fast Blade Etiquette fill.',
    ],
    weaknesses: [
      'Best teams need other limited S-Ranks.',
      'Leans heavily on her signature W-Engine for top damage.',
    ],
    tierRationale: 'Game8 Tier 1+ overall and DPS; solid in Physical Anomaly/Disorder Shiyu Defense and Deadly Assault comps.',
    skills: ['Starshine Waltz', 'Piercing Dawn', 'Aurora Thrust', 'Starfall Finale', 'Twin Rainbows of the Swordheart'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/527839', 'https://www.icy-veins.com/zenless-zone-zero/alice-thymefield-guide-best-builds', G8, IV],
  },
  {
    slug: 'aria',
    name: 'Aria',
    role: 'Anomaly',
    rarity: 'S-Rank',
    element: 'Ether',
    pveTier: 'S',
    overview:
      'An Ether Anomaly DPS from Angels of Delusion who generates and consumes "Fandom Power" for charged plunging attacks that trigger "Abloom" damage on corrupted enemies. A newer but fully documented main Anomaly DPS in v3.0.',
    coreMechanic: 'Anomaly DPS — Ether carry via Fandom Power into Abloom plunging damage.',
    builds: [
      {
        name: 'Abloom Anomaly DPS',
        focus: 'Max Anomaly Mastery to power her Core Skill.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/572601',
      },
    ],
    keyItems: [
      { name: 'Angel in the Shell (W-Engine)', note: 'Signature best-in-slot.' },
      { name: "Shining Aria (4pc) + Phaethon's Melody (2pc)", note: 'Chaos Jazz / Freedom Blues 2pc also viable.' },
    ],
    strengths: [
      'Massive Ether and Abloom DMG.',
      'Straightforward, easy-to-learn kit.',
      'Signature plunging attacks hit hard.',
    ],
    weaknesses: [
      'Needs her signature W-Engine to reach max Anomaly Mastery.',
      'Best teams require other limited S-Rank enablers.',
    ],
    tierRationale: 'Game8 Tier 1+ overall and DPS; a strong current-patch Ether Anomaly carry in Shiyu Defense and Deadly Assault.',
    skills: ['Perfect Pitch', 'Full-Sugar Electronica', 'Dream Collab', 'Moment of Delusion', 'Innate Stage Presence'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/572601', 'https://www.prydwen.gg/zenless/characters/aria', G8, IV],
  },
  {
    slug: 'zhao',
    name: 'Zhao',
    role: 'Defense',
    rarity: 'S-Rank',
    element: 'Ice',
    pveTier: 'S',
    overview:
      'An Ice Defense agent from the Krampus Compliance Authority — an off-field defensive support who banks Frostbite, then swaps in to trigger "Ether Veil: Wellspring" for squad-wide ATK buffs, healing and a charged Ice slash. An HP-scaling buffer (~27,000 HP for the max CRIT Rate buff).',
    coreMechanic: 'Defense/Support — HP-scaling, off-field Frostbite into Ether Veil team buffs and healing.',
    builds: [
      {
        name: 'HP Defensive Support',
        focus: 'Stack HP for team buffs and healing.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/565599',
      },
    ],
    keyItems: [
      { name: 'Half-Sugar Bunny (W-Engine)', note: 'Signature; alternatives Original Transmorpher and Bunny Band.' },
      { name: 'Bunny in Wonderland (4pc) + Yunkui Tales (2pc)', note: 'HP/support profile (Swing Jazz / Moonlight Lullaby 2pc also cited).' },
    ],
    strengths: [
      'Accessible healing via Special Attack.',
      "Ether Veil buffs the whole squad's ATK.",
      'Flexible into all Attack and Anomaly teams; accessible W-Engine options.',
    ],
    weaknesses: [
      'Not clearly best-in-slot in any single team.',
      'Less specialized than dedicated supports.',
    ],
    tierRationale: 'Game8 Tier 1+ Support; a universal, low-friction support option for Shiyu Defense and Deadly Assault.',
    skills: ['Final Verdict', 'Shatterfrost Surge', 'Frostflow Tundra', 'Bunny Barrage', 'Ideal Colleague'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/565599', 'https://www.icy-veins.com/zenless-zone-zero/zhao-guide-best-builds', G8, IV],
  },
  // ---- Tier 1 (A) — strong older S-Rank units ----
  {
    slug: 'jane-doe',
    name: 'Jane Doe',
    aliases: ['Jane'],
    role: 'Anomaly (Main DPS)',
    rarity: 'S-Rank',
    element: 'Physical',
    pveTier: 'A',
    overview:
      'A Physical Anomaly DPS who spams Assault procs, builds Passion, and converts Anomaly buildup into Anomaly-CRIT Assault damage. Still a strong, self-sufficient anomaly carry in v3.0 but power-crept out of the top tier — a high-investment pick that shines when the rotation favors Assault.',
    coreMechanic: 'Anomaly DPS — rapid Physical (Assault) application in her Passion State.',
    builds: [
      {
        name: 'Signature Anomaly',
        focus: 'Sharpened Stinger + Fanged Metal for maximum Assault frequency.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/461990',
      },
    ],
    keyItems: [
      { name: 'Sharpened Stinger (W-Engine)', note: 'Signature; Physical DMG plus Anomaly Buildup Rate.' },
      { name: 'Fanged Metal (4pc) + Freedom Blues (2pc)', note: '4pc powers her frequent Assaults; 2pc adds Anomaly Proficiency.' },
    ],
    strengths: [
      'Extremely fast, consistent Physical Anomaly buildup.',
      'Excellent mobility (three dashes) and self-sufficient carry.',
      'Unique Anomaly-CRIT scaling.',
    ],
    weaknesses: [
      'Complex to pilot; multipliers designed for older content scaling.',
      'Hurt by anti-Assault Shiyu rotations; needs high investment to stay relevant.',
    ],
    tierRationale: 'Dropped to A-tier in the 3.0 list — a Shiyu Defense niche pick, strong only when the rotation favors Assault/anomaly as enemy HP pools ballooned.',
    skills: ['Salchow Jump', 'Aerial Sweep', 'Flowers of Sin', 'Final Curtain', 'Insight'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/461990', G8, IV],
  },
  {
    slug: 'ellen-joe',
    name: 'Ellen Joe',
    aliases: ['Ellen'],
    role: 'Attack (Main DPS)',
    rarity: 'S-Rank',
    element: 'Ice',
    pveTier: 'A',
    overview:
      'A launch-era Ice Attack hypercarry built around Flash Freeze charges and burst Ice basics/specials. A v2.6 buff smoothed her Flash Freeze rotation, but she now sits mid-tier versus the current meta leaders — a strong pick only in dedicated Ice/Stun teams.',
    coreMechanic: 'Attack DPS — dodge into Roaming State to bank Flash Freeze charges, then unload empowered Ice hits.',
    builds: [
      {
        name: 'Ice Hypercarry',
        focus: 'Deep Sea Visitor + Polar Metal in an Ice/Stun team.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/436877',
      },
    ],
    keyItems: [
      { name: 'Deep Sea Visitor (W-Engine)', note: 'Signature; +Ice DMG and CRIT Rate on Basic hit.' },
      { name: 'Polar Metal (4pc) + Woodpecker Electro (2pc)', note: '4pc boosts Ice Basic/Dash DMG; 2pc adds CRIT.' },
    ],
    strengths: [
      'High single-target Ice burst.',
      'Strong mobility and fast dodge; smooth rotation post-buff.',
      'Excellent with Ice supports and stunners.',
    ],
    weaknesses: [
      'Very team-dependent (wants Ice/Stun enablers).',
      'Single-target focused; multipliers lag current HP inflation.',
    ],
    tierRationale: 'Fell to A-tier; a Shiyu Defense niche pick that shines only when the rotation aligns with her Ice-team setup.',
    skills: ['Flash Freeze Trimming', 'Sharknami', 'Avalanche', 'Endless Winter', 'Sharp-Toothed'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/436877', 'https://www.prydwen.gg/zenless/characters/ellen', G8, IV],
  },
  {
    slug: 'qingyi',
    name: 'Qingyi',
    role: 'Stun',
    rarity: 'S-Rank',
    element: 'Electric',
    pveTier: 'A',
    overview:
      "An Electric Stun agent whose Core (Subjugation stacks) raises the stunned enemy's Stun DMG Multiplier. Her raw Daze is modest but her damage-amp on stunned targets keeps her one of the most durable-value launch agents in v3.0.",
    coreMechanic: "Stunner — fast multi-hit Basics generate Impact/Daze; her Core amplifies the DPS's damage on the stunned foe.",
    builds: [
      {
        name: 'Stun Amplifier',
        focus: 'Ice-Jade Teapot + Shockstar Disco to max Daze and stun-amp.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/460407',
      },
    ],
    keyItems: [
      { name: 'Ice-Jade Teapot (W-Engine)', note: 'Signature; Impact scaling via "Ringing Melody".' },
      { name: 'Shockstar Disco (4pc) + Swing Jazz (2pc)', note: '4pc raises Daze; 2pc adds Energy Regen.' },
    ],
    strengths: [
      "Raises the stunned enemy's damage multiplier (team-wide amp).",
      'Fast Impact generation.',
      'Low investment threshold; pairs with any Attacker.',
    ],
    weaknesses: [
      'Weaker raw Daze than some stunners.',
      'Contributes little personal DMG; leans on quick-swap uptime.',
    ],
    tierRationale: 'The least power-crept of this group — Stunners age well because they scale with the carry, not enemy HP; still a valued A-tier control pick.',
    skills: ['Enchanted Moonlit Blossoms', 'Moonlit Begonia', 'Tranquil Serenade', 'Eight Sounds of Ganzhou', 'Eternal Seasons'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/460407', 'https://www.prydwen.gg/zenless/characters/qingyi', G8, IV],
  },
  {
    slug: 'zhu-yuan',
    name: 'Zhu Yuan',
    role: 'Attack (Main DPS)',
    rarity: 'S-Rank',
    element: 'Ether',
    pveTier: 'A',
    overview:
      'An Ether Attack DPS who fires Enhanced Shotshells for heavy ranged Ether burst against stunned targets. One of the first meta carries; still viable with investment but no longer efficient versus the current top roster — needs a strong stunner to shine.',
    coreMechanic: 'Attack DPS — build and dump Enhanced Shotshells for amplified Ether damage on stunned enemies.',
    builds: [
      {
        name: 'Shotshell Burst',
        focus: 'Riot Suppressor Mk VI + Chaotic Metal for stun-window burst.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/448244',
      },
    ],
    keyItems: [
      { name: 'Riot Suppressor Mark VI (W-Engine)', note: 'Signature; CRIT plus Enhanced-Shotshell/Basic DMG.' },
      { name: "Chaotic Metal (4pc) + Woodpecker Electro (2pc)", note: "Classic Ether BiS (Dawn's Bloom 4pc is a newer alternative)." },
    ],
    strengths: [
      'High burst Ether damage from safe range.',
      'Strong stun-window payoff.',
      'Simple, readable rotation; works with any support + stunner.',
    ],
    weaknesses: [
      'Heavily stun-reliant; front-loaded burst window.',
      'Multipliers designed for early content; efficiency lags modern carries.',
    ],
    tierRationale: 'Dropped to A-tier — remains viable with high investment but no longer efficient against current top agents as enemy HP scaled up.',
    skills: ['Please Do Not Resist', 'Full Barrage', 'Max Eradication Mode', 'Special Ops Ammunition'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/448244', 'https://www.prydwen.gg/zenless/characters/zhu-yuan', G8, IV],
  },
  {
    slug: 'asaba-harumasa',
    name: 'Asaba Harumasa',
    aliases: ['Harumasa'],
    role: 'Attack (Main DPS)',
    rarity: 'S-Rank',
    element: 'Electric',
    pveTier: 'A',
    overview:
      'An Electric Attack DPS from Section 6 who plants Electro Quivers, marks enemies (X-Mark) to enter Awakened state, then bursts with empowered Dash Attacks. A CRIT-stacking carry that stays serviceable in v3.0 but sits below the newest top-tier DPS.',
    coreMechanic: 'Attack DPS — generate Electro Quivers, X-Mark enemies, then burst in Awakened state with empowered Dash Attacks.',
    builds: [
      {
        name: 'CRIT Dash Carry',
        focus: 'Zanshin Herb Case + Electric CRIT discs for Awakened Dash burst.',
        url: 'https://game8.co/games/Zenless-Zone-Zero/archives/483077',
      },
    ],
    keyItems: [
      { name: 'Zanshin Herb Case (W-Engine)', note: 'Signature; CRIT DMG/Rate plus Electric DMG.' },
      { name: 'Woodpecker Electro (4pc) + Branch & Blade Song (2pc)', note: 'Electric CRIT profile; 2pc adds +16% CRIT DMG.' },
    ],
    strengths: [
      'Big Awakened Dash Attack burst.',
      'Huge innate CRIT Rate from Core + signature frees CRIT DMG substats.',
      'Benefits from ally anomaly to fuel Quivers; F2P-friendly team (Anby + Nicole).',
    ],
    weaknesses: [
      'Setup-dependent (needs X-Marks/Awakened uptime).',
      'Single-target lean; outclassed by newer Electric carries.',
    ],
    tierRationale: 'A solid mid-tier Electric DPS in the 3.0 era — no longer a top-tier meta pick versus current top agents.',
    skills: ['Cloud Piercer', 'Hiten no Tsuru - Slash', 'Nowhere to Run - Patrol', 'Zanshin - Scattered Blossoms', 'Day Break'],
    sources: ['https://game8.co/games/Zenless-Zone-Zero/archives/483077', G8, IV],
  },
];
