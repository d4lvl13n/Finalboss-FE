// Valve + ASUS handheld gaming PCs — "Major OEM" segment.
//
// Sourced from the 2026 handheld-gaming-PC structured dataset (Tables 1–14).
// Family→configuration grain: each configuration `id` is the dataset row_id.
// Unknown fields are omitted, never inferred.

import type { Handheld } from '../types';

export const VALVE_ASUS: Handheld[] = [
  // ────────────────────────────────────────────────────────────────────────
  // Valve Steam Deck (LCD)
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'valve-steam-deck-lcd',
    manufacturer: 'Valve',
    productLine: 'Steam Deck',
    name: 'Valve Steam Deck (LCD)',
    os: 'SteamOS',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2022-02-25',
    releaseYear: 2022,
    targetMarket: 'Mainstream / entry',
    status2026: 'Active — on sale, price-reduced',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'SD-LCD-256',
        label: '256 GB LCD',
        apu: {
          vendor: 'AMD',
          model: 'Steam Deck APU (LCD)',
          cpuArch: 'Zen 2',
          gpuArch: 'RDNA 2 (8 CUs)',
          computeUnits: 8,
          cores: '4c / 8t',
          boostClock: 'up to 3.5 GHz',
          tdpRangeW: '4–15 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5 6400 MT/s',
        storage: '256 GB NVMe SSD (M.2 2230, user-replaceable)',
        priceNote: 'Discontinued for new sale (Dec 2025); ~$319 Certified Refurbished from Valve, stock rotating',
        statusNote: 'New units discontinued — Certified Refurbished ~$319 from Valve when in stock',
      },
      {
        id: 'SD-LCD-512',
        label: '512 GB LCD',
        apu: {
          vendor: 'AMD',
          model: 'Steam Deck APU (LCD)',
          cpuArch: 'Zen 2',
          gpuArch: 'RDNA 2 (8 CUs)',
          computeUnits: 8,
          cores: '4c / 8t',
          boostClock: 'up to 3.5 GHz',
          tdpRangeW: '4–15 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5 6400 MT/s',
        storage: '512 GB NVMe SSD (M.2 2230, user-replaceable)',
        priceNote: 'Discontinued — replaced by OLED (launched at $529); ~$350–400 used',
        statusNote: 'Largely out of channel; occasionally still stocked',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1280 × 800 (16:10)',
      panelType: 'lcd',
      refreshRateHz: 60,
      vrr: 'No',
      brightnessNits: '~400 nits (SDR)',
      touch: true,
    },
    battery: {
      capacityWh: 40,
      chargerW: 45,
      lifeLowTdp: '~5–8 hr (Valve estimate)',
      lifeHighTdp: '~2 hr',
    },
    thermals: {
      fanCount: 1,
      coolingDesign: 'Single fan, single heat pipe',
      throttlingNote: 'Minimal — SteamOS manages TDP conservatively',
    },
    controls: {
      hallSticks: false,
      triggers: 'Analog (non-Hall potentiometer)',
      gyro: true,
      trackpads: '2× 32.5 mm square haptic trackpads',
      backButtons: 4,
      haptics: 'HD haptics',
      layoutNote: 'Thumbstick-above-d-pad layout; capacitive-touch full-size sticks',
    },
    ergonomics: {
      weightGrams: 669,
      dimensions: '298 × 117 × 49 mm',
      materials: 'Plastic',
      notes: 'Deep, palm-filling grips; praised for long-session comfort',
    },
    connectivity: {
      ports: '1× USB-C (USB 3.1 Gen 2 + DP + PD), 3.5 mm, microSD (UHS-I)',
      usb4Thunderbolt: 'No',
      wifi: 'Wi-Fi 5 (802.11ac)',
      bluetooth: '5.0',
    },
    reliability: [
      {
        area: 'Analog sticks',
        detail: 'Some potentiometer stick drift reported; capacitive touch detection occasionally unreliable',
        severity: 'moderate',
      },
      {
        area: 'microSD',
        detail: 'Slot sits near heat; occasional read errors with cheap cards, but less severe than ROG Ally',
        severity: 'low',
      },
      {
        area: 'Thermals',
        detail: 'Low — conservative power management keeps throttling minimal',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'Valve — Steam Deck (official)', url: 'https://www.steamdeck.com/en/oled', kind: 'manufacturer' },
      { label: 'Engadget — Steam Deck LCD review (2023)', url: 'https://www.engadget.com/steam-deck-lcd-review-2023-still-one-of-the-best-handheld-pcs-140044516.html', kind: 'review' },
      { label: 'Notebookcheck — Steam Deck coverage', url: 'https://www.notebookcheck.net/Steam-Deck-1-TB-OLED-review-Minimalist-performance-maximum-gaming-fun.802764.0.html', kind: 'benchmark' },
    ],
    conflicts: [
      {
        field: 'Pricing',
        detail: 'Launched at $399 (256 GB) in 2022; Valve discontinued new LCD sales in late 2025, so it now exists only as Certified Refurbished stock (~$319).',
      },
    ],

    summary:
      'The LCD Steam Deck is the value entry into SteamOS: a well-supported, easily repairable handheld whose Zen 2 / RDNA 2 APU is now dated but still fine for indies and older AAA at 800p. Its standout features remain the twin haptic trackpads and Valve’s excellent suspend/resume. In late 2025 Valve discontinued new LCD sales, so in 2026 it lives on mainly as a ~$319 Certified Refurbished option — the cheapest way into SteamOS when stock is available.',
    pros: [
      'Cheapest route into the polished SteamOS ecosystem',
      'Twin haptic trackpads — unmatched for mouse-driven games',
      'User-replaceable M.2 2230 SSD; strong iFixit support',
    ],
    cons: [
      'Aging Zen 2 / RDNA 2 APU capped at 15 W',
      '60 Hz LCD only ~400 nits; no HDR',
      'Potentiometer sticks can drift; only 40 Wh battery',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // Valve Steam Deck OLED
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'valve-steam-deck-oled',
    manufacturer: 'Valve',
    productLine: 'Steam Deck',
    name: 'Valve Steam Deck OLED',
    os: 'SteamOS',
    formFactor: 'traditional',
    displaySizeInches: 7.4,
    releaseDate: '2023-11-16',
    releaseYear: 2023,
    targetMarket: 'Mainstream / enthusiast',
    status2026: 'Active — on sale',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'SD-OLED-512',
        label: '512 GB OLED',
        apu: {
          vendor: 'AMD',
          model: 'Steam Deck OLED APU',
          cpuArch: 'Zen 2',
          gpuArch: 'RDNA 2 (8 CUs)',
          computeUnits: 8,
          cores: '4c / 8t',
          boostClock: 'up to 3.5 GHz',
          tdpRangeW: '4–15 W',
          tdpModes: '15 W PL1/PL2',
        },
        ramGb: 16,
        ramType: 'LPDDR5 6400 MT/s',
        storage: '512 GB NVMe SSD (M.2 2230, user-replaceable)',
        priceUsd: 789,
        priceNote: 'Current MSRP after Valve’s May 2026 price increase (was $549)',
      },
      {
        id: 'SD-OLED-1TB',
        label: '1 TB OLED',
        apu: {
          vendor: 'AMD',
          model: 'Steam Deck OLED APU',
          cpuArch: 'Zen 2',
          gpuArch: 'RDNA 2 (8 CUs)',
          computeUnits: 8,
          cores: '4c / 8t',
          boostClock: 'up to 3.5 GHz',
          tdpRangeW: '4–15 W',
          tdpModes: '15 W sustained',
        },
        ramGb: 16,
        ramType: 'LPDDR5 6400 MT/s',
        storage: '1 TB NVMe SSD (M.2 2230, user-replaceable)',
        priceUsd: 949,
        priceNote: 'Current MSRP after Valve’s May 2026 price increase (was $649)',
        statusNote: '1 TB SKU adds premium anti-glare etched glass',
      },
    ],

    display: {
      sizeInches: 7.4,
      resolution: '1280 × 800 (16:10)',
      panelType: 'oled',
      refreshRateHz: 90,
      vrr: 'No (fixed rate)',
      brightnessNits: '1000 nits (HDR) / 600 nits (SDR)',
      colorGamut: '110% P3',
      touch: true,
    },
    battery: {
      capacityWh: 50,
      chargerW: 45,
      lifeLowTdp: '~8–12 hr (Valve estimate)',
      lifeHighTdp: '~3 hr',
    },
    thermals: {
      fanCount: 1,
      coolingDesign: 'Updated larger fan + improved thermals',
      throttlingNote: 'Minimal',
    },
    controls: {
      hallSticks: false,
      triggers: 'Analog (non-Hall potentiometer)',
      gyro: true,
      trackpads: '2× 32.5 mm haptic trackpads (improved fidelity)',
      backButtons: 4,
      haptics: 'HD haptics (improved)',
      layoutNote: 'Revised stick material/shape; capacitive-touch sticks',
    },
    ergonomics: {
      weightGrams: 640,
      dimensions: '298 × 117 × 49 mm',
      materials: 'Plastic',
      notes: '~30 g lighter than LCD; same grip shape',
    },
    connectivity: {
      ports: '1× USB-C (USB 3.2 Gen 2 + DP 1.4 + PD), 3.5 mm, microSD (UHS-I)',
      usb4Thunderbolt: 'No',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
    },
    reliability: [
      {
        area: 'Analog sticks',
        detail: 'Low — revised stick material reduces drift versus the LCD model',
        severity: 'low',
      },
      {
        area: 'microSD',
        detail: 'Rare — improved slot placement over the LCD generation',
        severity: 'low',
      },
      {
        area: 'Game compatibility',
        detail: 'SteamOS/Proton compatibility issues on some newer titles',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'Valve — Steam Deck tech specs', url: 'https://www.steamdeck.com/en/tech', kind: 'manufacturer' },
      { label: 'Notebookcheck — Steam Deck 1 TB OLED review', url: 'https://www.notebookcheck.net/Steam-Deck-1-TB-OLED-review-Minimalist-performance-maximum-gaming-fun.802764.0.html', kind: 'review' },
      { label: 'PCMag — Valve Steam Deck OLED', url: 'https://www.pcmag.com/reviews/valve-steam-deck-oled', kind: 'review' },
    ],

    summary:
      'The OLED refresh is the Steam Deck to buy: a gorgeous 90 Hz HDR OLED, a larger 50 Wh battery, Wi-Fi 6E and improved thermals, all on the same mature SteamOS. The APU is unchanged from the LCD, so raw performance is flat, but efficiency and the display transform the experience. It remains the reference SteamOS handheld for polish, battery life and repairability.',
    pros: [
      'Excellent 90 Hz HDR OLED (1000 nits HDR) with 110% P3',
      'Bigger 50 Wh battery and Wi-Fi 6E vs LCD',
      'Best-in-class SteamOS suspend/resume; twin haptic trackpads',
    ],
    cons: [
      'Same Zen 2 / RDNA 2 APU — no performance gain over LCD',
      'No VRR; 800p ceiling limits sharpness',
      'Potentiometer (non-Hall) sticks',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // ASUS ROG Ally (2023)
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'asus-rog-ally-2023',
    manufacturer: 'ASUS',
    productLine: 'ROG Ally',
    name: 'ASUS ROG Ally (2023)',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2023-06-13',
    releaseYear: 2023,
    targetMarket: 'Mainstream / enthusiast',
    status2026: 'Legacy — discontinued; still in channel',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'ROG-ALLY-Z1',
        label: 'Ryzen Z1 · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen Z1',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (4 CUs)',
          computeUnits: 4,
          cores: '6c / 12t',
          boostClock: 'up to 4.9 GHz',
          tdpRangeW: '9–30 W',
          tdpModes: 'Performance 15 W / Turbo 30 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5 6400 MT/s',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2230, user-replaceable)',
        priceUsd: 599.99,
        priceNote: '$599.99 launch MSRP (June 2023); discontinued — open-box ~$450–470',
      },
      {
        id: 'ROG-ALLY-Z1X',
        asin: 'B0C52RFZXB',
        label: 'Ryzen Z1 Extreme · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen Z1 Extreme',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '9–30 W',
          tdpModes: 'Performance 15 W / Turbo 30 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5 6400 MT/s',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2230, user-replaceable)',
        priceUsd: 699.99,
        priceNote: '$699.99 launch MSRP; discontinued/EOL — ASUS store clearance ~$499.99',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080 (16:9)',
      panelType: 'ips',
      refreshRateHz: 120,
      vrr: 'AMD FreeSync Premium',
      brightnessNits: '500 nits',
      colorGamut: '100% sRGB',
      touch: true,
    },
    battery: {
      capacityWh: 40,
      chargerW: 65,
      lifeHighTdp: '~1–1.5 hr at 30 W',
    },
    thermals: {
      fanCount: 1,
      coolingDesign: 'Single fan',
      throttlingNote: 'Throttles at sustained Turbo — known issue',
    },
    controls: {
      hallSticks: false,
      triggers: 'Hall Effect',
      gyro: true,
      backButtons: 2,
      haptics: 'HD haptics',
      layoutNote: 'Potentiometer sticks with Hall Effect triggers; no trackpads',
    },
    ergonomics: {
      weightGrams: 608,
      materials: 'Plastic',
      notes: 'Smaller grips than Steam Deck; controversial thumb-above-d-pad layout; warms near USB-C',
    },
    connectivity: {
      ports: '1× ROG XG Mobile + USB-C (USB 3.2 Gen 2 + DP 1.4), 3.5 mm, microSD (UHS-II)',
      usb4Thunderbolt: 'No (USB 3.2 Gen 2 only)',
      externalGpu: 'ROG XG Mobile eGPU interface',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.4',
    },
    reliability: [
      {
        area: 'SD card reader',
        detail: 'Reader placement causes overheating and reader/card damage — widely reported, high-frequency failure',
        severity: 'high',
      },
      {
        area: 'Analog sticks',
        detail: 'Potentiometer stick drift — one of the most-cited hardware issues',
        severity: 'high',
      },
      {
        area: 'Thermals',
        detail: 'Sustained Turbo throttles',
        severity: 'moderate',
      },
      {
        area: 'Firmware / software',
        detail: 'Early firmwares buggy; significant BIOS/driver updates required; Armoury Crate crashes and poor Windows suspend/resume',
        severity: 'moderate',
      },
      {
        area: 'Repairability',
        detail: 'Poor — proprietary screws and tight assembly',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'ASUS — ROG Ally (2023) spec page', url: 'https://rog.asus.com/us/gaming-handhelds/rog-ally/rog-ally-2023/spec/', kind: 'manufacturer' },
      { label: 'Mezha.media — ROG Ally RC71L review', url: 'https://mezha.media/en/reviews/asus-rog-ally-rc71l-review-portable-gaming-system-on-windows-11/', kind: 'review' },
      { label: 'YouTube — ROG Ally SD card reader failure', url: 'https://www.youtube.com/watch?v=OtL1wMZW6tE', kind: 'reliability' },
    ],

    summary:
      'The original ROG Ally paired a fast 1080p/120 Hz screen with the potent Z1 Extreme, but it is remembered as much for its reliability record: a heat-adjacent SD card reader that cooked cards and potentiometer sticks prone to drift. Windows adds friction (suspend/resume, Armoury Crate crashes) versus SteamOS. In 2026 it is discontinued and only worth buying used at a steep discount, ideally the Z1 Extreme.',
    pros: [
      'Sharp 1080p 120 Hz FreeSync Premium display',
      'Z1 Extreme (RDNA 3, 12 CUs) is genuinely fast at 30 W',
      'Hall Effect triggers; ROG XG Mobile eGPU option',
    ],
    cons: [
      'SD card reader failures — a widely reported, high-severity defect',
      'Potentiometer sticks drift; poor repairability',
      'Small 40 Wh battery; Windows suspend/Armoury Crate issues',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // ASUS ROG Ally X
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'asus-rog-ally-x',
    manufacturer: 'ASUS',
    productLine: 'ROG Ally',
    name: 'ASUS ROG Ally X',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2024-07-22',
    releaseYear: 2024,
    targetMarket: 'Enthusiast',
    status2026: 'Legacy — superseded by 2025 line; still sold',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'ROG-ALLY-X',
        asin: 'B0D49B5DTD',
        label: 'Ryzen Z1 Extreme · 24 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen Z1 Extreme',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: 'up to 5.1 GHz',
          tdpRangeW: '9–30 W',
          tdpModes: 'Silent 10 W / Performance 15 W / Turbo 30 W',
        },
        ramGb: 24,
        ramType: 'LPDDR5x 7467 MT/s',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280, user-replaceable)',
        priceUsd: 799.99,
        priceNote: 'Current MSRP (still sold at $799.99; ASUS held price through the 2026 memory crunch)',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080 (16:9)',
      panelType: 'ips',
      refreshRateHz: 120,
      vrr: 'Adaptive Sync',
      brightnessNits: '500 nits',
      colorGamut: '100% sRGB',
      touch: true,
    },
    battery: {
      capacityWh: 80,
      chargerW: 65,
      lifeBalanced: '~4–5 hr (Silent 10 W)',
      lifeHighTdp: '~1.5–2.5 hr (30 W)',
    },
    thermals: {
      fanCount: 1,
      coolingDesign: 'Redesigned single fan',
      throttlingNote: 'Reduced vs gen 1; still present under sustained load',
    },
    controls: {
      hallSticks: false,
      triggers: 'Hall Effect',
      gyro: true,
      backButtons: 2,
      haptics: 'HD haptics',
      layoutNote: 'Redesigned potentiometer sticks with Hall Effect triggers; wider rear grips; no trackpads',
    },
    ergonomics: {
      weightGrams: 685,
      dimensions: '280 × 111 × 36.9 mm',
      materials: 'Plastic',
      notes: 'Revised rear grips wider and more comfortable than gen 1; improved thumbsticks',
    },
    connectivity: {
      ports: '1× USB4 40 Gbps (TB4) + 1× USB 3.2 Gen 2, 3.5 mm, microSD (UHS-II)',
      usb4Thunderbolt: 'Yes — 1× USB4 / TB4',
      externalGpu: 'ROG XG Mobile (via TB4)',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.2',
    },
    reliability: [
      {
        area: 'SD card reader',
        detail: 'Revised slot placement; the gen-1 reader-burn issue is largely resolved',
        severity: 'low',
      },
      {
        area: 'Analog sticks',
        detail: 'Improved mechanism but still potentiometer; community Hall-effect upgrade kits exist',
        severity: 'moderate',
      },
      {
        area: 'Battery',
        detail: '80 Wh — much improved over gen 1',
        severity: 'low',
      },
      {
        area: 'Software',
        detail: 'Windows + Armoury Crate: occasional crashes',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'Notebookcheck — ASUS ROG Ally X (RC72LA)', url: 'https://www.notebookcheck.net/Asus-ROG-Ally-X.858655.0.html', kind: 'review' },
      { label: 'TechPowerUp — ROG Ally X coverage', url: 'https://www.notebookcheck.net/Asus-ROG-Ally-X.858655.0.html', kind: 'benchmark' },
      { label: 'YouTube — ROG Ally Hall-effect stick upgrade', url: 'https://www.youtube.com/watch?v=6H2aezPcOLc', kind: 'reliability' },
    ],

    summary:
      'The Ally X is ASUS’s fix-everything revision: the same Z1 Extreme but with a doubled 80 Wh battery, 24 GB of faster RAM, a 1 TB M.2 2280 SSD, USB4/Thunderbolt and much better ergonomics. It also quietly resolves the original’s SD-reader defect. Sticks are still potentiometer and it remains a Windows device, but it is the most complete ROG Ally and a strong Windows-handheld pick even after the 2025 Xbox line.',
    pros: [
      'Large 80 Wh battery — roughly double the original',
      '24 GB LPDDR5x, 1 TB M.2 2280, USB4/Thunderbolt',
      'Improved grips; gen-1 SD-reader defect resolved',
    ],
    cons: [
      'Still potentiometer sticks (Hall triggers only)',
      'Windows suspend/resume friction persists',
      'Heavier (685 g) and pricier than rivals',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // ASUS ROG Xbox Ally
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'asus-rog-xbox-ally',
    manufacturer: 'ASUS',
    productLine: 'ROG Xbox Ally',
    name: 'ASUS ROG Xbox Ally',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2025-10 (estimated)',
    releaseYear: 2025,
    targetMarket: 'Mainstream / Xbox ecosystem',
    status2026: 'Active — current mainstream SKU',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'ROG-XBOX-ALLY',
        asin: 'B0FM6C3ZMN',
        label: 'Ryzen Z2 A · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen Z2 A',
          cpuArch: 'Zen 2',
          gpuArch: 'RDNA 2 (8 CUs)',
          computeUnits: 8,
          cores: '4c / 8t',
          boostClock: 'up to 3.8 GHz',
          tdpRangeW: '20–24 W',
          tdpModes: 'Silent / Performance 15 W / Turbo 20 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5x 6400 MT/s',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2280, user-replaceable)',
        priceUsd: 599.99,
        priceNote: '$599.99 MSRP (ASUS US store); Amazon/Best Buy have run a recurring $499.99 promo since ~April 2026',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080 (16:9)',
      panelType: 'ips',
      refreshRateHz: 120,
      vrr: 'AMD FreeSync Premium',
      brightnessNits: '500 nits',
      colorGamut: '100% sRGB',
      touch: true,
    },
    battery: {
      capacityWh: 60,
      chargerW: 65,
    },
    thermals: {
      fanCount: 1,
      coolingDesign: 'Redesigned cooling with heat redirected away from grips',
      noiseNote: 'Quiet / near-silent',
    },
    controls: {
      hallSticks: false,
      triggers: 'Hall Effect',
      gyro: true,
      backButtons: 2,
      haptics: 'HD haptics',
      layoutNote: 'Contoured Xbox-style grips; potentiometer sticks with Hall Effect triggers; no trackpads',
    },
    ergonomics: {
      weightGrams: 670,
      materials: 'Plastic',
      notes: 'Contoured grips inspired by the Xbox controller; heat redirected away from palms',
    },
    connectivity: {
      ports: '2× USB 3.2 Gen 2 Type-C (DP + PD), 3.5 mm, microSD (UHS-II)',
      usb4Thunderbolt: 'No USB4 in base model',
      externalGpu: 'ROG XG Mobile (docking port)',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
    },
    reliability: [
      {
        area: 'Software',
        detail: 'Xbox Full Screen Experience + Windows: minor launcher integration bugs; Windows desktop quirks remain',
        severity: 'low',
      },
      {
        area: 'Maturity',
        detail: 'Too new for established hardware issue patterns as of mid-2026',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'ASUS — ROG Xbox Ally (RC73YA) spec page', url: 'https://rog.asus.com/us/gaming-handhelds/rog-xbox-ally-2025/spec/', kind: 'manufacturer' },
      { label: 'Notebookcheck — ASUS ROG Xbox Ally', url: 'https://www.notebookcheck.net/Asus-ROG-Xbox-Ally.1173790.0.html', kind: 'review' },
      { label: 'RetroHandhelds — ROG Xbox Ally review', url: 'https://retrohandhelds.gg/asus-rog-xbox-ally-review/', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'USB4 availability',
        detail: 'ASUS’s spec page lists 2× USB 3.2 Gen 2 only; there is no USB4 on the base Xbox Ally (only the Xbox Ally X has USB4).',
      },
    ],

    summary:
      'The base Xbox Ally is the affordable, Xbox-branded handheld: a modest Zen 2 / RDNA 2 "Z2 A" APU tuned for efficiency, wrapped in redesigned Xbox-style grips with cooling steered away from the palms. The headline is the Xbox Full Screen Experience, which sidesteps much of the Windows desktop friction. It is not a performance device — the older APU and lack of USB4 are real limits — but at $599.99 it is a comfortable, quiet mainstream option.',
    pros: [
      'Comfortable contoured Xbox-style grips; quiet cooling',
      'Xbox Full Screen Experience reduces Windows friction',
      'Hall Effect triggers; $599.99 mainstream price',
    ],
    cons: [
      'Zen 2 / RDNA 2 "Z2 A" is the weakest APU in the family',
      'No USB4 on the base model',
      'Still potentiometer sticks; no trackpads',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // ASUS ROG Xbox Ally X
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'asus-rog-xbox-ally-x',
    manufacturer: 'ASUS',
    productLine: 'ROG Xbox Ally',
    name: 'ASUS ROG Xbox Ally X',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2025-10 (estimated)',
    releaseYear: 2025,
    targetMarket: 'Enthusiast / Xbox ecosystem',
    status2026: 'Active — current flagship SKU',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'ROG-XBOX-ALLY-X',
        label: 'Ryzen AI Z2 Extreme · 24 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Z2 Extreme',
          cpuArch: 'Zen 5',
          gpuArch: 'RDNA 3.5 (16 CUs)',
          computeUnits: 16,
          cores: '8c / 16t',
          boostClock: 'up to 5.0 GHz',
          tdpRangeW: '9–35 W',
          tdpModes: 'Performance 17 W / Turbo 35 W',
        },
        ramGb: 24,
        ramType: 'LPDDR5x',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280, user-replaceable)',
        priceUsd: 999.99,
        priceNote: '$999.99 MSRP (ASUS US store)',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080 (16:9)',
      panelType: 'ips',
      refreshRateHz: 120,
      vrr: 'AMD FreeSync Premium',
      brightnessNits: '500 nits',
      colorGamut: '100% sRGB',
      touch: true,
    },
    battery: {
      capacityWh: 80,
      chargerW: 65,
    },
    thermals: {
      fanCount: 1,
      coolingDesign: 'Redesigned chassis cooling',
    },
    controls: {
      hallSticks: false,
      triggers: 'Hall Effect',
      gyro: true,
      backButtons: 2,
      haptics: 'HD haptics',
      layoutNote: 'Contoured Xbox-style grips; potentiometer sticks with Hall Effect triggers; no trackpads',
    },
    ergonomics: {
      weightGrams: 715,
      dimensions: '290 × 121 × 27.5 – 50.9 mm',
      materials: 'Plastic',
      notes: 'Contoured Xbox-style grips; slightly heavier than the standard Xbox Ally',
    },
    connectivity: {
      ports: '1× USB4 (TB4 compliance, DP 1.4) + 1× USB 3.2 Gen 2 Type-C, 3.5 mm, microSD (UHS-II)',
      usb4Thunderbolt: 'Yes — 1× USB4 / TB4',
      externalGpu: 'ROG XG Mobile (up to RTX 5090 Laptop GPU per ASUS)',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.4',
    },
    reliability: [
      {
        area: 'Software',
        detail: 'Windows + Xbox FSE integration bugs reported early',
        severity: 'low',
      },
      {
        area: 'Maturity',
        detail: 'Too new for established hardware issue patterns as of mid-2026',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'ASUS — ROG Xbox Ally X (RC73XA) spec page', url: 'https://rog.asus.com/us/gaming-handhelds/rog-ally/rog-xbox-ally-x-2025/spec/', kind: 'manufacturer' },
      { label: 'Ultrabook Review — ROG Ally X early review', url: 'https://www.ultrabookreview.com/68970-asus-rog-ally-x-early-review/', kind: 'review' },
      { label: 'Notebookcheck — ROG Xbox Ally coverage', url: 'https://www.notebookcheck.net/Asus-ROG-Xbox-Ally.1173790.0.html', kind: 'benchmark' },
    ],

    summary:
      'The Xbox Ally X is the 2025 flagship: a Zen 5 / RDNA 3.5 "Ryzen AI Z2 Extreme" with 16 CUs, 24 GB of RAM, a 1 TB SSD, 80 Wh battery and USB4 with XG Mobile eGPU support — all fronted by the friction-reducing Xbox Full Screen Experience. It is the most powerful ASUS handheld to date and a direct answer to the Legion Go 2. The unchanged 1080p/120 Hz IPS panel and 715 g weight are the main compromises.',
    pros: [
      'Fast Zen 5 / RDNA 3.5 (16 CU) "Z2 Extreme" APU',
      '24 GB RAM, 1 TB SSD, 80 Wh battery, USB4 + XG Mobile',
      'Xbox Full Screen Experience smooths the Windows layer',
    ],
    cons: [
      'IPS-level 1080p panel — no OLED at flagship price',
      'Heavy at 715 g',
      'Still potentiometer sticks; $999.99 is premium',
    ],
  },
];
