import type { ClassRecord } from '@/app/lib/game-hub/types';

// ARC Raiders weapons are the tiered "unit" (looter_shooter blueprint).
//  - role      = weapon type (Battle Rifle, SMG, …)
//  - rarity    = loot rarity (Common → Legendary)
//  - pveTier   = Overall axis = ARC armor-penetration rating (the community
//                ranking axis per the blueprint; Very Weak → Very Strong)
//  - playstyle = the weapon's handling note
// No separate PvP tier exists in the source, so pvpTier is omitted.
//
// Last enriched 2026-07-15 for the Patch 1.26.0 / "Riven Tides" meta. Depth
// fields (overview, coreMechanic, builds, keyItems, strengths, weaknesses,
// tierRationale) reconciled from three lanes: a Perplexity cited-synthesis
// pass (breadth), authority verification (arcraiders.wiki weapon/mod pages,
// the arcraidermap weapon tier list, and a skycoach per-gun attachment guide),
// and Reddit sentiment (flavor only, never sourced for facts). The Overall
// (pveTier) axis tracks ARC armor-penetration value; several close-range PvP
// darlings therefore sit low on Overall while excelling player-vs-player —
// the rationale notes the split. Every attachment name is a real ARC Raiders
// mod; no attachment or URL is invented. Cite-or-drop throughout.
const WIKI = 'https://arc-raiders.fandom.com/wiki/Weapons';
const SHIELDS = 'https://arc-raiders.fandom.com/wiki/Shields';
const ARCWIKI = 'https://arcraiders.wiki/wiki/Weapons';
const MODS = 'https://arcraiders.wiki/wiki/Weapon_Mods';
const TIERLIST = 'https://arcraidermap.com/tier-list/weapons';
const ATTACH = 'https://skycoach.gg/blog/arc-raiders/articles/best-attachments-guide';
const RPS = 'https://www.rockpapershotgun.com/arc-raiders-best-guns-tier-list';
const COE = 'https://coe.gg/guides/best-weapons-tier-list/';

export const WEAPONS: ClassRecord[] = [
  {
    slug: 'aphelion',
    name: 'Aphelion',
    role: 'Battle Rifle',
    rarity: 'Legendary',
    pveTier: 'Strong',
    playstyle: 'Fires high-velocity energy rounds; premium legendary energy option.',
    overview:
      'The Aphelion is a legendary energy battle rifle that fires a two-round energy burst off a recharging clip. It is a specialist long-range PvE/PvP pick prized for reach and armor damage, but tier lists rate it below the medium-ammo rifles on pure value because of its legendary cost.',
    coreMechanic:
      'Two-round energy burst fed by a self-recharging Energy Clip — no ammo economy, but a legendary-only drop.',
    builds: [
      {
        name: 'Long-range energy DMR',
        focus: 'Hold outdoor sightlines and burst armored ARC and Raiders at range; pair with a close-range sidearm for gap coverage.',
        url: TIERLIST,
      },
    ],
    keyItems: [
      { name: 'No attachment slots', note: 'Like other Energy Clip weapons, the Aphelion accepts no muzzle/mag/stock mods — power comes from its rarity roll.' },
    ],
    strengths: [
      'High projectile velocity and strong range for confident long-range trades.',
      'Recharging Energy Clip means no ammo hoarding or reloads mid-fight.',
      'Energy rounds carry good armor damage against ARC.',
    ],
    weaknesses: [
      'Legendary rarity — expensive to acquire and replace.',
      'Two-round burst is less flexible than full-auto rifles up close.',
      'General tier lists rate it "outmatched on value" versus cheaper medium-ammo rifles.',
    ],
    tierRationale:
      'Sits Strong on the Overall (ARC armor-pen) axis because energy rounds punch armor at range, even though its legendary cost keeps it off the pure-value PvP picks.',
    sources: [WIKI, ARCWIKI, TIERLIST],
  },
  {
    slug: 'anvil',
    name: 'Anvil',
    role: 'Hand Cannon',
    rarity: 'Uncommon',
    pveTier: 'Strong',
    playstyle: 'High damage and headshot damage but slow handling; heavy ammo penetrates armor.',
    overview:
      'The Anvil is a single-action heavy-ammo hand cannon that plays like a pocket battle rifle: enormous per-shot damage plus armor penetration. It is a consensus S-tier "safe choice" across 2026 tier lists — roughly a two-headshot kill in PvP — and doubles as an armor breaker in PvE, all while staying cheap since even Uncommon rolls hit hard.',
    coreMechanic:
      'Single-action heavy-ammo fire: massive per-shot damage and armor pen, low rate of fire that punishes missed shots.',
    builds: [
      {
        name: 'Mid-range duelist',
        focus: 'Anvil primary held on 20–50m sightlines with a fast SMG secondary to finish pushes; muzzle mod for dispersion control.',
        url: RPS,
      },
      {
        name: 'PvE armor-breaker secondary',
        focus: 'Run a sustained AR (Bettina/Tempest) as primary and keep the Anvil as a burst finisher for elites and armored ARC.',
        url: COE,
      },
    ],
    keyItems: [
      { name: 'Compensator II/III', note: 'Tightens dispersion so each precious single shot lands where you aim.' },
      { name: 'Silencer II/III', note: 'Alternative muzzle for stealth peeks that cuts your noise radius.' },
      { name: 'Anvil Splitter (tech mod)', note: 'Optional — multiplies projectiles for PvE clear, but wrecks single-target consistency in PvP.' },
    ],
    strengths: [
      'Extreme per-shot damage — reliably two-taps Raiders on headshots.',
      'Heavy-ammo armor penetration doubles it as a boss/elite tool.',
      'Low rarity floor: even Uncommon Anvils are meta-viable, so it is cheap to run.',
    ],
    weaknesses: [
      'Low rate of fire and heavy recoil make whiffs very costly.',
      'Mediocre sustained DPS in long fights or horde PvE.',
      'Unforgiving for new players — demands consistent headshots.',
    ],
    tierRationale:
      'Strong on the Overall (ARC armor-pen) axis because heavy ammo shreds armor, and it is the game\'s benchmark all-round sidearm in PvP.',
    sources: [WIKI, TIERLIST, RPS, COE],
  },
  {
    slug: 'arpeggio',
    name: 'Arpeggio',
    role: 'Burst Rifle',
    rarity: 'Uncommon',
    pveTier: 'Moderate',
    playstyle: 'Decent damage output and accuracy.',
    overview:
      'The Arpeggio is a medium-ammo, three-round-burst assault rifle added in the Riven Tides update. It is a serviceable B-tier mid-tier option: a clean burst can down a target with two chest hits plus a headshot, making it a solid early-to-mid progression pickup rather than a meta staple.',
    coreMechanic:
      'Three-round burst on medium ammo — front-loaded damage that rewards trigger discipline over spray.',
    builds: [
      {
        name: 'Mid-range burst rifle',
        focus: 'Tap bursts at medium range and stack a compensator + medium mag for consistent follow-ups.',
        url: TIERLIST,
      },
    ],
    keyItems: [
      { name: 'Compensator II/III', note: 'Keeps the burst grouped for that two-body-plus-head kill.' },
      { name: 'Extended Medium Mag', note: 'More bursts before reloading in extended fights.' },
    ],
    strengths: [
      'A tight burst can kill in one trigger pull (2 chest + 1 head).',
      'Medium ammo is cheap and plentiful.',
      'Good accuracy for a mid-tier rifle.',
    ],
    weaknesses: [
      'Burst cadence is punishing if you miss the opener.',
      'Outclassed by top-tier ARs and battle rifles in the current meta.',
      'Weak armor penetration versus heavy ARC.',
    ],
    tierRationale:
      'Moderate on the Overall axis — dependable damage but no armor-pen edge, so it rounds out mid progression rather than defining the meta.',
    sources: [WIKI, ARCWIKI, TIERLIST],
  },
  {
    slug: 'bettina',
    name: 'Bettina',
    role: 'Assault Rifle',
    rarity: 'Epic',
    pveTier: 'Strong',
    playstyle: 'Slow fire rate but high damage; heavy ammo makes it strong vs armored ARC.',
    overview:
      'The Bettina is a full-auto heavy-ammo assault rifle that Patch 1.26.0 buffed into an S-tier contender — now a top pick for boss fights and armor-heavy PvE. It trades PvP burst for consistency, delivering the best armor damage of any AR and staying controllable at nearly all ranges across long raids.',
    coreMechanic:
      'Full-auto heavy ammo with a large magazine — sustained armor damage that scales its durability by rarity.',
    builds: [
      {
        name: 'PvE boss / ARC Turbine farmer',
        focus: 'Controlled full-auto onto weak points; back it with an Anvil or Hullcracker for overkill armor phases.',
        url: COE,
      },
      {
        name: 'All-round expedition rifle',
        focus: 'Primary DPS for long multi-objective runs, with a Venator/Anvil sidearm for burst PvP pickoffs.',
        url: ATTACH,
      },
    ],
    keyItems: [
      { name: 'Muzzle Brake II/III', note: 'Tames the heavy recoil so you can hold full-auto longer.' },
      { name: 'Angled Grip III', note: 'Improves handling and ADS stability for sustained fire.' },
      { name: 'Padded Stock', note: 'Steadies the platform for weak-point discipline on bosses.' },
    ],
    strengths: [
      'Top-tier armor damage — explicitly out-damages the Anvil against armored ARC.',
      'One of the most consistent guns in the game at manageable recoil.',
      'Large magazine and rarity-scaled durability make it raid-friendly.',
    ],
    weaknesses: [
      'Worse burst TTK than Anvil/Venator in PvP — it wins by consistency.',
      'Heavily gear-dependent: Common/Rare rolls feel mediocre.',
      'Poor accuracy for a rifle limits its pure-PvP value.',
    ],
    tierRationale:
      'Strong on the Overall (ARC armor-pen) axis — the post-1.26.0 buff made its heavy-ammo armor damage best-in-class for bossing, even if PvP burst lags.',
    sources: [WIKI, TIERLIST, ATTACH, COE],
  },
  {
    slug: 'bobcat',
    name: 'Bobcat',
    role: 'SMG',
    rarity: 'Epic',
    pveTier: 'Very Weak',
    playstyle: 'High fire rate but low accuracy; close-range PvP spray.',
    overview:
      'The Bobcat is a light-ammo full-auto SMG built for close-range ambushes, boasting one of the fastest time-to-kills in the game (~0.6s up close). It sits near the bottom of the Overall (ARC armor-pen) axis because light ammo does nothing to armor, yet it remains an A-tier PvP flanking tool.',
    coreMechanic:
      'Very high fire-rate light-ammo spray — devastating TTK inside its short effective range, no armor value.',
    builds: [
      {
        name: 'Close-range ambush SMG',
        focus: 'Flank and trade inside 15m; max fire rate and control with a converter or lightweight stock.',
        url: TIERLIST,
      },
    ],
    keyItems: [
      { name: 'Compensator III', note: 'Reins in the spray so more of the mag lands center-mass.' },
      { name: 'Vertical Grip III', note: 'Cuts vertical recoil for a flatter close-range beam.' },
      { name: 'Extended Light Mag III', note: 'Buffer rounds to secure the kill through missed shots.' },
      { name: 'Kinetic Converter', note: 'Pushes fire rate even higher for the fastest possible TTK.' },
    ],
    strengths: [
      'Elite close-range time-to-kill for aggressive pushes.',
      'High fire rate melts unarmored Raiders in a blink.',
      'Cheap to run as a PvP-focused secondary.',
    ],
    weaknesses: [
      'Light ammo has no armor penetration — near useless against armored ARC.',
      'Low accuracy and heavy falloff outside close range.',
      'Light-ammo economy is punished by the current medium-ammo meta.',
    ],
    tierRationale:
      'Very Weak on the Overall (ARC armor-pen) axis by design — a pure close-range PvP weapon with zero armor value, despite its strong player-vs-player TTK.',
    sources: [WIKI, TIERLIST, ATTACH],
  },
  {
    slug: 'burletta',
    name: 'Burletta',
    role: 'Pistol',
    rarity: 'Uncommon',
    pveTier: 'Very Weak',
    playstyle: 'Decent damage and accuracy sidearm.',
    overview:
      'The Burletta is a semi-automatic light-ammo pistol and a serviceable early sidearm. Community tier lists call it underrated for its consistency and quick reload, but its poor armor penetration keeps it firmly in the budget/backup bracket.',
    coreMechanic:
      'Semi-auto light-ammo sidearm — reliable, fast-reloading pistol fire with no armor value.',
    builds: [
      {
        name: 'Budget backup sidearm',
        focus: 'Early-game finisher and cleanup pistol before you unlock a Venator or Anvil.',
        url: TIERLIST,
      },
    ],
    keyItems: [
      { name: 'Extended Light Mag', note: 'More rounds to lean on its fast, consistent fire.' },
    ],
    strengths: [
      'Consistent, accurate sidearm damage.',
      'Quick reload keeps it in the fight.',
      'Cheap and easy to acquire early.',
    ],
    weaknesses: [
      'Poor armor penetration versus ARC.',
      'Light ammo caps its damage ceiling.',
      'Outclassed by Venator and Anvil as a duelling sidearm.',
    ],
    tierRationale:
      'Very Weak on the Overall (ARC armor-pen) axis — a consistent but low-impact light-ammo pistol with no armor value.',
    sources: [WIKI, ARCWIKI, TIERLIST],
  },
  {
    slug: 'equalizer',
    name: 'Equalizer',
    role: 'Energy Beam Gun',
    rarity: 'Legendary',
    pveTier: 'Very Strong',
    playstyle: 'High-capacity experimental beam rifle; best-in-class ARC armor penetration.',
    overview:
      'The Equalizer is a legendary full-auto energy weapon and one of the best ARC/armor tools in the game — a sustained-utility beam with strong weak-point damage valued in PvE armor-focused loadouts. It anchors the top of the Overall (armor-pen) axis, though general tier lists note it is not a meta-defining PvP gun.',
    coreMechanic:
      'Full-auto energy beam off a high-capacity recharging clip — sustained armor penetration with no ammo economy.',
    builds: [
      {
        name: 'PvE armor / ARC specialist',
        focus: 'Melt armored ARC and elites with sustained beam fire; carry a burst sidearm for PvP interruptions.',
        url: COE,
      },
    ],
    keyItems: [
      { name: 'No attachment slots', note: 'As an Energy Clip weapon it takes no muzzle/mag/stock mods — its power is baked into the legendary chassis.' },
    ],
    strengths: [
      'Best-in-class ARC armor penetration and weak-point damage.',
      'High-capacity recharging clip sustains long armor phases.',
      'No ammo hoarding — energy clip refills itself.',
    ],
    weaknesses: [
      'Not meta-defining in PvP (rated lower on general lists).',
      'Legendary rarity — costly to obtain and maintain.',
      'No attachment customization to tune handling.',
    ],
    tierRationale:
      'Very Strong on the Overall (ARC armor-pen) axis — its sustained energy beam is a top-end armor/boss breaker, which is exactly what that axis rewards.',
    sources: [WIKI, TIERLIST, COE],
  },
  {
    slug: 'ferro',
    name: 'Ferro',
    role: 'Break-Action Rifle',
    rarity: 'Common',
    pveTier: 'Strong',
    playstyle:
      'Hits hard but must reload after every shot; popular cheap armor-pen starter (40 base body damage).',
    overview:
      'The Ferro is a Common break-action, heavy-ammo battle rifle and the long-standing budget armor-pen king — craftable, cheap, and hard-hitting (around 40 base body damage) with excellent penetration for the price. Recent balancing nerfed it alongside Rattler, but it remains a staple early-to-mid backbone weapon.',
    coreMechanic:
      'Single break-action shot per reload — huge heavy-ammo damage and armor pen, but you reload after every trigger pull.',
    builds: [
      {
        name: 'Budget armor-pen marksman',
        focus: 'One-shot armored targets and elites on a shoestring; silencer for quiet peeks and a stable stock to steady the shot.',
        url: ATTACH,
      },
    ],
    keyItems: [
      { name: 'Silencer', note: 'Cuts your noise radius so a missed shot does not broadcast your position.' },
      { name: 'Stable Stock I/II', note: 'Faster recoil recovery to line up the next single shot.' },
    ],
    strengths: [
      'Excellent armor penetration for a cheap, craftable Common.',
      'High per-shot damage (~40 base body) that punches above its rarity.',
      'A genuine budget backbone that scales into mid-game.',
    ],
    weaknesses: [
      'Must reload after every single shot — brutal if you miss.',
      'Nerfed in recent balancing, trimming its former dominance.',
      'Slow follow-up leaves you exposed against fast SMG pushes.',
    ],
    tierRationale:
      'Strong on the Overall (ARC armor-pen) axis — cheap heavy-ammo armor penetration is its whole identity, which is what that axis ranks highest.',
    sources: [WIKI, SHIELDS, TIERLIST, ATTACH],
  },
  {
    slug: 'hairpin',
    name: 'Hairpin',
    role: 'Bolt-Action Pistol',
    rarity: 'Common',
    pveTier: 'Very Weak',
    playstyle: 'Built-in silencer; great for stealth but tricky in a firefight.',
    overview:
      'The Hairpin is a slide-action light-ammo pistol with a built-in silencer, made for stealth openers rather than firefights. It is a polarizing D-tier ambush tool — roughly three headshots or seven body shots to kill — that shines only when you land the first hit from concealment.',
    coreMechanic:
      'Silenced slide-action light-ammo pistol — low noise radius for stealth, but a slow, precision-dependent kill.',
    builds: [
      {
        name: 'Silent ambush sidearm',
        focus: 'Open on unaware targets from stealth; treat it as a utility pistol, not a duelling weapon.',
        url: TIERLIST,
      },
    ],
    keyItems: [
      { name: 'Built-in silencer', note: 'Integral — the Hairpin is quiet out of the box, its main selling point for stealth play.' },
    ],
    strengths: [
      'Built-in silencer keeps your noise radius tiny.',
      'Great for stealth openers on unaware enemies.',
      'Cheap Common that anyone can pick up.',
    ],
    weaknesses: [
      'Very low damage — 3 headshots or ~7 body shots to kill.',
      'Awkward and punishing in a stand-up firefight.',
      'No armor penetration whatsoever.',
    ],
    tierRationale:
      'Very Weak on the Overall (ARC armor-pen) axis — a niche silenced ambush pistol with minimal damage and zero armor value.',
    sources: [WIKI, ARCWIKI, TIERLIST],
  },
  {
    slug: 'hullcracker',
    name: 'Hullcracker',
    role: 'Grenade Launcher',
    rarity: 'Epic',
    pveTier: 'Very Strong',
    playstyle: 'Explosive projectiles that only detonate on ARC; anti-machine specialist.',
    overview:
      'The Hullcracker is a pump-action launcher whose explosive projectiles only detonate on ARC — a dedicated anti-machine specialist and the go-to pick for armor-heavy PvE and the ARC Turbine boss. It sits at the top of the Overall (armor-pen) axis for structure/weak-point burst, but is near-useless in PvP.',
    coreMechanic:
      'Launcher rounds that arm on ARC contact — massive weak-point/structure burst, inert against players.',
    builds: [
      {
        name: 'Boss / ARC breaker',
        focus: 'Swap to it for boss phases and armored elites; run a generalist (Anvil/Bettina) for trash and PvP.',
        url: COE,
      },
    ],
    keyItems: [
      { name: 'Vertical Grip II', note: 'Steadies the launcher so shots land on the weak point.' },
      { name: 'Lightweight Stock', note: 'Faster ADS/handling to keep the launcher on target between shots.' },
      { name: 'Kinetic Converter', note: 'Alternative stock slot that speeds up follow-up fire.' },
    ],
    strengths: [
      'Best-in-slot against armor and bosses — the top ARC Turbine pick.',
      'High weak-point burst that punishes exposed elites.',
      'Fits the current PvE meta that values fast boss phases.',
    ],
    weaknesses: [
      'Poor PvP value — projectiles do not detonate on players and bounce unreliably.',
      'Overkill and awkward against unarmored mobs.',
      'Committing to it taxes a weapon slot you rely on teammates to cover.',
    ],
    tierRationale:
      'Very Strong on the Overall (ARC armor-pen) axis — anti-machine explosive burst is its entire purpose and it is #1 for the ARC Turbine fight.',
    sources: [WIKI, TIERLIST, COE, ATTACH],
  },
  {
    slug: 'il-toro',
    name: 'IL Toro',
    role: 'Pump-Action Shotgun',
    rarity: 'Uncommon',
    pveTier: 'Weak',
    playstyle: 'Large spread, sharp falloff, high close-range damage.',
    overview:
      'The IL Toro is a pump-action shotgun that hits extremely hard at point-blank and famously needs no upgrading to be lethal early. A 1.20 nerf and sharp falloff pushed it to B-tier, but with precise positioning it is still a strong room-clearing and burst-PvP tool.',
    coreMechanic:
      'Pump-action shotgun with a wide pellet spread — devastating up close, falls off fast past a few metres.',
    builds: [
      {
        name: 'Point-blank room clearer',
        focus: 'Corner-camp and ambush; tighten the spread with a choke and speed handling with a lightweight stock.',
        url: ATTACH,
      },
    ],
    keyItems: [
      { name: 'Shotgun Choke II', note: 'Tightens pellet spread for more damage at the edge of its range.' },
      { name: 'Vertical Grip II/III', note: 'Controls pump recoil for faster follow-up shots.' },
      { name: 'Extended Shotgun Mag II', note: 'More shells before the slow reload leaves you exposed.' },
      { name: 'Lightweight Stock', note: 'Snappier ADS/handling for close-quarters swings.' },
    ],
    strengths: [
      'Extremely hard-hitting at point-blank range.',
      'Lethal even un-upgraded — great early-game equalizer.',
      'Strong for room clearing and ambush PvP.',
    ],
    weaknesses: [
      'Sharp damage falloff past close range.',
      'Nerfed in the 1.20 patch, trimming its dominance.',
      'High-risk pump cadence if the first shot does not connect.',
    ],
    tierRationale:
      'Weak on the Overall (ARC armor-pen) axis — a close-range spread weapon with no armor value, though it remains a real PvP threat up close.',
    sources: [WIKI, TIERLIST, ATTACH],
  },
  {
    slug: 'jupiter',
    name: 'Jupiter',
    role: 'Bolt-Action Sniper Rifle',
    rarity: 'Legendary',
    pveTier: 'Strong',
    playstyle: 'Incredible projectile velocity; can pierce multiple targets in one shot.',
    overview:
      'The Jupiter is a legendary bolt-action energy sniper — effectively a railgun — with incredible projectile velocity that can pierce multiple targets in a single shot. It is a boss/raid-focused pick valued for high single-shot damage and armor punch off a recharging energy clip.',
    coreMechanic:
      'Bolt-action Energy Clip sniper: enormous single-shot damage that penetrates multiple targets, clip recharges over time.',
    builds: [
      {
        name: 'Boss / raid sniper',
        focus: 'Pick off elites and hammer boss weak points from range; line up piercing shots on grouped ARC.',
        url: TIERLIST,
      },
    ],
    keyItems: [
      { name: 'No attachment slots', note: 'As an Energy Clip weapon it takes no standard optics/mag/stock mods.' },
    ],
    strengths: [
      'Incredible projectile velocity — near-hitscan at range.',
      'Pierces multiple targets in one shot.',
      'Recharging energy clip and strong armor punch for boss work.',
    ],
    weaknesses: [
      'Bolt-action pace is slow between shots.',
      'Situational — a specialist raid/boss tool, not an all-rounder.',
      'Legendary rarity makes it costly to run.',
    ],
    tierRationale:
      'Strong on the Overall (ARC armor-pen) axis — high-velocity energy shots with armor punch make it a meta-relevant boss/raid sniper.',
    sources: [WIKI, ARCWIKI, TIERLIST],
  },
  {
    slug: 'kettle',
    name: 'Kettle',
    role: 'Semi-Auto Assault Rifle',
    rarity: 'Common',
    pveTier: 'Very Weak',
    playstyle: 'Quick and accurate but low bullet velocity and slow reload.',
    overview:
      'The Kettle is a Common semi-auto light-ammo assault rifle and a classic starter gun — found in the free kit and famously lethal when fully upgraded, where a kitted level-4 Kettle can demolish higher-tier gear. It was formerly S-tier but a fire-rate cap and damage reduction nerf dropped it to a budget/beginner staple.',
    coreMechanic:
      'Semi-auto tap-fire on light ammo — accurate reliable damage, capped fire rate, low bullet velocity.',
    builds: [
      {
        name: 'Kitted early-game rifle',
        focus: 'Free-kit starter that scales hard with mods; add a mag and stable stock and it out-punches pricier guns.',
        url: ATTACH,
      },
    ],
    keyItems: [
      { name: 'Compensator II / Muzzle Brake II', note: 'Steadies dispersion for accurate tap-fire (Silencer works for stealth).' },
      { name: 'Angled Grip II/III', note: 'Better handling and ADS for snap fights.' },
      { name: 'Extended Light Mag II', note: 'More rounds between its slow reloads.' },
      { name: 'Stable Stock II/III', note: 'Faster recoil recovery for consistent taps.' },
    ],
    strengths: [
      'Accurate, reliable tap-fire at mid/close range.',
      'Free-kit gun — cheap and always available early.',
      'Insanely lethal when fully upgraded despite its rarity.',
    ],
    weaknesses: [
      'Nerfed with a fire-rate cap and damage reduction from its S-tier days.',
      'Low bullet velocity and slow reload.',
      'Light ammo means no armor penetration.',
    ],
    tierRationale:
      'Very Weak on the Overall (ARC armor-pen) axis — a light-ammo starter with no armor value, even though a kitted Kettle punches above its weight in PvP.',
    sources: [WIKI, TIERLIST, ATTACH],
  },
  {
    slug: 'osprey',
    name: 'Osprey',
    role: 'Scoped Sniper Rifle',
    rarity: 'Rare',
    pveTier: 'Moderate',
    playstyle: 'Reliable damage and accuracy; accessible mid-tier sniper.',
    overview:
      'The Osprey is a Rare bolt-action medium-ammo sniper — an accessible, reliable long-range pickoff rifle with around 80m range and a 2.5x headshot multiplier. It is a solid B-tier pick, valued for consistency, but tends to be outclassed by the Renegade for mid-range dominance.',
    coreMechanic:
      'Bolt-action medium-ammo sniper: dependable long-range damage with a 2.5x headshot multiplier.',
    builds: [
      {
        name: 'Accessible pickoff sniper',
        focus: 'Hold long lanes and headshot exposed Raiders; extended barrel for velocity, light stock for faster re-aim.',
        url: ATTACH,
      },
    ],
    keyItems: [
      { name: 'Extended Barrel', note: 'Adds ~25% bullet velocity so long-range shots land faster.' },
      { name: 'Extended Medium Mag II', note: 'Extra rounds between bolt cycles.' },
      { name: 'Lightweight Stock', note: 'Snappier ADS to re-acquire after each shot (Stable Stock II for control).' },
    ],
    strengths: [
      'Reliable damage and accuracy at ~80m.',
      '2.5x headshot multiplier rewards precision.',
      'Accessible Rare — an easy entry into sniping.',
    ],
    weaknesses: [
      'Outclassed by the Renegade for mid-range value.',
      'Bolt-action pace limits follow-up.',
      'Medium ammo gives it no special armor edge.',
    ],
    tierRationale:
      'Moderate on the Overall axis — a dependable, accessible sniper without an armor-pen niche, so it lands mid-pack.',
    sources: [WIKI, TIERLIST, ATTACH],
  },
  {
    slug: 'rattler',
    name: 'Rattler',
    role: 'Assault Rifle',
    rarity: 'Common',
    pveTier: 'Moderate',
    playstyle: 'Cheap offensive option; reloads 2 bullets at a time.',
    overview:
      'The Rattler is a Common full-auto medium-ammo assault rifle and a cheap offensive option with an unusual two-bullet-at-a-time reload and small magazine. Recent balancing nerfed it, and it generally underperforms the meta ARs, leaving it as a budget fallback.',
    coreMechanic:
      'Full-auto medium ammo with a small magazine that reloads two rounds at a time — frequent, drip-fed reloads.',
    builds: [
      {
        name: 'Budget full-auto fallback',
        focus: 'Cheap medium-ammo AR for early runs before you unlock Tempest or Bettina.',
        url: TIERLIST,
      },
    ],
    keyItems: [
      { name: 'Extended Medium Mag', note: 'Eases its biggest flaw — the tiny magazine and slow trickle reload.' },
    ],
    strengths: [
      'Cheap, craftable offensive option.',
      'Medium ammo is plentiful.',
      'Full-auto handling is beginner-friendly.',
    ],
    weaknesses: [
      'Small magazine with an awkward two-bullet reload.',
      'Nerfed in recent balancing and generally underperforms.',
      'No armor-pen advantage against ARC.',
    ],
    tierRationale:
      'Moderate on the Overall axis — usable but unremarkable, with no armor niche and a recent nerf holding it back.',
    sources: [WIKI, ARCWIKI, TIERLIST],
  },
  {
    slug: 'renegade',
    name: 'Renegade',
    role: 'Lever-Action Rifle',
    rarity: 'Rare',
    pveTier: 'Moderate',
    playstyle: 'High damage, accuracy and headshot damage.',
    overview:
      'The Renegade is a Rare lever-action, medium-ammo battle rifle and one of the best PvP guns in the game — S-tier for mid-range dominance thanks to a 2.25x headshot multiplier and ~69m range on cheap ammo. It rules player-vs-player but lacks the armor multipliers to be a top PvE farmer, which is why it sits Moderate on the armor-pen axis.',
    coreMechanic:
      'Lever-action medium ammo: high per-shot damage with a strong headshot multiplier and long effective range.',
    builds: [
      {
        name: 'PvP precision mid-range',
        focus: 'Abuse head-glitches and mid lanes; muzzle brake for recoil, medium mag and stable stock for hold-through-fire.',
        url: ATTACH,
      },
      {
        name: 'Budget marksman',
        focus: 'Long-range picks on cheap medium ammo with an SMG for close cleanup.',
        url: RPS,
      },
    ],
    keyItems: [
      { name: 'Muzzle Brake II/III', note: 'Controls the lever kick between shots (Compensator for dispersion).' },
      { name: 'Extended Medium Mag II/III', note: 'Reduces the lever-action reload downtime.' },
      { name: 'Stable Stock III', note: 'Faster recovery so you can hold aim through incoming fire (Padded Stock alt).' },
    ],
    strengths: [
      'Elite mid-range TTK — cited as out-damaging the Ferro.',
      '2.25x headshot multiplier and ~69m range on cheap medium ammo.',
      'High-value, forgiving in hectic PvP skirmishes.',
    ],
    weaknesses: [
      'Weak in pure ARC PvE — no armor multipliers like Bettina/Hullcracker.',
      'Relies on aim and lever/reload rhythm.',
      'Struggles at very close range without an SMG or pistol backup.',
    ],
    tierRationale:
      'Moderate on the Overall (ARC armor-pen) axis despite being an S-tier PvP rifle — it dominates player fights but lacks the armor damage that axis ranks.',
    sources: [WIKI, TIERLIST, ATTACH, RPS],
  },
  {
    slug: 'stitcher',
    name: 'Stitcher',
    role: 'SMG',
    rarity: 'Common',
    pveTier: 'Very Weak',
    playstyle: 'Good damage but low fire rate and hard to control.',
    overview:
      'The Stitcher is a Common light-ammo SMG and a budget early-game staple — craftable or cheap to buy, and a heavily-used starter for close-range PvP that becomes far more lethal with attachments. Nerfs trimmed it, but it stays viable as a cheap close-quarters option; on the Overall (armor-pen) axis it ranks low because light ammo does nothing to armor.',
    coreMechanic:
      'Light-ammo SMG built for close-range trades — cheap and craftable, rewarding good recoil control.',
    builds: [
      {
        name: 'Budget close-range SMG',
        focus: 'Early cleanup and CQB with a full mod kit; grip and converter tame the control issues.',
        url: ATTACH,
      },
    ],
    keyItems: [
      { name: 'Compensator III', note: 'Reins in dispersion for controllable close-range fire.' },
      { name: 'Vertical Grip III', note: 'Cuts vertical recoil to keep it on target.' },
      { name: 'Extended Light Mag III', note: 'More rounds through a close-range engagement.' },
      { name: 'Kinetic Converter', note: 'Speeds up the rate of fire (Lightweight/Stable Stock alternatives).' },
    ],
    strengths: [
      'Budget and craftable — a cheap, always-available CQB gun.',
      'Strong close-range option that scales hard with attachments.',
      'Free-kit availability makes it an easy early pick.',
    ],
    weaknesses: [
      'Hard to control at range and nerfed from its peak.',
      'Light ammo gives it zero armor penetration.',
      'Falls off quickly outside close quarters.',
    ],
    tierRationale:
      'Very Weak on the Overall (ARC armor-pen) axis — a budget light-ammo SMG with no armor value, kept relevant only by its cheap close-range PvP role.',
    sources: [WIKI, TIERLIST, ATTACH],
  },
  {
    slug: 'tempest',
    name: 'Tempest',
    role: 'Assault Rifle',
    rarity: 'Epic',
    pveTier: 'Moderate',
    playstyle: 'Full-auto AR with moderate fire rate and accuracy; well-rounded PvP rifle.',
    overview:
      'The Tempest is an Epic full-auto medium-ammo assault rifle and the meta "workhorse" — a safe, versatile primary for sustained mid-range fights. A recent patch raised its ARC damage multiplier by 10% to boost PvE viability, and its stable recoil makes it beginner-friendly, landing it firmly A-tier.',
    coreMechanic:
      'Full-auto medium ammo with balanced fire rate and ammo economy — sustained, controllable mid-range DPS.',
    builds: [
      {
        name: 'Versatile PvE/PvP hybrid',
        focus: 'Default primary for most fights, backed by an SMG or Anvil for close/armor gaps.',
        url: ATTACH,
      },
      {
        name: 'PvE ARC specialist',
        focus: 'Lean on the 10% ARC damage buff for general machine clear; Equalizer/Anvil secondary for heavy armor.',
        url: COE,
      },
    ],
    keyItems: [
      { name: 'Compensator II/III', note: 'Flattens dispersion for a laser-beam mid-range hold.' },
      { name: 'Angled Grip II/III', note: 'Improves handling and ADS stability.' },
      { name: 'Extended Medium Mag III', note: 'Keeps uptime high across long runs.' },
    ],
    strengths: [
      'Excellent sustained DPS with balanced ammo consumption.',
      '10% ARC damage buff makes it a strong PvE pick without rare rolls.',
      'Stable, forgiving recoil — very beginner-friendly.',
    ],
    weaknesses: [
      'Not top-tier PvP burst — behind Anvil/Renegade/Venator for raw killing power.',
      'Loses to Bettina for high-end bossing.',
      'Wins by steady pressure rather than explosive impact.',
    ],
    tierRationale:
      'Moderate on the Overall (ARC armor-pen) axis — its ARC buff helps PvE, but it leans on sustained DPS over the heavy-ammo armor pen that axis rewards most.',
    sources: [WIKI, TIERLIST, ATTACH, COE],
  },
  {
    slug: 'torrente',
    name: 'Torrente',
    role: 'LMG',
    rarity: 'Rare',
    pveTier: 'Moderate',
    playstyle: 'Large ammo capacity but only accurate while crouched; suppression tool.',
    overview:
      'The Torrente is a Rare full-auto medium-ammo LMG built around a huge magazine and high fire rate — a PvE wave-clearing and suppression tool with "High" raid value. It is accurate mainly while crouched, making it a set-piece surprise-attack weapon rather than a mobile duelist.',
    coreMechanic:
      'Full-auto LMG with a very large magazine — sustained suppression that is accurate only when crouched/braced.',
    builds: [
      {
        name: 'PvE suppression / wave clear',
        focus: 'Brace a lane and hose ARC waves; compensator and medium mag for a long, controllable stream.',
        url: ATTACH,
      },
    ],
    keyItems: [
      { name: 'Compensator III / Muzzle Brake III', note: 'Tames recoil so the long burst stays on target.' },
      { name: 'Extended Medium Mag III', note: 'Maximizes the already-large magazine for uninterrupted suppression.' },
      { name: 'Padded Stock', note: 'Steadies braced fire (Kinetic Converter to lift fire rate).' },
    ],
    strengths: [
      'Large magazine and high fire rate for sustained suppression.',
      'Strong PvE wave-clearing with "High" raid value.',
      'Excellent as a braced surprise-attack weapon.',
    ],
    weaknesses: [
      'Accurate only while crouched — poor on the move.',
      'Unwieldy handling in fast, mobile fights.',
      'Medium ammo gives it no armor-pen edge against heavy ARC.',
    ],
    tierRationale:
      'Moderate on the Overall axis — great sustained suppression, but its crouch-only accuracy and lack of armor pen keep it mid-pack.',
    sources: [WIKI, TIERLIST, ATTACH],
  },
  {
    slug: 'venator',
    name: 'Venator',
    role: '2-Shot Pistol',
    rarity: 'Rare',
    pveTier: 'Moderate',
    playstyle: 'Fires two shots at a time.',
    overview:
      'The Venator is a Rare semi-auto medium-ammo pistol that fires two rounds per trigger pull — widely considered the best sidearm in the game and an S-tier close-burst king with a 2.5x headshot multiplier. It is Anvil\'s main competitor for the secondary slot, unbeatable inside its effective range but falling off hard beyond it.',
    coreMechanic:
      'Double-round semi-auto fire — unmatched point-blank burst that empties fast under spam.',
    builds: [
      {
        name: 'Aggressive precision sidearm',
        focus: 'Open at range with a rifle, then swap to Venator for an instant close-range burst kill.',
        url: RPS,
      },
      {
        name: 'Close-range duelist backup',
        focus: 'Reserve it for must-win duels and finishing wounded enemies; vertical grip and medium mag steady the burst.',
        url: ATTACH,
      },
    ],
    keyItems: [
      { name: 'Vertical Grip II/III', note: 'Controls the recoil of the paired shots for tighter grouping.' },
      { name: 'Extended Medium Mag II/III', note: 'Buffers its heavy per-trigger ammo drain.' },
    ],
    strengths: [
      'Unmatched close-burst damage — double-round fire out-trades many primaries.',
      'Consistently the recommended best sidearm for high-level PvP.',
      'Low slot cost keeps your primary free for any meta rifle.',
    ],
    weaknesses: [
      'Very range-limited — falls off hard beyond close range.',
      'Heavy burst ammo consumption runs it dry in extended fights.',
      'Poor PvE scaling — overkill with no armor focus.',
    ],
    tierRationale:
      'Moderate on the Overall (ARC armor-pen) axis despite being an S-tier PvP sidearm — its double-shot burst rules player duels but does little against armor.',
    sources: [WIKI, TIERLIST, RPS, ATTACH],
  },
  {
    slug: 'vulcano',
    name: 'Vulcano',
    role: 'Semi-Auto Shotgun',
    rarity: 'Epic',
    pveTier: 'Weak',
    playstyle: 'Good spread but sharp falloff; aggressive close-range shotgun.',
    overview:
      'The Vulcano is an Epic semi-automatic shotgun and the close-quarters DPS king — the highest burst damage in the game, roughly a three-body-shot kill, combining big per-shot damage with high fire rate. It is an S-tier indoor PvP weapon, though its close-only range and lack of armor pen keep it Weak on the Overall (armor-pen) axis.',
    coreMechanic:
      'Semi-auto shotgun with high per-shot damage and fire rate — the top indoor burst weapon, with sharp falloff.',
    builds: [
      {
        name: 'CQB burst king',
        focus: 'Push corners and stairwells indoors; choke tightens spread, extended mag and converter sustain the burst.',
        url: ATTACH,
      },
    ],
    keyItems: [
      { name: 'Shotgun Choke III', note: 'Tightens pellet spread to extend its effective close range.' },
      { name: 'Vertical Grip III', note: 'Controls recoil between rapid semi-auto shots.' },
      { name: 'Extended Shotgun Mag III', note: 'Boosts the small default shell count (e.g. 4 → 10) for sustained fights.' },
      { name: 'Kinetic Converter', note: 'Pushes fire rate for an even faster close-range TTK.' },
    ],
    strengths: [
      'Highest burst damage in the game — ~3 body shots to kill.',
      'High fire rate plus strong per-shot damage rules indoor fights.',
      'Best "close-quarters DPS king" shotgun in the current meta.',
    ],
    weaknesses: [
      'Sharp damage falloff — useless past close range.',
      'Tiny default shell count without an extended mag.',
      'No armor penetration against heavy ARC.',
    ],
    tierRationale:
      'Weak on the Overall (ARC armor-pen) axis by nature — a pure close-range burst weapon with no armor value, even though it is an S-tier CQB PvP pick.',
    sources: [WIKI, TIERLIST, ATTACH, RPS],
  },
];
