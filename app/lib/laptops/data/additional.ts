// Boutique / regional manufacturers — enriched segment.
// Source: gaming-laptop-database-2026.md, "Additional manufacturers detailed
// tables" (Table 1 — Boutique/DTC, Table 2 — European/Regional Clevo-based,
// Table 3 — Secondary OEM families). These are low-volume boutique and
// regional models with sparser sourcing than the mainstream segments; Unknown
// values are omitted, not inferred. Where a model offers a GPU range the
// headline config keeps the top GPU and notes the range in statusNote.

import type { LaptopFamily } from '../types';
import { nvidia } from './_seed';

const VERIFIED = '2026-06-29';

export const ADDITIONAL: LaptopFamily[] = [
  // Table 1 — Boutique / Direct-to-Consumer ---------------------------------
  {
    slug: 'eluktronics-hydroc-16-g2',
    manufacturer: 'Eluktronics',
    productLine: 'HYDROC',
    name: 'Eluktronics HYDROC-16 G2',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Boutique DTC (liquid-cooled)',
    segment: 'Additional',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-070',
        label: 'RTX 5090 · Core Ultra 9 275HX / 290HX Plus',
        cpu: {
          vendor: 'Intel',
          model: 'Core Ultra 9 275HX / 290HX Plus',
          architecture: 'Arrow Lake-HX',
          cores: 24,
          boostClock: '5.4–5.5 GHz',
        },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175, tgpNote: '175 W (MAX-P)' },
        priceUsd: 2599,
        priceNote: 'from (RTX 5080 base config)',
        statusNote: 'Also offered with RTX 5080. Boutique direct-to-consumer brand.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (QHD)',
      panelType: 'ips',
      refreshRateHz: 300,
      brightnessNits: '500 nit (IPS) / 1,000 nit (Mini-LED option)',
      options: 'IPS-Type or Mini-LED (option)',
    },
    memory: {
      installed: '48 GB DDR5-6400',
      type: 'DDR5 SO-DIMM (6400 MT/s)',
      maxGb: 64,
      upgradeable: true,
      slots: 2,
      soldered: false,
      ssdSlots: 2,
      storageUpgradeable: '2 TB (PCIe Gen 5 primary + Gen 4 secondary)',
    },
    thermals: {
      throttlingNote: 'HYDROC closed-loop liquid-cooling system (brand signature); MUX switch stated on product page.',
    },
    battery: { capacityWh: '80 Wh standard / 99.8 Wh extended option' },
    connectivity: {
      thunderbolt: 'Thunderbolt 4 (×1, iGPU-connected)',
      wifi: 'Wi-Fi 7 (Intel BE200)',
    },
    build: { materials: 'Aluminum', weightKg: '2.83 kg (6.23 lb)' },
    reliability: [
      {
        area: 'Independent testing',
        detail: 'No independent review found at research time; specifications are manufacturer-stated. A clean Windows 11 install with no bloatware is a stated selling point. 1-year Eluktronics limited warranty.',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'Eluktronics HYDROC-16 product page', url: 'https://www.eluktronics.com/HYDROC-16', kind: 'manufacturer' },
    ],
    conflicts: [
      { field: 'Weight', detail: 'Product page lists 6.23 lb; some resellers show 6.4 lb — likely the extended (99.8 Wh) battery option.' },
    ],
    summary:
      "Eluktronics' liquid-cooled flagship pairs an RTX 5090 (175 W MAX-P) with a 48 GB / 300 Hz QHD package and a clean, bloatware-free Windows install. The HYDROC closed-loop cooling and aluminum chassis are the headline, with pricing from $2,599 for the RTX 5080 base config. The catch for buyers: as a boutique direct-to-consumer brand it had no independent review at research time, so the specs are largely manufacturer-stated.",
  },

  {
    slug: 'eluktronics-rp-16',
    manufacturer: 'Eluktronics',
    productLine: 'RP',
    name: 'Eluktronics RP-16',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Boutique DTC',
    segment: 'Additional',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-071',
        label: 'RTX 5070 · Ryzen 9 8945HX',
        cpu: {
          vendor: 'AMD',
          model: 'Ryzen 9 8945HX',
          architecture: 'Zen 4',
          cores: 16,
          threads: 32,
          boostClock: '5.4 GHz',
        },
        gpu: { ...nvidia('GeForce RTX 5070 Laptop', 'rtx-5070'), tgpWatts: 100, tgpNote: '100 W + 15 W Dynamic Boost' },
        priceUsd: 1499,
        priceNote: 'from (RTX 5060 base config)',
        statusNote: 'Also offered with RTX 5060.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (QHD)',
      panelType: 'ips',
      refreshRateHz: 180,
      brightnessNits: '500 nit',
    },
    memory: {
      installed: '32 GB DDR5',
      type: 'DDR5 SO-DIMM',
      maxGb: 64,
      upgradeable: true,
      soldered: false,
      storageUpgradeable: '2 TB NVMe',
    },
    battery: { capacityWh: 80 },
    connectivity: {
      usbC: 'USB-C 3.2 Gen 2 (no Thunderbolt)',
      wifi: 'Wi-Fi 6E (Realtek RZ616)',
    },
    build: { materials: 'Resin (polycarbonate)', weightKg: '2.28 kg (5.02 lb)' },
    reliability: [
      {
        area: 'Build & connectivity',
        detail: 'Resin (polycarbonate) chassis rather than metal — lighter at 2.28 kg but less premium. No Thunderbolt (USB-C 3.2 Gen 2 only) and Wi-Fi 6E rather than Wi-Fi 7.',
        severity: 'moderate',
      },
      {
        area: 'Independent testing',
        detail: 'No independent review found at research time; clean bloatware-free Windows install and 1-year limited warranty stated by Eluktronics.',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'Eluktronics RP-16 product page', url: 'https://www.eluktronics.com/RP-16', kind: 'manufacturer' },
    ],
    conflicts: [
      { field: 'Chassis material', detail: 'Eluktronics states "Resin" (polycarbonate/ABS); some resellers describe it as "plastic/polycarbonate."' },
    ],
    summary:
      "A lighter, more affordable Eluktronics built on AMD's Ryzen 9 8945HX with an RTX 5070 capped at 100 W (+15 W Dynamic Boost). At 2.28 kg with a resin (polycarbonate) chassis it trades premium materials for portability and a $1,499 RTX 5060 starting price, and it forgoes Thunderbolt (USB-C 3.2 Gen 2 only) and Wi-Fi 7. Like its sibling, it had no independent review at research time.",
  },

  {
    slug: 'maingear-super-16',
    manufacturer: 'Maingear',
    productLine: 'Super',
    name: 'Maingear Super 16',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Boutique (Clevo-based)',
    segment: 'Additional',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-072',
        label: 'RTX 5070 Ti · Core Ultra 9 275HX',
        cpu: {
          vendor: 'Intel',
          model: 'Core Ultra 9 275HX',
          architecture: 'Arrow Lake-HX',
          cores: 24,
          boostClock: '5.4 GHz',
        },
        gpu: { ...nvidia('GeForce RTX 5070 Ti Laptop', 'rtx-5070-ti'), tgpWatts: 140 },
        priceUsd: 2299,
        priceNote: 'from',
        statusNote: 'Clevo-based barebone; review conflict noted on as-tested price.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (QHD+)',
      panelType: 'ips',
      refreshRateHz: 300,
    },
    memory: {
      installed: '32 GB DDR5-5600',
      type: 'DDR5 SO-DIMM (5600 MT/s)',
      maxGb: 96,
      upgradeable: true,
      soldered: false,
      storageUpgradeable: '2 TB PCIe Gen 5 (Samsung 9100 Pro)',
    },
    connectivity: { wifi: 'Wi-Fi 7 (Killer DoubleShot Pro)' },
    build: { materials: 'Clevo OEM plastic/metal hybrid' },
    reliability: [
      {
        area: 'ODM transparency',
        detail: 'Confirmed Clevo OEM barebone — PCWorld states "chassis made by Clevo." Maingear does not disclose the ODM in its marketing, so you are paying a boutique premium over the underlying shared design.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'Maingear Super 16 product page', url: 'https://maingear.com/collections/super-16', kind: 'manufacturer' },
      { label: 'NotebookCheck launch article', url: 'https://www.notebookcheck.net/Maingear-launches-the-Super-16-gaming-laptop-with-Core-Ultra-9-275HX-RTX-5070-Ti-and-300Hz-display.1104402.0.html', kind: 'review' },
      { label: 'PCWorld review — "Power with caveats"', url: 'https://www.pcworld.com/article/3020028/maingear-super-16-review.html', kind: 'review' },
    ],
    conflicts: [
      { field: 'Price', detail: 'PCWorld review price ($2,758 as reviewed) is higher than Maingear direct ($2,299–$2,399) — likely reflects optional upgrades. NotebookCheck cites $2,399 base.' },
    ],
    summary:
      'A US-boutique Clevo barebone dressed up by Maingear: Core Ultra 9 275HX, a 140 W RTX 5070 Ti and a 300 Hz QHD+ panel from around $2,299. PCWorld\'s "power with caveats" verdict confirms the Clevo chassis — which Maingear doesn\'t disclose in marketing — and noted the as-reviewed price climbs with upgrades. Capable hardware, but you are paying a boutique premium over the underlying ODM design.',
  },

  {
    slug: 'eurocom-raptor-x18',
    manufacturer: 'Eurocom',
    productLine: 'Raptor',
    name: 'Eurocom Raptor X18',
    displaySizeInches: 18,
    releaseYear: 2026,
    targetMarket: 'Mobile workstation / gaming',
    segment: 'Additional',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-073',
        label: 'RTX 5090 · Core Ultra 9 275HX',
        cpu: {
          vendor: 'Intel',
          model: 'Core Ultra 9 275HX',
          architecture: 'Arrow Lake-HX',
          cores: 24,
          boostClock: '5.4 GHz',
        },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175 },
        priceUsd: 5504,
        priceNote: 'from (base RTX 5090)',
        statusNote: 'Also offered with RTX 5080.',
      },
    ],
    display: {
      sizeInches: 18,
      resolution: '2560×1600 (QHD) or 3840×2400 (UHD)',
      panelType: 'ips',
      refreshRateHz: '240 Hz (QHD) / 200 Hz (UHD)',
      options: 'IPS or Mini-LED (model-dependent)',
    },
    memory: {
      installed: '32 GB DDR5',
      type: 'DDR5 SO-DIMM (4× slots)',
      maxGb: 256,
      upgradeable: true,
      slots: 4,
      soldered: false,
      storageUpgradeable: 'Up to 32 TB (RAID)',
    },
    thermals: {
      throttlingNote: 'MUX switch (NVIDIA Advanced Optimus / Optimus Dynamic).',
    },
    connectivity: { thunderbolt: 'Thunderbolt 5 (×2)' },
    build: { materials: 'Aluminum-magnesium alloy', weightKg: '3.6 kg (7.9 lb)' },
    reliability: [
      {
        area: 'Independent testing',
        detail: 'At research time the only performance data came from Eurocom\'s own benchmark lab (primary source), not an independent third-party reviewer.',
        severity: 'moderate',
      },
      {
        area: 'Weight',
        detail: 'A heavy 18" desktop-replacement class chassis (3.6 kg / 7.9 lb), with OS options spanning Windows, Windows Server 2025 and Linux Ubuntu.',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'Eurocom Raptor X18 product page', url: 'https://eurocom.com/product/raptor-x18', kind: 'manufacturer' },
      { label: 'Eurocom Raptor X18 spec sheet', url: 'https://eurocom.com/ec/specs(526)RaptorX18', kind: 'manufacturer' },
      { label: 'Eurocom benchmark lab (primary source)', url: 'https://eurocom.com/journal/raptor-x18-benchmarks', kind: 'benchmark' },
    ],
    conflicts: [
      { field: 'Weight', detail: 'Product page lists 8.4 lb; the spec sheet lists 7.9 lb / 3.6 kg — the 8.4 lb figure likely includes the power brick.' },
    ],
    summary:
      "A true 18\" mobile workstation: a 175 W RTX 5090, Advanced Optimus MUX, dual Thunderbolt 5 and extreme expandability — up to 256 GB RAM across four SO-DIMMs and as much as 32 TB of RAID storage, with Linux and Windows Server options. It is heavy (3.6 kg) and expensive (from $5,504), and the only performance data at research time came from Eurocom's own benchmark lab rather than an independent reviewer. A niche pick for engineers and content pros more than mainstream gamers.",
  },

  {
    slug: 'origin-pc-eon16-x-v2',
    manufacturer: 'Origin PC',
    productLine: 'EON',
    name: 'Origin PC EON16-X V2',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'Boutique (Corsair/Origin)',
    segment: 'Additional',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-074',
        label: 'RTX 5090 · Core Ultra 9 275HX / 290HX Plus',
        cpu: {
          vendor: 'Intel',
          model: 'Core Ultra 9 275HX / 290HX Plus',
          architecture: 'Arrow Lake-HX',
          cores: 24,
          boostClock: '5.4–5.5 GHz',
        },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175 },
        priceUsd: 3191,
        priceNote: '~ (RTX 5080 base, Corsair listing)',
        statusNote: 'Also offered with RTX 5080. V2 adds the RTX 5090 option and Intel 290HX Plus.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (QHD+)',
      panelType: 'ips',
      refreshRateHz: 300,
      brightnessNits: '500 nit (max)',
      colorGamut: '100% sRGB',
    },
    memory: {
      installed: '32 GB DDR5',
      type: 'DDR5 SO-DIMM',
      maxGb: 96,
      upgradeable: true,
      soldered: false,
      storageUpgradeable: '2 TB M.2 NVMe',
    },
    battery: { capacityWh: 80 },
    connectivity: { thunderbolt: 'Thunderbolt 4 (×2)', wifi: 'Wi-Fi 7' },
    build: { materials: 'Aluminum alloy', weightKg: '2.22 kg (4.9 lb)' },
    reliability: [
      {
        area: 'Value',
        detail: 'How-To Geek\'s verdict — "power gaming at a premium" — sums it up: strong performance with boutique pricing. Backed by a 2-year warranty per the Corsair listing.',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'Origin PC EON16-X V2 page', url: 'https://www.originpc.com/gaming/laptops/eon16-x-v2/', kind: 'manufacturer' },
      { label: 'Corsair/Origin EON16-X RTX 5080 listing', url: 'https://www.corsair.com/us/en/p/gaming-computers/or-9050916-na/origin-pc-eon16-x-gaming-laptop-intel-core-ultra-9-275hx-geforce-rtx-5080-32gb-ddr5-2tb-m2-ssd-win11-home-or-9050916-na', kind: 'manufacturer' },
      { label: 'How-To Geek review — "Power Gaming at a Premium"', url: 'https://www.howtogeek.com/origin-pc-eon16-x-laptop-review/', kind: 'review' },
    ],
    conflicts: [
      { field: 'Price', detail: 'Corsair lists the EON16-X (RTX 5080, 32 GB, 2 TB) at ~$3,191; originpc.com does not display pricing without building a configuration, so the same machine is priced differently across the two storefronts.' },
    ],
    summary:
      'Now under Corsair, Origin PC\'s EON16-X V2 is a relatively light (2.22 kg) aluminum 16" offering RTX 5080 or 5090 at 175 W, a 300 Hz QHD+ panel and a 2-year warranty. How-To Geek summed it up as "power gaming at a premium" — strong performance with boutique pricing, from roughly $3,191 for the RTX 5080 via Corsair. Note that pricing differs between originpc.com and corsair.com, since the same machine is sold through both.',
  },

  // Table 2 — European / Regional Clevo-based -------------------------------
  {
    slug: 'medion-erazer-beast-16-x1',
    manufacturer: 'Medion Erazer',
    productLine: 'Beast',
    name: 'Medion Erazer Beast 16 X1 Ultimate',
    displaySizeInches: 16,
    releaseYear: 2026,
    targetMarket: 'European regional',
    segment: 'Additional',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-075',
        label: 'RTX 5090 · Core Ultra 9 275HX',
        cpu: {
          vendor: 'Intel',
          model: 'Core Ultra 9 275HX',
          architecture: 'Arrow Lake-HX',
          cores: 24,
          boostClock: '5.4 GHz',
        },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175 },
        statusNote:
          'Primary config is RTX 5080; RTX 5090 variant priced higher. Europe-only: RTX 5080 model £2,199.99 (UK) / €3,199.95 (DE). Not officially sold in North America.',
      },
    ],
    display: {
      sizeInches: 16,
      resolution: '2560×1600 (QHD+)',
      panelType: 'ips',
      refreshRateHz: 300,
      options: 'Matte IPS LCD',
    },
    memory: {
      installed: '32 GB DDR5',
      type: 'DDR5',
      storageUpgradeable: '2 TB PCIe Gen 5×4 SSD',
    },
    connectivity: { usb4: 'USB4 (per class)' },
    build: { materials: 'Aluminum' },
    reliability: [
      {
        area: 'Availability & support',
        detail: 'Sold mainly in Germany, the UK and the Netherlands; not officially available in North America, so US support and warranty are impractical. 2-year warranty per UK retailer listings.',
        severity: 'moderate',
      },
      {
        area: 'Independent testing',
        detail: 'Only retailer product listings were found at research time; no major independent review.',
        severity: 'low',
      },
    ],
    sources: [
      { label: 'Medion DE product page — Beast 16 X1 Ultimate', url: 'https://www.medion.com/de/shop/p/high-end-gaming-notebooks-medion-erazer-beast-16-x1-ultimate-high-end-gaming-laptop-intel-core-ultra-9-prozessor-275hx-windows-11-home-40-6-cm-16--qhd-display-mit-300-hz-rtx-5080-2-tb-pcie-ssd-32-gb-ram-30039629A1', kind: 'manufacturer' },
      { label: 'Medion Erazer International page', url: 'https://www.medion.com/erazer/int/home-english.html', kind: 'manufacturer' },
      { label: 'Laptop Outlet UK product listing', url: 'https://www.laptopoutlet.co.uk/medion-erazer-beast-16-x1-30039643.html' },
    ],
    conflicts: [
      { field: 'Price', detail: 'Medion Germany lists €3,199.95; UK Laptop Outlet lists £2,199.99 (~$2,800) for the RTX 5080 model — a significant UK vs DE discrepancy (EU pricing includes 19% VAT). The RTX 5090 variant is priced higher.' },
    ],
    summary:
      "A Lenovo-owned Medion flagship sold mainly in Germany, the UK and the Netherlands — not officially in North America. It pairs a Core Ultra 9 275HX and a 175 W RTX 5080 (RTX 5090 optional) with a matte 300 Hz QHD+ IPS panel, 2 TB of Gen 5 storage and an aluminum chassis. Pricing is European and inconsistent across markets (£2,199.99 UK vs €3,199.95 DE), and independent testing was limited to retailer listings at research time.",
  },

  {
    slug: 'medion-erazer-beast-18-x1',
    manufacturer: 'Medion Erazer',
    productLine: 'Beast',
    name: 'Medion Erazer Beast 18 X1',
    displaySizeInches: 18,
    releaseYear: 2026,
    targetMarket: 'European regional',
    segment: 'Additional',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-076',
        label: 'RTX 5090 · Core Ultra 9 275HX',
        cpu: {
          vendor: 'Intel',
          model: 'Core Ultra 9 275HX',
          architecture: 'Arrow Lake-HX',
          cores: 24,
          boostClock: '5.4 GHz',
        },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175 },
        statusNote:
          'Primary config is RTX 5080 (240 Hz QHD); RTX 5090 variant priced higher. Europe-only: ~€3,700 (RTX 5080) / ~€5,650 (RTX 5090). Not officially sold in North America.',
      },
    ],
    display: {
      sizeInches: 18,
      resolution: '2560×1600 (QHD+)',
      panelType: 'ips',
      refreshRateHz: 240,
      colorGamut: '100% sRGB',
    },
    memory: {
      installed: '32 GB DDR5',
      type: 'DDR5',
      storageUpgradeable: '2 TB PCIe SSD',
    },
    battery: { capacityWh: 99.8 },
    build: { materials: 'Aluminum' },
    reliability: [
      {
        area: 'Availability & support',
        detail: 'Europe-only (DE/UK/NL); not officially sold in North America. 2-year warranty per UK retailer listings.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'Medion DE product page — Beast 18 X1', url: 'https://www.medion.com/de/shop/p/high-end-gaming-notebooks-medion-erazer-beast-18-x1-high-end-gaming-laptop-intel-core-ultra-9-prozessor-275hx-windows-11-home-45-7-cm-18--qhd-display-100-srgb-mit-240-hz-rtx-5080-2-tb-pcie-ssd-32-gb-ram-30039669A1', kind: 'manufacturer' },
      { label: 'NotebookCheck (Turkish) — Beast 18 X1 review', url: 'https://www.notebookcheck-tr.com/Medion-Erazer-Beast-18-X1-dizuestue-bilgisayar-incelemesi-RTX-5080-oyun-devinde-nasil-bir-performans-sergiliyor.1022672.0.html', kind: 'review' },
      { label: 'TechRadar (NL) — Beast 18 X1 review', url: 'https://global.techradar.com/nl-nl/computing/gaming-laptops/erazer-beast-18-x1-review-nl', kind: 'review' },
      { label: 'Currys UK listing', url: 'https://www.currys.co.uk/products/medion-erazer-beast-18-x1-18-gaming-laptop-intel-core-ultra-9-rtx-5080-2-tb-ssd-10278099.html' },
    ],
    conflicts: [
      { field: 'Price', detail: 'NotebookCheck Turkish quotes ~€3,700 for the RTX 5080; a YouTube summary cites $3,499 USD; the RTX 5090 variant is listed at ~€5,650. Multiple currencies/markets make all USD figures converted estimates.' },
    ],
    summary:
      "The 18\" sibling steps up to a larger 240 Hz QHD+ (100% sRGB) panel and a 99.8 Wh battery while keeping the 275HX and 175 W RTX 5080 (RTX 5090 optional) core. Like the 16, it is a Europe-only Medion (DE/UK/NL), but it did draw independent coverage from NotebookCheck and TechRadar. Pricing is genuinely ambiguous — quoted around €3,700 for the RTX 5080 and ~€5,650 for the RTX 5090 — so cross-currency conversions are estimates.",
  },

  // Table 3 — Secondary OEM family (collector edition) ----------------------
  {
    slug: 'msi-titan-18-hx-dragon-edition',
    manufacturer: 'MSI',
    productLine: 'Titan Dragon Edition',
    name: 'MSI Titan 18 HX Dragon Edition (Draco Epic)',
    displaySizeInches: 18,
    releaseYear: 2026,
    targetMarket: 'Collector / limited edition',
    segment: 'Additional',
    completeness: 'full',
    lastVerified: VERIFIED,
    configurations: [
      {
        id: 'G26-077',
        label: 'RTX 5090 · Core Ultra 9 285HX',
        cpu: {
          vendor: 'Intel',
          model: 'Core Ultra 9 285HX',
          architecture: 'Arrow Lake-HX',
          cores: 24,
          boostClock: '5.5 GHz',
        },
        gpu: { ...nvidia('GeForce RTX 5090 Laptop', 'rtx-5090'), tgpWatts: 175 },
        priceUsd: 7000,
        priceNote: 'from (Dragon Edition collector; up to ~$12,000 by config)',
        statusNote: 'Also offered with RTX 5080. Limited collector variant of the Titan 18 platform; standard (non-Dragon) Titan 18 starts ~$3,999 for RTX 5080.',
      },
    ],
    display: {
      sizeInches: 18,
      resolution: '3840×2400 (UHD+)',
      panelType: 'mini-led',
      refreshRateHz: 240,
      hdr: 'HDR 1000 (per MSI store listing)',
    },
    memory: {
      installed: '64 GB DDR5-6400',
      type: 'DDR5 SO-DIMM (6400 MT/s)',
      maxGb: 128,
      upgradeable: true,
      soldered: false,
      storageUpgradeable: 'Up to 20 TB (2 TB Gen5 + 2 TB Gen4 base)',
    },
    thermals: {
      throttlingNote: 'Shares the 175 W Titan 18 cooling platform; MUX switch. Runs hot and loud at full draw.',
    },
    battery: { capacityWh: 99.9 },
    connectivity: { thunderbolt: 'Thunderbolt 5 (×2)', wifi: 'Wi-Fi 7' },
    build: {
      materials: 'Magnesium-aluminum alloy',
      weightKg: '~4.2 kg (~9.3 lb)',
      buildQuality: 'Acid-etched "Dragon Edition" collector chassis',
    },
    reliability: [
      {
        area: 'Value / pricing',
        detail: 'The collector "Dragon Edition" with acid-etched chassis commands a large premium (~$7,000–$12,000) over a standard Titan 18 (~$3,999 for the RTX 5080) for largely cosmetic differences.',
        severity: 'moderate',
      },
      {
        area: 'Thermals & weight',
        detail: 'Built on the 175 W Titan 18 platform — heavy (~4.2 kg / 9.3 lb) and runs hot and loud at full draw, like the standard model.',
        severity: 'moderate',
      },
    ],
    sources: [
      { label: 'MSI Titan 18 HX Dragon Edition (Draco Epic) page', url: 'https://www.msi.com/Laptop/Titan-18-HX-Dragon-Edition-Draco-Epic-A2WX', kind: 'manufacturer' },
      { label: 'MSI Computex 2026 lineup blog', url: 'https://us.msi.com/blog/msi-computex-2026-gaming-laptop-lineup-from-ultimate-performance-to-everyday-gaming', kind: 'manufacturer' },
      { label: 'YouTube — Dragon Edition "Norse Myth" review', url: 'https://www.youtube.com/watch?v=wb-keRhvQGU', kind: 'review' },
    ],
    conflicts: [
      { field: 'Price', detail: '"Dragon Edition" pricing varies widely by config and retailer — YouTube reviews cite $7,000 to $12,000. It is a separate, much more expensive line from the standard Titan 18 (non-Dragon base ~$3,999 for RTX 5080).' },
    ],
    summary:
      'A limited-run collector\'s Titan 18: the full 175 W RTX 5090, a 4K-class 240 Hz Mini-LED (HDR 1000) panel, 64 GB RAM expandable to 128 GB, dual Thunderbolt 5 and an acid-etched "Dragon Edition" chassis. The catch is the price — roughly $7,000 to $12,000 depending on config, versus around $3,999 for a standard Titan 18 with an RTX 5080. You are paying a steep premium for largely cosmetic exclusivity on top of an already hot, heavy (~4.2 kg) flagship platform.',
  },
];
