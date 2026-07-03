// Lenovo + MSI handheld gaming PCs — "Major OEM" segment.
//
// Sourced from handheld-gaming-pc-database-2026.md (Tables 1–14). Variants are
// collapsed into one family per product line, with each purchasable SKU as a
// `configuration` whose `id` is the dataset row_id. Unknown fields are omitted,
// never inferred.

import type { Handheld } from '../types';

export const LENOVO_MSI: Handheld[] = [
  // ─── Lenovo Legion Go (Gen 1) ──────────────────────────────────────────────
  {
    slug: 'lenovo-legion-go',
    manufacturer: 'Lenovo',
    productLine: 'Legion Go',
    name: 'Lenovo Legion Go (Gen 1)',
    os: 'Windows',
    formFactor: 'detachable',
    displaySizeInches: 8.8,
    releaseDate: '2023-10-31',
    releaseYear: 2023,
    targetMarket: 'Enthusiast',
    status2026: 'Legacy — superseded; still in channel',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',
    configurations: [
      {
        id: 'LEGION-GO-1',
        asin: 'B0CM74YFSP',
        label: 'Ryzen Z1 Extreme · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen Z1 Extreme',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: '5 – 30 W',
          tdpModes: 'Custom / Silent 8 W / Balanced 15 W / Performance 30 W',
        },
        ramGb: 16,
        ramType: 'DDR5 7500 MT/s',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2242)',
        priceUsd: 999.99,
        priceNote: 'Now ~$999.99 at Best Buy (~$899 on sale) — up ~$300 from the $699.99 launch amid the 2026 memory shortage',
      },
    ],
    display: {
      sizeInches: 8.8,
      resolution: '2560 × 1600',
      panelType: 'ips',
      refreshRateHz: 144,
      touch: true,
    },
    battery: {
      capacityWh: 49.2,
      chargerW: 65,
      lifeHighTdp: '~1–2 hr at 30 W',
    },
    thermals: {
      fanCount: 1,
      coolingDesign: 'Single fan, vapor chamber',
      throttlingNote: 'Present under 30 W sustained load',
    },
    controls: {
      // Gen 1 stick type unconfirmed (possibly potentiometer) — omitted per source.
      triggers: 'Hall Effect',
      gyro: true,
      trackpads: '1 (touchpad on right controller)',
      backButtons: 2,
      layoutNote:
        'Detachable controllers (FPS mode, mouse mode, tablet mode); kickstand',
    },
    ergonomics: {
      weightGrams: 845,
      dimensions: '299 × 131 × 41 mm',
      materials: 'Plastic',
      notes:
        'Heaviest mainstream handheld of its generation; detachable controllers enable tablet mode; kickstand; FPS mode uses the right controller as a mouse',
    },
    connectivity: {
      ports: '2× USB4 40 Gbps (DP 2.0 + PD), 3.5 mm, microSD',
      usb4Thunderbolt: 'Yes — 2× USB4',
      externalGpu: 'No dedicated eGPU (generic USB4 only)',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.2',
    },
    reliability: [
      {
        area: 'Firmware',
        detail:
          'Very poor launch firmware; many BIOS bugs required significant post-launch updates',
        severity: 'high',
      },
      {
        area: 'Software (Windows)',
        detail: 'Windows sleep/drain a major issue; numerous small software bugs',
        severity: 'moderate',
      },
      {
        area: 'Battery',
        detail: '49.2 Wh is short; compounded by Windows standby drain',
        severity: 'moderate',
      },
      {
        area: 'Thermals',
        detail: 'High TDP generates significant heat under sustained load',
        severity: 'moderate',
      },
      {
        area: 'Repairability',
        detail: 'Poor — heavy construction, difficult disassembly',
        severity: 'moderate',
      },
    ],
    sources: [
      {
        label: 'Notebookcheck — Legion Go review',
        url: 'https://www.notebookcheck.net/Lenovo-Legion-Go-gaming-handheld-review-Good-idea-not-quite-perfectly-executed.794034.0.html',
        kind: 'review',
      },
      {
        label: 'Lenovo Newsroom',
        url: 'https://news.lenovo.com',
        kind: 'manufacturer',
      },
    ],
    summary:
      'The first Legion Go paired a class-leading 8.8" 144 Hz 1600p screen and Switch-style detachable controllers with a Ryzen Z1 Extreme, but shipped with rough launch firmware and the heaviest body in its class. It has since been superseded by the Go 2 and Go S, surviving mainly as a clearance buy.',
    pros: [
      'Large, sharp 8.8" 2560 × 1600 144 Hz display',
      'Detachable controllers, kickstand and FPS mouse mode',
      'Dual USB4 ports for docking and accessories',
    ],
    cons: [
      'Very heavy at 845 g',
      'Poor launch firmware and Windows sleep/drain issues',
      'Short 49.2 Wh battery for the high-TDP APU',
    ],
  },

  // ─── Lenovo Legion Go S (Windows) ──────────────────────────────────────────
  {
    slug: 'lenovo-legion-go-s-windows',
    manufacturer: 'Lenovo',
    productLine: 'Legion Go S',
    name: 'Lenovo Legion Go S (Windows)',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 8.0,
    releaseDate: '2025-03',
    releaseYear: 2025,
    targetMarket: 'Mid-range / mainstream',
    status2026: 'Active — current mid-range SKU',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',
    configurations: [
      {
        id: 'LEGION-GO-S-WIN',
        asin: 'B0DTBN55K9',
        label: 'Ryzen Z2 Go · 16/32 GB · 512 GB / 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen Z2 Go',
          cpuArch: 'Zen 3+',
          gpuArch: 'RDNA 2 (12 CUs — Radeon 680M)',
          computeUnits: 12,
          cores: '4c / 8t',
          boostClock: 'up to 4.3 GHz',
          tdpRangeW: '5 – 30 W',
          tdpModes: 'Quiet 8 W / Balanced 15 W / Performance 30 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5x 6400 MT/s (16 GB base / 32 GB upper)',
        storage: '512 GB base / 1 TB upper — PCIe 4.0 NVMe (M.2 2242)',
        priceUsd: 729.99,
        priceNote:
          'Base 16 GB config now ~$729.99 regular (~$549.99 on sale); launched at $599.99 — pricing rose through the 2026 memory shortage, and higher 32 GB / 1 TB tiers cost more',
      },
    ],
    display: {
      sizeInches: 8.0,
      resolution: '1920 × 1200',
      panelType: 'ips',
      refreshRateHz: 120,
      touch: true,
    },
    battery: {
      capacityWh: 55.5,
      chargerW: 65,
      lifeBalanced: '~3–4 hr',
      lifeHighTdp: '~1.5 hr at 30 W',
    },
    thermals: {
      fanCount: 1,
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect (adjustable trigger switches)',
      gyro: true,
      backButtons: 2,
      layoutNote:
        'Non-detachable Hall Effect sticks; 2 macro/grip buttons',
    },
    ergonomics: {
      weightGrams: 738,
      dimensions: '299 × 128 × 22.6 mm',
      materials: 'Plastic',
      notes:
        'Slimmer profile than Legion Go 1; non-detachable controllers; high-quality feel',
    },
    connectivity: {
      ports: '2× USB4 40 Gbps (DP + PD), 3.5 mm, microSD',
      usb4Thunderbolt: 'Yes — 2× USB4',
      externalGpu: 'No dedicated eGPU',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
    },
    reliability: [
      {
        area: 'Software (Windows)',
        detail:
          'Windows hobbles performance and was rated negatively — Notebookcheck labelled the Windows variant a "Windows victim"',
        severity: 'high',
      },
      {
        area: 'Suspend/Resume',
        detail: 'Poor Windows suspend/resume with standby battery drain',
        severity: 'moderate',
      },
      {
        area: 'Battery',
        detail: '55.5 Wh is moderate for a Windows handheld',
        severity: 'low',
      },
    ],
    sources: [
      {
        label: 'Notebookcheck — Legion Go S (Windows) review',
        url: 'https://www.notebookcheck.net/Lenovo-Legion-Go-S-gaming-handheld-review-Steam-Deck-killer-or-Windows-victim.961296.0.html',
        kind: 'review',
      },
      {
        label: 'Lenovo CES 2025 press release',
        url: 'https://news.lenovo.com/pressroom/press-releases/lenovo-legion-unleashes-next-gen-gaming-power-at-ces-2025/',
        kind: 'manufacturer',
      },
    ],
    conflicts: [
      {
        field: 'priceUsd',
        detail:
          'Notebookcheck cites Best Buy $729.99 for the tested 16 GB config; Engadget/The Verge reported $499–599 for base SKUs — different SKUs, and the Windows variant is more expensive than the SteamOS base',
      },
    ],
    summary:
      'The Legion Go S is a comfortable, slimmer 8" Z2 Go handheld with genuine Hall-effect sticks. Reviewers were blunt that the Windows build wastes the hardware — the same chassis running SteamOS is markedly faster and more efficient — so the Windows SKU mainly suits buyers committed to the Windows ecosystem.',
    pros: [
      'Comfortable slimmer chassis with Hall-effect sticks and triggers',
      'Dual USB4 ports and microSD',
      'Good 8" 1920 × 1200 120 Hz display',
    ],
    cons: [
      'Windows noticeably hampers performance vs. the SteamOS variant',
      'Poor Windows suspend/resume and standby drain',
      'Modest Ryzen Z2 Go (4c / 8t) is the weakest APU in the family',
    ],
  },

  // ─── Lenovo Legion Go S (SteamOS) ──────────────────────────────────────────
  {
    slug: 'lenovo-legion-go-s-steamos',
    manufacturer: 'Lenovo',
    productLine: 'Legion Go S',
    name: 'Lenovo Legion Go S (SteamOS)',
    os: 'SteamOS',
    formFactor: 'traditional',
    displaySizeInches: 8.0,
    releaseDate: '2025-05-25',
    releaseYear: 2025,
    targetMarket: 'Mainstream / SteamOS ecosystem',
    status2026: 'Active — first licensed non-Valve SteamOS handheld',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',
    configurations: [
      {
        id: 'LEGION-GO-S-STOS',
        asin: 'B0FYFF5GLT',
        label: 'Ryzen Z2 Go · 32 GB · 1 TB (SteamOS)',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen Z2 Go',
          cpuArch: 'Zen 3+',
          gpuArch: 'RDNA 2 (12 CUs — Radeon 680M)',
          computeUnits: 12,
          cores: '4c / 8t',
          boostClock: 'up to 4.3 GHz',
          tdpRangeW: '5 – 30 W',
          tdpModes: 'SteamOS power profiles (ECO / Balanced / Performance)',
        },
        ramGb: 32,
        ramType: 'LPDDR5x 6400 MT/s',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2242)',
        priceUsd: 899.99,
        priceNote:
          'This 32 GB / 1 TB SteamOS config now ~$899.99 at Best Buy; the entry SteamOS tier launched at $549.99 and has risen sharply in the 2026 memory shortage (Lenovo direct has listed it $1,049+)',
      },
    ],
    display: {
      sizeInches: 8.0,
      resolution: '1920 × 1200',
      panelType: 'ips',
      refreshRateHz: 120,
      touch: true,
    },
    battery: {
      capacityWh: 55.5,
      chargerW: 65,
      lifeBalanced: '~4 hr (SteamOS efficiency)',
      lifeHighTdp: '~1.5–2 hr',
    },
    thermals: {
      fanCount: 1,
      coolingDesign: 'Fan runs quieter under SteamOS than Windows',
      noiseNote: 'Less audible gaming noise than the Windows variant',
      throttlingNote: 'Less throttling under SteamOS',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect (adjustable trigger switches)',
      gyro: true,
      backButtons: 2,
      layoutNote: 'Non-detachable Hall Effect sticks; 2 macro/grip buttons',
    },
    ergonomics: {
      weightGrams: 736,
      dimensions: '299 × 128 × 42 mm',
      materials: 'Plastic',
      notes: 'Identical chassis to the Windows variant',
    },
    connectivity: {
      ports: '2× USB4 40 Gbps (DP + PD), 3.5 mm, microSD',
      usb4Thunderbolt: 'Yes — 2× USB4',
      externalGpu: 'No dedicated eGPU',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
    },
    reliability: [
      {
        area: 'Software (SteamOS)',
        detail:
          'Minor incompatibility with non-Steam launchers; overall much lower issue frequency than the Windows variant',
        severity: 'low',
      },
    ],
    sources: [
      {
        label: 'Notebookcheck — Legion Go S SteamOS review',
        url: 'https://www.notebookcheck.net/Lenovo-Legion-Go-S-Review-Gaming-handheld-is-much-faster-thanks-to-SteamOS.1095464.0.html',
        kind: 'review',
      },
      {
        label: 'Engadget — first third-party SteamOS handheld (CES 2025)',
        url: 'https://www.engadget.com/gaming/pc/ces-2025-the-lenovo-legion-go-s-is-the-first-third-party-steamos-handheld-160001642.html',
        kind: 'review',
      },
    ],
    summary:
      'This is the first licensed non-Valve SteamOS handheld, and it is the same chassis as the Windows Go S running a much better OS. Notebookcheck measured it as significantly faster, quieter and more efficient than the Windows build, with better suspend/resume — the SteamOS version is the one to buy unless you specifically need Windows.',
    pros: [
      'SteamOS runs the same hardware faster, quieter and more efficiently than Windows',
      'Excellent SteamOS suspend/resume',
      'Hall-effect sticks and triggers; dual USB4',
    ],
    cons: [
      'Minor friction with non-Steam launchers on SteamOS',
      'Still a modest 4c / 8t Ryzen Z2 Go',
      'IPS panel and moderate 55.5 Wh battery',
    ],
  },

  // ─── Lenovo Legion Go 2 ────────────────────────────────────────────────────
  {
    slug: 'lenovo-legion-go-2',
    manufacturer: 'Lenovo',
    productLine: 'Legion Go 2',
    name: 'Lenovo Legion Go 2',
    os: 'Windows',
    formFactor: 'detachable',
    displaySizeInches: 8.8,
    releaseDate: '2025-10',
    releaseYear: 2025,
    targetMarket: 'Enthusiast / flagship',
    status2026: 'Active — launched October 2025',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',
    configurations: [
      {
        id: 'LEGION-GO-2-Z2',
        label: 'Ryzen Z2 · 16 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen Z2',
          cpuArch: 'Zen 5',
          gpuArch: 'RDNA 3.5 (CU count unconfirmed)',
          tdpRangeW: '15 – 30 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5x 8000 MT/s',
        storage: '1 TB PCIe Gen 4 NVMe (M.2 2242)',
        priceUsd: 1099.99,
        priceNote: '$1,099.99 launch (≈ current Best Buy sale price); regular price has since risen to ~$1,499–1,599 in the 2026 memory shortage',
      },
      {
        id: 'LEGION-GO-2-Z2X',
        asin: 'B0G573TMZS',
        label: 'Ryzen Z2 Extreme · 32 GB · 1 TB / 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen Z2 Extreme',
          cpuArch: 'Zen 5 (3P + 5E)',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M)',
          computeUnits: 16,
          cores: '8c / 16t',
          boostClock: 'up to 5.0 GHz',
          tdpRangeW: '15 – 35 W cTDP',
          tdpModes: '15 W / 30 W / 35 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5x 8000 MT/s',
        storage: '1 TB / 2 TB PCIe Gen 4 NVMe (M.2 2242)',
        priceUsd: 1999.99,
        priceNote: 'Now ~$1,999.99 (1 TB, Best Buy) and up to $2,849.99 for the 2 TB config direct from Lenovo — surged from the $1,349.99 launch in the 2026 memory shortage',
      },
    ],
    display: {
      sizeInches: 8.8,
      resolution: '1920 × 1200',
      panelType: 'oled',
      refreshRateHz: 144,
      vrr: 'Adaptive Sync / VRR (30–144 Hz)',
      brightnessNits: '500 nits',
      colorGamut: '97% DCI-P3 (VESA TrueBlack 1000)',
      touch: true,
    },
    battery: {
      capacityWh: 74,
      chargerW: 65,
      lifeLowTdp: '>10 hr (productivity)',
      lifeHighTdp: '2–3 hr AAA',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      gyro: true,
      trackpads: '1 (24 × 24 mm on right detachable controller)',
      backButtons: 2,
      layoutNote: 'Detachable controllers + kickstand; FPS mode',
    },
    ergonomics: {
      weightGrams: 922,
      dimensions: '295.6 × 136.7 × 42.25 mm',
      materials: 'Plastic',
      notes:
        'Improved ergonomics vs. gen 1 but still very heavy; detachable controllers and kickstand retained; wider stance',
    },
    connectivity: {
      ports: '2× USB4 (DP 2.0 + PD 3.0), 3.5 mm, microSD (up to 2 TB)',
      usb4Thunderbolt: 'Yes — 2× USB4',
      externalGpu: 'No dedicated eGPU',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
    },
    reliability: [
      {
        area: 'Software (Windows)',
        detail: 'Windows 11 sleep drain and system instability reported',
        severity: 'high',
      },
      {
        area: 'Analog sticks / build',
        detail:
          'Wobbly left controller (slight looseness) reported by early owners',
        severity: 'moderate',
      },
      {
        area: 'Buttons',
        detail: 'Uneven power button reported by early owners',
        severity: 'low',
      },
    ],
    sources: [
      {
        label: 'IGN — Legion Go 2 price and October launch',
        url: 'https://www.ign.com/articles/the-lenovo-legion-go-2-price-launching-in-october',
        kind: 'review',
      },
      {
        label: 'Windows Central — Legion Go 2 specs officially revealed',
        url: 'https://www.windowscentral.com/hardware/handheld-gaming-pc/lenovo-legion-go-2-specs-officially-revealed',
        kind: 'review',
      },
      {
        label: 'GamingOnLinux — Legion Go 2 launch',
        url: 'https://www.gamingonlinux.com/2025/09/the-lenovo-legion-go-2-launches-in-october-its-heavier-and-very-pricey/',
        kind: 'review',
      },
      {
        label: 'Reddit r/LegionGo — early fault reports',
        url: 'https://www.reddit.com/r/LegionGo/comments/1o3pw9s/new_legion_go_2_faults/',
        kind: 'reliability',
      },
    ],
    conflicts: [
      {
        field: 'priceUsd',
        detail:
          'Starting price: IGN reports $1,099.99 for Z2 / 16 GB; Windows Central reports $1,049 — likely IFA announcement vs. final US MSRP, with the IGN figure more commonly cited',
      },
      {
        field: 'priceEur',
        detail:
          'EU price: Notebookcheck shows a €1,500 list; Overclocking.com cites €999 — likely different config/region, with €1,500 being the maxed Z2 Extreme',
      },
    ],
    summary:
      'The Legion Go 2 upgrades to a gorgeous 8.8" OLED VRR panel, a 74 Wh battery and Zen 5 Ryzen Z2 / Z2 Extreme silicon, keeping the detachable controllers and kickstand. It is a genuine flagship — and priced like one: it launched at $1,099–$1,480 but 2026’s memory-shortage hikes pushed it to roughly $1,999 (1 TB) and up to $2,849 (2 TB) at regular pricing — while remaining very heavy (922 g) and still subject to Windows 11 standby drain.',
    pros: [
      'Excellent 8.8" OLED 144 Hz VRR display (97% DCI-P3)',
      'Large 74 Wh battery and Zen 5 Z2 / Z2 Extreme performance',
      'Detachable controllers, kickstand and dual USB4',
    ],
    cons: [
      'Very expensive, and pricier since 2026’s memory hikes (~$1,999 for 1 TB, up to $2,849 for 2 TB)',
      'Very heavy at 922 g',
      'Windows 11 sleep drain and early build-quality reports',
    ],
  },

  // ─── MSI Claw A1M ──────────────────────────────────────────────────────────
  {
    slug: 'msi-claw-a1m',
    manufacturer: 'MSI',
    productLine: 'Claw',
    name: 'MSI Claw A1M',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2024-03-08',
    releaseYear: 2024,
    targetMarket: 'Mainstream / enthusiast',
    status2026: 'Legacy — superseded',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',
    configurations: [
      {
        id: 'MSI-CLAW-A1M-U5',
        label: 'Core Ultra 5 135H · 16 GB · 512 GB',
        apu: {
          vendor: 'Intel',
          model: 'Core Ultra 5 135H',
          cpuArch: 'Meteor Lake',
          gpuArch: 'Intel Arc Xe (8 CUs)',
          computeUnits: 8,
          cores: '14c / 18t',
          boostClock: '4P up to 4.6 GHz / 8E up to 3.6 GHz',
          tdpRangeW: '9 – 35 W',
          tdpModes: 'Eco 9 W / Balanced 20 W / Sport 35 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5 6400 MT/s',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2230)',
        priceUsd: 699.99,
        priceNote: '$699.99 launch MSRP; EOL — last clearance ~$389.99, now sold out at major US retailers',
      },
      {
        id: 'MSI-CLAW-A1M-U7',
        label: 'Core Ultra 7 155H · 16 GB · 512 GB',
        apu: {
          vendor: 'Intel',
          model: 'Core Ultra 7 155H',
          cpuArch: 'Meteor Lake',
          gpuArch: 'Intel Arc Xe (8 CUs)',
          computeUnits: 8,
          cores: '16c / 22t',
          boostClock: '6P up to 4.8 GHz / 8E up to 3.8 GHz',
          tdpRangeW: '9 – 35 W',
          tdpModes: 'Eco 9 W / Balanced 20 W / Sport 35 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5 6400 MT/s',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2230)',
        priceUsd: 749.99,
        priceNote: '$749.99 launch MSRP; discontinued — street clearance ~$509 (Walmart)',
      },
      {
        id: 'MSI-CLAW-A1M-U7-1T',
        asin: 'B0CXGDNGRQ',
        label: 'Core Ultra 7 155H · 16 GB · 1 TB',
        apu: {
          vendor: 'Intel',
          model: 'Core Ultra 7 155H',
          cpuArch: 'Meteor Lake',
          gpuArch: 'Intel Arc Xe (8 CUs)',
          computeUnits: 8,
          cores: '16c / 22t',
          boostClock: 'up to 4.8 GHz',
          tdpRangeW: '9 – 35 W',
          tdpModes: 'Eco 9 W / Balanced 20 W / Sport 35 W',
        },
        ramGb: 16,
        ramType: 'LPDDR5 6400 MT/s',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2230)',
        priceUsd: 799.99,
        priceNote: '$799.99 launch MSRP; EOL — may still sell near MSRP while remaining stock lasts',
      },
    ],
    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080',
      panelType: 'ips',
      refreshRateHz: 120,
      vrr: 'FreeSync (48–120 Hz VRR)',
      brightnessNits: '500 nits',
      touch: true,
    },
    battery: {
      capacityWh: 53,
      chargerW: 65,
      lifeBalanced: '~2 hr (mediocre)',
      lifeHighTdp: '~1.5 hr',
    },
    thermals: {
      fanCount: 2,
      coolingDesign: 'Dual fan, 2 heat pipes',
      throttlingNote:
        'Meteor Lake thermal/power issues widely reported at sustained load',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      backButtons: '2 macro (M1/M2)',
      haptics: 'HD haptics',
      layoutNote: 'RGB Hall Effect sticks; fingerprint power button',
    },
    ergonomics: {
      weightGrams: 675,
      dimensions: '294 × 117 × 21.2 mm',
      materials: 'Plastic',
      notes:
        'Flat grips; USB-C sits in a hot spot; some find the reach to the sticks awkward; comfortable for medium sessions',
    },
    connectivity: {
      ports:
        '1× USB-C (Thunderbolt 4 + USB4 + DP 1.4 + PD 3.0), 3.5 mm, UHS-II microSD',
      usb4Thunderbolt: 'Yes — 1× Thunderbolt 4 / USB4',
      externalGpu: 'No dedicated eGPU',
      wifi: 'Wi-Fi 7 (Intel Killer BE1750)',
      bluetooth: '5.4',
    },
    reliability: [
      {
        area: 'Thermals',
        detail:
          'Meteor Lake thermal/power mismatch widely reported — high frequency at launch',
        severity: 'high',
      },
      {
        area: 'Battery',
        detail: '53 Wh is poor; battery-health degradation reports',
        severity: 'high',
      },
      {
        area: 'Firmware',
        detail:
          'Very poor at launch (major driver issues, crashes); gradually improved via updates',
        severity: 'high',
      },
      {
        area: 'Software (Windows)',
        detail: 'Multiple driver/crash issues at launch',
        severity: 'moderate',
      },
    ],
    sources: [
      {
        label: 'Engadget — MSI Claw A1M review',
        url: 'https://www.engadget.com/msi-claw-a1m-review-a-touch-late-and-bit-too-pricey-143009327.html',
        kind: 'review',
      },
      {
        label: 'Wikipedia — MSI Claw A1M',
        url: 'https://en.wikipedia.org/wiki/MSI_Claw_A1M',
        kind: 'manufacturer',
      },
      {
        label: 'Reddit r/MSIClaw — battery reports',
        url: 'https://www.reddit.com/r/MSIClaw/comments/1mvi1bn/having_issues_with_battery_on_msi_claw_a1m/',
        kind: 'reliability',
      },
    ],
    summary:
      "MSI's first handheld was the only Intel Meteor Lake entry, pairing Hall-effect sticks, Thunderbolt 4 and Wi-Fi 7 with an Arc Xe iGPU. It was undermined by widely reported thermal/power problems, poor ~2 hr battery life and glitchy launch software — issues that improved via updates but left it superseded by the Lunar Lake Claw 8 AI+.",
    pros: [
      'Hall-effect sticks and triggers from launch',
      'Thunderbolt 4 / USB4 and Wi-Fi 7',
      'Now very cheap on clearance',
    ],
    cons: [
      'Meteor Lake thermal/power issues widely reported',
      'Poor ~2 hr battery from the 53 Wh cell',
      'Glitchy driver/firmware situation at launch',
    ],
  },

  // ─── MSI Claw 8 AI+ ────────────────────────────────────────────────────────
  {
    slug: 'msi-claw-8-ai-plus',
    manufacturer: 'MSI',
    productLine: 'Claw 8 AI+',
    name: 'MSI Claw 8 AI+',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 8.0,
    releaseDate: '2025-Q1',
    releaseYear: 2025,
    targetMarket: 'Enthusiast',
    status2026: 'Active — current Intel SKU',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',
    configurations: [
      {
        id: 'MSI-CLAW8-AI',
        asin: 'B0DLPYC184',
        label: 'Core Ultra 7 258V · 32 GB · 1 TB',
        apu: {
          vendor: 'Intel',
          model: 'Core Ultra 7 258V',
          cpuArch: 'Lunar Lake',
          gpuArch: 'Intel Arc 140V (8 Xe2 CUs)',
          computeUnits: 8,
          cores: '8c / 8t',
          boostClock: '4P up to 4.8 GHz / 4E up to 3.7 GHz',
          tdpRangeW: '17 – 37 W',
          tdpModes: 'Eco / Balanced 20 W / Sport 30 W / Extreme 37 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5x 8533 MT/s (onboard)',
        storage: '1 TB PCIe Gen 4 NVMe (M.2 2230)',
        priceUsd: 1119,
        priceNote: 'US ships 1 TB-only (A2VM) at ~$1,119 — up from the $899.99 launch amid the 2026 DRAM shortage; the 512 GB tier is the separate 7-inch Claw 7 AI+',
      },
    ],
    display: {
      sizeInches: 8.0,
      resolution: '1920 × 1200',
      panelType: 'ips',
      refreshRateHz: 120,
      vrr: 'Yes — VRR',
      touch: true,
    },
    battery: {
      capacityWh: 80,
      chargerW: 65,
      lifeBalanced: '~5–6 hr',
      lifeHighTdp: '~2.5–3 hr',
    },
    thermals: {
      fanCount: 2,
      coolingDesign: 'Dual fan, 2 heat pipes',
      noiseNote: 'Fan speed fluctuates under load',
      throttlingNote: 'Reduced vs. A1M; fluctuating fan speed noted',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      gyro: true,
      backButtons: 2,
      layoutNote: 'Hall Effect sticks with LED rings; fingerprint power button',
    },
    ergonomics: {
      weightGrams: 793,
      dimensions: '299 × 126 × 30 mm',
      materials: 'Plastic (beige handles + black body)',
      notes:
        'Larger chassis; reach to the sticks slightly awkward for some hand sizes; good for extended sessions',
    },
    connectivity: {
      ports:
        '2× USB4 40 Gbps (2× Thunderbolt 4 + 2× DP + PD), 3.5 mm, microSD',
      usb4Thunderbolt: 'Yes — 2× USB4 / Thunderbolt 4',
      externalGpu: 'No dedicated eGPU',
      wifi: 'Wi-Fi 7 (Intel BE201)',
      bluetooth: '5.4',
    },
    reliability: [
      {
        area: 'Thermals',
        detail: 'Fluctuating fan speed under load; overall improved over A1M',
        severity: 'moderate',
      },
      {
        area: 'Software (Windows)',
        detail:
          'AI energy profiles awkward; control-remapping gaps noted; MSI Center M UI can be laggy',
        severity: 'moderate',
      },
      {
        area: 'Repairability',
        detail: 'Moderate — M.2 SSD now more accessible',
        severity: 'low',
      },
    ],
    sources: [
      {
        label: 'Notebookcheck — MSI Claw 8 AI+ review',
        url: 'https://www.notebookcheck.net/MSI-Claw-8-AI-review-The-best-gaming-handheld-thanks-to-Intel-Lunar-Lake.974004.0.html',
        kind: 'review',
      },
      {
        label: 'PCMag — MSI Claw 8 AI+ review',
        url: 'https://www.pcmag.com/reviews/msi-claw-8-ai-plus',
        kind: 'review',
      },
    ],
    conflicts: [
      {
        field: 'priceUsd',
        detail:
          'Launched at $899.99; the US SKU is 1 TB-only (A2VM) and 2026’s DRAM shortage pushed street pricing to ~$1,119. The 512 GB tier some early coverage cited belongs to the separate 7-inch Claw 7 AI+, not this 8-inch model.',
      },
    ],
    summary:
      "The Claw 8 AI+ moves to Intel Lunar Lake (Core Ultra 7 258V) and was called the best gaming handheld by Notebookcheck on the strength of its efficiency. An 80 Wh battery, 8\" 120 Hz VRR display, dual Thunderbolt 4 and Wi-Fi 7 fix most of the A1M's flaws, though the MSI Center M software and AI power profiles remain rough.",
    pros: [
      'Efficient Lunar Lake APU with strong performance-per-watt',
      'Large 80 Wh battery — ~5–6 hr balanced',
      'Dual Thunderbolt 4 / USB4 and Wi-Fi 7',
    ],
    cons: [
      'Laggy MSI Center M software and awkward AI energy profiles',
      'Fan speed fluctuates under load',
      'Reach to the sticks awkward for some hand sizes',
    ],
  },

  // ─── MSI Claw A8 ───────────────────────────────────────────────────────────
  {
    slug: 'msi-claw-a8',
    manufacturer: 'MSI',
    productLine: 'Claw A8',
    name: 'MSI Claw A8',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 8.0,
    releaseDate: '2026-01',
    releaseYear: 2026,
    targetMarket: 'Enthusiast',
    status2026: 'Active — current AMD SKU',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',
    configurations: [
      {
        id: 'MSI-CLAW-A8',
        asin: 'B0GL4N9YQV',
        label: 'Ryzen Z2 Extreme · 24 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen Z2 Extreme',
          cpuArch: 'Zen 5',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M)',
          computeUnits: 16,
          cores: '8c / 16t',
          boostClock: 'up to 5.0 GHz',
          tdpRangeW: '~17 – 33 W (unconfirmed)',
          tdpModes: 'Endurance / Balanced / Sport / Extreme',
        },
        ramGb: 24,
        ramType: 'LPDDR5x 8000 MT/s',
        storage: '1 TB PCIe NVMe',
        priceUsd: 1149,
        priceNote:
          '~$999–1,149 (US MSRP unconfirmed; $1,149 best available estimate)',
      },
    ],
    display: {
      sizeInches: 8.0,
      resolution: '1920 × 1200',
      panelType: 'ips',
      refreshRateHz: 120,
      vrr: 'Yes — VRR',
      touch: true,
    },
    battery: {
      capacityWh: 80,
      chargerW: 65,
      lifeLowTdp: '19+ hr video playback (Endurance)',
      lifeBalanced: '~3.5 hr gameplay (Endurance)',
    },
    thermals: {
      fanCount: 2,
      coolingDesign:
        'Dual fan (77-blade) — Cooler Boost HyperFlow intraflow design',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect (rounded)',
      backButtons: 2,
      layoutNote: 'Improved clicky face buttons; Hall Effect sticks',
    },
    ergonomics: {
      materials: 'Plastic (colored)',
      notes:
        'Sculpted grips described as improved over the Claw 8 AI+; blocky retro design; face buttons more clicky',
    },
    connectivity: {
      ports: '2× USB-C (Thunderbolt), 3.5 mm, microSD',
      usb4Thunderbolt: 'Yes — 2× Thunderbolt / USB4',
      externalGpu: 'No dedicated eGPU',
    },
    reliability: [
      {
        area: 'Software (Windows)',
        detail: 'Windows plus Xbox Full Screen Experience integration',
        severity: 'moderate',
      },
      {
        area: 'Issue frequency',
        detail:
          'Too new (US launch Jan 2026) for reliable field-failure frequency data',
        severity: 'low',
      },
    ],
    sources: [
      {
        label: 'MSI — Claw A8 BZ2EMX product page',
        url: 'https://www.msi.com/Handheld/Claw-A8-BZ2EMX',
        kind: 'manufacturer',
      },
      {
        label: 'IGN — MSI Claw A8 review',
        url: 'https://www.ign.com/articles/msi-claw-a8-bz2em-handheld-pc-review',
        kind: 'review',
      },
      {
        label: 'Notebookcheck DE — MSI Claw A8 BZ2EM',
        url: 'https://www.notebookcheck.com/MSI-Claw-A8-BZ2EM.1070697.0.html',
        kind: 'review',
      },
    ],
    conflicts: [
      {
        field: 'priceUsd',
        detail:
          'US price: IGN/Newegg placeholder ~$1,150; exact US MSRP not confirmed at time of compilation — $1,149 used as best available estimate (UK ~£850)',
      },
    ],
    summary:
      "The Claw A8 is MSI's first AMD handheld, swapping Intel silicon for the Zen 5 Ryzen Z2 Extreme (Radeon 890M) while keeping the 80 Wh battery, 8\" 120 Hz VRR display and dual Thunderbolt ports. It brings improved sculpted grips and clickier face buttons, but launched in the US only in January 2026, so long-term reliability and final pricing remain unsettled.",
    pros: [
      'Strong Zen 5 Ryzen Z2 Extreme (Radeon 890M) performance',
      'Large 80 Wh battery with long video-playback endurance',
      'Improved grips and clicky face buttons; dual Thunderbolt',
    ],
    cons: [
      'Pricey and with an unconfirmed final US MSRP',
      'Late US release (Jan 2026) means limited reliability track record',
      'Weight and several detailed specs still unconfirmed',
    ],
  },
];
