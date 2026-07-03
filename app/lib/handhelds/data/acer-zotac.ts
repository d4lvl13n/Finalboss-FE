// Acer Nitro Blaze + Zotac Zone — "Major OEM" segment.
//
// Extracted from handheld-gaming-pc-database-2026.md. Unknown source fields are
// omitted (never inferred). The three Acer Nitro Blaze devices were announced
// but — as of mid-2026 — have not been confirmed shipping to any market; that
// uncertainty is captured honestly in status2026, cons, reliability and
// conflicts. The Zotac Zone is active with limited US availability; its AMOLED
// panel, dual trackpads and haptic feedback are its standout features.

import type { Handheld } from '../types';

export const ACER_ZOTAC: Handheld[] = [
  {
    slug: 'acer-nitro-blaze-7',
    manufacturer: 'Acer',
    productLine: 'Nitro Blaze',
    name: 'Acer Nitro Blaze 7',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: 'Announced 2024-09 (IFA)',
    releaseYear: 2024,
    targetMarket: 'Mainstream (intended)',
    status2026:
      'Delayed / not shipped — announced at IFA 2024 but never confirmed shipping to any market; absent from CES 2026, with Acer citing tariff uncertainty.',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',
    configurations: [
      {
        id: 'NITRO-BLAZE-7',
        label: 'Ryzen 7 8840HS · 16 GB · up to 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840HS',
          cpuArch: 'Zen 4 (Phoenix)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: 'up to 5.1 GHz',
        },
        ramGb: 16,
        ramType: 'LPDDR5x 7500 MT/s',
        storage: 'up to 2 TB PCIe Gen 4 NVMe',
        priceNote: 'Announced pricing never confirmed; not shipped.',
        statusNote: 'Not shipped as of mid-2026.',
      },
    ],
    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080 (16:9)',
      panelType: 'ips',
      refreshRateHz: 144,
      vrr: 'AMD FreeSync Premium',
      colorGamut: '100% sRGB',
      touch: true,
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      trackpads: 'None',
      layoutNote:
        'ABXY, D-pad, LB/RB, 2× Hall Effect sticks, Hall Effect triggers, View, Menu, Acer Game Space hotkey, Quick Menu. Compact design; no detachable controllers.',
    },
    ergonomics: {
      notes: 'Compact design intended; no detachable controllers.',
    },
    connectivity: {
      ports: '1× USB4 Type-C (40 Gbps), microSD',
      usb4Thunderbolt: 'Yes — 1× USB4',
      externalGpu: 'No',
      wifi: 'Wi-Fi 6E',
    },
    reliability: [
      {
        area: 'Availability',
        detail:
          'Device never shipped — no owner reports or teardown possible; long-term reliability is unknown.',
        severity: 'high',
      },
    ],
    sources: [
      {
        label: 'Acer newsroom (IFA 2024 debut)',
        url: 'https://news.acer.com/acer-debuts-its-first-handheld-gaming-pc-the-nitro-blaze-7',
        kind: 'manufacturer',
      },
      {
        label: 'PCMag — why the Nitro Blaze was MIA at CES 2026',
        url: 'https://uk.pcmag.com/migrated-84555-gaming/162489/acers-steam-deck-rival-was-mia-at-ces-2026-heres-why',
        kind: 'review',
      },
    ],
    conflicts: [
      {
        field: 'Shipping status',
        detail:
          'Acer announced the Nitro Blaze 7 at IFA 2024 but never confirmed a shipment to any market; PCMag notes tariff uncertainty as the official reason for its absence at CES 2026.',
      },
    ],
    summary:
      'The Nitro Blaze 7 was Acer\'s first handheld gaming PC, announced at IFA 2024 around a Ryzen 7 8840HS APU and a 7-inch 1080p 144 Hz IPS panel. Despite the reveal, it was never confirmed shipping to any market and was absent from CES 2026, with Acer citing tariff uncertainty. Treat it as an announced-but-unshipped device rather than a buyable product.',
    pros: [
      '7-inch 1080p 144 Hz IPS panel with FreeSync Premium and 100% sRGB coverage.',
      'Hall Effect sticks and triggers plus USB4 (40 Gbps) connectivity on paper.',
    ],
    cons: [
      'Announced but NOT confirmed shipping as of mid-2026 — absent from CES 2026 (Acer cited tariff uncertainty).',
      'Pricing never announced; no owner reports, reviews or reliability data exist.',
    ],
  },
  {
    slug: 'acer-nitro-blaze-8',
    manufacturer: 'Acer',
    productLine: 'Nitro Blaze',
    name: 'Acer Nitro Blaze 8',
    os: 'Windows',
    formFactor: 'detachable',
    displaySizeInches: 8.8,
    releaseDate: 'Announced CES 2025 (Q2 2025 target)',
    releaseYear: 2025,
    targetMarket: 'Enthusiast',
    status2026:
      'Delayed / not shipped — Q2 2025 target missed; absent from CES 2026 and US launch not confirmed as of June 2026 (Acer says it "remains on the US roadmap" but gives no date).',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',
    configurations: [
      {
        id: 'NITRO-BLAZE-8',
        label: 'Ryzen 7 8840HS · 16 GB · up to 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840HS',
          cpuArch: 'Zen 4 (Phoenix)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: 'up to 5.1 GHz',
        },
        ramGb: 16,
        ramType: 'LPDDR5x 7500 MT/s',
        storage: 'up to 2 TB PCIe Gen 4 NVMe',
        priceNote: 'Announced at $899.99 (CES 2025) but never shipped in the US; no live price exists.',
        statusNote: 'Still not shipped as of July 2026 — Acer cites tariffs, no committed US ship date.',
      },
    ],
    display: {
      sizeInches: 8.8,
      resolution: '2560 × 1600 (16:10)',
      panelType: 'ips',
      refreshRateHz: 144,
      brightnessNits: '500 nits',
      touch: true,
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      trackpads: 'None',
      layoutNote:
        'ABXY, D-pad, LB/RB, 2× Hall Effect sticks, Hall Effect triggers, macro buttons, detachable controllers.',
    },
    ergonomics: {
      notes: 'Detachable controllers; kickstand; front camera.',
    },
    connectivity: {
      ports:
        '1× USB4 (40 Gbps), 1× USB 3.2 Type-C, 1× USB 3.2 Type-A, microSD, 3.5 mm',
      usb4Thunderbolt: 'Yes — 1× USB4',
      externalGpu: 'No',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
    },
    reliability: [
      {
        area: 'Availability',
        detail:
          'Device never shipped — no owner reports or teardown possible; long-term reliability is unknown.',
        severity: 'high',
      },
    ],
    sources: [
      {
        label: 'Acer newsroom (CES 2025 — Nitro Blaze 8 & 11)',
        url: 'https://news.acer.com/acer-expands-handheld-gaming-portfolio-with-new-nitro-blaze-8-and-nitro-blaze-11',
        kind: 'manufacturer',
      },
      {
        label: 'Windows Central — Acer Nitro handheld specs',
        url: 'https://www.windowscentral.com/gaming/acer-nitro-specs-gaming-handhelds-announcement',
        kind: 'review',
      },
      {
        label: 'PCMag — Nitro Blaze MIA at CES 2026',
        url: 'https://uk.pcmag.com/migrated-84555-gaming/162489/acers-steam-deck-rival-was-mia-at-ces-2026-heres-why',
        kind: 'review',
      },
    ],
    conflicts: [
      {
        field: 'Shipping status',
        detail:
          'Q2 2025 target never met; Acer told Windows Central the device "remains on the US roadmap" but has given no launch date, and it was absent from CES 2026.',
      },
    ],
    summary:
      'The Nitro Blaze 8 is Acer\'s enthusiast handheld, announced at CES 2025 with a detachable-controller, kickstand design around an 8.8-inch 1600p 144 Hz IPS screen and a Ryzen 7 8840HS. Its Q2 2025 target came and went; it was absent from CES 2026 and its US launch is unconfirmed as of mid-2026. The $899.99 figure is an announced MSRP, not a shipping price.',
    pros: [
      'Large 8.8-inch 2560 × 1600 144 Hz IPS panel (500 nits) with detachable controllers and kickstand.',
      'Broad I/O on paper: USB4, extra USB-C/USB-A, microSD and 3.5 mm.',
    ],
    cons: [
      'Announced but NOT confirmed shipping as of mid-2026 — Q2 2025 target missed and absent from CES 2026.',
      '$899.99 is an announced MSRP only; no reviews or reliability data exist.',
    ],
  },
  {
    slug: 'acer-nitro-blaze-11',
    manufacturer: 'Acer',
    productLine: 'Nitro Blaze',
    name: 'Acer Nitro Blaze 11',
    os: 'Windows',
    formFactor: 'detachable',
    displaySizeInches: 10.95,
    releaseDate: 'Announced CES 2025 (Q2 2025 target)',
    releaseYear: 2025,
    targetMarket: 'Premium large-screen',
    status2026:
      'Delayed / not shipped — Q2 2025 target missed; US launch not confirmed as of June 2026. The US product page is live but the device is unshipped (PCMag hands-on only).',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',
    configurations: [
      {
        id: 'NITRO-BLAZE-11',
        label: 'Ryzen 7 8840HS · 16 GB · up to 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840HS',
          cpuArch: 'Zen 4 (Phoenix)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: 'up to 5.1 GHz',
        },
        ramGb: 16,
        ramType: 'LPDDR5x 7500 MT/s',
        storage: 'up to 2 TB PCIe Gen 4 NVMe',
        priceNote: 'Announced at $1,099.99 (CES 2025) but never shipped in the US; no live price exists.',
        statusNote: 'Still not shipped as of July 2026 — Acer cites tariffs, no committed US ship date.',
      },
    ],
    display: {
      sizeInches: 10.95,
      resolution: '2560 × 1600 (16:10)',
      panelType: 'ips',
      refreshRateHz: 120,
      brightnessNits: '500 nits',
      touch: true,
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      trackpads: 'None',
      layoutNote:
        'Same controls as the Nitro Blaze 8: ABXY, D-pad, LB/RB, 2× Hall Effect sticks, Hall Effect triggers, detachable controllers.',
    },
    ergonomics: {
      notes:
        'Detachable controllers; kickstand; large 10.95-inch form factor; front camera.',
    },
    connectivity: {
      ports:
        '1× USB4 (40 Gbps), 1× USB 3.2 Type-C, 1× USB 3.2 Type-A, microSD, 3.5 mm',
      usb4Thunderbolt: 'Yes — 1× USB4',
      externalGpu: 'No',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
    },
    reliability: [
      {
        area: 'Availability',
        detail:
          'Device never shipped — the US product page is live but only PCMag hands-on exists; no owner reports or teardown, so long-term reliability is unknown.',
        severity: 'high',
      },
    ],
    sources: [
      {
        label: 'Acer US product page — Nitro Blaze 11',
        url: 'https://www.acer.com/us-en/handheld-gaming/nitro-handheld-gaming/nitro-blaze-11',
        kind: 'manufacturer',
      },
      {
        label: 'Windows Central — Acer Nitro handheld specs',
        url: 'https://www.windowscentral.com/gaming/acer-nitro-specs-gaming-handhelds-announcement',
        kind: 'review',
      },
      {
        label: 'PCMag — Nitro Blaze MIA at CES 2026',
        url: 'https://uk.pcmag.com/migrated-84555-gaming/162489/acers-steam-deck-rival-was-mia-at-ces-2026-heres-why',
        kind: 'review',
      },
    ],
    conflicts: [
      {
        field: 'Shipping status',
        detail:
          'Same conflict as the Nitro Blaze 8: Q2 2025 target missed and no US launch date. The product page is live but the device remains unshipped (PCMag hands-on only).',
      },
    ],
    summary:
      'The Nitro Blaze 11 is Acer\'s premium large-screen handheld, announced at CES 2025 with a 10.95-inch 1600p 120 Hz IPS display, detachable controllers and a kickstand around a Ryzen 7 8840HS. Its Q2 2025 target was missed and the US launch is unconfirmed as of mid-2026 — the product page is live but only a PCMag hands-on exists. The $1,099.99 figure is an announced MSRP, not a shipping price.',
    pros: [
      'Very large 10.95-inch 2560 × 1600 120 Hz IPS panel with detachable controllers and kickstand.',
      'USB4 plus extra USB-C/USB-A, microSD and 3.5 mm for a tablet-scale handheld.',
    ],
    cons: [
      'Announced but NOT confirmed shipping as of mid-2026 — product page live but device unshipped.',
      '$1,099.99 is an announced MSRP only; only a hands-on preview exists, with no reliability data.',
    ],
  },
  {
    slug: 'zotac-zone',
    manufacturer: 'Zotac',
    productLine: 'Zone',
    name: 'Zotac Zone',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2024-Q4 (US limited; wider 2025)',
    releaseYear: 2024,
    targetMarket: 'Enthusiast',
    status2026: 'Active — limited availability in the US.',
    segment: 'Major OEM',
    completeness: 'full',
    lastVerified: '2026-06-29',
    configurations: [
      {
        id: 'ZOTAC-ZONE',
        label: 'Ryzen 7 8840U · 16 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4 (Hawk Point-U)',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: '15 – 30 W',
          tdpModes: '28 W PL1 / 30 W PL2',
        },
        ramGb: 16,
        ramType: 'LPDDR5x 7500 MT/s',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 799,
        priceNote: '$799 MSRP, flat since the Sept 2024 launch; sold via Amazon/Newegg/B&H but US stock is intermittent — confirm availability before buying.',
      },
    ],
    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080 (16:9)',
      panelType: 'oled',
      refreshRateHz: 120,
      brightnessNits: '800 nits',
      colorGamut: 'Contrast 100,000:1 – 1,000,000:1 (AMOLED)',
      touch: true,
    },
    battery: {
      capacityWh: 48.5,
      chargerW: 65,
      lifeHighTdp: '~1.5 – 2 hr gaming',
    },
    thermals: {
      fanCount: 2,
      coolingDesign: 'Dual fan',
      noiseNote: 'Relatively quiet',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect + 2-stage adjustable',
      gyro: true,
      trackpads: '2× trackpads',
      backButtons: '2 macro',
      haptics: 'Haptic feedback',
      layoutNote:
        'ABXY, D-pad, L/R bumpers, 2× Hall Effect precision sticks, Hall Effect triggers with 2-stage adjustable throw, radial dials for on-the-fly system adjustment, 2 macro buttons, More/Home/Zone buttons.',
    },
    ergonomics: {
      weightGrams: 692,
      dimensions: '310 × 135 × 40 mm',
      notes:
        'Premium haptic feedback praised; radial dials for system adjustment; ergonomic and customizable. 1.0 MP front camera and fingerprint reader in the power button.',
    },
    connectivity: {
      ports: '2× USB4 (DisplayPort via USB4), 3.5 mm, UHS-II microSD',
      usb4Thunderbolt: 'Yes — 2× USB4',
      externalGpu: 'No dedicated eGPU',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.2',
    },
    reliability: [
      {
        area: 'Thermals',
        detail: 'Touchscreen gets warm under sustained load (noted con in reviews).',
        severity: 'low',
      },
      {
        area: 'Audio',
        detail: 'Stereo speakers rated poor for sound quality by Notebookcheck.',
        severity: 'moderate',
      },
      {
        area: 'Battery',
        detail:
          '48.5 Wh is small; reviewers note ~1.5–2 hr gaming life as a recurring weakness.',
        severity: 'moderate',
      },
      {
        area: 'Software',
        detail:
          'Zotac Gaming One Launcher is functional but rudimentary; feature-limited software is a recurring review complaint.',
        severity: 'moderate',
      },
    ],
    sources: [
      {
        label: 'Zotac Zone datasheet',
        url: 'https://cdn-reichelt.de/documents/datenblatt/E910/ZOTAC_ZONE_DB-EN.pdf',
        kind: 'manufacturer',
      },
      {
        label: 'Notebookcheck — Zotac Gaming Zone review',
        url: 'https://www.notebookcheck.net/ZOTAC-Gaming-Zone-handheld-review-Precision-controller-brilliant-OLED-and-compact.955863.0.html',
        kind: 'review',
      },
      {
        label: "Tom's Guide — updated Zotac Zone hands-on",
        url: 'https://www.tomsguide.com/gaming/handheld-gaming/i-tried-the-updated-zotac-zone-handheld-and-one-big-change-makes-it-a-true-steam-deck-rival',
        kind: 'review',
      },
      {
        label: 'GamesRadar — Zotac Zone review',
        url: 'https://www.gamesradar.com/hardware/handhelds/zotac-zone-review/',
        kind: 'review',
      },
    ],
    conflicts: [
      {
        field: 'Display contrast',
        detail:
          'The datasheet quotes a wide AMOLED contrast range (100,000:1 to 1,000,000:1); no single-source conflict, but the figure is a range rather than a fixed value.',
      },
    ],
    summary:
      'The Zotac Zone is an enthusiast Windows handheld built around a Ryzen 7 8840U and a standout 7-inch 1080p 120 Hz AMOLED panel (800 nits). Its differentiators are the OLED screen, dual trackpads and praised haptic feedback, plus radial dials and 2-stage adjustable Hall Effect triggers. It ships with limited US availability at roughly $800; the main knocks are a small 48.5 Wh battery (~1.5–2 hr gaming), poor speakers and Zotac\'s rudimentary launcher software.',
    pros: [
      'Standout 7-inch 1080p 120 Hz AMOLED panel at 800 nits with deep OLED contrast.',
      'Dual trackpads and praised haptic feedback — rare on Windows handhelds — plus radial dials and 2-stage adjustable Hall Effect triggers.',
      'Dual USB4 ports (DisplayPort out), Wi-Fi 6E and a compact 692 g body.',
    ],
    cons: [
      'Small 48.5 Wh battery gives only ~1.5–2 hr of gaming — a recurring review weakness.',
      'Stereo speakers rated poor, and the Zotac Gaming One Launcher software is rudimentary.',
      'Touchscreen gets warm under sustained load.',
    ],
  },
];
