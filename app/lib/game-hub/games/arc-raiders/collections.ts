import type { NamedCollection } from '@/app/lib/game-hub/types';

const MAPS = 'https://arc-raiders.fandom.com/wiki/Maps';
const ARC = 'https://arc-raiders.fandom.com/wiki/ARC';
const SHIELDS = 'https://arc-raiders.fandom.com/wiki/Shields';
const AUGMENTS = 'https://arc-raiders.fandom.com/wiki/Augments';
const GADGETS = 'https://arc-raiders.fandom.com/wiki/Gadgets';

export const COLLECTIONS: NamedCollection[] = [
  {
    key: 'maps',
    label: 'Maps',
    entries: [
      {
        name: 'Dam Battlegrounds',
        summary:
          "The Alcantara Power Plant ('The Dam') was a Raider stronghold in the First Wave; now toxic, waterlogged lands that stay an ARC-skirmish hotspot. Events include Harvester, Prospecting Probes, Husk Graveyard, Night Raid and Electromagnetic Storm — high ARC danger with strong loot events.",
        sources: [MAPS],
      },
      {
        name: 'Acerra Spaceport',
        summary:
          'A ruined spaceport where the Exodus shuttles once launched. Notable extra loot events include Launch Tower Loot and a Hidden Bunker, plus the Harvester event. One of the richer loot maps.',
        sources: [MAPS],
      },
      {
        name: 'Buried City',
        summary:
          "An arid, sand-dune wasteland of narrow streets and empty plazas from the old world. Events include Prospecting Probes, Uncovered Caches, Husk Graveyard, Lush Blooms and Night Raid. Target of the popular 'weapon cases Buried City locations' searches.",
        sources: [MAPS],
      },
      {
        name: 'Blue Gate',
        summary:
          'A gateway into perilous mountain ranges through a scarred valley. Events include Harvester, Uncovered Caches, Night Raid, Electromagnetic Storm and a Locked Gate. High-risk mountain terrain.',
        sources: [MAPS],
      },
      {
        name: 'Stella Montis',
        summary:
          'An endgame location reached via heavily trapped Tubes; contents are still shrouded in rumor. First place the Shredder ARC appears, testing close-quarters skill.',
        sources: [MAPS, ARC],
      },
      {
        name: 'Practice Range (The Backyard)',
        summary:
          'A secluded mountain hollow whose echoes confuse ARC, creating a rare pocket of open-air safety where Raiders hone skills. No hostile events — a safe zone.',
        sources: [MAPS],
      },
    ],
  },
  {
    key: 'gear',
    label: 'Gear & Augments',
    entries: [
      {
        name: 'Light Shield',
        summary:
          'Lightweight shield: 40 charge, 40% damage mitigation, 0% movement penalty, 5kg. Fastest class, cheap to repair (4x Plastic Parts), compatible with all augments. Every free kit includes one.',
        sources: [SHIELDS],
      },
      {
        name: 'Medium Shield',
        summary:
          'Standard shield: 70 charge, 42.5% mitigation, 5% movement penalty, 7kg. Balanced pick; repairs/crafts with ARC Circuitry + Battery.',
        sources: [SHIELDS],
      },
      {
        name: 'Heavy Shield',
        summary:
          'Heavy shield: 80 charge, 52.5% mitigation, 15% movement penalty, 9kg. Blocks the most damage but slows you; needs a Power Rod to craft. Only fits Combat MK.2/MK.3 and Tactical MK.3 (Defensive) augments.',
        sources: [SHIELDS],
      },
      {
        name: 'Free Loadout Augment',
        summary:
          'Starter augment: 14 backpack slots, 35kg limit, 4 quick-use slots, Light shield only. Baseline carry capacity for rookies.',
        sources: [AUGMENTS],
      },
      {
        name: 'Looting MK.2',
        summary:
          'Loot mule augment: 22 backpack slots, 60kg, 2 safe-pocket + 3 trinket slots; automatically throws off attached Ticks after 1s. Great for heavy scavenging runs.',
        sources: [AUGMENTS],
      },
      {
        name: 'Combat MK.3 (Aggressive)',
        summary:
          'Top combat augment: supports Light/Medium/Heavy shields, extra grenade space, regenerates 2 HP/5s (paused 30s when hit). Best survivability profile.',
        sources: [AUGMENTS],
      },
      {
        name: 'Tactical MK.3 (Healing)',
        summary:
          'Support augment: extra medical slots; on revive releases a healing cloud restoring 20 HP over 10s (30s cooldown). Team-medic loadout.',
        sources: [AUGMENTS],
      },
      {
        name: 'Barricade Kit',
        summary:
          'Deployable cover with 500 health that blocks incoming damage until it breaks; can be picked back up. Instant hard cover in open fights.',
        sources: [GADGETS],
      },
      {
        name: 'Photoelectric Cloak',
        summary:
          'Held gadget that makes you non-existent to ARC (not invisible to players); has a recharging usage bar and emits a loud beep. Sneak past machines.',
        sources: [GADGETS],
      },
      {
        name: 'Zipline',
        summary:
          'Deployable 60m zipline (needs line of sight) for fast repositioning or extraction routing.',
        sources: [GADGETS],
      },
      {
        name: 'Grappling / Snap Hook',
        summary:
          'Traversal tool: 20m range, 3 uses when fully charged, recharges when unused. Scale buildings and cross gaps.',
        sources: [GADGETS],
      },
      {
        name: 'Noisemaker',
        summary:
          'Deployable proximity sensor (8m radius) that alarms for 4s when an enemy Raider is detected. Early-warning against PvP ambushes.',
        sources: [GADGETS],
      },
    ],
  },
  {
    key: 'enemies',
    label: 'ARC Enemies',
    entries: [
      {
        name: 'Tick',
        summary:
          'Small unarmored ARC that hides on walls/ceilings inside buildings, leaps at Raiders and latches on. Shake it off (the Looting MK.2 augment auto-removes it after 1s) and shoot it quickly before it drains you.',
        sources: [ARC],
      },
      {
        name: 'Pop',
        summary:
          'Small unarmored rolling ARC that detonates when approached. Destroy it from range before it reaches you.',
        sources: [ARC],
      },
      {
        name: 'Fireball',
        summary:
          'Small armored rolling ARC that shoots fire; being armored it needs heavy ammo to kill efficiently.',
        sources: [ARC],
      },
      {
        name: 'Wasp',
        summary:
          'Small unarmored drone that fires light ammo; rarely alone — expect more Wasps or a Hornet nearby.',
        sources: [ARC],
      },
      {
        name: 'Hornet',
        summary:
          'Medium drone with two armored front rotors; patrols with Wasps or guards a larger ground ARC. Target the unarmored body.',
        sources: [ARC],
      },
      {
        name: 'Snitch',
        summary:
          'Small 3-rotor flying drone that deals no damage but calls in backup (usually 2 Wasps + 1 Hornet) when it spots you. Kill it fast to avoid reinforcements.',
        sources: [ARC],
      },
      {
        name: 'Sentinel',
        summary:
          'Unarmored sniper turret perched high on buildings/ledges; shoot the small vulnerable capsule on its swiveling arm.',
        sources: [ARC],
      },
      {
        name: 'Rocketeer',
        summary:
          'Formidable flying ARC with powerful rockets and area-of-effect damage; break line of sight and use cover.',
        sources: [ARC],
      },
      {
        name: 'Leaper',
        summary:
          'Large heavily armored spider-like ARC that jumps extreme distances and has a heavy-damage shockwave. Needs heavy ammo; keep mobile and avoid the ground slam. (Players ask which maps it spawns on.)',
        sources: [ARC],
      },
      {
        name: 'Bastion',
        summary:
          'Hulking heavily armored ARC with a full-auto minigun and accompanying air support that suppresses your movement. Heavy-ammo target; clear its escorts and use hard cover. (A top community question is which map has the most Bastions.)',
        sources: [ARC],
      },
      {
        name: 'Bombardier & Spotter',
        summary:
          'The Bombardier is a large unarmored ARC that lobs mortars at exposed Raiders, always escorted by 2 Spotters that laser-mark targets for it. Kill the Spotters or stay out of their line of sight to stop the barrage.',
        sources: [ARC],
      },
      {
        name: 'Shredder',
        summary:
          'Close-quarters threat that first appears in Stella Montis, challenging Raiders in tight encounters.',
        sources: [ARC, MAPS],
      },
      {
        name: 'The Queen',
        summary:
          'Very large boss ARC armed with artillery pods and a devastating beam attack; guards the Harvester during the Harvester Event. Extremely durable and lethal — a team fight.',
        sources: [ARC],
      },
      {
        name: 'Matriarch',
        summary:
          "An imposing ARC that 'makes the Queen look friendly,' appearing under a specific map condition; one of the toughest kills in the game.",
        sources: [ARC],
      },
    ],
  },
];
