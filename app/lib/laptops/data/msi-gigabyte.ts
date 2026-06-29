// MSI + Gigabyte — fully enriched segment.
// Source: gaming-laptop-database-2026.md, "MSI / Gigabyte detailed tables"
// (Tables 1–11). Unknown values are omitted, not inferred.

import type { LaptopFamily } from '../types';
import { nvidia } from './_seed';

const VERIFIED = '2026-06-29';

export const MSI_GIGABYTE: LaptopFamily[] = [
  // Table 1 -----------------------------------------------------------------
  {
    slug: 'msi-titan-18-hx-ai',
    manufacturer: 'MSI',
    productLine: 'Titan',
    name: 'MSI Titan 18 HX AI (A2XW)',
    displaySizeInches: 18,
    releaseYear: 2026,
    targetMarket: 'Flagship desktop-replacement',
    segment: 'MSI/Gigabyte',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-017',
        label: 'RTX 5090 · Core Ultra 9 285HX / 290HX Plus',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 285HX / 290HX Plus', architecture: 'Arrow Lake-HX', cores: 24, boostClock: '5.5 GHz' },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175, tgpNote: '175 W (Dynamic Boost)' },
        priceUsd: 5499,
        priceNote: 'from',
        statusNote: 'CPU SKU conflict recorded (285HX vs 290HX Plus by region).',
      },
      {
        id: 'G26-018',
        label: 'RTX 5080 · Core Ultra 9 285HX',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 285HX', architecture: 'Arrow Lake-HX', cores: 24, boostClock: '5.5 GHz' },
        gpu: { ...nvidia('GeForce RTX 5080 Laptop', 'rtx-5080'), tgpWatts: 175, tgpNote: '175 W (Dynamic Boost)' },
        priceUsd: 4299,
        priceNote: 'from',
      },
    ],
    display: {
      sizeInches: 18,
      resolution: '3840×2400 (UHD+)',
      panelType: 'mini-led',
      refreshRateHz: 120,
      gsyncVrr: 'No G-Sync / Advanced Optimus',
    },
    memory: {
      installed: '64 GB DDR5-6400',
      type: 'DDR5 SO-DIMM (6400 MT/s)',
      maxGb: 128,
      upgradeable: true,
      soldered: false,
      storageUpgradeable: 'Up to 2 TB Gen5 + 4 TB Gen4',
    },
    thermals: {
      vaporChamber: true,
      cpuTempNote: '96–100 °C CPU under gaming load (owner reports)',
      gpuTempNote: '~81 °C GPU at 175 W',
      throttlingNote: 'P-core throttling above ~75 W sustained; "significant heat and noise" at full 261–270 W draw (Notebookcheck).',
    },
    battery: { capacityWh: 99.9 },
    connectivity: { wifi: 'Wi-Fi 7' },
    build: { materials: 'Magnesium-aluminum alloy', weightKg: '~3.3 kg' },
    reliability: [
      {
        area: 'CPU thermals',
        detail: 'Recurring reports of the CPU hitting 96–100 °C under gaming load; one owner saw PROCHOT triggers even at light load after ~4 months.',
        severity: 'high',
      },
      {
        area: 'Acoustics',
        detail: 'Fan noise prominent under full load; no G-Sync or Advanced Optimus on the display.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'MSI Titan 18 HX AI', url: 'https://www.msi.com/Laptop/Titan-18-HX-AI-A2XWX', kind: 'manufacturer' },
      { label: 'Notebookcheck Titan 18 HX AI review', url: 'https://www.notebookcheck.net/MSI-Titan-18-HX-AI-A2XWJG-Review-No-holds-barred-Core-Ultra-9-285HX-and-175-W-RTX-5090-Laptop-performance.1010632.0.html', kind: 'review' },
      { label: "Tom's Hardware review", url: 'https://www.tomshardware.com/laptops/gaming-laptops/msi-titan-18-hx-ai-review', kind: 'review' },
      { label: 'Reddit — thermal issues', url: 'https://www.reddit.com/r/MSILaptops/comments/1rno0ha/msi_titan_18_hx_ai_super_hot_under_low_load/', kind: 'reliability' },
    ],
    conflicts: [
      { field: 'CPU SKU', detail: 'MSI US store lists "290HX Plus" on some 2026 SKUs; the global page lists "285HX" — both ship as separate SKUs.' },
    ],
    summary:
      'A no-compromise 18" flagship — RTX 5090 at the full 175 W, a 4K Mini LED panel, and up to 128 GB RAM. The trade-off is heat and noise: owners report 96–100 °C CPU temps and prominent fan noise at full draw, and there is no G-Sync. A desk-bound powerhouse, not a quiet one.',
    pros: [
      'Full 175 W RTX 5090',
      '4K (UHD+) Mini LED, 120 Hz',
      'Upgradeable RAM (to 128 GB)',
      'Wi-Fi 7',
    ],
    cons: [
      'CPU hits 96–100 °C under load',
      'Loud fans at full draw',
      'No G-Sync / Advanced Optimus',
      'Heavy (~3.3 kg)',
    ],
  },

  // Table 2 -----------------------------------------------------------------
  {
    slug: 'msi-raider-16-max-hx',
    manufacturer: 'MSI',
    productLine: 'Raider',
    name: 'MSI Raider 16 Max HX (B2W)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Enthusiast gaming',
    segment: 'MSI/Gigabyte',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-019',
        label: 'RTX 5090 · Core Ultra 9 290HX Plus',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 290HX Plus', architecture: 'Arrow Lake-HX', cores: 24, boostClock: '5.5 GHz' },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175 },
        priceUsd: 4099,
        priceNote: 'from',
        statusNote: 'Heavily discounted at times (Micro Center seen at ~$2,999).',
      },
      {
        id: 'G26-020',
        label: 'RTX 5080 · Core Ultra 9 290HX Plus',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 290HX Plus', architecture: 'Arrow Lake-HX', cores: 24, boostClock: '5.5 GHz' },
        gpu: { ...nvidia('GeForce RTX 5080 Laptop', 'rtx-5080'), tgpWatts: 175 },
        priceUsd: 3499,
        priceNote: 'from',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (QHD+)',
      panelType: 'oled',
      refreshRateHz: 240,
      gsyncVrr: 'No G-Sync / Advanced Optimus',
    },
    memory: {
      installed: '32 GB DDR5-6400',
      type: 'DDR5 SO-DIMM (up to 7200 MT/s)',
      maxGb: 128,
      upgradeable: true,
      soldered: false,
      storageUpgradeable: '1 TB NVMe Gen4 (expandable)',
    },
    thermals: {
      throttlingNote: 'Cooler Boost Trinity with Intra Flow; OverBoost up to 300 W total. CPU runs very warm (Notebookcheck).',
    },
    battery: { capacityWh: 90 },
    connectivity: { wifi: 'Wi-Fi 7' },
    build: { materials: 'Metal lid, plastic base', weightKg: '~2.65 kg (5.85 lb)' },
    reliability: [
      {
        area: 'Build feel',
        detail: 'Plastic base does not feel premium for the price; lid flexes more than Alienware or Razer rivals; glossy OLED attracts fingerprints and glare (PCWorld).',
        severity: 'moderate',
      },
      {
        area: 'Thermals',
        detail: 'Very warm CPU temperatures; no G-Sync or Advanced Optimus.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'MSI Raider 16 Max HX', url: 'https://us.msi.com/Laptop/Raider-16-Max-HX-B2WX', kind: 'manufacturer' },
      { label: 'PCWorld review', url: 'https://www.pcworld.com/article/3121543/msi-raider-16-max-hx-review.html', kind: 'review' },
      { label: 'Notebookcheck — "Faster than the Titan 18 HX"', url: 'https://www.notebookcheck.net/MSI-Raider-16-Max-HX-laptop-review-Faster-than-the-Titan-18-HX.1314805.0.html', kind: 'review' },
    ],
    conflicts: [
      { field: 'Price', detail: '$4,099 launch (MSI) vs ~$2,999 (Micro Center/Slickdeals) vs ~$4,400 top SKU (Notebookcheck).' },
    ],
    summary:
      'A 16" OLED that out-benchmarks the bigger Titan thanks to 300 W of OverBoost headroom — and frequently sells well below MSRP. The honest knocks are a plasticky base, a flexing lid, and no G-Sync. Strong performance-per-dollar when discounted, less so at full price.',
    pros: [
      '240 Hz OLED',
      '175 W RTX 5090 + 300 W OverBoost',
      'Upgradeable RAM (to 128 GB)',
      'Often discounted below MSRP',
    ],
    cons: [
      'Plasticky base, flexing lid',
      'Glossy OLED shows glare & fingerprints',
      'Very warm CPU',
      'No G-Sync / Advanced Optimus',
    ],
  },

  // Table 3 -----------------------------------------------------------------
  {
    slug: 'msi-vector-16-hx-ai',
    manufacturer: 'MSI',
    productLine: 'Vector',
    name: 'MSI Vector 16 HX AI (A2XW)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Performance gaming',
    segment: 'MSI/Gigabyte',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-021',
        label: 'RTX 5080 · Core Ultra 9 275HX',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 275HX', architecture: 'Arrow Lake-HX', cores: 24, boostClock: '5.4 GHz' },
        gpu: { ...nvidia('GeForce RTX 5080 Laptop', 'rtx-5080'), tgpWatts: 175, tgpNote: '175 W (Dynamic Boost 2.0)' },
        priceUsd: 3199,
        priceNote: 'from',
        statusNote: 'Also offered with RTX 5070 Ti.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (QHD+)',
      panelType: 'ips',
      refreshRateHz: 240,
    },
    memory: {
      installed: '32 GB DDR5-5600',
      type: 'DDR5 SO-DIMM',
      upgradeable: true,
      soldered: false,
      storageUpgradeable: '2 TB NVMe Gen4',
    },
    thermals: { throttlingNote: 'MSI OverBoost Ultra; dual Thunderbolt 5.' },
    connectivity: { wifi: 'Wi-Fi 7', thunderbolt: '2× Thunderbolt 5' },
    reliability: [
      {
        area: 'Thermals',
        detail: 'A Reddit thread reports overheating with Kernel-Power Event ID 41 (suspected cooling fault); isolated, not systemic.',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'MSI Vector 16 HX AI', url: 'https://us.msi.com/Laptop/Vector-16-HX-AI-A2XWX', kind: 'manufacturer' },
      { label: 'Reddit — overheating thread', url: 'https://www.reddit.com/r/MSILaptops/comments/1poywzz/overheating_msi_vector_16_hx/', kind: 'reliability' },
    ],
    summary:
      'The value performance pick of MSI\'s 2026 line: a full 175 W RTX 5080 with dual Thunderbolt 5 around $3,199, undercutting the flashier Raider and Titan. Less is documented about its build, and there are isolated overheating reports, but on paper it\'s a lot of GPU for the money.',
    pros: [
      'Full 175 W RTX 5080',
      'Dual Thunderbolt 5',
      '240 Hz screen',
      'Undercuts Raider & Titan (~$3,199)',
    ],
    cons: [
      'IPS panel, not OLED',
      'Isolated overheating reports',
      'Build quality lightly documented',
    ],
  },

  // Table 4 -----------------------------------------------------------------
  {
    slug: 'msi-stealth-16-ai-plus',
    manufacturer: 'MSI',
    productLine: 'Stealth',
    name: 'MSI Stealth 16 AI+ (B3W)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Thin-and-light gaming',
    segment: 'MSI/Gigabyte',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-022',
        label: 'RTX 5080 · Core Ultra 9 386H',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 386H', architecture: 'Panther Lake', cores: 16, boostClock: '4.9 GHz' },
        gpu: { ...nvidia('GeForce RTX 5080 Laptop', 'rtx-5080'), tgpNote: '175 W total system ceiling' },
        statusNote: 'Pre-release pricing unknown.',
      },
      {
        id: 'G26-023',
        label: 'RTX 5070 Ti · Core Ultra 9 386H',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 386H', architecture: 'Panther Lake', cores: 16, boostClock: '4.9 GHz' },
        gpu: nvidia('GeForce RTX 5070 Ti Laptop', 'rtx-5070-ti'),
        statusNote: 'Pre-release pricing unknown.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (QHD+)',
      panelType: 'oled',
      refreshRateHz: 240,
    },
    battery: { capacityWh: 90 },
    thermals: {
      throttlingNote: 'Cooler Boost with Intra Flow in a 16.65 mm chassis; predecessor showed thermal throttling under sustained load.',
    },
    build: {
      materials: 'All-aluminum alloy',
      weightKg: '1.99 kg',
      thickness: '16.65 mm (thinnest point)',
      keyboard: 'Invisible hinge',
    },
    reliability: [
      {
        area: 'Thermals',
        detail: 'The predecessor Stealth 16 AI Studio ran 60–70 °C idle and throttled under sustained gaming on its thin chassis; MSI called the heat behaviour "common". Watch whether this persists on the B3W.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'MSI Stealth 16 AI+', url: 'https://www.msi.com/Laptop/Stealth-16-AI-Plus-B3WX', kind: 'manufacturer' },
      { label: "Tom's Hardware CES 2026", url: 'https://www.tomshardware.com/laptops/gaming-laptops/msis-newest-16-inch-raider-and-stealth-gaming-laptops-debut-panther-lake-options-oled-panels-and-familiar-rtx-50-gpus', kind: 'review' },
    ],
    conflicts: [
      { field: 'GPU options', detail: "Tom's Hardware lists RTX 5070 Ti/5080/5090; MSI's page shows RTX 5080 as the top SKU — RTX 5090 may be a regional/pre-production detail." },
    ],
    summary:
      'A genuinely thin (16.65 mm), 1.99 kg all-aluminum 16" with an OLED and Panther Lake silicon — MSI\'s style-led option. Pricing wasn\'t set at research time, and the big question mark is sustained thermals, since the previous Stealth ran hot in the same thin form factor.',
    pros: [
      'Thin 16.65 mm, 1.99 kg',
      '240 Hz OLED',
      'All-aluminum build',
      'Panther Lake silicon',
    ],
    cons: [
      'Thin chassis risks throttling',
      'Predecessor ran hot under load',
      'Pricing not set at launch',
    ],
  },

  // Table 5 -----------------------------------------------------------------
  {
    slug: 'msi-crosshair-16-hx-ai',
    manufacturer: 'MSI',
    productLine: 'Crosshair',
    name: 'MSI Crosshair 16 HX AI (D2XW)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Mid-range gaming',
    segment: 'MSI/Gigabyte',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-024',
        label: 'RTX 5070 · Core Ultra 7 255HX / Ultra 9 275HX',
        cpu: { vendor: 'Intel', model: 'Core Ultra 7 255HX / Ultra 9 275HX', architecture: 'Arrow Lake-HX' },
        gpu: { ...nvidia('GeForce RTX 5070 Laptop', 'rtx-5070'), tgpWatts: 115, tgpNote: '115 W (Dynamic Boost); 170 W combined CPU+GPU' },
        priceUsd: 1499,
        priceNote: 'from',
      },
      {
        id: 'G26-025',
        label: 'RTX 5060 · Core Ultra 7 255HX',
        cpu: { vendor: 'Intel', model: 'Core Ultra 7 255HX', architecture: 'Arrow Lake-HX' },
        gpu: { ...nvidia('GeForce RTX 5060 Laptop', 'rtx-5060'), tgpWatts: 115 },
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (QHD+)',
      panelType: 'ips',
      refreshRateHz: 240,
    },
    memory: {
      installed: '32 GB DDR5-6400',
      type: 'DDR5 SO-DIMM (6400 MT/s)',
      maxGb: 96,
      upgradeable: true,
      soldered: false,
      storageUpgradeable: '1 TB NVMe (expandable)',
    },
    thermals: { throttlingNote: 'Cooler Boost 5; OverBoost; ~170 W combined CPU+GPU. Fan noise under heavy load.' },
    battery: { capacityWh: 90 },
    connectivity: { wifi: 'Wi-Fi 6E' },
    build: { weightKg: '~2.8 kg' },
    reliability: [
      {
        area: 'USB-C routing',
        detail: 'The Type-C port is routed through the iGPU, causing crashes/unplayable games on external monitors — use HDMI (dGPU) or an adapter.',
        severity: 'high',
      },
      {
        area: 'Thermal paste',
        detail: 'Owners report thermal paste drying out in under 2 years (66 °C idle CPU after the fact; confirmed repaste case).',
        severity: 'moderate',
      },
      {
        area: 'Display',
        detail: 'White pressure spots reported on the panel; 8 GB VRAM considered limiting by some owners at 1440p.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'MSI Crosshair 16 HX AI', url: 'https://www.msi.com/Laptop/Crosshair-16-HX-AI-D2XWX/Specification', kind: 'manufacturer' },
      { label: 'Notebookcheck review', url: 'https://www.notebookcheck.net/MSI-Crosshair-16-HX-AI-Laptop-Review-Solid-performance-with-caveats-that-don-t-mar-the-core-gaming-experience.1153382.0.html', kind: 'review' },
      { label: 'Reddit — Type-C/iGPU issue', url: 'https://www.reddit.com/r/MSILaptops/comments/1prr06x/hdmi_crosshair_16_hx_ai_d2xw/', kind: 'reliability' },
    ],
    conflicts: [
      { field: 'GPU VRAM', detail: 'Standard Crosshair 16 ships RTX 5070 with 8 GB; a separate Crosshair 16 Max variant ships RTX 5070 with 12 GB.' },
    ],
    summary:
      'A solid mid-ranger with upgradeable RAM (to 96 GB) and a 240 Hz screen around $1,499 — but it carries real caveats: the USB-C port routes through the iGPU and breaks external-monitor gaming (use HDMI), the thermal paste reportedly dries out quickly, and the 8 GB VRAM is tight at 1440p.',
    pros: [
      'Upgradeable RAM (to 96 GB)',
      '240 Hz screen',
      'Affordable (~$1,499)',
    ],
    cons: [
      'USB-C breaks external-monitor gaming (use HDMI)',
      'Thermal paste dries out within 2 years',
      '8 GB VRAM tight at 1440p',
      'Only Wi-Fi 6E',
    ],
  },

  // Table 6 -----------------------------------------------------------------
  {
    slug: 'msi-katana-15-hx',
    manufacturer: 'MSI',
    productLine: 'Katana',
    name: 'MSI Katana 15 HX (B14W)',
    displaySizeInches: 15.6,
    releaseYear: 2026,
    targetMarket: 'Budget gaming',
    segment: 'MSI/Gigabyte',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-026',
        label: 'RTX 5070 · Core i9-14900HX / i7-14650HX',
        cpu: { vendor: 'Intel', model: 'Core i9-14900HX / i7-14650HX', architecture: 'Raptor Lake-HX', boostClock: '5.8 GHz' },
        gpu: { ...nvidia('GeForce RTX 5070 Laptop', 'rtx-5070'), tgpWatts: 115, tgpNote: '115 W (Dynamic Boost)' },
        priceUsd: 999,
        priceNote: 'from',
        statusNote: 'QHD 165 Hz panel.',
      },
      {
        id: 'G26-027',
        label: 'RTX 5050 · Core i9-14900HX / i7-14650HX',
        cpu: { vendor: 'Intel', model: 'Core i9-14900HX / i7-14650HX', architecture: 'Raptor Lake-HX', boostClock: '5.8 GHz' },
        gpu: { ...nvidia('GeForce RTX 5050 Laptop', 'rtx-5050'), tgpWatts: 115 },
        priceUsd: 999,
        priceNote: 'from',
        statusNote: 'FHD 144 Hz panel.',
      },
    ],
    display: {
      sizeInches: 15.6,
      resolution: '2560×1440 (QHD) or 1920×1080 (FHD)',
      panelType: 'ips',
      refreshRateHz: '165 Hz (QHD) / 144 Hz (FHD)',
      brightnessNits: 'Dim (noted as a weakness at $999)',
      options: 'QHD 165 Hz or FHD 144 Hz',
    },
    memory: {
      installed: '16–32 GB DDR5-5600',
      type: 'DDR5 SO-DIMM (5600 MT/s)',
      maxGb: 96,
      upgradeable: true,
      soldered: false,
    },
    thermals: { throttlingNote: 'Cooler Boost 5 (MSI series standard).' },
    connectivity: { wifi: 'Wi-Fi 6E' },
    reliability: [
      {
        area: 'Display',
        detail: 'Tom\'s Hardware flagged a dim display as the key weakness at $999; CNET rated it 7.2/10 for solid 1080p value.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'MSI Katana 15 HX', url: 'https://www.msi.com/Laptop/Katana-15-HX-B14WX/Specification', kind: 'manufacturer' },
      { label: "Tom's Hardware review", url: 'https://www.tomshardware.com/laptops/gaming-laptops/msi-katana-15-hx-review', kind: 'review' },
      { label: 'CNET review', url: 'https://www.cnet.com/tech/computing/i-tested-msis-999-gaming-laptop-and-liked-its-1080p-performance-but-little-else/', kind: 'review' },
    ],
    conflicts: [
      { field: 'CPU SKU', detail: 'Both Core i9-14900HX and i7-14650HX ship as separate SKUs under the same model.' },
    ],
    summary:
      'A $999 RTX 5070 on a last-gen Raptor Lake CPU — strong frames-per-dollar with genuinely upgradeable RAM. The consistent compromise reviewers cite is a dim display; otherwise it\'s a sensible budget pick if you can live with 16:9 and a plastic build.',
    pros: [
      'RTX 5070 from $999',
      'Upgradeable RAM (to 96 GB)',
      'QHD 165 Hz panel option',
    ],
    cons: [
      'Dim display',
      'Last-gen Raptor Lake CPU',
      '16:9 panel, plastic build',
      'Only Wi-Fi 6E',
    ],
  },

  // Table 7 -----------------------------------------------------------------
  {
    slug: 'msi-cyborg-15',
    manufacturer: 'MSI',
    productLine: 'Cyborg',
    name: 'MSI Cyborg 15 (B2RW)',
    displaySizeInches: 15.6,
    releaseYear: 2026,
    targetMarket: 'Entry-level gaming',
    segment: 'MSI/Gigabyte',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-028',
        label: 'RTX 5050 · Core 7 240H',
        cpu: { vendor: 'Intel', model: 'Core 7 240H', cores: 10, boostClock: '5.2 GHz' },
        gpu: { ...nvidia('GeForce RTX 5050 Laptop', 'rtx-5050'), tgpWatts: 45, tgpNote: '45 W TGP — well below the 100 W "Max" variant' },
        priceUsd: 999,
        priceNote: 'from',
      },
      {
        id: 'G26-029',
        label: 'RTX 5060 · Core 7 240H / Core 5 210H',
        cpu: { vendor: 'Intel', model: 'Core 7 240H / Core 5 210H' },
        gpu: nvidia('GeForce RTX 5060 Laptop', 'rtx-5060'),
        priceUsd: 999,
        priceNote: 'from',
        statusNote: 'TGP higher than the 5050 tier, but unconfirmed by independent review.',
      },
    ],
    display: {
      sizeInches: 15.6,
      resolution: '1920×1080 (FHD)',
      panelType: 'ips',
      refreshRateHz: 144,
      colorGamut: '65% sRGB (low — "office-grade")',
    },
    memory: {
      installed: '16 GB DDR5',
      type: 'DDR5 SO-DIMM (2× slots)',
      upgradeable: true,
      soldered: false,
      storageUpgradeable: '512 GB NVMe (low for 2026)',
    },
    thermals: {
      vaporChamber: false,
      throttlingNote: 'Standard fan cooling, no vapor chamber. Idle temps run warm; elevated DPC latency.',
    },
    battery: { capacityWh: 55.2, officeHours: '~5.4 hrs (Wi-Fi)' },
    connectivity: { wifi: 'Wi-Fi 6E' },
    build: { materials: 'Plastic base, metal lid, translucent accents', weightKg: '2.2 kg' },
    reliability: [
      {
        area: 'GPU TGP',
        detail: 'The RTX 5050 is limited to 45 W TGP (vs up to 100 W elsewhere), making it ~20% slower than the RTX 5050 average — and below the previous RTX 4060 in some tests (Notebookcheck).',
        severity: 'high',
      },
      {
        area: 'Display',
        detail: '65% sRGB coverage is poor; 512 GB base storage is low for 2026.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'MSI Cyborg 15', url: 'https://www.msi.com/Laptop/Cyborg-15-B2RWX', kind: 'manufacturer' },
      { label: 'Notebookcheck full review', url: 'https://www.notebookcheck.net/MSI-Cyborg-15-review-The-perfect-budget-gaming-laptop-for-2026.1218188.0.html', kind: 'review' },
    ],
    conflicts: [
      { field: 'GPU TGP', detail: 'Standard Cyborg 15 (B2RWEKG) is 45 W; a separate "Cyborg 15 Max" variant runs 100 W TGP.' },
    ],
    summary:
      'A $999 entry machine whose headline RTX 5050 is hamstrung by a 45 W power limit — it can trail the older RTX 4060. Combined with a 65% sRGB panel and 512 GB storage, it\'s only worth it at a real discount; if you want the GPU to stretch its legs, look at the 100 W "Max" variant instead.',
    pros: [
      'Upgradeable RAM (2 slots)',
      '144 Hz panel',
      'Light (2.2 kg)',
    ],
    cons: [
      '45 W TGP limits the RTX 5050 (can trail RTX 4060)',
      'Poor 65% sRGB panel',
      '512 GB storage, low for 2026',
      'No vapor chamber, warm idle',
    ],
  },

  // Table 8 -----------------------------------------------------------------
  {
    slug: 'gigabyte-aorus-master-16-gen-2',
    manufacturer: 'Gigabyte',
    productLine: 'AORUS Master',
    name: 'Gigabyte AORUS Master 16 GEN 2 (AM6J)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Enthusiast gaming',
    segment: 'MSI/Gigabyte',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-030',
        label: 'RTX 5090 · Ryzen 9 9955HX3D',
        cpu: { vendor: 'AMD', model: 'Ryzen 9 9955HX3D', architecture: 'Zen 5 + 3D V-Cache', cores: 16, threads: 32, boostClock: '5.4 GHz' },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175, tgpNote: '175 W (Dynamic Boost)' },
        statusNote: 'Computex 2026 launch price unpublished; 2025 RTX 5090 model was ~$4,299.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (WQXGA)',
      panelType: 'oled',
      refreshRateHz: 240,
    },
    memory: {
      installed: '32 GB DDR5-5600',
      type: 'DDR5 SO-DIMM (2× slots)',
      maxGb: 64,
      upgradeable: true,
      soldered: false,
      storageUpgradeable: '1 TB NVMe (1× Gen5 + 1× Gen4)',
    },
    thermals: {
      vaporChamber: true,
      cpuTempNote: 'Low 80s °C CPU (cooler than Intel equivalents)',
      gpuTempNote: 'Low 80s °C GPU at 175 W',
      noiseGamingDb: 'Performance preset "excessively high" (Reddit)',
      throttlingNote: 'WINDFORCE Infinity EX (asymmetric Frost Fan + vapor chamber); up to 230 W thermal capacity.',
    },
    battery: { capacityWh: 99 },
    connectivity: { wifi: 'Wi-Fi 7' },
    build: { materials: '"5-degree Black" aluminum', weightKg: '2.3 kg', thickness: '19 mm (17% thinner than prior gen)' },
    reliability: [
      {
        area: 'Acoustics',
        detail: 'Fan noise at the performance preset described as "excessively high"; balanced mode is loud but acceptable. The AMD X3D chip runs cooler than the Intel predecessor.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'Gigabyte AORUS Master 16 GEN 2', url: 'https://www.gigabyte.com/Laptop/AORUS-MASTER-16-AM6J/sp', kind: 'manufacturer' },
      { label: 'Matthew Moniz 2026 review', url: 'https://matthewmoniz.com/videos/gigabyte-aorus-master-16-2026-review', kind: 'review' },
      { label: 'Notebookcheck (2025 predecessor)', url: 'https://www.notebookcheck.net/Competing-against-ROG-Legion-and-co-with-an-RTX-5090-and-240-Hz-OLED-Gigabyte-Aorus-Master-16-gaming-laptop-review.1028442.0.html', kind: 'review' },
    ],
    conflicts: [
      { field: 'Price', detail: 'Computex 2026 launch price not published; 2025 RTX 5090 model was ~$4,299.' },
    ],
    summary:
      'A slim (19 mm) 2.3 kg 16" OLED that pairs an RTX 5090 with AMD\'s X3D CPU — which keeps both chips in the low 80s °C, cooler than the Intel rivals. The recurring complaint is noise: the performance fan preset is very loud. Pricing for the 2026 GEN 2 wasn\'t public at research time.',
    pros: [
      '175 W RTX 5090 + AMD X3D CPU',
      '240 Hz OLED',
      'Slim 19 mm, 2.3 kg',
      'Cool low-80s °C chips',
    ],
    cons: [
      'Very loud performance fan preset',
      'RAM caps at 64 GB',
      '2026 pricing not public',
    ],
  },

  // Table 9 -----------------------------------------------------------------
  {
    slug: 'gigabyte-aorus-master-18',
    manufacturer: 'Gigabyte',
    productLine: 'AORUS Master',
    name: 'Gigabyte AORUS Master 18 (AM8H)',
    displaySizeInches: 18,
    releaseYear: 2026,
    targetMarket: 'Flagship desktop-replacement',
    segment: 'MSI/Gigabyte',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-031',
        label: 'RTX 5090 · Core Ultra 9 275HX',
        cpu: { vendor: 'Intel', model: 'Core Ultra 9 275HX', architecture: 'Arrow Lake-HX', cores: 24, boostClock: '5.4 GHz' },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175, tgpNote: '175 W (+200 MHz AI Boost OC)' },
        statusNote: 'Pricing unknown; review pricing differs ~$1,595 between sources ($4,400–$5,995).',
      },
    ],
    display: {
      sizeInches: 18,
      resolution: '2560×1600 (WQXGA)',
      panelType: 'mini-led',
      refreshRateHz: 240,
    },
    memory: {
      installed: 'Up to 128 GB',
      type: 'DDR5 SO-DIMM (4× slots)',
      maxGb: 128,
      upgradeable: true,
      soldered: false,
      storageUpgradeable: 'Up to 6 TB (1× Gen5 + 2× Gen4)',
    },
    thermals: {
      throttlingNote: 'WINDFORCE Infinity EX; up to 270 W total thermal power (400 W adapter). 270 W draw produces significant heat and noise.',
    },
    battery: { capacityWh: 99 },
    connectivity: { wifi: 'Wi-Fi 7', thunderbolt: 'Thunderbolt 5 + Thunderbolt 4' },
    build: { materials: '"5-degree Black" aluminum', weightKg: '~3.5 kg' },
    reliability: [
      {
        area: 'Heat & noise',
        detail: 'No independent 2026 review at research date; comparable 18" machines at 270 W produce significant heat and noise. BIOS options reported as limited vs Alienware.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'Gigabyte AORUS Master 18', url: 'https://www.gigabyte.com/Laptop/AORUS-MASTER-18-AM8H/sp', kind: 'manufacturer' },
      { label: 'IGN CES 2026 announcement', url: 'https://in.ign.com/tech/250459/news/ces-2026-gigabyte-aorus-master-16-aero-x16-and-a18-pro-gaming-laptops-announced-along-with-rtx-5090', kind: 'review' },
    ],
    conflicts: [
      { field: 'Price', detail: 'Review pricing differs by ~$1,595 between sources ($4,400 vs $5,995).' },
    ],
    summary:
      'The 18" big brother: an overclockable 175 W RTX 5090, a Mini LED panel, and extreme expandability (up to 128 GB RAM and 6 TB of SSD across 3 slots) plus Thunderbolt 5. Independent reviews were thin at research time, and at 270 W it will run hot and loud — a true desktop replacement.',
    pros: [
      'Overclockable 175 W RTX 5090',
      '240 Hz Mini LED',
      'Up to 128 GB RAM + 6 TB SSD',
      'Thunderbolt 5',
    ],
    cons: [
      'Runs hot & loud at 270 W',
      'Heavy (~3.5 kg)',
      'Limited BIOS options vs Alienware',
      'Pricing unclear at launch',
    ],
  },

  // Table 10 ----------------------------------------------------------------
  {
    slug: 'gigabyte-gaming-a18-pro',
    manufacturer: 'Gigabyte',
    productLine: 'Gaming A',
    name: 'Gigabyte Gaming A18 Pro (GA8J)',
    displaySizeInches: 18,
    releaseYear: 2026,
    targetMarket: 'Large-screen gaming',
    segment: 'MSI/Gigabyte',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-032',
        label: 'RTX 5080 · Core 7 240H',
        cpu: { vendor: 'Intel', model: 'Core 7 240H', cores: 10, boostClock: '5.2 GHz' },
        gpu: nvidia('GeForce RTX 5080 Laptop', 'rtx-5080'),
        statusNote: 'Top GPU per Gigabyte spec page.',
      },
      {
        id: 'G26-033',
        label: 'RTX 5070 Ti · Core 7 240H',
        cpu: { vendor: 'Intel', model: 'Core 7 240H', cores: 10, boostClock: '5.2 GHz' },
        gpu: nvidia('GeForce RTX 5070 Ti Laptop', 'rtx-5070-ti'),
        statusNote: 'Notebookcheck review config (DXJ); ~57 dB fan noise at gaming load.',
      },
    ],
    display: {
      sizeInches: 18,
      resolution: '2560×1600 (WQXGA)',
      panelType: 'ips',
      refreshRateHz: 165,
      brightnessNits: '~300 nits (low for an 18" panel)',
    },
    memory: {
      installed: '32 GB LPDDR5x-5600 (soldered)',
      type: 'LPDDR5x-5600 onboard',
      maxGb: 32,
      upgradeable: false,
      soldered: true,
      storageUpgradeable: 'Up to 4 TB (2× Gen4)',
    },
    thermals: {
      noiseGamingDb: '~57 dB(A) at gaming load (very loud)',
      throttlingNote: 'GiMATE AI agent; MUX Switch.',
    },
    battery: { capacityWh: 76 },
    connectivity: { wifi: 'Wi-Fi 6E' },
    build: { materials: 'Titanium Black', weightKg: '~2.9 kg', thickness: '20–25 mm' },
    reliability: [
      {
        area: 'Soldered RAM',
        detail: 'RAM is fully soldered at 32 GB — no upgrade path, so it cannot be expanded later.',
        severity: 'high',
      },
      {
        area: 'Acoustics & display',
        detail: '57 dB(A) fan noise at gaming load is very loud; 300-nit brightness is low and the 76 Wh battery is small for an 18" machine.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'Gigabyte Gaming A18 Pro', url: 'https://www.gigabyte.com/Laptop/GIGABYTE-GAMING-A18-PRO-GA8J/sp', kind: 'manufacturer' },
      { label: 'Notebookcheck review', url: 'https://www.notebookcheck.net/Gaming-without-compromise-Gigabyte-Gaming-A18-Pro-with-large-display-reviewed.1267784.0.html', kind: 'review' },
    ],
    conflicts: [
      { field: 'Top GPU', detail: 'Notebookcheck reviewed an RTX 5070 Ti unit (DXJ); the spec page lists RTX 5080 as the top GPU — both are valid SKUs.' },
    ],
    summary:
      'A big-screen 18" with a MUX switch and up to an RTX 5080 — but it makes real compromises: the 32 GB RAM is soldered (no upgrades), the fans hit a very loud 57 dB(A) under load, and the 300-nit panel and 76 Wh battery are both on the small side. Buy the capacity you need up front.',
    pros: [
      'MUX Switch',
      'Up to RTX 5080',
      'Up to 4 TB SSD',
    ],
    cons: [
      'RAM soldered at 32 GB (no upgrades)',
      'Very loud (~57 dB)',
      'Dim 300-nit panel',
      'Small 76 Wh battery',
    ],
  },

  // Table 11 ----------------------------------------------------------------
  {
    slug: 'gigabyte-aero-x16',
    manufacturer: 'Gigabyte',
    productLine: 'AERO',
    name: 'Gigabyte AERO X16 (EG61H / EG64H)',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Creator-gaming hybrid',
    segment: 'MSI/Gigabyte',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-034',
        label: 'RTX 5070 · Ryzen AI 7 350 / Ryzen AI 9 HX 370',
        cpu: { vendor: 'AMD', model: 'Ryzen AI 7 350 (EG61H) / Ryzen AI 9 HX 370 (EG64H)', architecture: 'Krackan Point / Zen 5', boostClock: '5.0–5.1 GHz' },
        gpu: { ...nvidia('GeForce RTX 5070 Laptop', 'rtx-5070'), tgpWatts: 85, tgpNote: '85 W TGP (confirmed by Tom\'s Hardware)' },
        statusNote: 'Available June 2026; no Thunderbolt (USB4 only).',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (WQXGA)',
      panelType: 'ips',
      refreshRateHz: 165,
    },
    memory: {
      installed: 'Up to 64 GB DDR5-5600',
      type: 'DDR5 SO-DIMM (2× slots)',
      maxGb: 64,
      upgradeable: true,
      soldered: false,
      storageUpgradeable: 'Up to 4 TB (Gen4×4 + Gen4×2)',
    },
    thermals: { throttlingNote: 'WINDFORCE Infinity cooling; MUX Switch; Copilot+ PC certified.' },
    battery: { capacityWh: 76 },
    connectivity: { wifi: 'Wi-Fi 6E', usb4: 'USB4 (no Thunderbolt)' },
    build: { materials: 'Slim aluminum (Lunar White / Space Gray)', weightKg: '~1.9 kg' },
    reliability: [
      {
        area: 'GPU TGP',
        detail: 'The RTX 5070 runs at only 85 W — Tom\'s Hardware called it "capable hardware, compromised", and PCGamer found gaming performance underwhelming for an RTX 5070.',
        severity: 'high',
      },
      {
        area: 'Connectivity',
        detail: 'No Thunderbolt (USB4 only). RAM is user-accessible (2× SO-DIMM).',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'Gigabyte AERO X16 EG61H', url: 'https://www.gigabyte.com/Laptop/GIGABYTE-AERO-X16-EG61H/sp', kind: 'manufacturer' },
      { label: "Tom's Hardware review", url: 'https://www.tomshardware.com/laptops/gaming-laptops/gigabyte-aero-x16-review', kind: 'review' },
      { label: 'PCGamer review', url: 'https://www.pcgamer.com/hardware/gaming-laptops/gigabyte-aero-x16/', kind: 'review' },
    ],
    conflicts: [
      { field: 'GPU TGP / SKU', detail: '85 W RTX 5070 (Tom\'s Hardware); a separate EG61H sub-SKU with RTX 5060 also exists.' },
    ],
    summary:
      'A 1.9 kg slim creator-gaming 16" with upgradeable RAM and a clean aluminum design — but the RTX 5070 is capped at just 85 W, so real-world gaming lands below what the GPU name suggests, and there\'s no Thunderbolt. Better as a portable creator machine than a frame-rate-first gaming laptop.',
    pros: [
      'Light 1.9 kg slim aluminum',
      'Upgradeable RAM (to 64 GB)',
      'MUX Switch',
      'Up to 4 TB SSD',
    ],
    cons: [
      '85 W TGP limits the RTX 5070',
      'No Thunderbolt (USB4 only)',
      'Only Wi-Fi 6E',
    ],
  },
];
