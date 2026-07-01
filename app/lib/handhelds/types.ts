// Domain model for the handheld-gaming-PC knowledge layer.
//
// Cloned-and-adapted from the laptop engine (app/lib/laptops) — same
// family→configuration grain, but with handheld-specific shape: an APU (not a
// discrete GPU tier), an OS dimension (SteamOS vs Windows — a primary buyer
// facet), controls (hall-effect sticks/triggers/gyro), ergonomics (weight),
// and external-GPU (OCuLink / USB4) support.
//
// Unknown policy mirrors the source dataset: unknown fields are omitted, never
// inferred.

export type Unknownable<T> = T | 'unknown';

/** Operating system / launcher layer — a primary way buyers filter handhelds. */
export type OS = 'SteamOS' | 'Windows' | 'Linux' | 'Dual boot' | 'other';

export type PanelType = 'oled' | 'lcd' | 'ips' | 'other';

export type FormFactor = 'traditional' | 'convertible' | 'detachable';

export type DataCompleteness = 'seed' | 'full';

export interface Apu {
  vendor: 'AMD' | 'Intel' | 'other';
  model: string; // e.g. "Ryzen Z1 Extreme", "Core Ultra 7 258V"
  cpuArch?: string; // "Zen 4", "Lunar Lake"
  gpuArch?: string; // "RDNA 3 (12 CUs)", "Intel Arc 140V"
  computeUnits?: number;
  cores?: string; // "8c / 16t"
  boostClock?: string;
  tdpRangeW?: string; // "9–30 W"
  tdpModes?: string; // "Silent 10 W / Performance 15 W / Turbo 30 W"
}

/** One purchasable SKU within a family. `id` is the dataset row_id. */
export interface Configuration {
  id: string;
  label: string; // "Z1 Extreme · 24 GB · 1 TB"
  apu: Apu;
  ramGb?: number;
  ramType?: string;
  storage?: string; // "1 TB PCIe 4.0 NVMe"
  priceUsd?: number;
  priceNote?: string;
  asin?: string;
  statusNote?: string;
}

export interface Display {
  sizeInches?: number;
  resolution?: string;
  panelType: PanelType;
  refreshRateHz?: number | string;
  vrr?: string;
  brightnessNits?: string;
  colorGamut?: string;
  touch?: boolean;
}

export interface Battery {
  capacityWh?: number;
  chargerW?: number;
  lifeLowTdp?: string;
  lifeBalanced?: string;
  lifeHighTdp?: string;
}

export interface Thermals {
  fanCount?: number;
  coolingDesign?: string;
  noiseNote?: string;
  throttlingNote?: string;
}

export interface Controls {
  hallSticks?: Unknownable<boolean>;
  triggers?: string; // "Hall Effect", "Analog"
  gyro?: Unknownable<boolean>;
  trackpads?: string;
  backButtons?: number | string;
  haptics?: string;
  layoutNote?: string;
}

export interface Ergonomics {
  weightGrams?: number;
  dimensions?: string;
  materials?: string;
  notes?: string;
}

export interface Connectivity {
  ports?: string;
  usb4Thunderbolt?: string;
  /** OCuLink / USB4 external-GPU support — a key power-user facet. */
  externalGpu?: string;
  wifi?: string;
  bluetooth?: string;
}

export type Severity = 'low' | 'moderate' | 'high';

export interface ReliabilityIssue {
  area: string;
  detail: string;
  severity?: Severity;
}

export type SourceKind = 'manufacturer' | 'review' | 'benchmark' | 'reliability';

export interface SourceLink {
  label: string;
  url: string;
  kind?: SourceKind;
}

export interface ConflictNote {
  field: string;
  detail: string;
}

export interface Handheld {
  /** URL slug under /handhelds/<slug>. Unique across the dataset. */
  slug: string;
  manufacturer: string; // "ASUS"
  productLine: string; // "ROG Ally"
  name: string; // "ASUS ROG Ally X"
  os: OS;
  formFactor?: FormFactor;
  displaySizeInches?: number;
  releaseDate?: string;
  releaseYear?: number;
  targetMarket?: string;
  /** 2026 availability, e.g. "Active", "Legacy — still sold", "Delayed". */
  status2026?: string;
  /** Sourcing segment (provenance, not user-facing). */
  segment: string;
  completeness: DataCompleteness;
  lastVerified: string;

  configurations: Configuration[];

  display?: Display;
  battery?: Battery;
  thermals?: Thermals;
  controls?: Controls;
  ergonomics?: Ergonomics;
  connectivity?: Connectivity;
  reliability?: ReliabilityIssue[];
  sources?: SourceLink[];
  conflicts?: ConflictNote[];

  summary?: string;
  pros?: string[];
  cons?: string[];
}
