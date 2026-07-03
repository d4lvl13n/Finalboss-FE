// GPD boutique handheld gaming PCs.
//
// Sourced from handheld-gaming-pc-database-2026.md, "GPD handhelds — Detailed
// Tables" segment. Family→configuration grain: SKU/config variants are
// collapsed into one family per product line, with each purchasable SKU as a
// `configuration`. Unknown fields are omitted, never inferred.

import type { Handheld } from '../types';

export const GPD: Handheld[] = [
  // ────────────────────────────────────────────────────────────────────────
  // GPD Win 4 (2025)
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'gpd-win-4',
    manufacturer: 'GPD',
    productLine: 'Win 4',
    name: 'GPD Win 4 (2025)',
    os: 'Windows',
    formFactor: 'convertible',
    displaySizeInches: 6.0,
    releaseDate: '2025',
    releaseYear: 2025,
    targetMarket: 'Enthusiast slider handheld with keyboard',
    status2026: 'Legacy — GPD confirmed the Win 4 is not being manufactured further, concentrating on the Win 5; 2025 units remain in channel',
    segment: 'boutique-gpd',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'gpd-win-4-8840u',
        label: 'Ryzen 7 8840U · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4 (Hawk Point)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M @ 2,700 MHz)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '15–35 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5x 7500 MT/s (soldered)',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 851,
        priceNote: '~$851 Indiegogo launch; ~$897 retail (Droix)',
      },
      {
        id: 'gpd-win-4-hx370',
        label: 'Ryzen AI 9 HX 370 · 32 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 + Zen 5c (Strix Point)',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2,900 MHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '15–35 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5x 7500 MT/s (soldered)',
        storage: '2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1172,
        priceNote: '$1,172 Indiegogo launch; ~$897–$1,271 retail (varies by SKU)',
      },
    ],

    display: {
      sizeInches: 6.0,
      resolution: '1920 × 1080',
      panelType: 'ips',
      refreshRateHz: '40 Hz and 60 Hz',
      touch: true,
    },
    battery: {
      capacityWh: 45.62,
    },
    ergonomics: {
      weightGrams: 598,
      materials: 'Plastic',
      notes: 'Slider chassis reveals a full backlit QWERTY keyboard, optical finger mouse and trackpad nub',
    },
    connectivity: {
      ports: 'OCuLink (SFF-8612) + USB4 40 Gbps',
      usb4Thunderbolt: 'Yes — USB4 40 Gbps',
      externalGpu: 'OCuLink (SFF-8612, 63 Gbps PCIe 4.0 ×4) + USB4',
      wifi: 'Wi-Fi 6E (802.11ax 2×2)',
    },
    controls: {
      hallSticks: false,
      triggers: 'Analog',
      gyro: true,
      backButtons: 2,
      layoutNote: 'ALPS 3D joysticks; slider reveals a scissor-switch keyboard; L1/R1 RGB; dual vibration motors',
    },
    reliability: [
      {
        area: 'Input lag',
        detail: 'Inherent ~50 ms (3-frame) input lag tied to the horizontal display IC buffer — affects every Win 4 unit across all generations including 2025; requires a hardware fix, not applied at the factory',
        severity: 'high',
      },
      {
        area: 'Fan noise',
        detail: 'Fan reported "too loud" even at lower TDPs; louder than ROG Ally X per community reports',
        severity: 'moderate',
      },
      {
        area: 'Thermal paste QC',
        detail: 'Suboptimal thermal paste on some units; community commonly repastes',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'GPD.hk — Win 4 2025', url: 'https://www.gpd.hk/gpdwin42025', kind: 'manufacturer' },
      { label: "Joey's Retro Handhelds — Win 4 2025 review", url: 'https://www.joeysretrohandhelds.com/reviews/gpd-win-4-2025-review/', kind: 'review' },
      { label: 'Reddit r/gpdwin — input lag thread', url: 'https://www.reddit.com/r/gpdwin/comments/1j4lakw/dont_buy_a_gpd_win_4_until_gpd_actually_fixes_the/', kind: 'reliability' },
    ],
    conflicts: [
      {
        field: 'battery',
        detail: "GPD.hk's spec sheet lists 45.62 Wh; Droix and Joey's Retro Handhelds have both stated \"44.24 Wh\" in some contexts — likely the same cell with different rounding. GPD's official spec page (45.62 Wh) is used here.",
      },
    ],

    summary:
      "The Win 4's slider keyboard and OCuLink port make it GPD's most PC-like handheld, and the HX 370 config is genuinely fast. But it ships with a structural, unresolved input-lag defect tied to the display's IC buffer that GPD has not factory-fixed across three generations, plus persistently loud fans — GPD itself has now discontinued the line in favor of the Win 5.",
    pros: [
      'Full backlit slider keyboard plus OCuLink and USB4 eGPU ports',
      'HX 370 config offers genuine desktop-adjacent performance',
      'ALPS 3D joysticks and dual vibration motors',
    ],
    cons: [
      'Structural ~50 ms input-lag defect affects every unit, unresolved as of mid-2026',
      'Fan noise reported as too loud even at moderate TDPs',
      'Discontinued by GPD in favor of the Win 5',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // GPD Win Mini (2025)
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'gpd-win-mini',
    manufacturer: 'GPD',
    productLine: 'Win Mini',
    name: 'GPD Win Mini (2025)',
    os: 'Windows',
    formFactor: 'convertible',
    displaySizeInches: 7.0,
    releaseDate: '2025-01',
    releaseYear: 2025,
    targetMarket: 'Compact clamshell handheld',
    status2026: 'Active — current GPD clamshell handheld',
    segment: 'boutique-gpd',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'gpd-win-mini-8840u',
        label: 'Ryzen 7 8840U · 16 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4 (Hawk Point)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M @ 2,700 MHz)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '15–35 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5x 7500 MT/s (soldered)',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 769,
        priceNote: '$769 Indiegogo launch',
      },
      {
        id: 'gpd-win-mini-ai9-365',
        label: 'Ryzen AI 9 365 · 32 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 365',
          cpuArch: 'Zen 5 (Strix Point)',
          gpuArch: 'RDNA 3.5 (Radeon 880M, CU count unconfirmed)',
          cores: '10c / 20t',
          boostClock: 'up to 5.0 GHz',
          tdpRangeW: '15–35 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5x 7500 MT/s (soldered)',
        storage: '2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1181,
        priceNote: '$1,181 Indiegogo',
      },
      {
        id: 'gpd-win-mini-hx370-32',
        label: 'Ryzen AI 9 HX 370 · 32 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 + Zen 5c (Strix Point)',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2,900 MHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '15–35 W (default 28 W)',
        },
        ramGb: 32,
        ramType: 'LPDDR5x 7500 MT/s (soldered)',
        storage: '2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1288,
        priceNote: '$1,288 Indiegogo; ~$1,380+ retail',
      },
      {
        id: 'gpd-win-mini-hx370-64',
        label: 'Ryzen AI 9 HX 370 · 64 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 + Zen 5c (Strix Point)',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2,900 MHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '15–35 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5x 7500 MT/s (soldered)',
        storage: '2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1426,
        priceNote: '$1,426 Indiegogo',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080',
      panelType: 'ips',
      refreshRateHz: '60 Hz and 120 Hz',
      brightnessNits: '500 nits',
      vrr: 'AMD FreeSync (VRR)',
      touch: true,
    },
    battery: {
      capacityWh: 44.24,
    },
    ergonomics: {
      weightGrams: 555,
      materials: 'Plastic',
      notes: 'Clamshell opens to a compact QWERTY keyboard (smaller keys than the Win Max 2) plus a gesture-only touchpad and a quick-detachable integrated grip',
    },
    connectivity: {
      ports: 'USB4 40 Gbps + USB-C 3.2 Gen 2 (10 Gbps)',
      usb4Thunderbolt: 'Yes — USB4 (no OCuLink)',
      externalGpu: 'No OCuLink — eGPU via USB4 only (~15% bandwidth penalty vs. OCuLink per community benchmarks)',
      wifi: 'Wi-Fi 6E (802.11ax 2×2)',
    },
    controls: {
      hallSticks: true,
      triggers: 'Analog',
      gyro: true,
      backButtons: 'L4/R4 macro buttons',
      layoutNote: 'Hall effect mini joysticks; quick-detachable integrated grip',
    },
    reliability: [
      {
        area: 'Fan noise',
        detail: 'Fan runs at 80–100% on boot/shutdown unless the Motion Assistant app is actively managing the fan curve — becomes unusable in quiet environments',
        severity: 'high',
      },
      {
        area: 'SSD thermals',
        detail: 'SSD on the right side runs hot; community remedy is adding an SSD thermal pad',
        severity: 'moderate',
      },
      {
        area: 'L4/R4 buttons',
        detail: 'Non-functional at review time on HX 370 units, pending a firmware update',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'GPD.hk — Win Mini 2025', url: 'https://www.gpd.hk/gpdwinmini2025', kind: 'manufacturer' },
      { label: "Joey's Retro Handhelds — Win Mini 2025 review", url: 'https://www.joeysretrohandhelds.com/reviews/gpd-win-mini-2025-review/', kind: 'review' },
      { label: 'Reddit r/gpdwin — fan noise thread', url: 'https://www.reddit.com/r/gpdwin/comments/1lf3j25/gpd_win_mini_2025_excessive_fan_noise_in_idle_is_this_normal/', kind: 'reliability' },
    ],

    summary:
      "The Win Mini packs a genuine (if cramped) QWERTY keyboard and Hall effect mini joysticks into GPD's smallest clamshell, spanning 8840U through 64 GB HX 370 configs. It drops OCuLink for USB4-only eGPU, and its fan is a known headache — it runs at 80–100% on boot/shutdown unless GPD's Motion Assistant app is actively managing the curve.",
    pros: [
      'Genuine QWERTY keyboard and Hall effect mini joysticks in a pocketable clamshell',
      'Wide APU spread from 8840U up to 64 GB HX 370',
      'AMD FreeSync VRR on a 120 Hz panel',
    ],
    cons: [
      'Fan runs at 80–100% on boot/shutdown without the Motion Assistant app actively managing it',
      'No OCuLink — eGPU only via USB4, with a bandwidth penalty',
      'L4/R4 macro buttons shipped non-functional pending firmware',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // GPD Win Max 2 (2025)
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'gpd-win-max-2',
    manufacturer: 'GPD',
    productLine: 'Win Max 2',
    name: 'GPD Win Max 2 (2025)',
    os: 'Windows',
    formFactor: 'convertible',
    displaySizeInches: 10.1,
    releaseDate: '2025',
    releaseYear: 2025,
    targetMarket: 'Mini-laptop handheld hybrid',
    status2026: 'Active — current GPD mini-laptop handheld',
    segment: 'boutique-gpd',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'gpd-win-max-2-8840u',
        label: 'Ryzen 7 8840U · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4 (Hawk Point)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M @ 2,700 MHz)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '15–35 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5x 7500 MT/s (soldered, dual-channel)',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280); secondary empty M.2 2230 slot',
        priceUsd: 958,
        priceNote: '~$958 Indiegogo launch; ~$1,078–$1,494 retail (Droix; varies by region)',
      },
      {
        id: 'gpd-win-max-2-hx370',
        label: 'Ryzen AI 9 HX 370 · 64 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 + Zen 5c (Strix Point)',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2,900 MHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '15–35 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5x 7500 MT/s (soldered, dual-channel)',
        storage: '2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1462,
        priceNote: '~$1,462 Indiegogo; ~$1,494–$1,500+ retail',
      },
    ],

    display: {
      sizeInches: 10.1,
      resolution: '2560 × 1600',
      panelType: 'ips',
      refreshRateHz: 60,
      brightnessNits: '450 nits',
      touch: true,
    },
    battery: {
      capacityWh: 67,
    },
    ergonomics: {
      weightGrams: 1005,
      materials: 'Plastic',
      notes: "Clamshell mini-laptop with a full backlit QWERTY keyboard, Microsoft Precision touchpad and Hall sensor sticks under a magnetic cover; GPD's official spec is 1,005 g, though Droix's review unit measured 1,098 g",
    },
    connectivity: {
      ports: '2× USB4 40 Gbps + OCuLink; HDMI 2.1; 2.5G RJ45',
      usb4Thunderbolt: 'Yes — 2× USB4',
      externalGpu: 'OCuLink (SFF-8612, 63 Gbps) + 2× USB4',
      wifi: 'Wi-Fi 6E (802.11ax 2×2)',
    },
    controls: {
      hallSticks: true,
      triggers: 'Analog',
      gyro: true,
      trackpads: 'Microsoft Precision TouchPad',
      layoutNote: 'Hall sensor sticks under a magnetic cover; 2 custom buttons; dual linear motors',
    },
    reliability: [
      {
        area: 'OCuLink + G1 eGPU',
        detail: 'Reddit threads report OCuLink causing boot-process slowdowns and freezes when paired with the GPD G1 eGPU; GPDstore published a dedicated fix (power management setting) that partially resolves it',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'GPD.hk — Win Max 2 2025 Tech Specs', url: 'https://www.gpd.hk/gpdwinmax22025techspecs', kind: 'manufacturer' },
      { label: 'Droix — Win Max 2 2025 review', url: 'https://droix.net/blogs/gpd-win-max-2-2025-review/', kind: 'review' },
      { label: 'Notebookcheck — Win Max 2 2025 upgrade', url: 'https://www.notebookcheck.net/GPD-Win-Max-2-upgraded-with-new-2025-version.928871.0.html', kind: 'benchmark' },
    ],
    conflicts: [
      {
        field: 'weightGrams',
        detail: "GPD's official tech-spec sheet lists 1,005 g; Droix's review measured 1,098 g — likely accessories or measurement variance. 1,005 g (manufacturer figure) is recorded here.",
      },
    ],

    summary:
      'The Win Max 2 is GPD\'s mini-laptop-shaped handheld: a full keyboard, Precision touchpad and a sharp 10.1" 2560×1600 panel, backed by both OCuLink and dual USB4 for eGPU flexibility — the best-connected device in GPD\'s lineup. It is heavy for a "handheld" at ~1 kg, but for desk-replacement use with occasional gaming it is GPD\'s most capable machine.',
    pros: [
      'Full keyboard, Microsoft Precision touchpad and a sharp 2560×1600 10.1" display',
      'Best connectivity in the GPD range: OCuLink plus 2× USB4',
      'HDMI 2.1 and 2.5G Ethernet make it a genuine desk-replacement device',
    ],
    cons: [
      "Heaviest device in GPD's current lineup at ~1 kg",
      'OCuLink + G1 eGPU pairing has documented boot-freeze issues',
      'Clamshell shape trades handheld ergonomics for laptop functionality',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // GPD Win 5
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'gpd-win-5',
    manufacturer: 'GPD',
    productLine: 'Win 5',
    name: 'GPD Win 5',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2025-11',
    releaseYear: 2025,
    targetMarket: 'Flagship Strix Halo handheld',
    status2026: "Active — GPD's current flagship, replacing the Win 4",
    segment: 'boutique-gpd',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'gpd-win-5-385-32',
        label: 'Ryzen AI Max 385 · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Max 385',
          cpuArch: 'Zen 5 (Strix Halo)',
          gpuArch: 'RDNA 3.5 (32 CUs — Radeon 8050S @ 2,800 MHz)',
          computeUnits: 32,
          cores: '8c / 16t',
          boostClock: 'up to 5.0 GHz',
          tdpRangeW: '7–85 W (sweet spot ~50–55 W)',
        },
        ramGb: 32,
        ramType: 'LPDDR5x 8000 MT/s (soldered, 256-bit unified bus)',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280) + Mini SSD slot (up to 2 TB) + microSD',
        priceUsd: 1448,
        priceNote: '$1,448 Indiegogo launch (Nov 2025)',
      },
      {
        id: 'gpd-win-5-395-32',
        label: 'Ryzen AI Max+ 395 · 32 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Max+ 395',
          cpuArch: 'Zen 5 (Strix Halo)',
          gpuArch: 'RDNA 3.5 (40 CUs — Radeon 8060S @ 2,900 MHz)',
          computeUnits: 40,
          cores: '16c / 32t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '7–85 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5x 8000 MT/s (soldered, 256-bit unified bus)',
        storage: '2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1650,
        priceNote: '~$1,650 Indiegogo (Nov 2025)',
      },
      {
        id: 'gpd-win-5-395-64',
        label: 'Ryzen AI Max+ 395 · 64 GB · 4 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Max+ 395',
          cpuArch: 'Zen 5 (Strix Halo)',
          gpuArch: 'RDNA 3.5 (40 CUs — Radeon 8060S @ 2,900 MHz)',
          computeUnits: 40,
          cores: '16c / 32t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '7–85 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5x 8000 MT/s (soldered, 256-bit unified bus)',
        storage: '4 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 2120,
        priceNote: '~$2,120 Indiegogo; ~$2,433 retail (Droix, Apr 2026)',
      },
      {
        id: 'gpd-win-5-385-128',
        label: 'Ryzen AI Max 385 · 128 GB · 4 TB (White)',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Max 385',
          cpuArch: 'Zen 5 (Strix Halo)',
          gpuArch: 'RDNA 3.5 (32 CUs — Radeon 8050S @ 2,800 MHz)',
          computeUnits: 32,
          cores: '8c / 16t',
          tdpRangeW: '7–85 W',
        },
        ramGb: 128,
        ramType: 'LPDDR5x 8000 MT/s (soldered, 256-bit unified bus)',
        storage: '4 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 2653,
        priceNote: '$2,653 — White colorway only at Dec 2025 global launch (Black was out of stock)',
        statusNote: 'At global launch the 128 GB tier was only available with the lower-power AI Max 385, not the AI Max+ 395',
      },
      {
        id: 'gpd-win-5-395-128',
        label: 'Ryzen AI Max+ 395 · 128 GB · 4 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Max+ 395',
          cpuArch: 'Zen 5 (Strix Halo)',
          gpuArch: 'RDNA 3.5 (40 CUs — Radeon 8060S @ 2,900 MHz)',
          computeUnits: 40,
          cores: '16c / 32t',
          tdpRangeW: '7–85 W',
        },
        ramGb: 128,
        ramType: 'LPDDR5x 8000 MT/s (soldered, 256-bit unified bus)',
        storage: '4 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 2753,
        priceNote: '~$2,753 (GPDstore configurator, 2026)',
        statusNote: 'Later-availability configuration added to the GPDstore configurator after the initial Dec 2025 global launch',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080',
      panelType: 'ips',
      refreshRateHz: 120,
      brightnessNits: '500 nits',
      colorGamut: '100% sRGB',
      vrr: 'AMD FreeSync Premium (VRR)',
      touch: true,
    },
    battery: {
      capacityWh: 80,
      lifeHighTdp: '~42 min at 80–85 W max TDP',
      lifeBalanced: '~1.5 h at 35 W gaming; ~2–3 h average gaming',
      lifeLowTdp: 'up to ~9–10 h idle',
    },
    ergonomics: {
      weightGrams: 565,
      notes: '565 g handheld body without a battery; ~915 g with the external 80 Wh detachable battery (back-mount or FlexPower extension cable) attached. First Win-series model without a built-in keyboard.',
    },
    connectivity: {
      ports: '2× USB-C (USB4 40 Gbps + USB 3.2 Gen 2), DC barrel jack (180 W), USB-A 3.2 Gen 2, Mini SSD slot, microSD',
      usb4Thunderbolt: 'Yes — USB4 40 Gbps (single port)',
      externalGpu: 'No OCuLink — USB4 (single port) only; OCuLink would need an impractical NVMe-adapter hack',
      wifi: 'Wi-Fi 6E (802.11ax)',
      bluetooth: '5.3',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect (dual-mode short/long throw)',
      layoutNote: 'Dual capacitive joysticks (zero drift/dead zone), optical finger mouse, fingerprint power button, programmable rear buttons',
    },
    reliability: [
      {
        area: 'VRR / display',
        detail: 'VRR implementation reported inconsistent by some users; requires BIOS tuning for optimal battery and throttling behavior',
        severity: 'low',
      },
      {
        area: 'Speakers',
        detail: 'Popping sounds at low volume out of the box; requires EQ tuning (e.g. SoundFX) to resolve',
        severity: 'moderate',
      },
      {
        area: 'Battery life at max TDP',
        detail: '~42 minutes at the maximum 80–85 W TDP — short but expected for extreme-load use',
        severity: 'moderate',
      },
      {
        area: 'Build',
        detail: 'Chassis described as "creaky" and joysticks as "notably short" by one reviewer',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'GPD.hk — Win 5', url: 'https://www.gpd.hk', kind: 'manufacturer' },
      { label: 'Notebookcheck — Win 5 global release', url: 'https://www.notebookcheck.net/GPD-Win-5-released-globally-with-AMD-Ryzen-AI-Max-395-and-up-to-64-GB-RAM.1123906.0.html', kind: 'review' },
      { label: 'Droix — Win 5 review', url: 'https://droix.net/blogs/gpd-win-5-review/', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'priceUsd (128 GB tiers)',
        detail: 'Notebookcheck (Dec 2025) states the 128 GB tier was available only with the AI Max 385 (not the AI Max+ 395) at global launch, for $2,653 in White only. GPDstore\'s configurator later listed an AI Max+ 395 / 128 GB option for ~$2,753 — captured here as a separate, later-availability config.',
      },
    ],

    summary:
      "The Win 5 drops the built-in keyboard for a pure-gamepad Strix Halo flagship: up to a 40-CU Radeon 8060S, 128 GB of unified RAM and an external 80 Wh detachable battery. It genuinely competes with a PS5 in some titles per Notebookcheck's testing, but the detachable-battery design, no-OCuLink eGPU path and reported speaker/VRR rough edges mark it as a first-generation Strix Halo handheld.",
    pros: [
      'Strix Halo AI Max+ 395 (40 CU Radeon 8060S) hits ~93.5% of PS5 FPS in some titles per Notebookcheck',
      'Up to 128 GB unified LPDDR5x — genuinely useful for local AI workloads',
      'Dual capacitive Hall joysticks with zero drift/dead zone',
    ],
    cons: [
      'No internal battery — the external 80 Wh pack is detachable, adding bulk and complexity',
      'No OCuLink; eGPU only via a single USB4 port',
      'Speaker popping and inconsistent VRR reported out of the box',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // GPD Duo
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'gpd-duo',
    manufacturer: 'GPD',
    productLine: 'Duo',
    name: 'GPD Duo',
    os: 'Windows',
    formFactor: 'convertible',
    displaySizeInches: 13.3,
    releaseDate: '2024',
    releaseYear: 2024,
    targetMarket: 'Dual-screen convertible with integrated gamepad controls',
    status2026: 'Active — relevant through 2026 as an OCuLink eGPU gaming-adjacent device',
    segment: 'boutique-gpd',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'gpd-duo-hx370-32',
        label: 'Ryzen AI 9 HX 370 · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 + Zen 5c (Strix Point)',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2,900 MHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '35–60 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5x 7500 MT/s (soldered)',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280); secondary empty M.2 2230 slot',
        priceUsd: 1650,
        priceNote: '$1,650 Indiegogo early bird; ~$1,790 MSRP',
      },
      {
        id: 'gpd-duo-8840u-16',
        label: 'Ryzen 7 8840U · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4 (Hawk Point)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M @ 2,700 MHz)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '35–60 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5x 6400/7500 MT/s (soldered)',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1270,
        priceNote: '$1,270 Indiegogo early bird; $1,425 MSRP',
      },
      {
        id: 'gpd-duo-hx370-64',
        label: 'Ryzen AI 9 HX 370 · 64 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 + Zen 5c (Strix Point)',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2,900 MHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '35–60 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5x 7500 MT/s (soldered)',
        storage: '2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1860,
        priceNote: '$1,860 Indiegogo early bird; $1,971 MSRP',
      },
    ],

    display: {
      sizeInches: 13.3,
      resolution: '2880 × 1800 per screen',
      panelType: 'oled',
      refreshRateHz: 60,
      brightnessNits: '500 nits peak',
      colorGamut: '100% DCI-P3, 100% Adobe RGB (133% sRGB), 96% NTSC',
      touch: true,
    },
    battery: {
      capacityWh: 80,
    },
    ergonomics: {
      weightGrams: 2200,
      materials: 'Metal / plastic',
      notes: 'Dual 13.3" AMOLED "Aurora" screens; secondary screen rotates 360° to tablet mode; integrated gaming controls (joysticks, D-pad, ABXY, triggers) sit above the keyboard; stylus support (MPP 4096-level pressure)',
    },
    connectivity: {
      ports: 'OCuLink (SFF-8612) + USB4 40 Gbps + USB-C (full-featured) + USB-C (DP Alt); 2.5G RJ45; HDMI 2.1',
      usb4Thunderbolt: 'Yes — USB4 40 Gbps',
      externalGpu: 'OCuLink (SFF-8612, 63 Gbps) + USB4',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
    },
    controls: {
      layoutNote: 'Integrated gamepad controls (joysticks, D-pad, ABXY, analog triggers) mounted above a full chiclet keyboard; not a traditional handheld shape',
    },
    reliability: [
      {
        area: 'OCuLink + G1 eGPU',
        detail: 'Multiple Reddit reports of OCuLink causing boot freezes/slowdowns; GPDstore published a link-state power-management fix; some users still report USB4 crashing during gameplay after applying it',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'GPD.hk — Duo', url: 'https://www.gpd.hk/gpdduo', kind: 'manufacturer' },
      { label: 'Notebookcheck — Duo release', url: 'https://www.notebookcheck.net/GPD-Duo-released-as-new-innovative-convertible-laptop-with-powerful-AMD-Zen-5-APU-and-dual-OLED-displays.898774.0.html', kind: 'review' },
      { label: 'Droix — Duo review', url: 'https://droix.net/blogs/gpd-duo-review/', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'gaming classification',
        detail:
          'GPD markets the Duo as gaming-adjacent via its OCuLink port and secondary screen (usable as a portable display for other handhelds), but reviewers note it is not primarily a gaming handheld — one YouTube reviewer said "I don\'t think it falls into the category if you just wanted a handheld gaming PC." Included here as an OCuLink eGPU-relevant device, not a mainstream pick.',
      },
    ],

    summary:
      "The Duo is GPD's dual-screen convertible laptop, not a traditional handheld — but its integrated gamepad controls, OCuLink port and up-to-HX 370 silicon make it relevant to the eGPU-gaming crowd, and GPD explicitly positions it as a portable display/dock for its own Win-series handhelds. Reviewers agree it's a niche pick for anyone shopping specifically for a gaming handheld.",
    pros: [
      'Dual 13.3" AMOLED "Aurora" screens with 100% DCI-P3 and stylus support',
      'OCuLink plus USB4 for serious eGPU flexibility',
      "Doubles as a portable secondary display/dock for GPD's own handhelds",
    ],
    cons: [
      'Not a true handheld — 2.2 kg convertible laptop shape',
      'OCuLink + G1 eGPU pairing has documented boot-freeze issues',
      'Reviewers explicitly flag it as the wrong pick for buyers wanting a dedicated gaming handheld',
    ],
  },
];
