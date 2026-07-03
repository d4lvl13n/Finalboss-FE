// AYANEO + AYN boutique handheld gaming PCs.
//
// Sourced from handheld-gaming-pc-database-2026.md, "AYANEO / AYN handhelds —
// Detailed Tables" segment (Tables A1–A7, B1). Family→configuration grain:
// SKU/config variants are collapsed into one family per product line, with
// each purchasable SKU as a `configuration`. Unknown fields are omitted,
// never inferred.

import type { Handheld } from '../types';

export const AYANEO_AYN: Handheld[] = [
  // ────────────────────────────────────────────────────────────────────────
  // AYANEO 3
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'ayaneo-3',
    manufacturer: 'AYANEO',
    productLine: 'AYANEO 3',
    name: 'AYANEO 3',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2025-04',
    releaseYear: 2025,
    targetMarket: 'Mainstream / enthusiast modular handheld',
    status2026: 'Active — shipping since Apr 2025; available throughout 2026',
    segment: 'boutique-ayaneo',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'ayaneo-3-8840u-oled',
        label: 'Ryzen 7 8840U · OLED · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4 (Hawk Point)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: '15–35 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5X 7500 MT/s (soldered; SKUs up to 64 GB)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2230)',
        priceUsd: 699,
        priceNote: '$699 Early Bird (8840U OLED base); street ~$699–$899',
      },
      {
        id: 'ayaneo-3-8840u-lcd',
        label: 'Ryzen 7 8840U · IPS LCD · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4 (Hawk Point)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: '15–35 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5X 7500 MT/s (soldered; SKUs up to 64 GB)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2230)',
        priceUsd: 699,
        priceNote: '$699 Early Bird (8840U LCD base)',
        statusNote: '120 Hz IPS LCD panel with VRR instead of OLED — same chassis and APU as the OLED SKU',
      },
      {
        id: 'ayaneo-3-hx370-oled',
        label: 'Ryzen AI 9 HX 370 · OLED · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 / Zen 5c (Strix Point)',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '15–35 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5X 7500 MT/s (soldered; SKUs up to 64 GB)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2230)',
        priceUsd: 799,
        priceNote: '$799–$899 estimated (HX 370 uplift over 8840U)',
      },
      {
        id: 'ayaneo-3-hx370-lcd',
        label: 'Ryzen AI 9 HX 370 · IPS LCD · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 / Zen 5c (Strix Point)',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '15–35 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5X 7500 MT/s (soldered; SKUs up to 64 GB)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2230)',
        priceUsd: 799,
        priceNote: '$799–$899 estimated (HX 370 uplift over 8840U)',
        statusNote: '120 Hz IPS LCD panel with VRR instead of OLED — same chassis and APU as the OLED SKU',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080',
      panelType: 'oled',
      refreshRateHz: '60 / 90 / 120 / 144 Hz',
      vrr: 'Yes',
      brightnessNits: '800 nits',
      colorGamut: '110% DCI-P3',
      touch: true,
    },
    battery: {
      capacityWh: 49,
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect (RGB, dual-stage limit trigger)',
      gyro: true,
      layoutNote: 'RGB Hall sticks; fingerprint power button; dual-stage Hall limit triggers',
    },
    ergonomics: {
      weightGrams: 690,
      dimensions: '289.8 × 115 × 22.4 mm',
      materials: 'Plastic',
      notes: 'Modular chassis lets owners swap face plates/joystick modules',
    },
    connectivity: {
      ports: '2× USB4 + 1× OCuLink (SFF-8612), microSD',
      usb4Thunderbolt: 'Yes — 2× USB4',
      externalGpu: 'OCuLink (SFF-8612, PCIe 4.0 ×4) — dedicated eGPU port',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
    },
    reliability: [
      {
        area: 'Launch software',
        detail: 'Typical new-platform firmware maturation at launch; no widely reported hardware defect pattern as of mid-2026',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'AYANEO 3 official launch article', url: 'https://www.ayaneo.com/article/870', kind: 'manufacturer' },
      { label: 'The Verge — AYANEO 3', url: 'https://www.theverge.com/2025/1/24/24351191/ayaneo-3-price-release-date-indiegogo-specs-handheld', kind: 'review' },
      { label: 'NotebookCheck — AYANEO 3 launch timeline', url: 'https://www.notebookcheck.net/Ayaneo-3-Ryzen-AI-9-HX-370-powered-gaming-handheld-gets-its-launch-timeline-revealed.937446.0.html', kind: 'benchmark' },
    ],
    conflicts: [
      {
        field: 'display',
        detail:
          'OLED SKUs (8840U/HX 370) get a 144 Hz, 800-nit, 110% DCI-P3 OLED with VRR; IPS LCD SKUs drop to a 120 Hz IPS panel without OLED contrast/HDR. The panelType recorded here (oled) reflects the flagship variant.',
      },
    ],

    summary:
      "AYANEO's modular flagship pairs a swappable-faceplate chassis with either the value 8840U or the much faster HX 370, each offered with OLED or IPS LCD. A 49 Wh battery, RGB Hall sticks, dual-stage Hall triggers and — rare in this class — a dedicated OCuLink eGPU port round out a genuinely configurable Windows handheld. It shipped in April 2025 and remains AYANEO's mainstream pick through 2026.",
    pros: [
      'OLED SKUs get a bright, 144 Hz, 110% DCI-P3 panel',
      'Dedicated OCuLink port for eGPU, alongside dual USB4',
      'RGB Hall sticks and dual-stage Hall triggers throughout the range',
    ],
    cons: [
      'Only 49 Wh battery for an up-to-35 W HX 370 config',
      'LCD SKUs give up OLED contrast and refresh headroom',
      'Modular design adds cost versus fixed-chassis rivals',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // AYANEO NEXT II
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'ayaneo-next-ii',
    manufacturer: 'AYANEO',
    productLine: 'NEXT II (NEXT 2)',
    name: 'AYANEO NEXT II',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 9.06,
    releaseDate: '2026-02',
    releaseYear: 2026,
    targetMarket: 'Flagship ultra-performance handheld',
    status2026: 'Pre-order (Indiegogo) — estimated delivery Jun 2026',
    segment: 'boutique-ayaneo',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'ayaneo-next-ii-385-32',
        label: 'Ryzen AI Max 385 · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Max 385',
          cpuArch: 'Zen 5 (Strix Halo)',
          gpuArch: 'RDNA 3.5 (32 CUs — Radeon 8050S)',
          computeUnits: 32,
          cores: '8c / 16t',
          tdpRangeW: 'Up to 85 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X 8000 MT/s (soldered, unified)',
        storage: '1 TB PCIe 4.0 NVMe',
        priceUsd: 1799,
        priceNote: '$1,799 Early Bird; $1,999 retail',
      },
      {
        id: 'ayaneo-next-ii-385-64',
        label: 'Ryzen AI Max 385 · 64 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Max 385',
          cpuArch: 'Zen 5 (Strix Halo)',
          gpuArch: 'RDNA 3.5 (32 CUs — Radeon 8050S)',
          computeUnits: 32,
          cores: '8c / 16t',
          tdpRangeW: 'Up to 85 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5X 8000 MT/s (soldered, unified)',
        storage: '2 TB PCIe 4.0 NVMe',
        priceNote: 'Separate SKU tier; exact pricing not confirmed',
      },
      {
        id: 'ayaneo-next-ii-395-64',
        label: 'Ryzen AI Max+ 395 · 64 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Max+ 395',
          cpuArch: 'Zen 5 (Strix Halo)',
          gpuArch: 'RDNA 3.5 (40 CUs — Radeon 8060S)',
          computeUnits: 40,
          cores: '16c / 32t',
          tdpRangeW: 'Up to 85 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5X 8000 MT/s (soldered, unified)',
        storage: '1 TB PCIe 4.0 NVMe',
        priceUsd: 2299,
        priceNote: '$2,299 Early Bird; $2,699 retail',
      },
      {
        id: 'ayaneo-next-ii-395-128',
        label: 'Ryzen AI Max+ 395 · 128 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Max+ 395',
          cpuArch: 'Zen 5 (Strix Halo)',
          gpuArch: 'RDNA 3.5 (40 CUs — Radeon 8060S)',
          computeUnits: 40,
          cores: '16c / 32t',
          tdpRangeW: 'Up to 85 W',
        },
        ramGb: 128,
        ramType: 'LPDDR5X 8000 MT/s (soldered, unified)',
        storage: '2 TB PCIe 4.0 NVMe',
        priceUsd: 3499,
        priceNote: '$3,499 Early Bird; $4,299 retail',
      },
    ],

    display: {
      sizeInches: 9.06,
      resolution: '2400 × 1504',
      panelType: 'oled',
      refreshRateHz: '60 / 90 / 120 / 144 / 165 Hz',
      vrr: 'Yes (multi-mode)',
      brightnessNits: '1100–1155 nits peak',
      colorGamut: '100% DCI-P3',
    },
    battery: {
      capacityWh: 116,
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect (linear)',
    },
    ergonomics: {
      weightGrams: 1426,
      dimensions: '341.7 × 146.2 × 26.15 mm',
      notes: 'Large 9.06" flagship chassis; the 116 Wh battery exceeds the 100 Wh airline carry-on limit and needs airline approval to fly with',
    },
    connectivity: {
      ports: '2× USB4 40 Gbps (DP 1.4, PD 3.0)',
      usb4Thunderbolt: 'Yes — 2× USB4',
      wifi: 'Wi-Fi 7',
    },
    reliability: [
      {
        area: 'Availability',
        detail: 'Crowdfunded via Indiegogo — carries typical crowdfunding delivery-delay risk',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'AYANEO NEXT II official announcement', url: 'https://www.ayaneo.com/article/905', kind: 'manufacturer' },
      { label: 'The Verge — NEXT II Indiegogo preorder', url: 'https://www.theverge.com/tech/876521/ayaneo-next-2-windows-handheld-ryzen-ai-max-395-indiegogo-preorder', kind: 'review' },
      { label: 'Fiksas.lt — NEXT 2 review', url: 'https://fiksas.lt/en/gaming-consoles/ayaneo-next-2-review/', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'battery / weight',
        detail:
          'Battery is quoted as both 115 Wh (Fiksas.lt) and 116 Wh (Windows Central, The Verge, AYANEO official) — 116 Wh used as the primary figure. Weight is quoted anywhere from ~1.5 kg down to the authoritative 1,426 g figure (TweakTown / basic-tutorials.com).',
      },
    ],

    summary:
      "The NEXT II is AYANEO's answer to the Strix Halo era: a 9.06\" 165 Hz OLED with 100% DCI-P3, a huge 116 Wh battery and a choice of Ryzen AI Max 385 or AI Max+ 395 with up to 128 GB of unified RAM. It is a crowdfunded flagship — expect Indiegogo delivery risk — and at 1.4 kg with a battery that exceeds airline carry-on limits, it trades portability for desktop-class handheld power.",
    pros: [
      'Strix Halo APUs (up to 40 CU Radeon 8060S) with up to 128 GB unified RAM',
      'Gorgeous 9.06" 165 Hz OLED, 100% DCI-P3, 1100+ nit peak brightness',
      'Huge 116 Wh battery and dual USB4 / Wi-Fi 7',
    ],
    cons: [
      'Crowdfunded (Indiegogo) — delivery timeline and final specs carry risk',
      'Very heavy at 1,426 g',
      '116 Wh battery exceeds the 100 Wh airline carry-on limit',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // AYN Loki
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'ayn-loki',
    manufacturer: 'AYN',
    productLine: 'Loki',
    name: 'AYN Loki',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 6.0,
    releaseDate: '2023-06',
    releaseYear: 2023,
    targetMarket: 'Budget-to-mid Windows handheld',
    status2026: 'Discontinued — secondary market only; AYN.com listing removed',
    segment: 'boutique-ayn',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'ayn-loki-max',
        label: 'Ryzen 7 6800U · 16 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 6800U',
          cpuArch: 'Zen 3+ (Rembrandt)',
          gpuArch: 'RDNA 2 (Radeon 680M)',
        },
        ramGb: 16,
        ramType: 'LPDDR5 (soldered)',
        priceUsd: 775,
        priceNote: '$775 pre-order; ~$759 at launch',
      },
      {
        id: 'ayn-loki-6600u',
        label: 'Ryzen 5 6600U · 16 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 5 6600U',
          cpuArch: 'Zen 3+ (Rembrandt)',
          gpuArch: 'Radeon 660M',
        },
        ramGb: 16,
        ramType: 'LPDDR5 (soldered)',
        priceUsd: 499,
        priceNote: '$499–$699 across three storage tiers',
      },
      {
        id: 'ayn-loki-mini-pro',
        label: 'Ryzen 5 7320U (Mendocino) · up to 16 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 5 7320U',
          cpuArch: 'Zen 2 (Mendocino)',
          gpuArch: 'Radeon 610M',
        },
        ramGb: 16,
        ramType: 'LPDDR5 (soldered)',
        priceUsd: 299,
        priceNote: '~$299; the Intel Loki Mini and standard AMD Mini were cancelled before release',
      },
      {
        id: 'ayn-loki-zero',
        label: 'Athlon Silver 3050e · 4 GB',
        apu: {
          vendor: 'AMD',
          model: 'Athlon Silver 3050e',
          cpuArch: 'Zen (Dali)',
          gpuArch: 'Radeon Vega (integrated)',
        },
        ramGb: 4,
        ramType: 'DDR4-2400',
        priceUsd: 249,
        priceNote: '$249 launch',
        statusNote: 'Lower 1280×720 display and DDR4 RAM — much weaker than the other Loki SKUs',
      },
    ],

    display: {
      sizeInches: 6.0,
      resolution: '1920 × 1080',
      panelType: 'lcd',
      refreshRateHz: 60,
    },
    battery: {
      capacityWh: 46,
    },
    ergonomics: {
      weightGrams: 568,
      dimensions: '248 × 98 × 23.7 mm',
      materials: 'Plastic',
      notes: 'Compact 6" chassis shared across Max, standard and Mini Pro variants',
    },
    connectivity: {
      wifi: 'Wi-Fi 6',
      bluetooth: '5.2',
    },
    reliability: [
      {
        area: 'Availability',
        detail: 'Officially discontinued; AYN.com removed its Loki listings — only secondary market (eBay, forums) as of 2026',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: "Droix — AYN Loki & Loki Max review", url: 'https://droix.net/blogs/ayn-loki-ayn-loki-max-review-with-video/', kind: 'review' },
      { label: "Tom's Hardware — AYN Loki portable PC reveal", url: 'https://www.tomshardware.com/news/ayn-loki-portable-pc-windows', kind: 'review' },
      { label: 'Reddit — is the AYN Loki even buyable?', url: 'https://www.reddit.com/r/Handhelds/comments/1ieio9g/can_the_ayn_loki_even_be_bought/', kind: 'reliability' },
    ],
    conflicts: [
      {
        field: 'battery',
        detail:
          'Battery capacity was never officially published for any Loki SKU. ~46 Wh (Max/standard) is a community/teardown estimate extrapolated from the 40.5 Wh Loki Zero figure, not a manufacturer-confirmed value.',
      },
    ],

    summary:
      "AYN's Loki line undercut the majors with a compact 6\" chassis across four tiers — from the budget Athlon Silver Zero up to the Ryzen 7 6800U Max. It never matched Steam Deck-level polish, and AYN discontinued the range and pulled its site down; in 2026 any Loki is a secondary-market purchase only, worth considering solely at a steep discount.",
    pros: [
      'Genuinely compact 6" chassis across the whole range',
      'Four price/performance tiers, from budget to Ryzen 7 6800U',
      'Cheap on the secondary market',
    ],
    cons: [
      'Discontinued — AYN.com removed, no warranty support',
      'Battery capacity was never officially published for any SKU',
      'Loki Zero (Athlon Silver, DDR4) is too weak for modern games',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // AYANEO Kun
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'ayaneo-kun',
    manufacturer: 'AYANEO',
    productLine: 'Kun',
    name: 'AYANEO Kun',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 8.4,
    releaseDate: '2023-10',
    releaseYear: 2023,
    targetMarket: 'Large-screen premium flagship handheld',
    status2026: 'Legacy — still circulating on the secondary market',
    segment: 'boutique-ayaneo',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'ayaneo-kun-7840u',
        label: 'Ryzen 7 7840U · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 7840U',
          cpuArch: 'Zen 4 (Phoenix)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: 'Up to 54 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5X 6400–7500 MT/s (soldered; SKUs up to 64 GB)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 999,
        priceNote: '$999–$1,199 (Indiegogo / AYANEO store)',
      },
    ],

    display: {
      sizeInches: 8.4,
      resolution: '2560 × 1600',
      panelType: 'ips',
      refreshRateHz: 60,
      brightnessNits: '400 nits (Notebookcheck measured)',
    },
    battery: {
      capacityWh: 75,
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      gyro: true,
      layoutNote: 'Dual 6-axis gyroscope with sensors in both the body and the handles',
    },
    ergonomics: {
      weightGrams: 950,
      dimensions: '312.4 × 132.5 × 21.9 mm',
      materials: 'CNC aluminum alloy (top) + plastic',
      notes: 'Unique 8.4" large-screen flagship; an unusually high 54 W sustained TDP ceiling for a handheld',
    },
    connectivity: {
      ports: '2× USB4 + 1× USB-A 3.2 Gen 2',
      usb4Thunderbolt: 'Yes — 2× USB4',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.2',
    },
    reliability: [
      {
        area: 'Display refresh rate',
        detail: "AYANEO's official product page does not list a refresh rate; IGN and Notebookcheck reviews both measured 60 Hz despite some third-party listings claiming 120 Hz",
        severity: 'low',
      },
    ],
    sources: [
      { label: 'AYANEO Kun product page', url: 'https://ayaneo.com/product/AYANEO-KUN.html', kind: 'manufacturer' },
      { label: 'IGN — AYANEO Kun review', url: 'https://www.ign.com/articles/ayaneo-kun-review', kind: 'review' },
      { label: 'Notebookcheck — AYANEO Kun review', url: 'https://www.notebookcheck.net/Ayaneo-Kun-gaming-handheld-in-review-Performance-beast-for-individualists.797526.0.html', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'refreshRateHz',
        detail: "Some third-party listings claim 120 Hz; AYANEO's own product page does not list a refresh rate, and both IGN and Notebookcheck reviews confirm 60 Hz — recorded here as 60 Hz.",
      },
    ],

    summary:
      "The Kun remains AYANEO's most distinctive flagship: an 8.4\" 2560×1600 IPS panel in a CNC-aluminum shell, backed by a Ryzen 7 7840U tuned to an unusually high 54 W ceiling. It is a 2023 device now surviving mainly on the secondary market, but the combination of screen size and sustained power output is still unmatched in AYANEO's own lineup.",
    pros: [
      'Unique 8.4" 2560×1600 IPS panel — the largest in the AYANEO range',
      'Unusually high 54 W sustained TDP ceiling',
      'CNC aluminum-alloy top shell; dual 6-axis gyro in both body and handles',
    ],
    cons: [
      'Heaviest AYANEO at 950 g',
      '60 Hz panel despite the large, sharp display',
      '2023 hardware — no longer sold new by AYANEO',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // AYANEO Flip DS
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'ayaneo-flip-ds',
    manufacturer: 'AYANEO',
    productLine: 'Flip DS',
    name: 'AYANEO Flip DS',
    os: 'Windows',
    formFactor: 'convertible',
    displaySizeInches: 7.0,
    releaseDate: '2024-04',
    releaseYear: 2024,
    targetMarket: 'Dual-screen compact handheld',
    status2026: 'Active — sold via AYANEO store and retailers',
    segment: 'boutique-ayaneo',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'ayaneo-flip-ds-7840u',
        label: 'Ryzen 7 7840U · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 7840U',
          cpuArch: 'Zen 4 (Phoenix)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: '15–28 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5X 6400 MT/s (soldered; up to 64 GB)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2230)',
        priceUsd: 749,
        priceNote: '$749 reviewed (16 GB/512 GB); up to ~$946+ on higher configs',
      },
      {
        id: 'ayaneo-flip-ds-8840u',
        label: 'Ryzen 7 8840U · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4 (Hawk Point)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          tdpRangeW: '15–28 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5X 6400 MT/s (soldered; up to 64 GB)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2230)',
        priceUsd: 799,
        priceNote: '~$799 (8840U refresh)',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080 (upper); 960 × 640 (lower 3.5")',
      panelType: 'ips',
      refreshRateHz: 120,
      brightnessNits: '400 nits',
      touch: true,
    },
    battery: {
      capacityWh: 45,
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect (linear + optical nubbin)',
      gyro: true,
      layoutNote: 'Folding dual-screen chassis with a secondary 3.5" lower touchscreen',
    },
    ergonomics: {
      weightGrams: 650,
      dimensions: '180 × 102 × 36 mm',
      materials: 'Plastic',
      notes: 'The 7840U and 8840U are nearly identical in performance — PC Gamer called the 8840U "basically the same, a rebrand" (~5% faster)',
    },
    connectivity: {
      ports: '1× USB4 + 1× USB 3.2 Gen 2 + OCuLink',
      usb4Thunderbolt: 'Yes — 1× USB4',
      externalGpu: 'OCuLink (SFF-8612)',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.2',
    },
    reliability: [
      {
        area: 'Performance parity',
        detail: 'PC Gamer: the 8840U is "basically the same" as the 7840U — roughly a rebrand with a ~5% gain, not a meaningful upgrade',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'PC Gamer — AYANEO Flip DS review', url: 'https://www.pcgamer.com/hardware/handheld-gaming-pcs/ayaneo-flip-ds-review/', kind: 'review' },
      { label: 'Droix — AYANEO Flip review', url: 'https://droix.net/blogs/ayaneo-flip-review-with-video/', kind: 'review' },
      { label: 'AYANEO Flip KB/DS store page', url: 'https://ayaneo.co/product/ayaneo-flip/', kind: 'manufacturer' },
    ],

    summary:
      'The Flip DS folds into a Nintendo DS-style dual-screen clamshell, pairing a 7" 120 Hz main panel with a 3.5" secondary touchscreen. Hall sticks, an optical nubbin and even a dedicated OCuLink port are packed into a genuinely pocketable 650 g shell. The 8840U refresh barely outperforms the original 7840U, so either is a reasonable buy.',
    pros: [
      'Unique folding dual-screen "DS-style" form factor',
      'OCuLink eGPU port in a genuinely compact chassis',
      'Hall sticks with an optical nubbin for precision aiming',
    ],
    cons: [
      '45 Wh battery is modest for a 28 W APU',
      '8840U refresh barely outperforms the original 7840U',
      'Small 3.5" secondary screen limits its usefulness outside DS-style software',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // AYANEO Air 1S
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'ayaneo-air-1s',
    manufacturer: 'AYANEO',
    productLine: 'Air 1S',
    name: 'AYANEO Air 1S',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 5.5,
    releaseDate: '2023-07',
    releaseYear: 2023,
    targetMarket: 'Ultra-thin light Windows handheld',
    status2026: 'Legacy — secondary market active',
    segment: 'boutique-ayaneo',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'ayaneo-air-1s-7840u-std',
        label: 'Ryzen 7 7840U · Standard · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 7840U',
          cpuArch: 'Zen 4 (Phoenix)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          tdpRangeW: '15–25 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5X 6400–7500 MT/s (soldered; up to 32 GB)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 829,
        priceNote: '$829 (16 GB/512 GB); ~$1,259 (32 GB/2 TB)',
      },
      {
        id: 'ayaneo-air-1s-7840u-utl',
        label: 'Ryzen 7 7840U · Ultra Thin & Light · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 7840U',
          cpuArch: 'Zen 4 (Phoenix)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          tdpRangeW: '15–18 W (limited by thermals)',
        },
        ramGb: 16,
        ramType: 'LPDDR5X 6400 MT/s (soldered; up to 32 GB)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2280)',
        priceNote: 'Premium over the standard edition; exact price not widely confirmed',
        statusNote: 'Lighter 405 g shell with a smaller 28 Wh / 7,350 mAh battery than the standard edition',
      },
      {
        id: 'ayaneo-air-1s-8840u',
        label: 'Ryzen 7 8840U (refresh) · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4 (Hawk Point)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          tdpRangeW: '15–25 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5X 6400 MT/s (soldered; up to 32 GB)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 804,
        priceNote: '~$804 equivalent (Japan launch); ~$839+ global estimate',
      },
    ],

    display: {
      sizeInches: 5.5,
      resolution: '1920 × 1080',
      panelType: 'oled',
      refreshRateHz: 60,
      brightnessNits: '350 nits',
      colorGamut: '96% Adobe RGB',
      touch: true,
    },
    battery: {
      capacityWh: 38,
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect (linear)',
      gyro: true,
      layoutNote: 'Master Controller Hall sticks; dual 6-axis gyro',
    },
    ergonomics: {
      weightGrams: 450,
      dimensions: '224 × 89.5 × 21.6 mm',
      materials: 'Plastic (ABS/UV coated)',
      notes: 'Ultra Thin & Light edition drops to 405 g with a smaller 28 Wh battery for extra portability',
    },
    connectivity: {
      ports: '2× USB4 (USB-C, DP 1.4)',
      usb4Thunderbolt: 'Yes — 2× USB4',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.2',
    },
    sources: [
      { label: 'AYANEO Air 1S launch article', url: 'https://www.ayaneo.com/article/773', kind: 'manufacturer' },
      { label: 'Notebookcheck — Air 1S review', url: 'https://www.notebookcheck.net/Ayaneo-Air-1S-Retro-Power-gaming-handheld-in-test-Zen4-Power-for-your-pocket.761047.0.html', kind: 'review' },
      { label: 'Tweaktown — Air 1S launch', url: 'https://www.tweaktown.com/news/92282/ayaneo-air-1s-is-the-thinnest-and-lightest-portable-gaming-handheld-with-ryzen-7-7840u/index.html', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'weight / battery',
        detail:
          'The Ultra Thin & Light edition weighs 405 g with a smaller 28 Wh / 7,350 mAh battery, versus 450 g and 38 Wh / 10,050 mAh on the standard edition — both editions share the same 7840U chassis.',
      },
    ],

    summary:
      "The Air 1S is AYANEO's ultra-thin, pocketable handheld: a 5.5\" OLED in a sub-450 g shell, with an even lighter 405 g Ultra Thin & Light edition. The 7840U (or later 8840U refresh) is plenty for indies and older AAA at 1080p, though the small screen and modest 38 Wh battery reflect the size-first design brief.",
    pros: [
      'Genuinely pocketable — 450 g standard, 405 g Ultra Thin & Light',
      '5.5" OLED with 96% Adobe RGB coverage',
      'Master Controller Hall sticks with dual 6-axis gyro',
    ],
    cons: [
      'Small 5.5" screen limits visibility for some genres',
      'Modest 38 Wh (or 28 Wh UTL) battery',
      '2023 chassis; 8840U refresh is only a minor bump',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // AYANEO KONKR FIT
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'ayaneo-konkr-fit',
    manufacturer: 'AYANEO',
    productLine: 'KONKR FIT',
    name: 'AYANEO KONKR FIT',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2026-04',
    releaseYear: 2026,
    targetMarket: 'Mainstream Windows handheld',
    status2026: 'Pre-order → shipping Apr–Jun 2026',
    segment: 'boutique-ayaneo',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'ayaneo-konkr-fit-hx370',
        label: 'Ryzen AI 9 HX 370 · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 / Zen 5c (Strix Point)',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: '5.1 GHz',
          tdpRangeW: 'Up to 28 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5X 8533 MT/s (soldered)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2230)',
        priceUsd: 999,
        priceNote: '$999 Early Bird; $1,299 standard',
      },
      {
        id: 'ayaneo-konkr-fit-hx470',
        label: 'Ryzen AI 9 HX 470 · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 470',
          cpuArch: 'Zen 5 / Zen 5c (Gorgon Point)',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M)',
          computeUnits: 16,
          cores: '12c / 24t',
          tdpRangeW: 'Up to 28 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X 8533 MT/s (soldered)',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2230)',
        priceUsd: 1299,
        priceNote: '$1,299 Early Bird; $1,699 standard',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080',
      panelType: 'oled',
      refreshRateHz: '60 / 90 / 120 / 144 Hz',
      brightnessNits: '800 nits',
      touch: true,
    },
    battery: {
      capacityWh: 80.85,
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect (linear)',
      gyro: true,
      layoutNote: 'TMR (tunneling magnetoresistance) joysticks; fingerprint power button',
    },
    ergonomics: {
      weightGrams: 738,
      dimensions: '270.8 × 100.4 × 25.1 mm',
      materials: 'Plastic (polycarbonate)',
      notes: "AYANEO's new KONKR sub-brand; first AYANEO to ship with TMR joysticks",
    },
    connectivity: {
      ports: '2× USB4 (one DP 1.4 + PD; one data-only)',
      usb4Thunderbolt: 'Yes — 2× USB4',
      wifi: 'Wi-Fi 7 (per AYANEO article; not independently confirmed by a third-party spec sheet)',
      bluetooth: '5.4',
    },
    reliability: [
      {
        area: 'Maturity',
        detail: 'Ships from April 2026 — too new for established reliability data as of mid-2026',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'AYANEO KONKR FIT official announcement', url: 'https://www.ayaneo.com/article/918', kind: 'manufacturer' },
      { label: 'retrohandhelds.gg — KONKR Fit pre-order', url: 'https://retrohandhelds.gg/ayaneos-konkr-fit-is-now-up-for-pre-order-but-wont-ship-until-end-of-april/', kind: 'review' },
      { label: 'NotebookCheck — KONKR Fit unveiling', url: 'https://www.notebookcheck.net/Ayaneo-unveils-Konkr-Fit-Windows-handheld-powered-by-AMD-Ryzen-AI-9-HX-470.1207534.0.html', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'battery',
        detail: 'AYANEO article states 80.85 Wh; Handheldsarena.com lists 5000 mAh (~19 Wh) — likely a different-voltage mAh figure. 80.85 Wh (AYANEO official) used as the authoritative value.',
      },
      {
        field: 'wifi',
        detail: "AYANEO's article claims \"latest Wi-Fi\" (interpreted as Wi-Fi 7); retrohandhelds.gg's spec sheet does not independently confirm Wi-Fi 7.",
      },
    ],

    summary:
      "KONKR FIT launches AYANEO's new sub-brand with a Strix Point HX 370/HX 470 pairing, TMR joysticks and an 80.85 Wh battery — one of the largest in the AYANEO range. It ships from April 2026, so real-world reliability data is still thin, but the spec sheet (144 Hz OLED, dual USB4, big battery) reads as a genuine step up from the AYANEO 3.",
    pros: [
      'Large 80.85 Wh battery — among the biggest in the AYANEO lineup',
      'TMR joysticks, a newer stick technology than standard Hall sensors',
      'Strix Point HX 370/HX 470 with a bright 800-nit 144 Hz OLED',
    ],
    cons: [
      'Too new for established reliability data as of mid-2026',
      'Wi-Fi 7 claim not independently confirmed by third-party spec sheets',
      'M.2 2230 SSD is a downgrade in upgradeability from older M.2 2280 AYANEO models',
    ],
  },
];
