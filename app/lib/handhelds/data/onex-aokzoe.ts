// ONEXPLAYER / OneXFly / AOKZOE boutique handheld gaming PCs.
//
// Sourced from handheld-gaming-pc-database-2026.md, "ONEXPLAYER / OneXFly /
// AOKZOE handhelds — Detailed Tables" segment. Family→configuration grain:
// SKU/config variants are collapsed into one family per product line, with
// each purchasable SKU as a `configuration`. Unknown fields are omitted,
// never inferred.

import type { Handheld } from '../types';

export const ONEX_AOKZOE: Handheld[] = [
  // ────────────────────────────────────────────────────────────────────────
  // ONEXPLAYER X1
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'onexplayer-x1',
    manufacturer: 'ONEXPLAYER',
    productLine: 'X1',
    name: 'ONEXPLAYER X1',
    os: 'Windows',
    formFactor: 'detachable',
    displaySizeInches: 10.95,
    releaseDate: '2024-01',
    releaseYear: 2024,
    targetMarket: '3-in-1 tablet/handheld/laptop hybrid',
    status2026: 'Legacy — superseded by the X1 Pro; still sold',
    segment: 'boutique-onex',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'onexplayer-x1-u5-125h',
        label: 'Intel Core Ultra 5 125H · 16 GB · 1 TB',
        apu: {
          vendor: 'Intel',
          model: 'Core Ultra 5 125H',
          cpuArch: 'Meteor Lake (4+8+2 cores)',
          gpuArch: 'Intel Arc Xe-LPG',
          boostClock: 'up to 4.5 GHz',
          tdpRangeW: '15–45 W class (exact range unconfirmed)',
        },
        ramGb: 16,
        ramType: 'LPDDR5X-7500',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 859,
        priceNote: '$859 Indiegogo early-bird (sold out); retail was ~$1,049',
      },
      {
        id: 'onexplayer-x1-u7-155h',
        label: 'Intel Core Ultra 7 155H · 32 GB · 2 TB',
        apu: {
          vendor: 'Intel',
          model: 'Core Ultra 7 155H',
          cpuArch: 'Meteor Lake (6+8+2 cores)',
          gpuArch: 'Intel Arc Xe-LPG',
          boostClock: 'up to 4.8 GHz',
          tdpRangeW: '15–45 W class (exact range unconfirmed)',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1299,
        priceNote: '$1,299 original retail; clearance price ~$799',
      },
      {
        id: 'onexplayer-x1-8840u-32-1tb',
        label: 'Ryzen 7 8840U · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M @ 2.7 GHz)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: 'Up to 30 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1099,
        priceNote: '~$1,099 launch',
      },
      {
        id: 'onexplayer-x1-8840u-64-2tb',
        label: 'Ryzen 7 8840U · 64 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M @ 2.7 GHz)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: 'Up to 30 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5X-7500',
        storage: '2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1399,
        priceNote: '~$1,399 launch',
      },
    ],

    display: {
      sizeInches: 10.95,
      resolution: '2560 × 1600 (2.5K, 16:10)',
      panelType: 'ips',
      refreshRateHz: 120,
      brightnessNits: '540 nits',
      touch: true,
    },
    battery: {
      capacityWh: 65,
    },
    ergonomics: {
      weightGrams: 789,
      dimensions: '252 × 163 × 13 mm (tablet body); ~355 mm wide with controllers attached',
      materials: 'Aluminum alloy + ABS',
    },
    connectivity: {
      ports: 'OCuLink + dual USB4 40 Gbps; microSD',
      usb4Thunderbolt: 'Yes — dual USB4',
      externalGpu: 'OCuLink port for eGPU (confirmed functional for AMD GPUs; one user reported Nvidia issues, not independently confirmed)',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.2',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      layoutNote: 'Detachable side controllers with "chicken leg" grips and 2× back buttons; optional magnetic keyboard sold separately',
    },
    reliability: [
      {
        area: 'Maturity',
        detail: 'The Intel X1 was the first Meteor Lake gaming handheld and was limited to 200 units per SKU at Indiegogo early-bird pricing',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'OneXPlayerStore — X1 Intel product page', url: 'https://onexplayerstore.com/products/x1-155h', kind: 'manufacturer' },
      { label: 'NotebookCheck — X1 Meteor Lake / OCuLink launch', url: 'https://www.notebookcheck.net/ONEXPLAYER-X1-launches-as-first-Intel-Meteor-Lake-gaming-handheld-with-Intel-Core-Ultra-7-155H-and-OCuLink-eGPU-support.796213.0.html', kind: 'review' },
      { label: 'Droix — ONEXPLAYER X1 AMD review', url: 'https://droix.net/blogs/onexplayer-x1-amd-review/', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'refreshRateHz',
        detail: 'The Intel and AMD X1 share a 120 Hz 2.5K panel — different from the older ONEXPLAYER 2/2 Pro\'s 60 Hz panel on the same 8.4" size class.',
      },
    ],

    summary:
      "The X1 was ONEXPLAYER's first 3-in-1 hybrid — tablet, handheld (via detachable controllers) or laptop (via an optional magnetic keyboard) — and the first Meteor Lake gaming handheld with a dedicated OCuLink port. AMD 8840U variants followed the Intel launch on the same chassis. It has since been superseded by the X1 Pro but remains a capable, well-connected hybrid.",
    pros: [
      'Genuine 3-in-1: tablet, handheld and laptop via a detachable magnetic keyboard',
      'OCuLink plus dual USB4 for eGPU flexibility',
      'Sharp 10.95" 2.5K 120 Hz touchscreen with 540 nits',
    ],
    cons: [
      '789 g main unit alone, heavier still with controllers attached',
      'Intel Meteor Lake variant was Indiegogo-limited (200 units per SKU)',
      "Superseded by the X1 Pro (HX 370) for buyers who don't need the lower price",
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // ONEXPLAYER X1 Mini
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'onexplayer-x1-mini',
    manufacturer: 'ONEXPLAYER',
    productLine: 'X1 Mini',
    name: 'ONEXPLAYER X1 Mini',
    os: 'Windows',
    formFactor: 'detachable',
    displaySizeInches: 8.8,
    releaseDate: '2024-06',
    releaseYear: 2024,
    targetMarket: 'Smaller, more portable 3-in-1 hybrid',
    status2026: 'Active — sold via OneXPlayerStore, Amazon, Droix',
    segment: 'boutique-onex',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'onexplayer-x1-mini-32-1tb',
        label: 'Ryzen 7 8840U · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: 'Up to 30 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1049,
        priceNote: '$1,049 (32 GB/1 TB) per XDA review',
      },
      {
        id: 'onexplayer-x1-mini-64-2tb',
        label: 'Ryzen 7 8840U · 64 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: 'Up to 30 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5X-7500',
        storage: '2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1399,
        priceNote: '$1,399 (64 GB/2 TB) per XDA review',
      },
    ],

    display: {
      sizeInches: 8.8,
      resolution: '2560 × 1600 (16:10)',
      panelType: 'ips',
      refreshRateHz: 144,
      touch: true,
    },
    battery: {
      capacityWh: 65,
    },
    ergonomics: {
      weightGrams: 710,
      dimensions: '210.6 × 129.2 × 20 mm (tablet); ~315 mm wide with controllers',
      materials: 'Aluminum alloy + ABS',
      notes: 'Significantly lighter than the full-size X1 AMD (969 g); XDA measured 710 g, Droix measured 737 g',
    },
    connectivity: {
      ports: 'OCuLink (bottom-mounted) + USB4',
      usb4Thunderbolt: 'Yes — USB4',
      externalGpu: 'OCuLink port, positioned at the bottom of the chassis — flagged as an "annoying position" for desktop use in Droix\'s review',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.2',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      backButtons: 2,
      layoutNote: 'Detachable side controllers; 1MP top camera for Windows Hello',
    },
    reliability: [
      {
        area: 'OCuLink position',
        detail: "OCuLink port sits at the bottom of the chassis — Droix's review flags this as inconvenient for desktop/eGPU setups",
        severity: 'low',
      },
    ],
    sources: [
      { label: 'XDA Developers — X1 Mini review', url: 'https://www.xda-developers.com/one-xplayer-x1-mini-review/', kind: 'review' },
      { label: 'Droix — X1 Mini review', url: 'https://droix.net/blogs/onexplayer-x1-mini-review/', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'weightGrams',
        detail: 'XDA measured 710 g without controllers; Droix measured 737 g — likely unit-to-unit variation.',
      },
    ],

    summary:
      "The X1 Mini shrinks the X1's 3-in-1 formula into an 8.8\" chassis at roughly 710–737 g, a significant drop from the 969 g full-size X1 AMD. Same Ryzen 7 8840U, same detachable-controller/tablet/laptop flexibility and OCuLink, but the eGPU port's bottom placement is an ergonomic misstep flagged by reviewers.",
    pros: [
      'Much lighter than the full-size X1 (710–737 g vs. 969 g)',
      'Same OCuLink + detachable-controller 3-in-1 flexibility in a smaller frame',
      "144 Hz 2.5K panel — faster than the standard X1's 120 Hz",
    ],
    cons: [
      'OCuLink port sits at the bottom, flagged as awkward for desktop eGPU use',
      'Only offered with the older Ryzen 7 8840U, not HX 370',
      'Weight measurement varies 27 g between reviewers',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // ONEXPLAYER X1 Pro
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'onexplayer-x1-pro',
    manufacturer: 'ONEXPLAYER',
    productLine: 'X1 Pro',
    name: 'ONEXPLAYER X1 Pro',
    os: 'Windows',
    formFactor: 'detachable',
    displaySizeInches: 10.95,
    releaseDate: '2025',
    releaseYear: 2025,
    targetMarket: 'High-end 3-in-1 hybrid',
    status2026: 'Active — current flagship X1-series hybrid',
    segment: 'boutique-onex',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'onexplayer-x1-pro-hx370-32',
        label: 'Ryzen AI 9 HX 370 · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 / Zen 5c',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2.9 GHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: '5.1 GHz',
          tdpRangeW: '30 W sustained',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1399,
        priceNote: '$1,399 current sale (was $1,599 MSRP)',
      },
      {
        id: 'onexplayer-x1-pro-hx370-64',
        label: 'Ryzen AI 9 HX 370 · 64 GB · 4 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 / Zen 5c',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2.9 GHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: '5.1 GHz',
          tdpRangeW: '30 W sustained',
        },
        ramGb: 64,
        ramType: 'LPDDR5X-7500',
        storage: '4 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1799,
        priceNote: '~$1,799 (estimated from store configurator)',
      },
      {
        id: 'onexplayer-x1-pro-8840u',
        label: 'Ryzen 7 8840U · 32 GB · 1–2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          tdpRangeW: '30 W sustained',
        },
        ramGb: 32,
        ramType: 'LPDDR5-6400',
        storage: '1 TB or 2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1199,
        priceNote: '~$1,199–$1,399 estimated; exact price unconfirmed, sold out in most configs',
      },
      {
        id: 'onexplayer-x1-pro-eva-255h',
        label: 'Intel Core Ultra 7 255H · Eva Edition · 64 GB · 2 TB',
        apu: {
          vendor: 'Intel',
          model: 'Core Ultra 7 255H',
          cpuArch: 'Arrow Lake-H (6+8+2 cores)',
          gpuArch: 'Intel Arc 140T (Xe2 / Battlemage-class)',
          tdpRangeW: '~28–45 W (unconfirmed)',
        },
        ramGb: 64,
        ramType: 'LPDDR5X',
        storage: '2 TB',
        priceUsd: 1649.99,
        priceNote: '$1,649.99 — limited-edition run via Minixpc',
      },
    ],

    display: {
      sizeInches: 10.95,
      resolution: '2560 × 1600 (2.5K, 16:10)',
      panelType: 'ips',
      refreshRateHz: 120,
      brightnessNits: '500 nits',
      touch: true,
    },
    battery: {
      capacityWh: 65.5,
    },
    ergonomics: {
      weightGrams: 789,
      dimensions: '312 × 131 × 21.2 mm',
      materials: 'Aluminum alloy frame + ABS',
      notes: 'NotebookCheck: "the largest member of the ONEXPLAYER family" — "quite heavy as a handheld," takes some getting used to',
    },
    connectivity: {
      ports: 'OCuLink + 2× USB4 (Thunderbolt 4 ×2 on the Intel Eva edition)',
      usb4Thunderbolt: 'Yes — 2× USB4 / Thunderbolt 4 on the Intel variant',
      externalGpu: 'OCuLink confirmed by NotebookCheck ("OCUlink to connect an eGPU") plus 2× USB4',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      layoutNote: 'Detachable side controllers with back buttons; magnetic keyboard sold separately',
    },
    reliability: [
      {
        area: 'Ergonomics',
        detail: 'Droix (4.6/5): "larger and heavier than other handhelds" listed as a con; NotebookCheck agrees the size takes getting used to',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'NotebookCheck — X1 Pro full review', url: 'https://www.notebookcheck.net/XL-gaming-handheld-tablet-and-laptop-OneXplayer-X1-Pro-review.983190.0.html', kind: 'review' },
      { label: 'Droix — X1 Pro review (4.6/5)', url: 'https://droix.net/blogs/onexplayer-x1-pro-review/', kind: 'review' },
      { label: 'Windows Central — X1 Pro Eva Edition coverage', url: 'https://www.windowscentral.com/gaming/pc-gaming/microsofts-surface-pro-meets-nintendos-switch-2-in-this-absurd-gaming-handheld-and-its-ludicrously-expensive', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'apu (8840U variant)',
        detail: 'onexplayer.bg\'s spec page for "X1 Pro" describes the base/entry 8840U variant released first, with LPDDR5-6400 (not 7500) — likely a downclocked RAM config versus the primary HX 370 SKU.',
      },
    ],

    summary:
      'The X1 Pro is ONEXPLAYER\'s flagship hybrid, pairing HX 370 with confirmed OCuLink eGPU support in the same 10.95" 3-in-1 chassis as the original X1. A limited-run Intel Arrow Lake-H "Eva Edition" pushes price to $1,650. It\'s unambiguously the largest and heaviest device in ONEXPLAYER\'s range — NotebookCheck calls it "quite heavy as a handheld" — but the connectivity and performance ceiling are class-leading.',
    pros: [
      'HX 370 with confirmed OCuLink eGPU support plus 2× USB4',
      'Sharp 10.95" 2.5K 120 Hz touchscreen at 500 nits',
      'Genuine 3-in-1 flexibility: tablet, handheld, laptop',
    ],
    cons: [
      'Largest and heaviest device in the ONEXPLAYER range — "quite heavy as a handheld" per NotebookCheck',
      '8840U base-tier pricing is unconfirmed and mostly sold out',
      'Eva Edition (Intel Arrow Lake-H) is a limited, expensive run at $1,649.99',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // ONEXPLAYER G1
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'onexplayer-g1',
    manufacturer: 'ONEXPLAYER',
    productLine: 'G1',
    name: 'ONEXPLAYER G1',
    os: 'Windows',
    formFactor: 'convertible',
    displaySizeInches: 8.8,
    releaseDate: '2025-01',
    releaseYear: 2025,
    targetMarket: 'Clamshell handheld (GPD Win Mini rival)',
    status2026: 'Active — sold direct since ~March 2025',
    segment: 'boutique-onex',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'onexplayer-g1-8840u',
        label: 'Ryzen 7 8840U · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: 'Up to 30 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 959,
        priceNote: '$959 direct (discounted from $1,099 launch)',
      },
      {
        id: 'onexplayer-g1-u7-255h',
        label: 'Intel Core Ultra 7 255H · 32 GB · 1 TB',
        apu: {
          vendor: 'Intel',
          model: 'Core Ultra 7 255H',
          cpuArch: 'Arrow Lake-H (6+8+2 cores)',
          gpuArch: 'Intel Arc 140T ("~60% faster than Arc 140V" per NCK)',
          tdpRangeW: '~28–45 W (unconfirmed)',
        },
        ramGb: 32,
        ramType: 'LPDDR5X',
        storage: '1 TB',
        priceUsd: 1099,
        priceNote: '$1,099 Indiegogo launch price; Indiegogo-exclusive, not sold on the direct store',
      },
      {
        id: 'onexplayer-g1-hx370-32',
        label: 'Ryzen AI 9 HX 370 · 32 GB · 1–2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 / Zen 5c',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2.9 GHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: '5.1 GHz',
          tdpRangeW: 'Up to 30 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '1 TB or 2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1199,
        priceNote: '$1,199 Indiegogo / $1,319 direct launch',
      },
      {
        id: 'onexplayer-g1-hx370-64',
        label: 'Ryzen AI 9 HX 370 · 64 GB · 4 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 / Zen 5c',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2.9 GHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: '5.1 GHz',
          tdpRangeW: 'Up to 30 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5X-7500',
        storage: '4 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1519,
        priceNote: '$1,519 direct (up to $2,000 per some listings)',
      },
    ],

    display: {
      sizeInches: 8.8,
      resolution: '2560 × 1600 (2.5K, 16:10)',
      panelType: 'ips',
      refreshRateHz: 144,
    },
    battery: {
      capacityWh: 51.97,
    },
    ergonomics: {
      weightGrams: 880,
      dimensions: '208 × 146.5 × 32 mm',
      materials: 'Plastic',
      notes: 'Clamshell form factor like the GPD Win Mini — not a traditional landscape handheld; optional detachable keyboard accessory sold separately',
    },
    connectivity: {
      ports: 'OCuLink + 2× USB4',
      usb4Thunderbolt: 'Yes — 2× USB4',
      externalGpu: 'OCuLink + 2× USB4 (confirmed by NCK and HandheldsArena)',
      wifi: 'Wi-Fi 6E',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      layoutNote: 'Integrated controls (no detachable controllers); Hall effect joysticks and triggers confirmed by HandheldsArena',
    },
    reliability: [
      {
        area: 'SKU availability',
        detail: 'The Intel Core Ultra 7 255H variant is Indiegogo-exclusive and was never offered on the direct OneXPlayerStore, per NotebookCheck',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'NotebookCheck — G1 direct-availability article', url: 'https://www.notebookcheck.net/OneXPlayer-G1-now-available-directly-featuring-AMD-Ryzen-AI-9-HX-370-and-64-GB-of-RAM-with-early-launch-discounts.1015993.0.html', kind: 'review' },
      { label: 'HandheldsArena — G1 full spec sheet', url: 'https://handheldsarena.com/devices/one-netbook/onexplayer-g1/', kind: 'review' },
      { label: 'OneXPlayerStore — G1 product page', url: 'https://onexplayerstore.com/products/onexplayer-g1-amd-ryzen-ai-9-hx-370-ultimate-gaming-handheld-console-versatile-laptop', kind: 'manufacturer' },
    ],

    summary:
      "The G1 is ONEXPLAYER's answer to the GPD Win Mini — a clamshell handheld with an 8.8\" 144 Hz panel, OCuLink and dual USB4, spanning 8840U through 64 GB HX 370. The Intel Core Ultra 7 255H tier is Indiegogo-exclusive and never reached the direct store. At 880 g it's noticeably heavier than the GPD Win Mini it competes with.",
    pros: [
      'OCuLink plus dual USB4 — better eGPU connectivity than the GPD Win Mini',
      'Sharp 8.8" 2.5K 144 Hz panel',
      'Wide APU spread from 8840U to 64 GB HX 370, plus an Indiegogo-exclusive Intel tier',
    ],
    cons: [
      'At 880 g, notably heavier than the GPD Win Mini it competes with',
      'Intel Core Ultra 7 255H tier is Indiegogo-exclusive, never sold direct',
      'Smaller 51.97 Wh battery than ONEXPLAYER\'s X1 series (~65 Wh)',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // OneXFly F1 Pro
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'onexfly-f1-pro',
    manufacturer: 'ONEXPLAYER',
    productLine: 'OneXFly F1 Pro',
    name: 'OneXFly F1 Pro',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2025',
    releaseYear: 2025,
    targetMarket: 'Flagship compact OLED handheld',
    status2026: 'Active — current OneXFly flagship',
    segment: 'boutique-onex',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'onexfly-f1-pro-8840u',
        label: 'Ryzen 7 8840U · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: 'Up to 30 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '1 TB PCIe 4.0 NVMe (options: 2 TB, 4 TB)',
        priceUsd: 1010.95,
        priceNote: '$1,010.95 via Droix (32 GB/1 TB, 8840U)',
      },
      {
        id: 'onexfly-f1-pro-ai9-365',
        label: 'Ryzen AI 9 365 · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 365',
          cpuArch: 'Zen 5 / Zen 5c',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2.9 GHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: '5.0 GHz',
          tdpRangeW: 'Up to 30 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '1 TB (options: 2 TB)',
        priceUsd: 1100,
        priceNote: '~$1,100 estimated (between the 8840U and HX 370 tiers)',
      },
      {
        id: 'onexfly-f1-pro-hx370-32',
        label: 'Ryzen AI 9 HX 370 · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 / Zen 5c',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2.9 GHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: '5.1 GHz',
          tdpRangeW: 'Up to 30 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '1 TB PCIe 4.0 NVMe (options: 2 TB, 4 TB)',
        priceUsd: 1099,
        priceNote: '$1,099 current OneXPlayerStore sale (was $1,599)',
      },
      {
        id: 'onexfly-f1-pro-hx370-64',
        label: 'Ryzen AI 9 HX 370 · 64 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI 9 HX 370',
          cpuArch: 'Zen 5 / Zen 5c',
          gpuArch: 'RDNA 3.5 (16 CUs — Radeon 890M @ 2.9 GHz)',
          computeUnits: 16,
          cores: '12c / 24t',
          boostClock: '5.1 GHz',
          tdpRangeW: 'Up to 30 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5X-7500',
        storage: '2 TB PCIe 4.0 NVMe',
        priceUsd: 1299,
        priceNote: '~$1,299–$1,399 estimated (64 GB/2 TB per store configs)',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1080 (FHD, 16:9)',
      panelType: 'oled',
      refreshRateHz: 144,
      brightnessNits: '800 nits',
      colorGamut: '152% sRGB, 112% DCI-P3',
    },
    battery: {
      capacityWh: 48.5,
    },
    ergonomics: {
      weightGrams: 599,
      dimensions: '263 × 98 × 23 mm',
      materials: 'Plastic / ABS',
    },
    connectivity: {
      ports: '2× USB-C 4.0 (USB4/TB4-class) + USB-A 3.0; microSD 4.0',
      usb4Thunderbolt: 'Yes — USB4',
      externalGpu: 'No OCuLink — USB4 only for eGPU',
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.2',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      layoutNote: 'Integrated controls, no detachable side controllers',
    },
    reliability: [
      {
        area: 'Value framing',
        detail: 'XDA: "best gaming handheld I\'ve ever used but only if you have obscene amounts of money" — reflects the premium pricing versus rivals at similar specs',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'XDA Developers — OneXFly F1 Pro review', url: 'https://www.xda-developers.com/onexfly-f1-pro-review/', kind: 'review' },
      { label: 'NotebookCheck — F1 Pro availability article', url: 'https://www.notebookcheck.net/OneXFly-F1-Pro-First-OLED-and-AMD-Zen-5-gaming-handheld-now-available-with-better-warranty-options-via-third-party.930228.0.html', kind: 'review' },
      { label: 'OneXPlayerStore — F1 Pro product page', url: 'https://onexplayerstore.com/products/onexfly-f1-pro-wolrd-s-first-amd-ai-370-oled-144hz-gaming-handheld-console', kind: 'manufacturer' },
    ],

    summary:
      'The F1 Pro was the first AMD Zen 5 handheld with an OLED panel — an 800-nit, 144 Hz, 152% sRGB screen shared across all three APU tiers (8840U, AI 9 365, HX 370). XDA called it "the best gaming handheld I\'ve ever used," with the caveat that the HX 370/64 GB configuration is genuinely expensive. It has no OCuLink, relying on USB4 for eGPU.',
    pros: [
      'First AMD Zen 5 handheld with an 800-nit 144 Hz OLED, HARMAN AudioEFX-certified speakers',
      'All three APU tiers (8840U / AI 9 365 / HX 370) share the identical chassis, display and battery',
      'Compact 599 g, 7" form factor for the performance on offer',
    ],
    cons: [
      'No OCuLink — eGPU only via USB4 40 Gbps',
      'HX 370/64 GB tier pricing runs well above rivals at similar specs',
      'Touch is not confirmed on the OLED panel, unlike most IPS-panel rivals',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // ONEXPLAYER Super X
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'onexplayer-super-x',
    manufacturer: 'ONEXPLAYER',
    productLine: 'Super X',
    name: 'ONEXPLAYER Super X',
    os: 'Windows',
    formFactor: 'detachable',
    releaseDate: '2026',
    releaseYear: 2026,
    targetMarket: 'Flagship AI tablet-laptop hybrid (not a traditional handheld)',
    status2026: 'Active — pre-order via Droix / OneXPlayerStore',
    segment: 'boutique-onex',
    completeness: 'seed',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'onexplayer-super-x-395-128',
        label: 'Ryzen AI Max+ 395 · 128 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Max+ 395',
          cpuArch: 'Zen 5 (Strix Halo)',
          gpuArch: 'RDNA 3.5 (40 CUs — Radeon 8060S)',
          computeUnits: 40,
          tdpRangeW: 'Unknown (estimated 45–55 W; liquid-cooled standard, water-cooled premium option)',
        },
        ramGb: 128,
        ramType: 'LPDDR5X-8000 (up to 96 GB allocatable as VRAM)',
        storage: 'Up to 4 TB (2× M.2 slots, PCIe 4.0)',
        priceUsd: 1999,
        priceNote: '$1,999 current sale (from $3,408 per OneXPlayerStore)',
      },
      {
        id: 'onexplayer-super-x-385-64',
        label: 'Ryzen AI Max 385 · 64 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen AI Max 385',
          cpuArch: 'Zen 5 (Strix Halo)',
          gpuArch: 'RDNA 3.5 (32 CUs — Radeon 8050S)',
          computeUnits: 32,
          tdpRangeW: 'Unknown',
        },
        ramGb: 64,
        ramType: 'LPDDR5X-8000',
        storage: 'Up to 2 TB',
        priceUsd: 1799,
        priceNote: '~$1,799 estimated — not confirmed per-SKU',
      },
    ],

    battery: {
      capacityWh: 85.58,
    },
    connectivity: {
      wifi: 'Wi-Fi 7 (confirmed on the top variant per Droix); lower variants may be Wi-Fi 6E',
      bluetooth: '5.3',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      layoutNote: 'No integrated controllers — sold as a 14" tablet-laptop hybrid with an optional detachable controller-connector accessory',
    },
    ergonomics: {
      notes: 'A 14" AI tablet-laptop hybrid, not a traditional handheld; weight, dimensions and display specs are unconfirmed in any retrieved source',
    },
    reliability: [
      {
        area: 'Form factor',
        detail: 'TechRadar describes it as a "water-cooled AMD AI 14-inch tablet" — ONEXPLAYER itself frames it as an AI tablet/laptop hybrid rather than a handheld gaming device',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'Droix — Super X listing', url: 'https://droix.net/product/onexplayer-super-x/', kind: 'review' },
      { label: 'OneXPlayerStore — Super X product page', url: 'https://onexplayerstore.com/products/onexplayer-super-x', kind: 'manufacturer' },
    ],
    conflicts: [
      {
        field: 'display',
        detail: 'Display size, resolution, panel type, refresh rate and brightness are all unconfirmed in every retrieved source; 14" is inferred only from Liliputing/Droix descriptions, not an official spec.',
      },
    ],

    summary:
      'The Super X trades the handheld gamepad shape for a 14" AI tablet-laptop hybrid built around Strix Halo silicon — up to a 40-CU Radeon 8060S with 128 GB of unified RAM (up to 96 GB allocatable as VRAM) and an 85.58 Wh battery. Game controls come via an optional detachable connector accessory rather than integrated sticks, and core display specs remain unconfirmed as of mid-2026 — this is a niche, AI-workload-first pick rather than a mainstream handheld.',
    pros: [
      'Up to 128 GB unified LPDDR5x with up to 96 GB allocatable as VRAM for local AI workloads',
      'Large 85.58 Wh battery; Wi-Fi 7 on the top configuration',
      'Liquid-cooled chassis option for sustained Strix Halo performance',
    ],
    cons: [
      'Not a traditional handheld — controllers are a separate accessory, not integrated',
      'Display specs (size, resolution, panel, refresh) are entirely unconfirmed',
      'Weight and dimensions unpublished in any retrieved source',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // ONEXPLAYER 2 Pro
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'onexplayer-2-pro',
    manufacturer: 'ONEXPLAYER',
    productLine: '2 Pro',
    name: 'ONEXPLAYER 2 Pro',
    os: 'Windows',
    formFactor: 'detachable',
    displaySizeInches: 8.4,
    releaseDate: '2023',
    releaseYear: 2023,
    targetMarket: 'Upper-mid handheld with detachable controllers',
    status2026: 'Legacy — mostly discontinued / clearance',
    segment: 'boutique-onex',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'onexplayer-2-pro-7840u',
        label: 'Ryzen 7 7840U · 32 GB · 1 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 7840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M @ 2.7 GHz)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: '30 W sustained',
        },
        ramGb: 32,
        ramType: 'LPDDR5X',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280) (options: 512 GB, 2 TB)',
        priceUsd: 899,
        priceNote: '~$899–$1,249 (7840U configs; mostly discontinued)',
      },
      {
        id: 'onexplayer-2-pro-8840u',
        label: 'Ryzen 7 8840U (2024 refresh) · 32 GB · 1–2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 8840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: '30 W sustained',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '1 TB or 2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 999,
        priceNote: '~$999 (8840U base; now on clearance)',
      },
    ],

    display: {
      sizeInches: 8.4,
      resolution: '2560 × 1600 (16:10)',
      panelType: 'ips',
      refreshRateHz: 60,
    },
    battery: {
      capacityWh: 65.5,
    },
    ergonomics: {
      weightGrams: 876,
      dimensions: '311 × 135 × 43 mm (with controllers attached); unit alone 310 × 127 mm',
      materials: 'Plastic / ABS',
      notes: 'The 8840U revision ships in a lighter 709 g chassis per the official spec sheet, versus 876 g measured by NotebookCheck on the 7840U review unit',
    },
    connectivity: {
      ports: 'USB4 40 Gbps; microSD',
      usb4Thunderbolt: 'Yes — USB4',
      externalGpu: 'No OCuLink — USB4 (40 Gbps) eGPU support only',
      wifi: 'Wi-Fi 6E (Intel AX210)',
      bluetooth: '5.2',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      layoutNote: 'Magnetically detachable side controllers; PC Gamer flagged them as "wobbly"',
    },
    reliability: [
      {
        area: 'Detachable controllers',
        detail: 'PC Gamer (score: 65) called the controllers "wobbly" and found tablet/laptop modes impractical; NotebookCheck (84.9%) was considerably more positive on the same hardware',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'NotebookCheck — ONEXPLAYER 2 Pro (7840U) in-depth review', url: 'https://www.notebookcheck.net/OneXPlayer-2-Pro-gaming-handheld-tablet-or-detachable-in-review-multifaceted-device-with-strong-Ryzen-7.798258.0.html', kind: 'review' },
      { label: 'PC Gamer — OneXPlayer 2 Pro review', url: 'https://www.pcgamer.com/onexplayer-2-pro-review/', kind: 'review' },
      { label: 'onexplayer.bg — 2 Pro 8840U spec sheet', url: 'https://onexplayer.bg/en/onexplayer2pro8840_spec', kind: 'manufacturer' },
    ],
    conflicts: [
      {
        field: 'weightGrams',
        detail: "NotebookCheck's 7840U review unit weighed 876 g; the store page for the 8840U revision lists 709 g — likely a genuine lighter chassis revision rather than measurement error.",
      },
    ],

    summary:
      'The 2 Pro brought magnetically detachable side controllers and an 8.4" 2560×1600 panel to ONEXPLAYER\'s mid-range, first on the 7840U and later refreshed with the lighter, more efficient 8840U. Reviews split on the detachable controllers — NotebookCheck scored it 84.9%, PC Gamer found them "wobbly" — and it lacks OCuLink, relying on USB4 for eGPU. Now mostly discontinued/clearance.',
    pros: [
      'Magnetically detachable side controllers with tablet/laptop modes',
      'Sharp 8.4" 2560×1600 IPS panel',
      '8840U refresh chassis drops significant weight (709 g vs. 876 g)',
    ],
    cons: [
      'No OCuLink — USB4 only for eGPU, unlike the later X1 series',
      'PC Gamer found the detachable controllers "wobbly"; tablet/laptop modes impractical',
      'Mostly discontinued — clearance pricing only in 2026',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // AOKZOE A2
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'aokzoe-a2',
    manufacturer: 'AOKZOE',
    productLine: 'A2',
    name: 'AOKZOE A2',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 7.0,
    releaseDate: '2023-12-22',
    releaseYear: 2023,
    targetMarket: 'Budget-to-mid compact handheld',
    status2026: 'Active — AMD line sold out in most configs; Intel Ultra variant is a China-only launch',
    segment: 'boutique-aokzoe',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'aokzoe-a2-6800u',
        label: 'Ryzen 7 6800U · 32 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 6800U',
          cpuArch: 'Zen 3+',
          gpuArch: 'RDNA 2 (12 CUs — Radeon 680M)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '2.7 – 4.7 GHz',
          tdpRangeW: '15–28 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 599,
        priceNote: '$599 launch (Dec 2023)',
      },
      {
        id: 'aokzoe-a2-7840u-32-512',
        label: 'Ryzen 7 7840U · 32 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 7840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M @ 2.7 GHz)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: '15–30 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2280) (options: 1 TB, 2 TB)',
        priceUsd: 699,
        priceNote: '$699 launch (Dec 2023)',
      },
      {
        id: 'aokzoe-a2-7840u-64-4tb',
        label: 'Ryzen 7 7840U · 64 GB · 4 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 7840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M @ 2.7 GHz)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: '15–30 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5X',
        storage: '4 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 1199,
        priceNote: '$1,199 launch; the A2 is now on clearance around $799',
      },
      {
        id: 'aokzoe-a2-ultra-u5-125h',
        label: 'Intel Core Ultra 5 125H · 16 GB · 512 GB',
        apu: {
          vendor: 'Intel',
          model: 'Core Ultra 5 125H',
          cpuArch: 'Meteor Lake (4+8+2 cores)',
          gpuArch: 'Intel Arc Xe-LPG (8 Xe cores @ 2.25 GHz)',
          tdpRangeW: '~15–35 W (unconfirmed)',
        },
        ramGb: 16,
        ramType: 'LPDDR5X',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 692,
        priceNote: 'CNY 4,999 (~$692 at time of NCK article); global pricing unconfirmed',
      },
      {
        id: 'aokzoe-a2-ultra-u7-155h',
        label: 'Intel Core Ultra 7 155H · 32 GB · 1 TB',
        apu: {
          vendor: 'Intel',
          model: 'Core Ultra 7 155H',
          cpuArch: 'Meteor Lake (6+8+2 cores)',
          gpuArch: 'Intel Arc Xe-LPG (8 Xe cores @ 2.25 GHz)',
          tdpRangeW: '~15–35 W (unconfirmed)',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7467',
        storage: '1 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 886,
        priceNote: 'CNY 6,399 (~$886 at time of NCK article); global pricing unconfirmed',
      },
    ],

    display: {
      sizeInches: 7.0,
      resolution: '1920 × 1200 (8:5 / 16:10)',
      panelType: 'ips',
    },
    battery: {
      capacityWh: 48.5,
    },
    ergonomics: {
      weightGrams: 649,
      dimensions: '265 × 105 × 22 mm',
      materials: 'Plastic',
      notes: 'The A2 Ultra (Intel) variant is slightly heavier at 666 g per unboxdiaries',
    },
    connectivity: {
      ports: 'USB4 (AMD variants); microSD (up to 300 MB/s)',
      usb4Thunderbolt: 'Yes — USB4 (AMD variants)',
      externalGpu: 'No OCuLink — USB4/USB-C for eGPU (AOKZOE dock sold separately)',
      wifi: 'Wi-Fi 6E (AMD 7840U per Wccftech); Wi-Fi 7 (A2 Ultra Intel variant per unboxdiaries)',
      bluetooth: '5.2 (AMD); 5.4 (A2 Ultra)',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect (linear)',
      layoutNote: '"Large Hall Joystick" sticks; RGB lighting on the A2 Ultra per Wccftech',
    },
    reliability: [
      {
        area: 'Wi-Fi spec conflict',
        detail: 'HandheldsArena lists Wi-Fi 6 for the AMD A2; Wccftech\'s launch article says "WiFi 6E + BE5.2" — a significant conflict between sources',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'Wccftech — AOKZOE A2 launch article (full pricing)', url: 'https://wccftech.com/aokzoe-a2-gaming-handheld-launch-22-december-amd-ryzen-7840u-699-6800u-599-usd/', kind: 'review' },
      { label: 'AOKZOE — A2 official product page', url: 'https://aokzoestore.com/products/aokzoe-a2-7840u-handheld', kind: 'manufacturer' },
      { label: 'NotebookCheck — A2 Ultra pricing revealed', url: 'https://www.notebookcheck.net/AOKZOE-A2-Ultra-gaming-handheld-gets-its-pricing-revealed.835764.0.html', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'wifi',
        detail: 'HandheldsArena records Wi-Fi 6 for the A2; Wccftech\'s launch article states "WiFi 6E + BE5.2" — a direct conflict between the two sources.',
      },
      {
        field: 'priceUsd (A2 Ultra)',
        detail: 'A2 Ultra pricing is only confirmed in CNY (China domestic pre-order, ~$692–$996 equivalent); no confirmed international USD pricing was found in any retrieved source. NotebookCheck speculated "similar to MSI Claw (~$699 base)" but this was not confirmed.',
      },
    ],

    summary:
      'The A2 is AOKZOE\'s compact 7" budget-to-mid handheld, spanning a 6800U entry SKU up to a 64 GB/4 TB 7840U flagship, plus a China-launched Intel Meteor Lake "A2 Ultra" variant with Wi-Fi 7. It undercuts ASUS and Lenovo on price with genuine Hall sticks and triggers, but the A2 Ultra\'s international pricing and availability remain unconfirmed as of mid-2026, and the base AMD line is largely sold out.',
    pros: [
      'Aggressive pricing — $599 entry, undercutting most rivals',
      '"Large Hall Joystick" sticks and Hall Effect linear triggers throughout',
      'A2 Ultra (Intel) adds Wi-Fi 7 and Bluetooth 5.4',
    ],
    cons: [
      'AMD A2 line is largely sold out on the official store as of mid-2026',
      'A2 Ultra has no confirmed international USD pricing',
      'Display refresh rate is unconfirmed by AOKZOE or any reviewer',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // AOKZOE A1 Pro
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'aokzoe-a1-pro',
    manufacturer: 'AOKZOE',
    productLine: 'A1 Pro',
    name: 'AOKZOE A1 Pro',
    os: 'Windows',
    formFactor: 'traditional',
    displaySizeInches: 8.0,
    releaseDate: '2024',
    releaseYear: 2024,
    targetMarket: 'Mid-range handheld',
    status2026: 'Legacy — being phased out; refurbished units on the official store',
    segment: 'boutique-aokzoe',
    completeness: 'full',
    lastVerified: '2026-06-29',

    configurations: [
      {
        id: 'aokzoe-a1-pro-32-512',
        label: 'Ryzen 7 7840U · 32 GB · 512 GB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 7840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M @ 2.7 GHz)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: '15–30 W',
        },
        ramGb: 32,
        ramType: 'LPDDR5X-7500',
        storage: '512 GB PCIe 4.0 NVMe (M.2 2280) (options: 1 TB, 2 TB)',
        priceUsd: 799,
        priceNote: '~$799–$849 launch; now $699–$799 clearance',
      },
      {
        id: 'aokzoe-a1-pro-64-2tb',
        label: 'Ryzen 7 7840U · 64 GB · 2 TB',
        apu: {
          vendor: 'AMD',
          model: 'Ryzen 7 7840U',
          cpuArch: 'Zen 4',
          gpuArch: 'RDNA 3 (12 CUs — Radeon 780M @ 2.7 GHz)',
          computeUnits: 12,
          cores: '8c / 16t',
          boostClock: '3.3 – 5.1 GHz',
          tdpRangeW: '15–30 W',
        },
        ramGb: 64,
        ramType: 'LPDDR5X-7500',
        storage: '2 TB PCIe 4.0 NVMe (M.2 2280)',
        priceUsd: 999,
        priceNote: '~$999–$1,099',
      },
    ],

    display: {
      sizeInches: 8.0,
      resolution: '1920 × 1200 (8:5 / 16:10, 283 PPI)',
      panelType: 'ips',
      refreshRateHz: 60,
      brightnessNits: '350 nits',
    },
    battery: {
      capacityWh: 65,
    },
    ergonomics: {
      weightGrams: 729,
      dimensions: '285 × 125 × 21 mm',
      materials: 'Plastic',
      notes: 'Built-in kickstand; integrated (non-detachable) controls',
    },
    connectivity: {
      ports: 'USB4 (40 Gbps) / USB-C 4.0; docking station available; microSD',
      usb4Thunderbolt: 'Yes — USB4',
      externalGpu: 'No OCuLink — USB4 (40 Gbps) for eGPU only',
      wifi: 'Wi-Fi 6 (per HandheldsArena; Droix review notes Wi-Fi 6E capability)',
      bluetooth: '5.0 / 5.2 (conflicting across listings)',
    },
    controls: {
      hallSticks: true,
      triggers: 'Hall Effect',
      layoutNote: 'Integrated controls with a built-in kickstand',
    },
    reliability: [
      {
        area: 'Software',
        detail: 'PC Gamer: "software is clunky" and the A1 Pro is "pricier than the ROG Ally"',
        severity: 'moderate',
      },
      {
        area: 'D-pad',
        detail: 'PC Gamer flagged a sticky D-pad',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'PC Gamer — AOKZOE A1 Pro review', url: 'https://www.pcgamer.com/aokzoe-a1-pro-review-performance/', kind: 'review' },
      { label: 'Droix — A1 Pro review (4.3/5)', url: 'https://droix.net/blogs/aokzoe-a1-pro-review-with-video/', kind: 'review' },
      { label: 'HandheldsArena — A1 Pro spec', url: 'https://handheldsarena.com/devices/aokzoe/a1-pro/', kind: 'review' },
    ],
    conflicts: [
      {
        field: 'wifi / bluetooth',
        detail: 'Droix\'s A1 Pro review notes Wi-Fi 6E capability; HandheldsArena\'s spec page says "Wi-Fi 6" — conflicting. Bluetooth is listed as both 5.0 and 5.2 across sources.',
      },
    ],

    summary:
      'The A1 Pro upgraded AOKZOE\'s original A1 to a Ryzen 7 7840U with Hall effect sticks, a 65 Wh battery and a built-in kickstand. Droix rated it 4.3/5 as "lower cost but high performance," while PC Gamer found it pricier than the ROG Ally with clunky software and a sticky D-pad. AOKZOE is now phasing it out — refurbished units are showing up on the official store.',
    pros: [
      'Hall effect sticks and triggers — an upgrade over the standard A1',
      'Large 65 Wh battery with a built-in kickstand',
      'Droix rated it 4.3/5 for its price-to-performance ratio',
    ],
    cons: [
      'PC Gamer found the software "clunky" and pricing above the ROG Ally',
      'Sticky D-pad reported in review',
      'Being phased out — official store now sells refurbished units',
    ],
  },
];
