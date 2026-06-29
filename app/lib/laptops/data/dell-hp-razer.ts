// Alienware/Dell + HP + Razer — fully enriched segment.
// Source: gaming-laptop-database-2026.md, "Dell / HP / Razer detailed tables"
// (main configuration dataset rows 1–18, reliability summary, sources index).
// Unknown values are omitted, not inferred.

import type { LaptopFamily } from '../types';
import { nvidia } from './_seed';

const VERIFIED = '2026-06-29';

export const DELL_HP_RAZER: LaptopFamily[] = [
  // Rows 1–3 ----------------------------------------------------------------
  {
    slug: 'alienware-area-51-16',
    manufacturer: 'Alienware',
    productLine: 'Area-51',
    name: 'Alienware Area-51 16 (2026)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Premium gaming',
    segment: 'Dell/HP/Razer',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-035',
        label: 'RTX 5060 · Core Ultra 7 255HX',
        cpu: { vendor: 'Intel', model: 'Core Ultra 7 255HX', architecture: 'Arrow Lake-HX', cores: 20, boostClock: '5.1 GHz' },
        gpu: { ...nvidia('GeForce RTX 5060 Laptop', 'rtx-5060'), tgpWatts: 115, tgpNote: 'Up to 115 W GPU (within a 240 W total platform envelope)' },
        priceUsd: 1950,
        priceNote: 'from',
      },
      {
        id: 'G26-036',
        label: 'RTX 5080 · Core Ultra 9 275HX',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 275HX', architecture: 'Arrow Lake-HX', cores: 24, boostClock: '5.4 GHz' },
        gpu: { ...nvidia('GeForce RTX 5080 Laptop', 'rtx-5080'), tgpWatts: 150, tgpNote: '150 W GPU (within 240 W total platform power)' },
        priceUsd: 3249,
        priceNote: 'from',
      },
      {
        id: 'G26-037',
        label: 'RTX 5080 OLED · Core Ultra 9 290HX Plus',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 290HX Plus', architecture: 'Arrow Lake-HX Plus', cores: 24, boostClock: '5.5 GHz' },
        gpu: { ...nvidia('GeForce RTX 5080 Laptop', 'rtx-5080'), tgpWatts: 150 },
        priceUsd: 3900,
        priceNote: 'from',
        statusNote: 'OLED panel and 290HX Plus CPU are a forced bundle (cannot be ordered separately); ~$3,900–$4,000.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (QHD+)',
      panelType: 'oled',
      refreshRateHz: 240,
      brightnessNits: '500 nits',
      hdr: 'DisplayHDR 500 (IPS) / DisplayHDR TrueBlack 500 (OLED)',
      colorGamut: '100% DCI-P3',
      gsyncVrr: 'G-SYNC + Advanced Optimus',
      options: 'IPS (DisplayHDR 500) standard; OLED (TrueBlack 500) only on the top 290HX Plus bundle',
    },
    memory: {
      installed: '32 GB',
      type: 'DDR5 (6400 MT/s)',
      storageUpgradeable: '1 TB PCIe Gen 4 NVMe (Gen 5 on top config)',
    },
    thermals: {
      cpuTempNote: '~100 °C CPU under all-core load (owner reports)',
      throttlingNote: 'E-core thermal throttling reported at idle; reviewers note little measurable fps impact in practice.',
    },
    battery: { capacityWh: 90, gamingHours: '~2 hrs' },
    connectivity: {
      wifi: 'Wi-Fi 7',
      thunderbolt: '2× Thunderbolt 4 (Thunderbolt 5 on RTX 5070 Ti+ tier)',
    },
    build: {
      materials: 'Aluminum + ABS ("Alienware 30" design)',
      weightKg: '3.1–3.3 kg',
      buildQuality: 'Good',
    },
    reliability: [
      {
        area: 'CPU thermals',
        detail:
          'CPUs reach ~100 °C under all-core load; consistent reports of E-core thermal throttling at idle (r/Alienware, Notebookcheck). Throttle is observed but the fps impact is often minimal in practice.',
        severity: 'moderate',
      },
      {
        area: 'Travel weight',
        detail: 'The 360 W charger adds ~2 kg; Laptop Mag noted a 7.2 lb laptop becomes a ~9.6 lb travel kit.',
        severity: 'low',
      },
    ],
    sources: [
      {
        label: 'Notebookcheck Alienware 16 Area-51 review',
        url: 'https://www.notebookcheck.net/Alienware-16-Area-51-review-New-Core-Ultra-9-290HX-Plus-is-all-power-at-any-cost.1276167.0.html',
        kind: 'review',
      },
      {
        label: 'Laptop Mag Area-51 RTX 5080 review',
        url: 'https://www.laptopmag.com/laptops/gaming-laptops-pcs/alienware-16-area-51-rtx-5080-review',
        kind: 'review',
      },
      {
        label: 'The Gadgeteer — Alienware 2026 lineup',
        url: 'https://the-gadgeteer.com/2026/03/20/alienwares-30th-birthday-laptops-look-nothing-like-before/',
        kind: 'review',
      },
      {
        label: 'r/Alienware — Area-51 16 thermal throttling',
        url: 'https://www.reddit.com/r/Alienware/comments/1pm5q4o/aw_area_51_16_thermal_throttling_issue_or_non/',
        kind: 'reliability',
      },
    ],
    conflicts: [
      {
        field: 'GPU TGP',
        detail: 'Dell spec page lists "up to 240 W total platform"; the RTX 5060 tier is ~115 W GPU per The Gadgeteer — platform power vs GPU TGP.',
      },
      {
        field: 'CPU SKU',
        detail: 'Core Ultra 7 255HX confirmed by Notebookcheck vs "Core Ultra 7 270HX Plus" in Dell CES materials — both verified as separate SKUs.',
      },
      {
        field: 'Price',
        detail: '$3,249 as reviewed for the RTX 5080 config (Laptop Mag) vs ~$2,849 starting for the tier (Notebookcheck).',
      },
    ],
    summary:
      "Alienware's 30th-anniversary 16-incher is a genuinely powerful, well-built (aluminum + ABS) machine with a 240 Hz panel that can be upgraded to OLED — but the OLED and the top 290HX Plus CPU are sold only as a forced ~$3,900+ bundle. The consistent caveat across the line is heat: CPUs hit ~100 °C under load with E-core throttling at idle, though reviewers say the real-world fps impact is usually small. Factor in the heavy 360 W charger if you plan to travel with it.",
  },

  // Row 4 -------------------------------------------------------------------
  {
    slug: 'alienware-area-51-18',
    manufacturer: 'Alienware',
    productLine: 'Area-51',
    name: 'Alienware Area-51 18 (2026)',
    displaySizeInches: 18,
    releaseYear: 2026,
    targetMarket: 'Flagship desktop-replacement',
    segment: 'Dell/HP/Razer',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-038',
        label: 'RTX 5090 · Core Ultra 9 275HX',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 275HX', architecture: 'Arrow Lake-HX', cores: 24, boostClock: '5.4 GHz' },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175, tgpNote: '175 W GPU (280 W total platform power)' },
        priceUsd: 4549,
        priceNote: 'from',
        statusNote: 'Price as reviewed by PCMag for the RTX 5090 top config.',
      },
    ],
    display: {
      sizeInches: 18,
      resolution: '2560×1600 (QHD+)',
      panelType: 'ips',
      refreshRateHz: 300,
      brightnessNits: '500 nits',
      hdr: 'DisplayHDR 500',
      colorGamut: '100% DCI-P3',
      gsyncVrr: 'G-SYNC + Advanced Optimus',
      options: 'IPS only (no OLED at 18")',
    },
    memory: {
      installed: '32 GB (up to 64 GB)',
      type: 'DDR5 (6400 MT/s)',
      maxGb: 64,
      storageUpgradeable: 'Up to 2 TB PCIe Gen 4/5 NVMe',
    },
    thermals: {
      cpuTempNote: '~80–100 °C E-core temps at idle on some units',
      noiseGamingDb: 'Fans ~65% continuous (owner reports)',
      throttlingNote: 'Throttles in benchmarks; QC variance — one reviewer required a unit exchange for erratic P-core behaviour.',
    },
    battery: { capacityWh: 99 },
    connectivity: {
      wifi: 'Wi-Fi 7',
      thunderbolt: '2× Thunderbolt 5',
    },
    build: {
      materials: 'Aluminum + ABS',
      weightKg: '~4 kg',
    },
    reliability: [
      {
        area: 'CPU thermals & QC',
        detail:
          'High idle temperatures (80–100 °C on E-cores on some units) and near-continuous fan noise; one reviewer received a replacement unit for erratic P-core behaviour after Dell initially called it "normal". The second unit improved but still throttled in benchmarks.',
        severity: 'moderate',
      },
    ],
    sources: [
      {
        label: 'PCMag Alienware 18 Area-51 review',
        url: 'https://www.pcmag.com/reviews/alienware-18-area-51',
        kind: 'review',
      },
      {
        label: 'The Gadgeteer — Alienware 2026 lineup',
        url: 'https://the-gadgeteer.com/2026/03/20/alienwares-30th-birthday-laptops-look-nothing-like-before/',
        kind: 'review',
      },
      {
        label: 'r/Alienware — Area-51 18 thermal thread',
        url: 'https://www.reddit.com/r/Alienware/comments/1mnjna9/area51_18_thermal_throttleheatloud_no_load/',
        kind: 'reliability',
      },
      {
        label: 'r/Alienware — Area-51 18 unit exchange',
        url: 'https://www.reddit.com/r/Alienware/comments/1shbfzu/are_these_temps_normal_on_alienware_18_area51/',
        kind: 'reliability',
      },
    ],
    conflicts: [
      {
        field: 'Starting price',
        detail: 'PCMag tested the RTX 5090 config at $4,549; The Gadgeteer cites "starting at $1,899.99", which reflects the lower RTX 5070 Ti tier rather than the 5090.',
      },
    ],
    summary:
      'The 18" flagship pairs a full 175 W RTX 5090 with a 300 Hz IPS panel (no OLED at this size) in a ~4 kg, 99 Wh desktop-replacement. It is fast, but thermals are the weak spot: owners report 80–100 °C idle E-core temps, near-continuous fan noise, and at least one documented unit exchange for erratic P-core behaviour that Dell first dismissed as normal. A powerhouse with real QC variance — buy from a returnable retailer.',
  },

  // Row 5 -------------------------------------------------------------------
  {
    slug: 'alienware-aurora-16x',
    manufacturer: 'Alienware',
    productLine: 'Aurora',
    name: 'Alienware 16X Aurora (2026)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Mainstream gaming',
    segment: 'Dell/HP/Razer',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-039',
        label: 'RTX 5060 · Core Ultra 7 255HX',
        cpu: { vendor: 'Intel', model: 'Core Ultra 7 255HX', architecture: 'Arrow Lake-HX', cores: 20, boostClock: '5.1 GHz' },
        gpu: { ...nvidia('GeForce RTX 5060 Laptop', 'rtx-5060'), tgpWatts: 115, tgpNote: '115 W (vs 80 W on the cheaper 16 Aurora)' },
        priceUsd: 1849,
        priceNote: 'from',
        statusNote: 'Dell G-Series replacement; $1,849–$2,179 list, seen ~$1,450–$1,650 on sale.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (WQXGA)',
      panelType: 'ips',
      refreshRateHz: 240,
      brightnessNits: '500 nits',
      hdr: 'Limited HDR',
      colorGamut: '100% DCI-P3',
      gsyncVrr: 'G-SYNC + Advanced Optimus',
    },
    memory: {
      installed: '32 GB',
      type: 'DDR5-5600',
      storageUpgradeable: '1 TB PCIe Gen 4 NVMe',
    },
    thermals: {
      throttlingNote: 'Some early RTX 5060 units showed GPU throttling and coil whine; some users reported overheating/battery drain within ~30 min.',
    },
    battery: { capacityWh: 80 },
    connectivity: {
      wifi: 'Wi-Fi 7',
      thunderbolt: '2× Thunderbolt 4',
    },
    build: {
      materials: 'Anodized aluminum lid + ABS bottom',
      weightKg: '2.6 kg',
    },
    reliability: [
      {
        area: 'GPU & acoustics',
        detail:
          'r/Alienware reported GPU throttling and coil whine on some RTX 5060 units in early batches, plus overheating/battery drain in ~30 min on some units.',
        severity: 'moderate',
      },
      {
        area: 'Support',
        detail: 'Dell support quality cited as inconsistent across reports.',
        severity: 'low',
      },
    ],
    sources: [
      {
        label: 'Dell.com — Alienware 16X Aurora',
        url: 'https://www.dell.com/en-us/shop/dell-laptops/alienware-16x-aurora-gaming-laptop/spd/alienware-aurora-ac16251-gaming-laptop',
        kind: 'manufacturer',
      },
      {
        label: 'CNET — 16X Aurora review',
        url: 'https://www.cnet.com/tech/computing/i-tested-two-budget-alienware-gaming-laptops-and-the-16x-aurora-is-the-one-to-get/',
        kind: 'review',
      },
      {
        label: 'IGN — Alienware 16X Aurora review',
        url: 'https://www.ign.com/articles/alienware-aurora-16x-review',
        kind: 'review',
      },
      {
        label: 'r/Alienware — 16X Aurora reliability',
        url: 'https://www.reddit.com/r/Alienware/comments/1rtq7b2/is_the_alienware_16x_aurora_worth_buying_right/',
        kind: 'reliability',
      },
    ],
    conflicts: [
      {
        field: 'Price',
        detail: 'CNET tested at $1,450–$1,650 on sale; IGN says "starts at $1,549"; Dell.com lists starting $1,849.99 — multiple price points observed.',
      },
    ],
    summary:
      'Positioned as the value Alienware (and the de-facto Dell G-Series replacement), the 16X Aurora runs its RTX 5060 at the full 115 W — meaningfully faster than the 80 W cap on the cheaper 16 Aurora. Street pricing swings widely (from ~$1,450 on sale to $1,849+ list), and early batches drew complaints of GPU throttling, coil whine and fast battery drain. Solid value when discounted, but check the unit and factor in Dell\'s inconsistent support.',
  },

  // Row 6 -------------------------------------------------------------------
  {
    slug: 'alienware-aurora-16',
    manufacturer: 'Alienware',
    productLine: 'Aurora',
    name: 'Alienware 16 Aurora (2026)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Mainstream gaming',
    segment: 'Dell/HP/Razer',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-040',
        label: 'RTX 5060 · Core 7 240H',
        cpu: { vendor: 'Intel', model: 'Core 7 240H', architecture: 'Raptor Lake Refresh (no NPU)', cores: 10, boostClock: '5.2 GHz' },
        gpu: { ...nvidia('GeForce RTX 5060 Laptop', 'rtx-5060'), tgpWatts: 80, tgpNote: '80 W hard-capped (confirmed Tom\'s Hardware & Notebookcheck)' },
        priceUsd: 1149,
        priceNote: 'from',
        statusNote: '80 W TGP cap; $1,149–$1,499 (RTX 5050/4050 configs also exist from ~$799.99).',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (WQXGA)',
      panelType: 'ips',
      refreshRateHz: 120,
      brightnessNits: '300 nits',
      colorGamut: '100% sRGB',
      gsyncVrr: 'VRR (no G-SYNC)',
    },
    memory: {
      installed: '32 GB',
      type: 'DDR5-5600',
      storageUpgradeable: '1 TB PCIe Gen 4 NVMe',
    },
    thermals: {
      throttlingNote: 'The 80 W GPU cap limits performance rather than producing heat; it is a structural design decision, not a defect.',
    },
    battery: { capacityWh: 96 },
    connectivity: {
      wifi: 'Wi-Fi 7 (MediaTek MT7925)',
      usbC: '1× USB 3.2 Gen 2 Type-C (no Thunderbolt)',
    },
    build: {
      materials: 'ABS chassis, aluminum lid',
      weightKg: '2.57 kg',
    },
    reliability: [
      {
        area: 'GPU TGP',
        detail:
          'The RTX 5060 is hard-capped at 80 W vs 115 W on the 16X Aurora — Tom\'s Hardware calls it "the biggest compromise" and PCWorld called the laptop "overpriced for the trade-offs". A design limitation, not a defect.',
        severity: 'high',
      },
      {
        area: 'CPU / features',
        detail: 'The Core 7 240H has no NPU, which limits Copilot+ features; it also sits a tier below the HX chips elsewhere in the lineup.',
        severity: 'low',
      },
    ],
    sources: [
      {
        label: 'Dell.com — Alienware 16 Aurora',
        url: 'https://www.dell.com/en-us/shop/dell-laptops/alienware-16-aurora-gaming-laptop/spd/alienware-aurora-ac16250-gaming-laptop',
        kind: 'manufacturer',
      },
      {
        label: "Tom's Hardware — Alienware 16 Aurora review",
        url: 'https://www.tomshardware.com/laptops/gaming-laptops/alienware-16-aurora-review',
        kind: 'review',
      },
      {
        label: 'PCWorld — Alienware 16 Aurora review',
        url: 'https://www.pcworld.com/article/2855425/alienware-16-aurora-review.html',
        kind: 'review',
      },
      {
        label: 'r/Alienware — Aurora 16 RTX 5060',
        url: 'https://www.reddit.com/r/Alienware/comments/1lqgsns/alienware_aurora_16_rtx_5060/',
        kind: 'reliability',
      },
    ],
    conflicts: [
      {
        field: 'GPU TGP',
        detail: 'Reddit/Best Buy product pages initially reported 65 W; Tom\'s Hardware confirmed 80 W — Dell\'s Best Buy promotional copy was inaccurate.',
      },
    ],
    summary:
      "The entry Alienware that replaced the Dell G-Series, and its headline compromise is structural: the RTX 5060 is hard-capped at 80 W (vs 115 W on the 16X Aurora), so it trails its own GPU tier, and the Core 7 240H has no NPU for Copilot+ features. Tom's Hardware and PCWorld both call it overpriced for the trade-offs. Worth it only at the low end of its $1,149–$1,499 range — otherwise the 16X Aurora is the better buy.",
  },

  // Rows 7–8 ----------------------------------------------------------------
  {
    slug: 'hp-omen-16',
    manufacturer: 'HP',
    productLine: 'OMEN',
    name: 'HP OMEN 16 (2026)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Mainstream gaming',
    segment: 'Dell/HP/Razer',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-041',
        label: 'Intel · RTX 5070 · Core Ultra 9 290HX Plus',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 290HX Plus', architecture: 'Arrow Lake-HX Plus', cores: 24 },
        gpu: { ...nvidia('GeForce RTX 5070 Laptop', 'rtx-5070'), tgpWatts: 115, tgpNote: '~115 W GPU; up to 170 W total system power (Unleashed)' },
        statusNote: 'OLED panel; pricing not confirmed at research time (~$1,500–$2,000 est.).',
      },
      {
        id: 'G26-042',
        label: 'AMD · RTX 5070 (12 GB) · Ryzen 9 9955HX3D',
        cpu: { vendor: 'AMD', model: 'Ryzen 9 9955HX / 9955HX3D', architecture: 'Zen 5 + 3D V-Cache' },
        gpu: { ...nvidia('GeForce RTX 5070 Laptop', 'rtx-5070'), vramGb: 12 },
        statusNote: 'AMD variant ships 12 GB VRAM but drops the light bar / reverse-fan mode; CPU conflict recorded (9955HX vs 9955HX3D).',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (2.5K)',
      panelType: 'oled',
      refreshRateHz: 165,
      brightnessNits: '500 nits SDR / 1100 nits HDR',
      hdr: 'HDR 1100 nits',
      colorGamut: '100% DCI-P3',
      gsyncVrr: 'VRR',
    },
    memory: {
      installed: '16–64 GB',
      type: 'DDR5-5600',
      maxGb: 64,
      upgradeable: true,
      soldered: false,
      storageUpgradeable: 'Up to 2 TB PCIe Gen 4 (PCIe Gen 5 slot available)',
    },
    thermals: {
      throttlingNote: 'Intel variant supports a dust-clearing reverse-fan mode; HP promises improved cooling for the 2026 refresh.',
    },
    battery: { capacityWh: 83 },
    connectivity: {
      wifi: 'Wi-Fi 7 (MediaTek MT7925)',
      thunderbolt: 'Thunderbolt (Intel; version unverified)',
      usb4: 'USB4 (AMD SKUs; no Thunderbolt)',
    },
    build: {
      materials: 'Aluminum-blend',
      weightKg: '~2.4 kg',
    },
    reliability: [
      {
        area: 'Single-channel RAM',
        detail: 'Initial units shipped with single-channel 16 GB DDR5 (performance impact confirmed by a YouTube reviewer); upgrade to dual-channel via the open slot.',
        severity: 'moderate',
      },
      {
        area: 'AMD feature parity',
        detail: 'The AMD variant lacks the chassis light bar, AlienFX-equivalent effects and reverse dust-cleaning fan mode (Intel-exclusive), and uses USB4 instead of Thunderbolt.',
        severity: 'low',
      },
      {
        area: 'Storage',
        detail: 'A PCIe Gen 5 SSD slot is present, but a Gen 4 SSD ships as standard.',
        severity: 'low',
      },
    ],
    sources: [
      {
        label: 'HP Gaming — Omen / HyperX laptops',
        url: 'https://www.hp.com/us-en/gaming-pc/laptops.html',
        kind: 'manufacturer',
      },
      {
        label: 'Notebookcheck — Omen 16 CES 2026',
        url: 'https://www.notebookcheck.net/New-HP-Omen-16-gaming-laptop-arrives-with-Intel-Panther-Lake-165-Hz-OLED-and-promise-of-improved-cooling.1196903.0.html',
        kind: 'review',
      },
      {
        label: 'YouTube — HyperX Omen Pro 16 review',
        url: 'https://www.youtube.com/watch?v=JWuDhaAP-9U',
        kind: 'review',
      },
    ],
    conflicts: [
      {
        field: 'CPU options',
        detail: 'HP.com shows "Up to Core Ultra 9 290HX Plus"; Notebookcheck\'s CES report also mentioned Core Ultra 7 365H and Core Ultra 9 275HX as options. AMD SKU may ship 9955HX rather than 9955HX3D.',
      },
      {
        field: 'GPU / VRAM',
        detail: 'Intel RTX 5070 ships 8 GB; AMD RTX 5070 ships 12 GB. Omen 16 maxes at RTX 5070, whereas the separate Omen Max 16 line goes to RTX 5090.',
      },
    ],
    summary:
      "HP's 2026 Omen 16 (now merged with the HyperX brand) is a 2.4 kg machine with a strong 165 Hz OLED (1100-nit HDR) offered in both Intel and AMD flavours. The two diverge in ways worth knowing: the Intel RTX 5070 ships with 8 GB VRAM plus a dust-clearing reverse-fan mode, while the AMD variant gets 12 GB VRAM but drops the light bar and reverse-fan feature and uses USB4 instead of Thunderbolt. Early units shipped single-channel 16 GB RAM (a known performance trap), and US pricing wasn't confirmed at research time.",
  },

  // Rows 9–10 ---------------------------------------------------------------
  {
    slug: 'hp-omen-max-16',
    manufacturer: 'HP',
    productLine: 'OMEN Max',
    name: 'HP OMEN Max 16 (2026)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Enthusiast gaming',
    segment: 'Dell/HP/Razer',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-043',
        label: 'Intel · RTX 5090 · Core Ultra 9 290HX Plus',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 290HX Plus', architecture: 'Arrow Lake-HX Plus', cores: 24, boostClock: '5.5 GHz' },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175, tgpNote: '175 W GPU (300 W total platform power)' },
        priceUsd: 4469,
        priceNote: 'from',
        statusNote: 'Line starts at $2,679 (Intel, RTX 5070 Ti base); RTX 5090 top config $4,469.',
      },
      {
        id: 'G26-044',
        label: 'AMD · RTX 5080 · Ryzen AI 9 HX 475',
        cpu: { vendor: 'AMD', model: 'Ryzen AI 9 HX 475', architecture: 'Gorgon Point' },
        gpu: { ...nvidia('GeForce RTX 5080 Laptop', 'rtx-5080'), tgpNote: 'Lower power ceiling than the Intel config (exact W unverified); AMD caps at RTX 5080' },
        priceUsd: 4569,
        priceNote: 'from',
        statusNote: 'AMD top config costs more than the Intel RTX 5090 despite the slower GPU; cited more often in thermal-complaint threads.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (2.5K)',
      panelType: 'oled',
      refreshRateHz: 240,
      brightnessNits: '500 nits SDR / 1100 nits HDR',
      hdr: 'HDR 1100 nits',
      colorGamut: '100% DCI-P3',
      gsyncVrr: 'G-SYNC (Intel) / VRR (AMD)',
    },
    memory: {
      installed: 'Up to 64 GB (AMD up to 48 GB)',
      type: 'DDR5-5600',
      maxGb: 64,
      storageUpgradeable: 'Up to 2 TB PCIe Gen 5 NVMe',
    },
    thermals: {
      throttlingNote: 'Intel + RTX 5080 config praised as running "clean and quiet"; AMD variant cited for erratic fan behaviour under light loads and higher surface temps.',
    },
    battery: { capacityWh: 83 },
    connectivity: {
      wifi: 'Wi-Fi 7',
      thunderbolt: '2× Thunderbolt 4 (Intel)',
      usb4: '2× USB4 (AMD)',
    },
    build: {
      materials: 'Aluminum / magnesium alloy',
      weightKg: '2.66–2.81 kg',
    },
    reliability: [
      {
        area: 'Reliability / QC',
        detail:
          'A 290-reply r/HPOmen PSA thread documents units shutting down mid-session, a suspected liquid-metal leak and motherboard failures, with HP repair timelines stretching 2–3 months. Quality-control variance is confirmed across multiple independent reports; the Intel build is praised by many, motherboard failures are real but not universal.',
        severity: 'high',
      },
      {
        area: 'AMD thermals',
        detail:
          'The AMD variant is more frequently cited for fan/thermal complaints, lacks the reverse-fan dust-cleaning mode, and showed crashes linked to dwm.exe (a clean Windows reinstall resolved most for some users).',
        severity: 'high',
      },
    ],
    sources: [
      {
        label: 'Notebookcheck — HP Omen Max 16 Series',
        url: 'https://www.notebookcheck.net/HP-Omen-Max-16-Series.1062750.0.html',
        kind: 'review',
      },
      {
        label: 'Notebookcheck — 2026 Max 16 refresh release',
        url: 'https://www.notebookcheck.net/HP-releases-new-16-inch-gaming-laptop-with-Nvidia-graphics-and-64-GB-RAM.1306172.0.html',
        kind: 'review',
      },
      {
        label: 'The Gadgeteer — Omen Max 16 polarizing review',
        url: 'https://the-gadgeteer.com/2026/02/23/hp-omen-max-16-gaming-laptop-you-either-love-it-or-hate-it/',
        kind: 'review',
      },
      {
        label: 'r/HPOmen — "avoid the Omen Max 16" PSA thread',
        url: 'https://www.reddit.com/r/HPOmen/comments/1ue379v/avoid_the_hp_omen_max_16_mine_completely_died_and/',
        kind: 'reliability',
      },
    ],
    conflicts: [
      {
        field: 'Price',
        detail: 'AMD top config ($4,569) costs $100 more than the Intel RTX 5090 config ($4,469) despite RTX 5080 vs RTX 5090 — flagged as an anomaly by Notebookcheck.',
      },
      {
        field: 'Model year overlap',
        detail: 'HP.com still lists a 275HX config as the current "Omen Max 16"; the 2026 "HyperX" refresh starts at $2,679 — two model years co-exist on the site.',
      },
    ],
    summary:
      'The enthusiast Omen, available with a 175 W RTX 5090 (Intel) or RTX 5080 (AMD) behind a 240 Hz OLED. Reliability is the headline concern: a 290-reply r/HPOmen PSA thread documents mid-session shutdowns, suspected liquid-metal leaks and motherboard failures, with HP repairs stretching 2–3 months — and the AMD variant is cited far more often in thermal/fan complaints than the Intel one. Oddly, the AMD top config ($4,569) costs more than the Intel RTX 5090 ($4,469) despite the slower GPU. Favour the Intel build, from a returnable seller.',
  },

  // Row 11 ------------------------------------------------------------------
  {
    slug: 'hp-omen-transcend-14',
    manufacturer: 'HP',
    productLine: 'OMEN Transcend',
    name: 'HP OMEN Transcend 14 (2026)',
    displaySizeInches: 14,
    releaseYear: 2026,
    targetMarket: 'Ultra-portable gaming',
    segment: 'Dell/HP/Razer',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-045',
        label: 'RTX 5060 · Core Ultra 7 255H',
        cpu: { vendor: 'Intel', model: 'Core Ultra 7 255H', architecture: 'Arrow Lake-H', cores: 16, boostClock: '5.1 GHz' },
        gpu: { ...nvidia('GeForce RTX 5060 Laptop', 'rtx-5060'), tgpWatts: 75, tgpNote: '75 W hard-capped (confirmed by community vBIOS thread)' },
        priceUsd: 1099,
        priceNote: 'from',
        statusNote: '75 W hard TGP cap; $1,099–$1,699 (HP spec page lists RTX 5050 as entry config).',
      },
    ],
    display: {
      sizeInches: 14,
      resolution: '2880×1800 (3K)',
      panelType: 'oled',
      refreshRateHz: 120,
      brightnessNits: '400 nits SDR / 500 nits HDR',
      hdr: 'HDR 500 nits',
      colorGamut: '100% DCI-P3',
      gsyncVrr: 'G-SYNC',
    },
    memory: {
      installed: '16–32 GB',
      type: 'LPDDR5X-7467 (onboard)',
      maxGb: 32,
      upgradeable: false,
      soldered: true,
      storageUpgradeable: '1 TB PCIe Gen 4 NVMe',
    },
    thermals: {
      throttlingNote: 'GPU hard-capped at 75 W; users report overheating during sustained loads such as video editing, and that the power supply is insufficient under external-monitor load.',
    },
    battery: { capacityWh: 83 },
    connectivity: {
      wifi: 'Wi-Fi 6E / Wi-Fi 7',
      thunderbolt: '2× Thunderbolt 4',
    },
    build: {
      materials: 'CNC aluminum unibody',
      weightKg: '1.64 kg',
    },
    reliability: [
      {
        area: 'GPU TGP',
        detail:
          'The GPU is hard-capped at 75 W despite RTX 5060/5070 hardware, so it significantly underperforms 115 W versions in the same tier; owners of the RTX 5070 model report it "couldn\'t manage basic tasks" with frequent overheating. Community vBIOS bypasses exist but are unsupported and may void the warranty.',
        severity: 'high',
      },
      {
        area: 'Support',
        detail: 'A 65 W vs 75 W power discrepancy with HP support remained unresolved.',
        severity: 'low',
      },
    ],
    sources: [
      {
        label: 'HP — Omen Transcend 14 store',
        url: 'https://www.hp.com/us-en/shop/pdp/omen-transcend-14-inch-gaming-laptop-pc-pdk-a88y7av-1',
        kind: 'manufacturer',
      },
      {
        label: "Tom's Hardware — Transcend 14 review",
        url: 'https://www.tomshardware.com/laptops/gaming-laptops/hp-omen-transcend-14-review',
        kind: 'review',
      },
      {
        label: 'TechRadar — HP Omen Transcend 14',
        url: 'https://www.techradar.com/computing/gaming-laptops/hp-omen-transcend-14',
        kind: 'review',
      },
      {
        label: 'r/GamingLaptops — Transcend 14 vBIOS thread',
        url: 'https://www.reddit.com/r/GamingLaptops/comments/1o0qxwz/rtx_5060_and_rtx_5070_115w_vbios_for_2025_hp_omen/',
        kind: 'reliability',
      },
    ],
    conflicts: [
      {
        field: 'GPU SKU / price',
        detail: 'HP\'s spec page lists RTX 5050 as the entry config on the Transcend 14t-fb100; TechTimes confirmed an RTX 5060 config at $1,099 on sale.',
      },
    ],
    summary:
      'A gorgeous 1.64 kg CNC-aluminum 14-incher with a 3K 120 Hz OLED — undone for gaming by a hard 75 W GPU cap. Owners report the RTX 5060/5070 silicon badly underperforming its tier, overheating during sustained work, and an unresolved HP support discrepancy over the power limit; community vBIOS bypasses exist but risk the warranty. Excellent as a premium thin-and-light, frustrating as a gaming machine.',
  },

  // Row 12 ------------------------------------------------------------------
  {
    slug: 'hp-victus-15',
    manufacturer: 'HP',
    productLine: 'Victus',
    name: 'HP Victus 15 (2026)',
    displaySizeInches: 15.6,
    releaseYear: 2026,
    targetMarket: 'Budget gaming',
    segment: 'Dell/HP/Razer',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-046',
        label: 'RTX 5050 · Core 5 210H',
        cpu: { vendor: 'Intel', model: 'Core 5 210H', cores: 8, boostClock: '4.8 GHz' },
        gpu: { ...nvidia('GeForce RTX 5050 Laptop', 'rtx-5050'), tgpNote: 'Exact TGP not published by HP (budget-class)' },
        priceUsd: 699,
        priceNote: 'from',
        statusNote: 'Budget tier; hinge concerns noted. ~$699–$799.',
      },
    ],
    display: {
      sizeInches: 15.6,
      resolution: '1920×1080 (FHD)',
      panelType: 'ips',
      refreshRateHz: 144,
      brightnessNits: '300 nits',
      colorGamut: '62.5% sRGB',
      gsyncVrr: 'No',
    },
    memory: {
      installed: '8–16 GB',
      type: 'DDR5-5200',
      storageUpgradeable: '512 GB PCIe Gen 4 NVMe',
    },
    thermals: {
      throttlingNote: 'Subpar cooling; overheating and battery drain are recurring owner complaints.',
    },
    battery: { capacityWh: 70 },
    connectivity: {
      wifi: 'Wi-Fi 6E',
    },
    build: {
      materials: 'Plastic chassis',
      weightKg: '~2.3 kg',
      buildQuality: 'Budget plastic; weak hinges reported',
    },
    reliability: [
      {
        area: 'Hinge',
        detail: 'Hinge weakness with cracks reported after ~1 year — a complaint repeated across multiple Victus generations.',
        severity: 'high',
      },
      {
        area: 'Display & thermals',
        detail: 'Display flickering reported within 2 years of use; overheating and rapid battery degradation also cited.',
        severity: 'moderate',
      },
    ],
    sources: [
      {
        label: 'HP — Victus 15t-fa200 store',
        url: 'https://www.hp.com/us-en/shop/pdp/victus-by-hp-156-inch-gaming-laptop-pc-a8vy4av-1',
        kind: 'manufacturer',
      },
      {
        label: 'r/GamingLaptops — Victus 2026 worth buying?',
        url: 'https://www.reddit.com/r/GamingLaptops/comments/1rkbsj2/is_this_laptop_worth_buying_in_2026/',
        kind: 'reliability',
      },
      {
        label: 'r/HPVictus — build quality discussion',
        url: 'https://www.reddit.com/r/HPVictus/comments/1fylqz9/is_the_victus_truly_poor_quality_as_some_reviews/',
        kind: 'reliability',
      },
      {
        label: 'r/HPVictus — 2026 performance issue',
        url: 'https://www.reddit.com/r/HPVictus/comments/1r1c6y3/hp_victus_gaming_laptop_performance_issue_within/',
        kind: 'reliability',
      },
    ],
    conflicts: [
      {
        field: 'Configurations',
        detail: 'HP.com lists both an AMD Ryzen 5 8645HS + Radeon RX 6550M Victus 15 and the Intel Core 5 210H + RTX 5050 config; the RTX 5050 TGP in this chassis is not published.',
      },
    ],
    summary:
      "HP's budget gaming entry at ~$699–$799, and it shows: a 62.5% sRGB 1080p panel, 512 GB of storage and a plastic chassis. The recurring owner complaints are structural and span generations — hinge cracking after about a year, display flicker within two, plus overheating and fast battery drain. A reasonable frames-per-dollar pick only if you treat it as semi-disposable and upgrade the RAM/storage yourself.",
  },

  // Rows 13–14 --------------------------------------------------------------
  {
    slug: 'razer-blade-14',
    manufacturer: 'Razer',
    productLine: 'Blade',
    name: 'Razer Blade 14 (2026)',
    displaySizeInches: 14,
    releaseYear: 2026,
    targetMarket: 'Premium thin-and-light',
    segment: 'Dell/HP/Razer',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-047',
        label: 'RTX 5060 · Ryzen AI 9 365',
        cpu: { vendor: 'AMD', model: 'Ryzen AI 9 365', architecture: 'Zen 5 / Strix Point', cores: 10, boostClock: '5.0 GHz' },
        gpu: { ...nvidia('GeForce RTX 5060 Laptop', 'rtx-5060'), tgpWatts: 115, tgpNote: '100 W + 15 W Dynamic Boost (115 W max)' },
        priceUsd: 1999,
        priceNote: 'from',
        statusNote: '16 GB RAM; $1,999–$2,299 (down from launch MSRP).',
      },
      {
        id: 'G26-048',
        label: 'RTX 5070 · Ryzen AI 9 365',
        cpu: { vendor: 'AMD', model: 'Ryzen AI 9 365', architecture: 'Zen 5 / Strix Point', cores: 10, boostClock: '5.0 GHz' },
        gpu: { ...nvidia('GeForce RTX 5070 Laptop', 'rtx-5070'), tgpWatts: 115, tgpNote: '100 W + 15 W Dynamic Boost (115 W max)' },
        priceUsd: 2699,
        priceNote: 'from',
        statusNote: 'RTX 5070 forces a 32 GB RAM upgrade in Razer\'s configurator (64 GB also available).',
      },
    ],
    display: {
      sizeInches: 14,
      resolution: '2880×1800 (3K / QHD+)',
      panelType: 'oled',
      refreshRateHz: 120,
      brightnessNits: '~400 nits typical',
      hdr: 'VESA DisplayHDR TrueBlack',
      colorGamut: '100% DCI-P3',
      gsyncVrr: 'G-SYNC',
    },
    memory: {
      installed: '16–32 GB',
      type: 'LPDDR5X-8000 (soldered)',
      upgradeable: false,
      soldered: true,
      ssdSlots: 1,
      storageUpgradeable: '1 TB PCIe Gen 4 NVMe (single upgradeable M.2)',
    },
    thermals: {
      throttlingNote: 'Fan noise on the 14" chassis is higher than on the 16".',
    },
    battery: { capacityWh: 72 },
    connectivity: {
      wifi: 'Wi-Fi 7',
      usb4: '2× USB4 (Type-C)',
    },
    build: {
      materials: 'CNC T6 aluminum unibody',
      weightKg: '1.63 kg',
      buildQuality: 'Excellent (aluminum unibody)',
      repairability: 'Low (soldered RAM, single M.2)',
    },
    reliability: [
      {
        area: 'Motherboard failure',
        detail:
          'Recurring post-warranty motherboard failures reported on r/RazerBlade14 (a ~1–2 year lifespan pattern), widely documented across model years.',
        severity: 'high',
      },
      {
        area: 'Battery & software',
        detail: 'Battery bloat documented; Razer Synapse software reliability complaints recur across all Blade models.',
        severity: 'moderate',
      },
      {
        area: 'VRAM',
        detail: 'The RTX 5070 model\'s 8 GB VRAM is criticized as insufficient for the native 2880×1800 OLED in demanding titles.',
        severity: 'moderate',
      },
    ],
    sources: [
      {
        label: 'Razer Blade 14 official page',
        url: 'https://www.razer.com/gaming-laptops/razer-blade-14',
        kind: 'manufacturer',
      },
      {
        label: 'PCWorld — Razer Blade 14 review',
        url: 'https://www.pcworld.com/article/2847578/razer-blade-14-review-2.html',
        kind: 'review',
      },
      {
        label: 'The Verge — Blade 14 pricing',
        url: 'https://www.theverge.com/news/669500/razer-blade-14-gaming-laptop-rtx-5060-5070-specs-price',
        kind: 'review',
      },
      {
        label: 'r/razer — Blade 14 motherboard failure thread',
        url: 'https://www.reddit.com/r/razer/comments/1ilx3km/dont_buy_razer_blade_14/',
        kind: 'reliability',
      },
    ],
    conflicts: [
      {
        field: 'Price',
        detail: 'Launched at $2,299 for the RTX 5060 (May 2025, The Verge); Razer.com now shows $1,999.99 for the RTX 5060 / 16 GB config — a drop from initial MSRP.',
      },
    ],
    summary:
      'The Blade 14 is the most desirable small chassis here — a 1.63 kg CNC-aluminum unibody with a 3K OLED and AMD\'s Ryzen AI 9 365 — but the soldered LPDDR5X and a single M.2 cap upgradeability. Its reputation problem is durability: r/razer documents recurring post-warranty motherboard failures (a ~1–2 year pattern), battery bloat and persistent Synapse software gripes. The RTX 5070 model\'s 8 GB VRAM is also tight for the native 2880×1800 panel.',
  },

  // Rows 15–16 --------------------------------------------------------------
  {
    slug: 'razer-blade-16',
    manufacturer: 'Razer',
    productLine: 'Blade',
    name: 'Razer Blade 16 (2026)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Premium gaming',
    segment: 'Dell/HP/Razer',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-049',
        label: 'RTX 5080 · Core Ultra 9 386H',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 386H', architecture: 'Panther Lake', cores: 16, boostClock: '4.9 GHz' },
        gpu: { ...nvidia('GeForce RTX 5080 Laptop', 'rtx-5080'), tgpWatts: 175, tgpNote: '150 W + 25 W Dynamic Boost (175 W max)' },
        priceUsd: 3499,
        priceNote: 'from',
        statusNote: '2026 Panther Lake refresh; $3,499–$3,999.',
      },
      {
        id: 'G26-050',
        label: 'RTX 5090 · Core Ultra 9 386H',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 386H', architecture: 'Panther Lake', cores: 16, boostClock: '4.9 GHz' },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175, tgpNote: '150 W + 25 W Dynamic Boost (175 W max); sustained ~150–165 W per owners' },
        priceUsd: 4499,
        priceNote: 'from',
        statusNote: '2026 Panther Lake refresh; 32–64 GB RAM, 2 TB base; $4,499–$5,599.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (QHD+)',
      panelType: 'oled',
      refreshRateHz: 240,
      brightnessNits: '1000 nits HDR',
      hdr: 'VESA DisplayHDR TrueBlack 1000',
      colorGamut: '100% DCI-P3',
      gsyncVrr: 'G-SYNC',
    },
    memory: {
      installed: '32–64 GB',
      type: 'LPDDR5X-9600 (soldered; fastest available laptop RAM)',
      maxGb: 64,
      upgradeable: false,
      soldered: true,
      storageUpgradeable: '1–2 TB PCIe Gen 4 NVMe (upgradeable)',
    },
    thermals: {
      throttlingNote: 'Thermal management rated "significantly improved" vs 2025; an owner reported the RTX 5090 sustained at 150–165 W and cooler idle temps than the prior model.',
    },
    battery: { capacityWh: 99.9 },
    connectivity: {
      wifi: 'Wi-Fi 7',
      bluetooth: 'BT 6.0',
      thunderbolt: 'Thunderbolt 5',
    },
    build: {
      materials: 'CNC aluminum unibody',
      weightKg: '~2.1 kg',
      buildQuality: 'Excellent (aluminum unibody)',
      repairability: 'Low (soldered RAM)',
    },
    reliability: [
      {
        area: 'QC / software',
        detail:
          'Some units were returned for startup-freeze glitches and benchmark scores slightly below the 2025 Blade 16; Synapse software glitches continue. Most owners report thermals and QC better than prior years.',
        severity: 'moderate',
      },
    ],
    sources: [
      {
        label: 'Razer — Blade 16 2026 newsroom',
        url: 'https://www.razer.com/newsroom/product-news/2026-blade-16/',
        kind: 'manufacturer',
      },
      {
        label: 'The Verge — Blade 16 2026 (Panther Lake)',
        url: 'https://www.theverge.com/gadgets/900518/razers-new-blade-16-gaming-laptop-has-an-intel-panther-lake-chip-and-very-fast-ram',
        kind: 'review',
      },
      {
        label: 'Windows Central — Blade 16 2026 announcement',
        url: 'https://www.windowscentral.com/hardware/razer/razer-blade-16-2026-announcement',
        kind: 'review',
      },
      {
        label: 'r/razer — Blade 16 2026 impressions',
        url: 'https://www.reddit.com/r/razer/comments/1t15jda/razer_blade_16_2026_impressions/',
        kind: 'reliability',
      },
    ],
    conflicts: [
      {
        field: 'Price',
        detail: 'RTX 5080: GamesRadar/The Verge cite $3,499.99, Technetbooks $3,999 after a hike, PCGamer "$3,200". RTX 5090: The Verge $4,499.99, Technetbooks $4,899 (32 GB), Digital Trends $5,599 (64 GB) — varies by time and region.',
      },
    ],
    summary:
      "Razer's 2026 Blade 16 switches to Intel Panther Lake and the fastest laptop RAM available (LPDDR5X-9600, soldered), behind a 240 Hz 1000-nit OLED in a ~2.1 kg unibody. The good news is thermals: owners report the 175 W GPUs running cooler than the 2025 model and sustaining 150–165 W. The catches are a few startup-freeze returns, the usual Synapse software niggles, and pricing that drifts between sources ($3,499–$5,599 depending on config and region).",
  },

  // Rows 17–18 --------------------------------------------------------------
  {
    slug: 'razer-blade-18',
    manufacturer: 'Razer',
    productLine: 'Blade',
    name: 'Razer Blade 18 (2026)',
    displaySizeInches: 18,
    releaseYear: 2026,
    targetMarket: 'Flagship desktop-replacement',
    segment: 'Dell/HP/Razer',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-051',
        label: 'RTX 5070 Ti · Core Ultra 9 290HX Plus',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 290HX Plus', architecture: 'Arrow Lake-HX Plus', cores: 24, boostClock: '5.5 GHz' },
        gpu: { ...nvidia('GeForce RTX 5070 Ti Laptop', 'rtx-5070-ti'), tgpWatts: 175, tgpNote: '150 W + 25 W Dynamic Boost (175 W max)' },
        priceUsd: 3999,
        priceNote: 'from',
        statusNote: 'Dual-mode panel: 4K 240 Hz or FHD+ 440 Hz.',
      },
      {
        id: 'G26-052',
        label: 'RTX 5090 · Core Ultra 9 290HX Plus',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 290HX Plus', architecture: 'Arrow Lake-HX Plus', cores: 24, boostClock: '5.5 GHz' },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175, tgpNote: '150 W + 25 W Dynamic Boost (175 W max; 280 W total system)' },
        priceUsd: 4499,
        priceNote: 'from',
        statusNote: 'RTX 5090 starts ~$4,499; up to $6,999 for the 128 GB / 2 TB top config.',
      },
    ],
    display: {
      sizeInches: 18,
      resolution: '3840×2400 (4K UHD+) or 1920×1200 (dual-mode)',
      panelType: 'ips',
      refreshRateHz: '240 Hz (4K) / 440 Hz (FHD+)',
      brightnessNits: '600 nits',
      hdr: 'DisplayHDR capable',
      colorGamut: '100% DCI-P3',
      gsyncVrr: 'G-SYNC',
      options: 'Dual-mode panel (resolution/refresh switch)',
    },
    memory: {
      installed: '32–128 GB',
      type: 'DDR5 (speed unspecified by Razer on 18")',
      maxGb: 128,
      storageUpgradeable: '1–2 TB PCIe Gen 4 NVMe',
    },
    thermals: {
      fanCount: 3,
      throttlingNote: '280 W total system power (Notebookcheck); a comparable thermal/acoustic profile is expected for an 18" machine at this draw.',
    },
    battery: { capacityWh: 99 },
    connectivity: {
      wifi: 'Wi-Fi 7',
      thunderbolt: 'Thunderbolt 5 + Thunderbolt 4',
    },
    build: {
      materials: 'CNC aluminum unibody',
      weightKg: '3.2 kg',
      thickness: '28.7 mm',
      buildQuality: 'Excellent (aluminum unibody)',
    },
    reliability: [
      {
        area: 'Mobility',
        detail: 'At 3.2 kg and 28.7 mm thick this is a desktop replacement — practical portability is limited by the form factor.',
        severity: 'low',
      },
      {
        area: 'Coverage',
        detail: 'Recent launch — no widespread reliability patterns confirmed for the 2026 model yet (insufficient data).',
        severity: 'low',
      },
    ],
    sources: [
      {
        label: 'Notebookcheck — Razer Blade 18 2026',
        url: 'https://www.notebookcheck.net/Razer-Blade-18-2026-with-4K-display-is-faster-but-costs-up-to-6-999.1297211.0.html',
        kind: 'review',
      },
      {
        label: 'Razer Blade 18 official page',
        url: 'https://www.razer.com/gaming-laptops/razer-blade-18',
        kind: 'manufacturer',
      },
      {
        label: 'Gagadget — Blade 18 2026 pricing overview',
        url: 'https://gagadget.com/en/710511-razer-blade-18-2026-rtx-5090-power-a-7000-price-tag-and-a-500-hike-on-entry/',
        kind: 'review',
      },
    ],
    conflicts: [
      {
        field: 'CPU',
        detail: 'Notebookcheck confirms the 2026 model replaces the Core Ultra 9 275HX with the 290HX Plus for ~100 MHz higher clocks — a minor performance delta. All three 2026 Blade 18 configs use the same 290HX Plus CPU.',
      },
      {
        field: 'Price',
        detail: 'RTX 5090 starts at $4,499 (32 GB); an intermediate RTX 5080 config is also $4,499; $6,999 is the 128 GB / 2 TB top config (Notebookcheck / Gagadget) — a $500 hike over the 2025 entry.',
      },
    ],
    summary:
      "The 18\" Blade is a true desktop replacement — a dual-mode panel (4K 240 Hz or FHD+ 440 Hz), up to a 175 W RTX 5090, up to 128 GB RAM and dual Thunderbolt 5/4 — in a 3.2 kg body that makes portability moot. The 2026 refresh swaps in the 290HX Plus CPU (a minor ~100 MHz bump over the 275HX) and a brighter 600-nit panel, but pushes the top config to a record $6,999. It's too new for reliability patterns to have emerged; pricing is the main thing to watch, with the RTX 5090 starting near $4,499.",
  },
];
