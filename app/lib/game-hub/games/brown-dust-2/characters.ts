import type { ClassRecord } from '@/app/lib/game-hub/types';

// Brown Dust 2 unit roster. In BD2 the pullable unit is a costume, so each
// entry is a costume with its own rarity/role/element and PvE (Story) / PvP
// (Mirror War) tier. Fields are omitted when the source lists no value; every
// unit carries at least one source (cite-or-drop).
export const CHARACTERS: ClassRecord[] = [
  {
    slug: 'apostle-morpeah',
    name: 'Apostle Morpeah',
    role: 'Attacker (DPS)',
    rarity: '5★',
    element: 'Water',
    pveTier: 'S',
    bossTier: 'S',
    guildTier: 'A',
    overview:
      'Widely rated the strongest unit in the game — a water magic dealer who summons self-destructing spectres to both damage and set up the field. Her Apostle kit stacks Concentrated Fire and Vulnerability onto summons for enormous focused burst, and the Preemptive option lets her summons exist from turn 1.',
    coreMechanic:
      'Summon-based magic DPS: creates personas/spectres that self-destruct for damage while applying Concentrated Fire + Vulnerability to funnel team damage into one target.',
    builds: [
      {
        name: 'Boss Raid magic nuker',
        focus: 'Max M.ATK / Crit DMG; summon-then-detonate rotation for single-target fiend burst.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-morpeah/',
      },
    ],
    keyItems: [
      { name: 'Travel God\'s Friend', note: 'Craftable UR magic weapon — top M.ATK base for magic dealers.' },
      { name: 'Shackle of Treachery', note: 'Craftable UR magic gloves from Tower of Pride.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit-damage accessory for DPS; push toward UR4.' },
    ],
    strengths: [
      'Best-in-slot single-target/boss damage via Concentrated Fire funnelling',
      'Summons act as extra bodies and preemptive setup on turn 1',
      'On-element Water coverage for a huge share of endgame stages',
    ],
    weaknesses: [
      'Reward is highest inside magic teams built around her (Helena, vulnerability debuffers)',
      'Summon micromanagement and positioning add piloting complexity',
    ],
    tierRationale:
      'Top Story and Boss Raid placement comes from her funnelled single-target ceiling; Guild sits a notch lower (A) because sustained multi-part raids reward chainers/DoT over burst.',
    skills: ['Black Order (Apostle)', 'Villain Persona (Summer Vacation)', "Daydream's Call (Daydream Bunny)"],
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/pve-tier-list/',
      'https://dotgg.gg/brown-dust-2/character-guide-morpeah/',
      'https://www.propelrc.com/ultimate-brown-dust-2-tier-list/',
    ],
  },
  {
    slug: 'apostle-blade',
    name: 'Apostle Blade',
    role: 'Attacker (Counterattack DPS)',
    rarity: '5★',
    element: 'Dark',
    pveTier: 'S',
    bossTier: 'S',
    guildTier: 'S',
    overview:
      'The game\'s first Apostle and a defining Dark physical dealer built around a team-wide counterattack. When struck she retaliates against every enemy, making her exceptional in fiend hunts and guild raids where she can rack up multi-hit counters.',
    coreMechanic:
      'Counterattack DPS: her Abyssal Gaze counter is the only one in the game that hits the whole enemy team, converting incoming hits into repeated AoE physical damage.',
    builds: [
      {
        name: 'Guild Raid / Fiend Hunt counter DPS',
        focus: 'Stack ATK/Crit DMG and pair with a taunt/aggro setup so she is hit and counters repeatedly.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-blade/',
      },
    ],
    keyItems: [
      { name: 'Evil Dragon\'s Blade', note: 'Craftable UR physical weapon for high ATK/crit base.' },
      { name: 'God-King\'s Silver Arm', note: 'Craftable UR physical gloves from Tower of Pride.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit-damage accessory; push toward UR4.' },
    ],
    strengths: [
      'Unique whole-team counterattack — huge value in sustained raid content',
      'Very high per-counter multiplier (reported up to ~2700%)',
      'Covers Dark-weak content as a top-tier physical dealer',
    ],
    weaknesses: [
      'Low personal HP — fragile if not managed',
      'Long (~5-turn) cooldown means uptime depends on being hit on schedule',
    ],
    tierRationale:
      'S across Story, Boss Raid and Guild Raid: the team-wide counter scales with the many-enemy, many-turn nature of raids, which is exactly where her ceiling is highest.',
    skills: ['Abyssal Gaze'],
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/character-guide-blade/',
      'https://dotgg.gg/brown-dust-2/banner-guide-apostle-blade/',
    ],
  },
  {
    slug: 'deadeye-nekyndalia',
    name: 'Deadeye Nekyndalia',
    role: 'Attacker (Single-target Sniper)',
    rarity: '5★',
    element: 'Wind',
    pveTier: 'S',
    overview:
      'A limited Wind magic sniper considered one of the strongest magic attackers overall. Her Mark mechanic ignores evasion, and her exceptionally deep vertical range lets her hit backline targets other units cannot reach.',
    coreMechanic:
      'Mark-based sniper: applies an unevadable Mark before the first hit, then delivers multi-hit vertical/column magic damage that punishes single targets and backlines.',
    builds: [
      {
        name: 'Boss Raid / backline sniper',
        focus: 'Max M.ATK / Crit DMG; use deep range to reach protected backline targets.',
        url: 'https://dotgg.gg/brown-dust-2/banner-guide-deadeye-nekyndalia/',
      },
    ],
    keyItems: [
      { name: 'Travel God\'s Friend', note: 'Craftable UR magic weapon for M.ATK scaling.' },
      { name: 'Shackle of Treachery', note: 'Craftable UR magic gloves.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Mark ignores evasion — reliable against dodge-heavy enemies',
      'Deep vertical reach hits backline targets',
      'Top-tier Wind magic single-target output',
    ],
    weaknesses: [
      'Single-target focus means lower value in wide wave-clear',
      'Limited costume — investment/availability dependent',
    ],
    tierRationale:
      'S in Story on the strength of her evasion-piercing, backline-reaching single-target damage in a Wind slot that covers much endgame content.',
    skills: ['Mark (evasion-ignoring debuff)'],
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/banner-guide-deadeye-nekyndalia/',
    ],
  },
  {
    slug: 'nebris',
    name: 'Nebris',
    role: 'Attacker (Single-target burst)',
    rarity: '5★',
    element: 'Wind',
    pveTier: 'S',
    bossTier: 'A',
    guildTier: 'A',
    overview:
      'A Wind physical burst dealer who stacks self-buffs across her costumes, then cashes them in for a single massive nuke. Her New Hire costume scales explicitly with the number of buffs she is holding, rewarding a full self-setup rotation.',
    coreMechanic:
      'Buff-stacking nuke: layer DMG/Crit/ATK self-buffs (Gatekeeper\'s Power, You Started It!) then convert them into a buff-count-scaling burst (Let Me Give It a Go).',
    builds: [
      {
        name: 'Boss burst nuker',
        focus: 'Self-buff for 1–2 turns, then fire the buff-scaling nuke on a high-value target.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-nebris/',
      },
    ],
    keyItems: [
      { name: 'Evil Dragon\'s Blade', note: 'Craftable UR physical weapon.' },
      { name: 'God-King\'s Silver Arm', note: 'Craftable UR physical gloves.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Extremely high single-target ceiling after setup',
      'Self-sufficient buffs reduce reliance on external buffers',
      'Scales hard with banner copies (+3 extends ATK buff duration)',
    ],
    weaknesses: [
      'Needs a setup turn — weaker in fast clears',
      'Investment-sensitive; buff conditions require positioning',
    ],
    tierRationale:
      'S in Story for her burst ceiling; Boss/Guild sit at A because the setup-then-nuke pattern is less efficient across long multi-target raids than sustained dealers.',
    skills: ["Gatekeeper's Power (Labyrinth Gatekeeper)", 'You Started It! (Laid-back Lifeguard)', 'Let Me Give It a Go (New Hire)'],
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/pve-tier-list/',
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://dotgg.gg/brown-dust-2/character-guide-nebris/',
    ],
  },
  {
    slug: 'bikini-agent-sylvia',
    name: 'Bikini Agent Sylvia',
    role: 'Attacker (DPS)',
    rarity: '5★',
    element: 'Water',
    pveTier: 'S',
    bossTier: 'S',
    guildTier: 'S',
    overview:
      'Rated the best Water DPS in the game currently. Her signature trick is extending the duration of her own buffs, so she can front-load offensive stat stacks and keep them live across an endgame boss rotation.',
    coreMechanic:
      'Buff-extension DPS: Bikini Blaster deals heavy physical damage while extending all of her active buffs by 2 turns, letting her stack and sustain offensive stats.',
    builds: [
      {
        name: 'Water Boss/Guild DPS',
        focus: 'Stack self-buffs, extend them with Bikini Blaster, then sustain high physical output.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-sylvia/',
      },
    ],
    keyItems: [
      { name: 'Evil Dragon\'s Blade', note: 'Craftable UR physical weapon.' },
      { name: 'God-King\'s Silver Arm', note: 'Craftable UR physical gloves.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Top Water DPS with flexible, self-sustaining buff uptime',
      'Strong in both single-target and endgame sustained fights',
      'S across all three PvE axes — a universal Water carry',
    ],
    weaknesses: [
      'Mostly raw damage — leans on external vulnerability/DEF-shred to peak',
      'Best value requires the buff-extension rotation to be piloted correctly',
    ],
    tierRationale:
      'Straight S in Story, Boss Raid and Guild Raid: buff extension keeps her damage curve high across both short and long fights, making her the default Water carry.',
    skills: ['Bikini Blaster'],
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/pve-tier-list/',
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://dotgg.gg/brown-dust-2/character-guide-sylvia/',
    ],
  },
  {
    slug: 'naive-lady-elise',
    name: 'Naive Lady Elise',
    role: 'Attacker (DPS Carry)',
    rarity: '5★',
    element: 'Fire',
    pveTier: 'S',
    overview:
      'A Fire carry costume that flips Elise\'s traditional support/utility identity into a battlefield-wide nuke. She scales up to a huge (~330%) damage amplification, turning her into a hyper-carry in Fire-weak content.',
    coreMechanic:
      'Amplify-and-nuke carry: converts utility uptime into a scaling damage-amplification window, then delivers wide Fire damage.',
    builds: [
      {
        name: 'Fire wave-clear carry',
        focus: 'Build for amplification uptime, then blanket Fire-weak stages with amplified AoE.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-elise/',
      },
    ],
    keyItems: [
      { name: 'Evil Dragon\'s Blade', note: 'Craftable UR physical weapon (match her costume damage type).' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Massive damage amplification ceiling',
      'Battlefield-wide coverage for Fire content',
    ],
    weaknesses: [
      'Reward concentrated in Fire-weak stages',
      'Needs the amplification setup to reach its ceiling',
    ],
    tierRationale:
      'S in Story as a Fire hyper-carry; her amplification scaling makes her a premier wave-clear option where Fire is on-element.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://dotgg.gg/brown-dust-2/character-guide-elise/',
      'https://dotgg.gg/brown-dust-2/banner-guide-naive-lady-elise/',
    ],
  },
  {
    slug: 'violent-student-kry',
    name: 'Violent Student Kry',
    role: 'Attacker (F2P-friendly DPS)',
    rarity: '5★',
    element: 'Dark',
    pveTier: 'S',
    overview:
      'A Dark dealer/debuffer that punches far above its cost — a 4-cast unit repeatedly flagged as a must-have for F2P and newer accounts. Kry costumes are the go-to armour/DEF-piercing answer when a normal DPS gets walled by tanky enemies.',
    coreMechanic:
      'Cheap repeatable caster: low-SP skills that pierce armour / reduce DEF, letting budget teams break high-defence walls without premium units.',
    builds: [
      {
        name: 'F2P Story DPS / DEF-breaker',
        focus: 'Slot as the accessible DEF-shred + damage core beside starter buffers.',
        url: 'https://dotgg.gg/brown-dust-2/reroll-guide/',
      },
    ],
    strengths: [
      'Exceptional value for a low-rarity, low-SP unit',
      'DEF/armour piercing solves early-account content walls',
      'F2P-accessible — a genuine must-have for new players',
    ],
    weaknesses: [
      'Ceiling below premium limited DPS in optimized endgame teams',
      'More of a workhorse than a hyper-carry',
    ],
    tierRationale:
      'S in Story is efficiency-driven: cheap 4-cast damage plus DEF-shred makes her one of the best accessible carries for clearing the campaign.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
    ],
  },
  {
    slug: 'young-lady-blade',
    name: 'Young Lady Blade',
    role: 'Attacker (AoE burst)',
    rarity: '5★',
    pveTier: 'S',
    pvpTier: 'S',
    overview:
      'A Dark physical costume that doubles as a single-target vulnerability applier. Ruthless Fervor stacks 100% Physical Vulnerability on the main target while multi-hitting, so she both nukes and softens a boss for the rest of the team.',
    coreMechanic:
      'Vulnerability nuker: Ruthless Fervor applies 100% Physical Vulnerability (4 turns) to the main target across a 4-hit attack, enabling physical carries to spike.',
    builds: [
      {
        name: 'Single-target vulnerability enabler',
        focus: 'Open with Ruthless Fervor to plant Physical Vulnerability, then let physical DPS follow up.',
        url: 'https://dotgg.gg/brown-dust-2/banner-guide-young-lady-blade/',
      },
    ],
    keyItems: [
      { name: 'Evil Dragon\'s Blade', note: 'Craftable UR physical weapon.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Self-contained damage + 100% single-target physical vulnerability',
      'Strong in both Story and Mirror War',
    ],
    weaknesses: [
      'Vulnerability is single-target — less value in wide AoE farm',
      'Relies on physical carries to fully exploit the debuff',
    ],
    tierRationale:
      'S in both Story and Mirror War because a self-sufficient nuke that also plants heavy physical vulnerability fits offensive comps in either mode.',
    skills: ['Ruthless Fervor'],
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/pvp-tier-list/',
      'https://dotgg.gg/brown-dust-2/banner-guide-young-lady-blade/',
    ],
  },
  {
    slug: 'venaka',
    name: 'Venaka',
    rarity: '5★',
    pveTier: 'S',
    bossTier: 'A',
    guildTier: 'A',
    overview:
      'A Wind hybrid who blends damage with rare support utility. Her Wind Dancer costume is the first source of Wind vulnerability in the game — up to 150% in a square with 100% uptime — so she amplifies a Wind team while still contributing damage herself.',
    coreMechanic:
      'Hybrid vulnerability support: applies persistent AoE Wind vulnerability (square pattern, ~100% uptime) while doubling as a damage dealer.',
    builds: [
      {
        name: 'Wind vulnerability enabler',
        focus: 'Maintain the Wind-vulnerability square to boost the whole Wind team, adding chip damage.',
        url: 'https://dotgg.gg/brown-dust-2/costume-guide-wind-dancer-venaka/',
      },
    ],
    keyItems: [
      { name: 'Buff/debuff-uptime gear', note: 'Favour debuff-effect and survivability substats so the vulnerability stays applied.' },
    ],
    strengths: [
      'Only Wind vulnerability source with near-100% uptime',
      'Hybrid: buffs the team and still deals damage',
      'Stabilizes and amplifies Wind comps',
    ],
    weaknesses: [
      'Best value locked to Wind-focused teams',
      'Support ceiling depends on strong Wind carries alongside',
    ],
    tierRationale:
      'S in Story as a Wind enabler; Boss/Guild at A because single-element vulnerability is narrower than universal amplifiers in mixed raid rosters.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://vortexgaming.io/en/postdetail/616661',
      'https://dotgg.gg/brown-dust-2/character-guide-venaka/',
    ],
  },
  {
    slug: 'liatris',
    name: 'Liatris',
    rarity: '5★',
    element: 'Fire',
    pveTier: 'S',
    overview:
      'A Fire magic dealer built around damage-over-time and DoT payoff. Her DoT costumes seed burns/ailments, while her Maid Name R costume is a huge 3×3 AoE nuke that is amplified against enemies already afflicted with any DoT.',
    coreMechanic:
      'DoT-and-detonate: apply DoT with one costume, then fire a wide 3×3 AoE nuke that scales up against DoT-afflicted enemies.',
    builds: [
      {
        name: 'Fire DoT AoE carry',
        focus: 'Seed DoT, then cash in Maid Name R\'s 3×3 nuke against the ailing pack.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-liatris/',
      },
    ],
    keyItems: [
      { name: 'Travel God\'s Friend', note: 'Craftable UR magic weapon.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Wide 3×3 AoE that dwarfs single-hit peers in wave clear',
      'DoT synergy amplifies her own nuke',
      'Low SP cost on her AoE with first potential unlocked',
    ],
    weaknesses: [
      'Per-hit damage lower than dedicated single-target nukers',
      'Wants a DoT setup to reach peak amplification',
    ],
    tierRationale:
      'S in Story because a cheap, amplified 3×3 Fire nuke is best-in-class for multi-enemy clear.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/character-guide-liatris/',
    ],
  },
  {
    slug: 'levia',
    name: 'Levia',
    rarity: '5★',
    pveTier: 'S',
    bossTier: 'A',
    guildTier: 'A',
    overview:
      'A central Fire magic nuker and, in her Toxic Fantasy variant, a magic-vulnerability debuffer that spikes magic teams against bosses. Her Overheat costume specializes in AoE nuking that is massively boosted against vulnerability-flagged enemies.',
    coreMechanic:
      'Fire magic nuke + magic-vulnerability: single-target and AoE burst, with a costume that stacks magic vulnerability to multiply magic DPS.',
    builds: [
      {
        name: 'Fire magic nuker',
        focus: 'Max M.ATK/Crit DMG; Night of Jealousy for single-target, Overheat for amplified AoE.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-levia/',
      },
    ],
    keyItems: [
      { name: 'Travel God\'s Friend', note: 'Craftable UR magic weapon.' },
      { name: 'Shackle of Treachery', note: 'Craftable UR magic gloves.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Very high single-target Fire magic damage (Night of Jealousy)',
      'Overheat scales hard vs vulnerability-flagged enemies',
      'Can pull double duty as magic-vulnerability support',
    ],
    weaknesses: [
      'AoE variant leans on vulnerability setup for full value',
      'Magic-team dependent to peak',
    ],
    tierRationale:
      'S in Story as a core Fire nuker; Boss/Guild at A since her biggest spikes need vulnerability setup and magic-team scaffolding.',
    skills: ['Track and Field Team Captain', 'Night of Jealousy', 'Overheat'],
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://vortexgaming.io/en/postdetail/616661',
      'https://dotgg.gg/brown-dust-2/character-guide-levia/',
    ],
  },
  {
    slug: 'loen',
    name: 'Loen',
    rarity: '5★',
    pveTier: 'S',
    overview:
      'One of the hardest-hitting magic units in the game, a Fire dealer whose big explosive AoE hits a reported ~750% multiplier. Her Last Hope and Celebrity Bunny costumes are wide AoE nukes, while Track and Field grants her a self M.ATK buff.',
    coreMechanic:
      'Explosive Fire AoE: high-multiplier magic detonations (Descending Inferno / EMP Flash) with a self-M.ATK buff costume for setup.',
    builds: [
      {
        name: 'Fire AoE nuker',
        focus: 'Self-buff M.ATK, then blanket packs with high-multiplier AoE explosions.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-loen/',
      },
    ],
    keyItems: [
      { name: 'Travel God\'s Friend', note: 'Craftable UR magic weapon.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Among the highest magic multipliers in the game (~750%)',
      'Wide AoE for efficient Fire wave clear',
      'Self M.ATK buff reduces external buff needs',
    ],
    weaknesses: [
      'PvE-oriented; limited Mirror War relevance',
      'Fire on-element requirement to maximize value',
    ],
    tierRationale:
      'S in Story: raw multiplier and wide AoE make her one of the best Fire clearers in PvE.',
    skills: ['Descending Inferno', 'Explosive Dive!', 'EMP Flash'],
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/character-guide-loen/',
    ],
  },
  {
    slug: 'yuri',
    name: 'Yuri',
    rarity: '5★',
    pveTier: 'S',
    overview:
      'A Physical Light DPS who grants herself no-strings self-buffs and reaches her best form when her Whitebolt and Comeback Idol costumes are run together. Whitebolt provides an ATK buff plus dispel utility; Comeback Idol layers a Crit DMG buff.',
    coreMechanic:
      'Self-buffing Light carry: stacks her own ATK and Crit DMG across two costumes (with dispel utility) for reliable, independent damage.',
    builds: [
      {
        name: 'Light physical carry',
        focus: 'Pair Whitebolt (ATK + dispel) with Comeback Idol (Crit DMG) for a self-sufficient carry.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-yuri/',
      },
    ],
    keyItems: [
      { name: 'Evil Dragon\'s Blade', note: 'Craftable UR physical weapon.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Self-buffs with no conditions — plug-and-play damage',
      'Light element is not weak to anything',
      'Built-in dispel utility on Whitebolt',
    ],
    weaknesses: [
      'Best form needs both costumes',
      'Pure damage — little team utility beyond the dispel',
    ],
    tierRationale:
      'S in Story as a consistent, self-sufficient Light physical carry that fits almost any PvE team.',
    skills: ["Let's Sing Together! (Whitebolt)", 'Fluttering Heart... Bang! (Comeback Idol)'],
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/character-guide-yuri/',
    ],
  },
  {
    slug: 'samay',
    name: 'Samay',
    rarity: '5★',
    element: 'Dark',
    pveTier: 'S',
    overview:
      'Samay anchors budget support shells: the Kind Student Samay costume (a cheap ATK/M.ATK buffer) is a staple beginner buff, and paired with Arines it delivers a well-known ~+120% ATK / +30% Crit package for early teams. Higher-rarity Samay costumes push into strong Dark damage.',
    coreMechanic:
      'Accessible attack buffer: cheap ATK/M.ATK team buff that stacks with other supports to hit high early-game damage multipliers.',
    strengths: [
      'Cheap, accessible team ATK/M.ATK buff',
      'Cornerstone of the beginner Arines + Samay support shell',
    ],
    weaknesses: [
      'The budget buff costume is low-impact once premium supports come online',
      'Value is as a buffer, not a standalone carry',
    ],
    tierRationale:
      'S reflects how universally useful an accessible attack buffer is across Story content, especially for lower-investment accounts.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://browndust2.miraheze.org/wiki/Samay',
    ],
  },
  {
    slug: 'sentana',
    name: 'Sentana',
    rarity: '5★',
    pveTier: 'S',
    overview:
      'Sentana sits in the top Story tier as a strong attacker, though her public English kit documentation is thin compared with the meta headliners. Aggregator tier lists place her at S while giving little detail on her exact costumes and multipliers.',
    coreMechanic:
      'Top-tier Story attacker (specific kit details sparsely documented in English sources).',
    strengths: [
      'Consistently placed in the top Story tier',
      'Strong offensive output in PvE clears',
    ],
    weaknesses: [
      'Limited English kit/skill documentation to verify specifics',
      'Less discussed than the headline meta carries',
    ],
    tierRationale:
      'S in Story per aggregate tier lists; treated as a strong PvE attacker even though granular kit data is sparse.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/pve-tier-list/',
    ],
  },
  {
    slug: 'eclipse',
    name: 'Eclipse',
    rarity: '5★',
    pveTier: 'S',
    overview:
      'A Dark magic dealer defined by SP manipulation and MRES shred. Nightmare Bunny drains enemy SP while shredding Magic Resistance and generating her own SP; Dimension Witch self-heals and drains SP; Beach Vacation is a straightforward high-damage hit.',
    coreMechanic:
      'SP-control magic DPS: attacks that shred MRES and starve enemy SP (crippling PvP setups) while refunding her own.',
    builds: [
      {
        name: 'Dark magic DPS / SP denial',
        focus: 'Use Nightmare Bunny to shred MRES + drain SP, then follow with high-damage casts.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-eclipse/',
      },
    ],
    keyItems: [
      { name: 'Travel God\'s Friend', note: 'Craftable UR magic weapon.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'MRES shred amplifies the whole magic team',
      'SP drain disrupts enemy rotations',
      'Self SP generation keeps her online',
    ],
    weaknesses: [
      'Reward is highest in magic-leaning comps',
      'Utility-heavy costumes trade some raw damage',
    ],
    tierRationale:
      'S in Story: MRES shred plus SP economy makes her both a damage amp and a disruptor in PvE magic teams.',
    skills: ['Dream Eater (Nightmare Bunny)', 'Terra Drain (Dimension Witch)'],
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/character-guide-eclipse/',
    ],
  },
  {
    slug: 'luvencia',
    name: 'Luvencia',
    rarity: '5★',
    pveTier: 'S',
    bossTier: 'A',
    guildTier: 'A',
    overview:
      'A Dark physical dealer with strong damage plus team-amplifying utility, which is why she shows up as a flexible S-tier pick across element teams. Her limited costumes push her damage ceiling further while adding DEF-shred / amplification effects.',
    coreMechanic:
      'Physical Dark DPS with utility: high personal damage layered with team damage-amplification / DEF-shred depending on costume.',
    builds: [
      {
        name: 'Dark physical DPS / amp',
        focus: 'Slot as a flexible physical carry that also amplifies team damage.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-luvencia/',
      },
    ],
    keyItems: [
      { name: 'Evil Dragon\'s Blade', note: 'Craftable UR physical weapon.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'High raw damage plus useful team utility',
      'Flexible into many element teams',
    ],
    weaknesses: [
      'Best versions are limited-costume dependent',
      'More "top DPS" than a comp centerpiece',
    ],
    tierRationale:
      'S in Story for damage + utility flexibility; Boss/Guild at A because she is outscaled there by dedicated raid chainers and DoT dealers.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://vortexgaming.io/en/postdetail/616661',
      'https://dotgg.gg/brown-dust-2/character-guide-luvencia/',
    ],
  },
  {
    slug: 'beachside-angel-teresse',
    name: 'Beachside Angel Teresse',
    rarity: '5★',
    pveTier: 'S',
    overview:
      'A limited Teresse costume that functions as a chain-conditional damage buffer rather than a pure healer. "P-proud to Show Skin!" grants +100% damage to targets carrying 5 or fewer chains, layering multiplicative damage on top of ordinary ATK buffs.',
    coreMechanic:
      'Damage-dealt buffer: applies a conditional +100% damage-dealt buff (targets with ≤5 chains), stacking multiplicatively with ATK buffs and vulnerability.',
    builds: [
      {
        name: 'Damage-amp support',
        focus: 'Pair with primary ATK buffers so her damage-dealt buff multiplies the carry\'s output.',
        url: 'https://dotgg.gg/brown-dust-2/costume-guide-beachside-angel-teresse/',
      },
    ],
    keyItems: [
      { name: 'Buff-duration / support gear', note: 'Prioritize buff-duration and survivability so the buff stays applied.' },
    ],
    strengths: [
      'Multiplicative damage-dealt buff (separate from ATK buffs)',
      'High ceiling in optimized buff-stacking comps',
    ],
    weaknesses: [
      'Chain-count condition on the target',
      'Little value if you already lack strong primary carries',
    ],
    tierRationale:
      'S in Story because a multiplicative damage-dealt buff is among the most valuable support effects for pushing damage in stacked comps.',
    skills: ['P-proud to Show Skin!'],
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/character-guide-teresse/',
      'https://dotgg.gg/brown-dust-2/costume-guide-beachside-angel-teresse/',
    ],
  },
  {
    slug: 'beachside-justice-michaela',
    name: 'Beachside Justice Michaela',
    rarity: '5★',
    pveTier: 'S',
    overview:
      'A Light magic dealer and a key piece of the Michaela hyper-carry package. Beachside Justice provides strong on-turn magic damage that is dramatically amplified once Acting Archbishop Michaela\'s 500% crit-damage buff is active on prior turns.',
    coreMechanic:
      'Light magic carry: high-multiplier magic damage designed to consume Acting Archbishop\'s crit-damage buff for a huge amplified payoff.',
    builds: [
      {
        name: 'Light magic hyper-carry',
        focus: 'Prime with Acting Archbishop\'s Crit DMG buff, then cash in Beachside Justice\'s magic burst.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-michaela/',
      },
    ],
    keyItems: [
      { name: 'Travel God\'s Friend', note: 'Craftable UR magic weapon.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Very high amplified magic damage inside the Michaela package',
      'Light element covers a large slice of endgame content',
    ],
    weaknesses: [
      'Peak output needs Michaela\'s other costumes (Acting Archbishop / QoS)',
      'Buff-window dependent rotation',
    ],
    tierRationale:
      'S in Story as the payoff half of the Michaela crit-damage combo, delivering top Light magic burst when set up.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/character-guide-michaela/',
    ],
  },
  {
    slug: 'magical-innovator-diana',
    name: 'Magical Innovator Diana',
    role: 'Supporter (Elemental Buffer)',
    rarity: '5★',
    element: 'Wind',
    pveTier: 'S',
    overview:
      'A Wind support summoner whose robot repeatedly buffs allies with property damage. The summon applies an X-shape ~50% property buff per turn, stacking up to 4× — worth ~200% property damage in shorter fights and up to ~400% in long guild raids.',
    coreMechanic:
      'Summon buffer: a persistent robot re-casts an X-shape property-damage buff each turn, stacking to 4× for enormous elemental amplification in long fights.',
    builds: [
      {
        name: 'Elemental (Wind) property-buff support',
        focus: 'Build survivability so the summon persists and stacks property buffs to 4×.',
        url: 'https://dotgg.gg/brown-dust-2/banner-guide-magical-innovator-diana/',
      },
    ],
    keyItems: [
      { name: 'Buff-duration / defensive gear', note: 'HP/DEF and buff-duration keep Diana and her summon alive to maintain stacks.' },
    ],
    strengths: [
      'Up to 4× stacking property-damage buff for the whole team',
      'Scales best in long fights (guild raids)',
      'Excellent in any elemental-focused comp, especially Wind',
    ],
    weaknesses: [
      'Low impact in short fights before stacks build',
      'Needs a property-damage team to fully exploit',
    ],
    tierRationale:
      'S in Story: stacking property-damage amplification is a premier support effect for element-focused teams and long PvE fights.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/banner-guide-magical-innovator-diana/',
    ],
  },
  {
    slug: 'pure-white-blessing-refithea',
    name: 'Pure White Blessing Refithea',
    role: 'Supporter (Buffer, crit/attack buffs)',
    rarity: '5★',
    element: 'Light',
    pveTier: 'S',
    overview:
      'One of only two property-damage buffers in the game and a top offensive enabler — frequently credited with enabling one-turn clears. "Let\'s Be Happy Together!" raises Property DMG and, for two turns, adds a Chain on every attack, feeding chain-based carries.',
    coreMechanic:
      'Property-damage + chain buffer: raises team Property DMG and stacks extra Chains per attack, powering both elemental and chain comps.',
    builds: [
      {
        name: 'Offensive property/chain buffer',
        focus: 'Open with the property + chain buff so carries burst in a single amplified window.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-refithea/',
      },
    ],
    keyItems: [
      { name: 'Buff-duration / support gear', note: 'Buff-duration and survivability substats keep her enabling window live.' },
    ],
    strengths: [
      'Rare property-damage buff — enables one-turn clears',
      'Adds Chains, powering chain-based carries',
      'Both offensive and (in other costumes) sustain utility',
    ],
    weaknesses: [
      'Reward is highest in property/chain-oriented teams',
      'Modest personal damage — a pure enabler',
    ],
    tierRationale:
      'S in Story as a best-in-class offensive buffer; property-damage amplification is scarce and directly enables the highest-damage clears.',
    skills: ["Let's Be Happy Together!"],
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://dotgg.gg/brown-dust-2/pve-tier-list/',
      'https://dotgg.gg/brown-dust-2/character-guide-refithea/',
    ],
  },
  {
    slug: 'earth-mother-believer-priestess',
    name: 'Earth Mother Believer Priestess',
    role: 'Supporter (Healer)',
    rarity: '5★',
    element: 'Light',
    pveTier: 'S',
    overview:
      'A limited Light support prized for boss survivability. Her Holy Light SP applies AoE magic Vulnerability (≈50% for 2 turns) while dealing meaningful magic damage (~250% M.ATK), so she blends protection/utility with amplification rather than being a pure healer.',
    coreMechanic:
      'Protective magic-vulnerability support: wide AoE magic vulnerability plus damage, re-cast each turn, with a kit that counters dangerous boss patterns.',
    builds: [
      {
        name: 'Boss survival + magic-vuln support',
        focus: 'Sustain HP/DEF/RES; maintain AoE magic vulnerability while chipping damage.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-priestess/',
      },
    ],
    keyItems: [
      { name: 'Defensive / RES gear', note: 'HP/DEF/RES and healing/barrier substats to survive boss burst.' },
    ],
    strengths: [
      'Strong protection/utility vs dangerous boss mechanics',
      'AoE magic vulnerability doubles as amplification',
      'Contributes real damage on top of support',
    ],
    weaknesses: [
      'Must re-cast each turn (SP-hungry)',
      'Vulnerability value (~75% at cap) trails dedicated debuffers',
    ],
    tierRationale:
      'S in Story: a protective support that also amplifies magic damage is a must-have for hard boss content, even if pure debuffers push higher vulnerability.',
    skills: ['Holy Light SP'],
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/character-guide-priestess/',
    ],
  },
  {
    slug: 'palette-shattered-dream',
    name: 'Palette (Shattered Dream)',
    role: 'Supporter (Debuff Extender)',
    rarity: '5★',
    element: 'Dark',
    pveTier: 'S',
    bossTier: 'S',
    guildTier: 'S',
    overview:
      'A unique Dark support whose whole identity is extending debuffs already on the enemy by 2 turns (one player turn), on top of a strong 800% 3×3 AoE hit for just 3 SP. In guild raids she can even extend Redeeming Strike vulnerability for an extra 200% window.',
    coreMechanic:
      'Debuff extender: prolongs enemy debuffs — vulnerability, stat-downs, silence, DoT — by 2 turns while dealing big AoE magic damage.',
    builds: [
      {
        name: 'Raid debuff extender',
        focus: 'Follow a vulnerability applier (e.g. Sonya) to keep two vulnerability layers live at once.',
        url: 'https://dotgg.gg/brown-dust-2/banner-guide-shattered-dream-palette/',
      },
    ],
    keyItems: [
      { name: 'Travel God\'s Friend', note: 'Craftable UR magic weapon (her AoE deals magic damage).' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Extends every debuff type — multiplies debuffer value',
      'Strong 800% 3×3 AoE at only 3 SP',
      'Huge in long fiend hunts / guild raids',
    ],
    weaknesses: [
      'Nearly irrelevant in PvP (fights end too fast)',
      'Single costume; value scales with how many debuffers you run',
    ],
    tierRationale:
      'S across Story, Boss and Guild because debuff extension compounds the game\'s multiplicative vulnerability meta in exactly the long fights raids demand.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://dotgg.gg/brown-dust-2/banner-guide-shattered-dream-palette/',
    ],
  },
  {
    slug: 'shadowed-dream-sonya',
    name: 'Shadowed Dream Sonya',
    role: 'Supporter (Debuffer / damage amp)',
    rarity: '5★',
    element: 'Dark',
    pveTier: 'S',
    pvpTier: 'S',
    bossTier: 'A',
    guildTier: 'A',
    overview:
      'A premier Dark vulnerability debuffer whose all-element mode fits into virtually any team. With dark mode off (attacking first) she applies ~125% all-element vulnerability; with dark mode on (after 5+ chains) she applies ~175% dark-only vulnerability.',
    coreMechanic:
      'Mode-switching vulnerability: ~125% universal vulnerability, or ~175% dark vulnerability once 5+ chains are stacked — a multiplicative team damage amp.',
    builds: [
      {
        name: 'Universal vulnerability enabler',
        focus: 'Lead with all-element vulnerability for mixed teams; switch to dark mode with chain support.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-sonya/',
      },
    ],
    keyItems: [
      { name: 'Debuff-uptime gear', note: 'Debuff-effect and survivability substats to keep vulnerability applied.' },
    ],
    strengths: [
      'All-element vulnerability fits any comp',
      'Higher dark-only vulnerability for dedicated Dark teams',
      'Works across PvE and PvP',
    ],
    weaknesses: [
      'Dark mode needs chain setup (5+ chains)',
      'A pure amp — no carry-level personal damage',
    ],
    tierRationale:
      'S in Story and Mirror War for universal vulnerability; Boss/Guild at A because single-target raid vulnerability specialists edge her out there.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/character-guide-sonya/',
      'https://vortexgaming.io/en/postdetail/616661',
    ],
  },
  {
    slug: 'dark-saintess-liberta',
    name: 'Dark Saintess Liberta',
    role: 'Supporter (physical-team support)',
    rarity: '5★',
    pveTier: 'S',
    overview:
      'One of the premier physical attack buffers, treated primarily as a buffer despite decent personal damage. Prayer of Duality raises ally ATK and Crit Rate (base +35% ATK / +25% Crit), scaling up to roughly +115% ATK and +50% Crit at full potential.',
    coreMechanic:
      'Physical attack buffer: team-wide ATK + Crit Rate buff (Prayer of Duality) that anchors nearly every physical DPS comp.',
    builds: [
      {
        name: 'Physical-team ATK/Crit buffer',
        focus: 'Prioritize buff potency and uptime so ATK/Crit stay maxed for physical carries.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-liberta/',
      },
    ],
    keyItems: [
      { name: 'Buff-potency / support gear', note: 'Buff-potency and survivability so she stays on-field as a long-duration buffer.' },
    ],
    strengths: [
      'Excellent team ATK + Crit Rate buff',
      'Decent personal damage on top of buffing',
      'Fits almost every physical DPS comp',
    ],
    weaknesses: [
      'No benefit to magic teams',
      'Timing/positioning needed to maximize buff coverage',
    ],
    tierRationale:
      'S in Story as a near-mandatory physical buffer; ATK + Crit is the baseline stat package that physical carries are balanced around.',
    skills: ['Prayer of Duality'],
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/pve-tier-list/',
      'https://dotgg.gg/brown-dust-2/character-guide-liberta/',
    ],
  },
  {
    slug: 'acting-archbishop-michaela',
    name: 'Acting Archbishop Michaela',
    role: 'Supporter (Debuffer)',
    rarity: '5★',
    pveTier: 'S',
    pvpTier: 'S',
    bossTier: 'S',
    overview:
      'A Light magic enabler built to supercharge the rest of the Michaela package. At full potential Acting Archbishop grants a ~500% Crit DMG buff for 6 turns (and deals ~200% damage), but the effect slashes her own DEF/M.RES by 90%, so she is glassy after casting.',
    coreMechanic:
      'Crit-damage enabler: a ~500% Crit DMG team buff over 6 turns that primes Michaela\'s other costumes for enormous amplified magic bursts.',
    builds: [
      {
        name: 'Crit-DMG hyper-carry enabler',
        focus: 'Gear M.ATK/M.ATK% over Crit DMG (the buff scales better with less gear crit DMG); prime, then swap to her carry costumes.',
        url: 'https://dotgg.gg/brown-dust-2/banner-guide-acting-archbishop-michaela/',
      },
    ],
    keyItems: [
      { name: 'Travel God\'s Friend', note: 'Craftable UR magic weapon — favour M.ATK/M.ATK% substats over Crit DMG.' },
      { name: 'Shackle of Treachery', note: 'Craftable UR magic gloves.' },
    ],
    strengths: [
      '~500% Crit DMG buff for 6 turns — a massive amplifier',
      'Strong versus Dark Fiend Hunts',
      'S across Story, Mirror War and Boss Raid',
    ],
    weaknesses: [
      'Self -90% DEF/M.RES — extremely fragile after casting',
      'Long cooldown; needs Michaela\'s other costumes to pay off',
    ],
    tierRationale:
      'S in Story, Mirror War and Boss Raid: a 6-turn 500% Crit DMG buff is one of the strongest amplification windows in the game despite her self-fragility.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/pvp-tier-list/',
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://dotgg.gg/brown-dust-2/banner-guide-acting-archbishop-michaela/',
    ],
  },
  {
    slug: 'b-rank-helena',
    name: 'B-Rank Helena',
    role: 'Supporter (magic-team support)',
    rarity: '4★',
    pveTier: 'A',
    overview:
      'A 4★ magic support widely used as the backbone of magic teams — a strong M.ATK buffer and SP battery that keeps magic carries (Morpeah, Levia) cycling their skills. Cheap to obtain, she over-performs her rarity as a support shell.',
    coreMechanic:
      'Magic buffer + SP battery: boosts team M.ATK and floods SP so magic DPS can rotate ultimates every turn.',
    builds: [
      {
        name: 'Magic-team SP battery',
        focus: 'Buff-duration + SP-per-turn substats; keep her alive to sustain the SP economy.',
        url: 'https://dotgg.gg/brown-dust-2/pve-tier-list/',
      },
    ],
    strengths: [
      'Strong M.ATK buff for the whole magic team',
      'SP battery enables consistent skill rotations',
      '4★ and accessible — huge value for the cost',
    ],
    weaknesses: [
      'Almost no personal damage — dead slot in physical comps',
      'Needs decent team-building to feel broken rather than merely good',
    ],
    tierRationale:
      'A in Story because she is a magic-only enabler; within magic teams she plays well above her tier, but her utility does not translate to physical comps.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/pve-tier-list/',
    ],
  },
  {
    slug: 'empress-rubia',
    name: 'Empress Rubia',
    role: 'Attacker (DPS)',
    rarity: '5★',
    pveTier: 'A',
    pvpTier: 'S',
    overview:
      'A Fire AoE dealer whose Empress of the Ocean skill combines wide coverage with DEF shred — a 6-hit attack (one of the highest hit counts in the game) applying ~45% DEF reduction. Her large AoE makes her a standout PvP threat where a single cast can catch multiple enemies.',
    coreMechanic:
      'Wide AoE + DEF shred: a 6-hit area attack that reduces enemy DEF by ~45%, giving unmatched field coverage among DEF-shredders.',
    builds: [
      {
        name: 'Mirror War AoE shredder',
        focus: 'Exploit her large AoE to catch 2+ enemies and shred DEF for the team on offense or defense.',
        url: 'https://dotgg.gg/brown-dust-2/costume-guide-empress-of-the-ocean-rubia/',
      },
    ],
    keyItems: [
      { name: 'Evil Dragon\'s Blade', note: 'Craftable UR physical weapon.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Largest AoE coverage among DEF-shredders',
      'High 6-hit count with ~45% DEF reduction',
      'Wins Mirror War games on AoE surprise factor',
    ],
    weaknesses: [
      'DEF shred less pivotal in single-target PvE bosses',
      'Wants a physical team to translate the shred into damage',
    ],
    tierRationale:
      'S in Mirror War for game-swinging AoE + DEF shred; A in Story because single-target boss content values focused damage over her wide coverage.',
    skills: ['Empress of the Ocean'],
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/pvp-tier-list/',
      'https://dotgg.gg/brown-dust-2/character-guide-rubia/',
    ],
  },
  {
    slug: 'pool-party-justia',
    name: 'Pool Party Justia',
    role: 'Defender (evasion tank)',
    rarity: '5★',
    element: 'Light',
    pvpTier: 'S',
    overview:
      'A top Mirror War evasion tank. Her evasion costs only 1 SP and, at full potential (+5), can be kept up every turn for a net SP gain, letting her soak attacks indefinitely. She also deals fixed damage, which bypasses the DEF of well-geared PvP opponents.',
    coreMechanic:
      'Sustainable evasion + fixed damage: near-free evasion uptime to tank hits, plus DEF-ignoring fixed damage that shines against geared PvP defenses.',
    builds: [
      {
        name: 'Mirror War evasion tank',
        focus: 'Cycle 1-SP evasion every turn to soak damage while chipping with fixed damage.',
        url: 'https://dotgg.gg/brown-dust-2/costume-guide-pool-party-justia/',
      },
    ],
    strengths: [
      'Near-permanent evasion for ~1 SP (net SP gain at +5)',
      'Fixed damage bypasses enemy DEF in PvP',
      'Premier Mirror War defensive anchor',
    ],
    weaknesses: [
      'Fixed damage is a handicap in PvE scaling',
      'Evasion can be bypassed by unevadable/Mark effects',
    ],
    tierRationale:
      'S in Mirror War: cheap perpetual evasion plus DEF-ignoring fixed damage is exactly what wins PvP stalls; her PvE value is comparatively low.',
    sources: [
      'https://dotgg.gg/brown-dust-2/pvp-tier-list/',
      'https://dotgg.gg/brown-dust-2/costume-guide-pool-party-justia/',
    ],
  },
  {
    slug: 'apostle-olivier',
    name: 'Apostle Olivier',
    role: 'Defender (evasion tank)',
    rarity: '5★',
    pvpTier: 'S',
    overview:
      'A Light Apostle used as a Mirror War evasion tank and disruptive front-liner, and a solid Light attacker in PvE. Her value in PvP is soaking offense through evasion while her allies set up.',
    coreMechanic:
      'Evasion front-liner: dodges incoming attacks to stall PvP exchanges while contributing damage/utility.',
    strengths: [
      'Strong evasion-based PvP survivability',
      'Doubles as a usable Light attacker in PvE',
    ],
    weaknesses: [
      'Evasion is bypassed by unevadable / Mark effects',
      'Not a dedicated damage centerpiece',
    ],
    tierRationale:
      'S in Mirror War as an evasion anchor; her damage is fine in PvE but her defining value is PvP disruption.',
    sources: [
      'https://dotgg.gg/brown-dust-2/pvp-tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
    ],
  },
  {
    slug: 'dark-knight-lathel',
    name: 'Dark Knight Lathel',
    role: 'Defender (guard / damage reduction)',
    rarity: '5★',
    pvpTier: 'S',
    overview:
      'A Mirror War defender built around guarding allies and reducing incoming damage, giving PvP teams a durable front line that buys turns for carries. A guard/damage-reduction anchor rather than a damage threat.',
    coreMechanic:
      'Guard tank: damage-reduction / protective effects that shield the backline and blunt enemy burst in PvP.',
    strengths: [
      'Reliable damage reduction / protection for the team',
      'Buys tempo for PvP setups',
    ],
    weaknesses: [
      'Minimal offensive pressure',
      'Value is largely PvP-specific',
    ],
    tierRationale:
      'S in Mirror War as a protective anchor; a durable guard front line is a persistent PvP archetype even without damage.',
    sources: [
      'https://dotgg.gg/brown-dust-2/pvp-tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
    ],
  },
  {
    slug: 'iron-monarch-wilhelmina',
    name: 'Iron Monarch Wilhelmina',
    role: 'Attacker (pre-battle Earth damage)',
    rarity: '5★',
    element: 'Earth',
    pveTier: 'A',
    pvpTier: 'S',
    bossTier: 'A',
    guildTier: 'S',
    overview:
      'A physical Wilhelmina costume that deals pre-battle damage and serves as a guild-raid staple, with strong Mirror War presence. High physical output, though she is outclassed by other picks in some PvP matchups.',
    coreMechanic:
      'Pre-battle physical striker: front-loads damage before the fight starts and anchors sustained physical raid comps.',
    builds: [
      {
        name: 'Guild Raid physical DPS',
        focus: 'Stack ATK/Crit DMG; leverage pre-battle damage and sustained hits in long raids.',
        url: 'https://dotgg.gg/brown-dust-2/banner-guide-iron-monarch-wilhelmina/',
      },
    ],
    keyItems: [
      { name: 'Evil Dragon\'s Blade', note: 'Craftable UR physical weapon.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Pre-battle damage adds free burst',
      'Guild-raid staple with high physical DPS',
      'Strong Mirror War pick',
    ],
    weaknesses: [
      'Outclassed by some units in specific PvP matchups',
      'Only A in Story/Boss vs the top single-target carries',
    ],
    tierRationale:
      'S in Mirror War and Guild Raid for pre-battle burst and sustained physical DPS; A in Story/Boss where dedicated single-target carries pull ahead.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://dotgg.gg/brown-dust-2/pvp-tier-list/',
      'https://vortexgaming.io/en/postdetail/616661',
      'https://dotgg.gg/brown-dust-2/banner-guide-iron-monarch-wilhelmina/',
    ],
  },
  {
    slug: 'ocean-vanguard-luvencia',
    name: 'Ocean Vanguard Luvencia',
    rarity: '5★',
    pveTier: 'A',
    overview:
      'A limited Luvencia costume offering solid PvE damage/utility, sitting a tier below the very top carries. A dependable pick when the meta S-tier options are unavailable.',
    coreMechanic:
      'Costume variant of Luvencia — a capable physical damage/utility dealer used as a flexible A-tier option.',
    strengths: [
      'Reliable A-tier PvE damage',
      'Flexible fill when top carries are missing',
    ],
    weaknesses: [
      'Outclassed by base Luvencia\'s best variants and S-tier carries',
      'Limited-costume availability',
    ],
    tierRationale:
      'A in Story: strong but not top-of-meta, serving as a flexible alternative rather than a centerpiece carry.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://dotgg.gg/brown-dust-2/banner-guide-ocean-vanguard-luvencia/',
    ],
  },
  {
    slug: 'deserted-flower-sylvia',
    name: 'Deserted Flower Sylvia',
    role: 'Attacker (Water DPS)',
    rarity: '5★',
    element: 'Water',
    pveTier: 'A',
    overview:
      'A Water DPS Sylvia costume with solid single-target damage — a strong alternative Water carry that sits below Bikini Agent Sylvia in the current meta. A good pick when you want Water coverage without the top limited costume.',
    coreMechanic:
      'Water physical single-target dealer — a reliable Water carry variant.',
    strengths: [
      'Good single-target Water damage',
      'Provides Water coverage as an accessible alternative',
    ],
    weaknesses: [
      'Outscaled by Bikini Agent Sylvia\'s buff-extension kit',
      'Mostly raw damage with limited utility',
    ],
    tierRationale:
      'A in Story: a capable Water carry, just short of the buff-extending Bikini Agent variant that defines the top of the Water tier.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://dotgg.gg/brown-dust-2/character-guide-sylvia/',
    ],
  },
  {
    slug: 'onsen-practitioner-ventana',
    name: 'Onsen Practitioner Ventana',
    rarity: '5★',
    pveTier: 'A',
    bossTier: 'A',
    overview:
      'A Ventana support/utility costume useful in boss content, recently slipping slightly in the meta but still a dependable A-tier pick. Provides team support/sustain that helps stabilize longer fights.',
    coreMechanic:
      'Support/utility unit that aids survivability and team stability in boss fights.',
    strengths: [
      'Useful boss-content support/sustain',
      'Solid A-tier reliability',
    ],
    weaknesses: [
      'Recently trended down in tier movement',
      'Outshined by top-tier dedicated supports',
    ],
    tierRationale:
      'A in Story and Boss Raid: still valuable utility, but edged out by the current best supports after recent meta shifts.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://dotgg.gg/brown-dust-2/character-guide-ventana/',
    ],
  },
  {
    slug: 'wiggle',
    name: 'Wiggle',
    rarity: '5★',
    pveTier: 'A',
    overview:
      'An A-tier PvE unit that fills a solid role in Story content without defining the meta. A dependable option rather than a headline carry.',
    coreMechanic:
      'Solid A-tier Story contributor (kit specifics lightly documented in English aggregators).',
    strengths: [
      'Reliable A-tier Story performance',
      'Useful roster depth',
    ],
    weaknesses: [
      'Not meta-defining',
      'Limited English kit documentation',
    ],
    tierRationale:
      'A in Story: a steady contributor that sits below the top S-tier carries.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://www.pockettactics.com/brown-dust-2/tier-list',
    ],
  },
  {
    slug: 'scheherazade',
    name: 'Scheherazade (Schera)',
    rarity: '5★',
    pveTier: 'A',
    bossTier: 'A',
    guildTier: 'A',
    overview:
      'A Water AoE attacker recently trending up in the tier lists. Good general DPS with area coverage, sitting consistently at A across PvE modes as a flexible clear option.',
    coreMechanic:
      'Water AoE dealer — reliable area damage for wave clear and general PvE.',
    strengths: [
      'Solid AoE Water damage',
      'Recently improved (upward tier movement)',
    ],
    weaknesses: [
      'Below the top single-target carries in raids',
      'General-purpose rather than specialized',
    ],
    tierRationale:
      'A across Story, Boss and Guild: dependable AoE Water damage that clears content well without topping the meta.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://vortexgaming.io/en/postdetail/616661',
    ],
  },
  {
    slug: 'rafina',
    name: 'Rafina',
    rarity: '5★',
    pveTier: 'A',
    bossTier: 'A',
    guildTier: 'A',
    overview:
      'A physical support best known as an AoE physical-vulnerability debuffer, used to amplify physical carries (Sylvia, Dalvi) across multi-enemy stages. She multiplies team physical damage rather than dealing it herself.',
    coreMechanic:
      'AoE physical vulnerability: applies area physical-vulnerability to boost physical DPS across multiple enemies.',
    builds: [
      {
        name: 'AoE physical-vuln support',
        focus: 'Prioritize debuff effect/duration over personal damage; enable physical carries in wide fights.',
        url: 'https://dotgg.gg/brown-dust-2/pve-tier-list/',
      },
    ],
    strengths: [
      'AoE physical vulnerability boosts the whole physical team',
      'Great in multi-enemy stages',
    ],
    weaknesses: [
      'Less critical in single-target boss fights',
      'Needs a mostly-physical team to shine',
    ],
    tierRationale:
      'A across PvE modes: a valuable physical-vuln enabler, though single-target raid specialists and universal debuffers rank higher.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
      'https://vortexgaming.io/en/postdetail/616661',
    ],
  },
  {
    slug: 'rou',
    name: 'Rou',
    rarity: '5★',
    element: 'Dark',
    pveTier: 'A',
    overview:
      'A Dark A-tier unit providing usable PvE damage without defining the meta. Roster depth for Dark content rather than a top carry.',
    coreMechanic:
      'A-tier Dark contributor (kit specifics lightly documented in English aggregators).',
    strengths: [
      'Serviceable Dark A-tier damage',
      'Useful roster flexibility',
    ],
    weaknesses: [
      'Not meta-defining',
      'Limited English kit documentation',
    ],
    tierRationale:
      'A in Story: a steady Dark option that sits below the top S-tier Dark carries.',
    sources: [
      'https://www.pockettactics.com/brown-dust-2/tier-list',
    ],
  },
  {
    slug: 'darian',
    name: 'Darian',
    role: 'Attacker (sustained DoT DPS)',
    rarity: '5★',
    element: 'Fire',
    pveTier: 'S',
    bossTier: 'S',
    guildTier: 'S',
    overview:
      'A sustained damage-over-time specialist whose signature Frostbite stacks tick heavily over multiple turns, with built-in cooldown reduction to keep re-applying it. In long boss and guild fights her stacked DoT out-values burst carries.',
    coreMechanic:
      'Stacking DoT: layers Frostbite (~180% per turn over 5 turns) with cooldown reduction so the damage-over-time keeps refreshing across long fights.',
    builds: [
      {
        name: 'Raid DoT dealer',
        focus: 'Maximize DoT stacks and uptime; excels in fiend hunts / guild raids where fights run long.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-darian/',
      },
    ],
    keyItems: [
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory for DPS.' },
      { name: 'Buff/debuff-uptime gear', note: 'Effect and duration substats help keep DoT stacks refreshing.' },
    ],
    strengths: [
      'Excellent sustained damage in long fights',
      'Cooldown reduction keeps DoT uptime high',
      'S across Story, Boss and Guild',
    ],
    weaknesses: [
      'DoT ramps — weaker in short fights / fast clears',
      'Pairs best with debuff-extenders (Palette) to peak',
    ],
    tierRationale:
      'S across Story, Boss and Guild: stacking DoT scales directly with fight length, making her a raid cornerstone rather than a burst pick.',
    skills: ['Frostbite'],
    sources: [
      'https://www.propelrc.com/ultimate-brown-dust-2-tier-list/',
      'https://dotgg.gg/brown-dust-2/pve-tier-list/',
      'https://vortexgaming.io/en/postdetail/616661',
      'https://dotgg.gg/brown-dust-2/character-guide-darian/',
    ],
  },
  {
    slug: 'mamonir',
    name: 'Mamonir (Mammonir of the Night of Death)',
    role: 'Attacker (magic DPS, crit / HP-scaling)',
    rarity: '5★',
    element: 'Wind',
    bossTier: 'A',
    guildTier: 'A',
    overview:
      'A Wind magic dealer whose kit leans on crit and HP-scaling for damage, used as a raid contributor in Boss and Guild content. A capable A-tier raid dealer rather than a top-of-meta carry.',
    coreMechanic:
      'Crit / HP-scaling magic DPS: damage that scales with crit and health investment for raid burst.',
    strengths: [
      'Solid Wind magic raid damage',
      'Crit/HP scaling rewards focused gearing',
    ],
    weaknesses: [
      'A-tier ceiling below the top raid carries',
      'Wind magic slot competes with Nekyndalia/Venaka',
    ],
    tierRationale:
      'A in Boss and Guild Raid: a useful Wind magic raid dealer that sits under the premier single-target and DoT carries.',
    sources: [
      'https://www.propelrc.com/ultimate-brown-dust-2-tier-list/',
      'https://vortexgaming.io/en/postdetail/616661',
    ],
  },
  {
    slug: 'tyr',
    name: 'Tyr',
    role: 'Attacker (dealer)',
    rarity: '5★',
    pveTier: 'S',
    bossTier: 'A',
    guildTier: 'A',
    overview:
      'A Wind physical dealer favoured for boss content and huge burst. Her Starlight Guardian skill reaches ~1,400% at +5 — reported as the highest unconditional damage multiplier in the game — but it applies a 2-SP cost-increase debuff to her own later casts.',
    coreMechanic:
      'Highest unconditional nuke: a single massive Starlight Guardian hit that trades SP efficiency (2-SP cost increase on later skills) for raw multiplier.',
    builds: [
      {
        name: 'Boss burst nuker',
        focus: 'Max ATK/Crit DMG; land the ~1,400% Starlight Guardian hit on a high-value target.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-tyr/',
      },
    ],
    keyItems: [
      { name: 'Evil Dragon\'s Blade', note: 'Craftable UR physical weapon.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Highest unconditional damage multiplier in the game',
      'Excellent single-target boss burst',
    ],
    weaknesses: [
      'Self SP-cost-increase debuff hurts follow-up casts',
      '6-turn cooldown limits repeat burst',
    ],
    tierRationale:
      'S in Story for her unmatched single-hit ceiling; Boss/Guild at A because the SP-cost penalty and long cooldown cap her sustained raid throughput.',
    skills: ['Starlight Guardian'],
    sources: [
      'https://vortexgaming.io/en/postdetail/616661',
      'https://dotgg.gg/brown-dust-2/pve-tier-list/',
      'https://dotgg.gg/brown-dust-2/character-guide-tyr/',
    ],
  },
  {
    slug: 'celia',
    name: 'Celia',
    role: 'Attacker (raid chain dealer)',
    rarity: '5★',
    bossTier: 'A',
    guildTier: 'A',
    overview:
      'A raid chainer used in chain-based comps, valued for building AoE chain stacks that feed the team\'s chain damage ceiling. Best inside deliberately built chain teams rather than as a standalone carry.',
    coreMechanic:
      'AoE chainer: generates chain stacks across enemies to power chain-synergy damage in raids.',
    strengths: [
      'Enables high-ceiling chain comps (AoE chainer)',
      'Strong in longer raid fights',
    ],
    weaknesses: [
      'Low standalone value outside chain teams',
      'Requires timing/experience to chain correctly',
    ],
    tierRationale:
      'A in Boss and Guild Raid: essential to chain teams, but her value is conditional on a comp built around chain mechanics.',
    sources: [
      'https://vortexgaming.io/en/postdetail/616661',
      'https://dotgg.gg/brown-dust-2/pve-tier-list/',
    ],
  },
  {
    slug: 'zenith',
    name: 'Zenith',
    role: 'Attacker (raid chain dealer)',
    rarity: '5★',
    bossTier: 'A',
    guildTier: 'A',
    overview:
      'A raid utility dealer providing general (all-type) vulnerability plus a concentrated-fire mechanic, so she amplifies both physical and magical teams. More complex to pilot, since skills must align around concentrated-fire windows.',
    coreMechanic:
      'General vulnerability + concentrated fire: amplifies all damage types and focuses team damage onto a target during set windows.',
    strengths: [
      'General vulnerability works for physical and magic teams',
      'Concentrated fire spikes focus damage',
    ],
    weaknesses: [
      'Complex to pilot — misaligned timing loses value',
      'Not plug-and-play like simpler buffers',
    ],
    tierRationale:
      'A in Boss and Guild Raid: a flexible amplifier whose all-type vulnerability is valuable, but rewards precise chain/concentrated-fire piloting.',
    sources: [
      'https://vortexgaming.io/en/postdetail/616661',
    ],
  },
  {
    slug: 'splash-queen-wilhelmina',
    name: 'Splash Queen Wilhelmina',
    role: 'Attacker (single-target boss DPS)',
    rarity: '5★',
    bossTier: 'S',
    overview:
      'A Water single-target chainer built for boss fights, prized for stacking large chain values (a 12-hit chain attack) that push single-target damage to the top of raid scoring. A cornerstone of high-score single-target boss teams.',
    coreMechanic:
      'Single-target chainer: a 12-hit chain skill that stacks big chain values to maximize focused boss damage.',
    builds: [
      {
        name: 'Boss single-target chainer',
        focus: 'Stack chain value on the boss; pair with chain buffers (Refithea) and vulnerability for peak burst.',
        url: 'https://dotgg.gg/brown-dust-2/character-guide-wilhelmina/',
      },
    ],
    keyItems: [
      { name: 'Evil Dragon\'s Blade', note: 'Craftable UR physical weapon.' },
      { name: 'Venomous Touch', note: 'Cornerstone UR crit accessory.' },
    ],
    strengths: [
      'Elite single-target boss chain damage',
      'High chain-value stacking for score modes',
    ],
    weaknesses: [
      'Single-target focus — weak wave clear',
      'Needs chain buffers to reach full ceiling',
    ],
    tierRationale:
      'S in Boss Raid: high chain-value stacking makes her a premier single-target boss dealer for score-chasing content.',
    sources: [
      'https://www.pocketgamer.com/brown-dust-2/tier-list/',
      'https://dotgg.gg/brown-dust-2/character-guide-wilhelmina/',
      'https://dotgg.gg/brown-dust-2/banner-guide-water-park-wilhelmina/',
    ],
  },
];
