// Domain model for the gaming-laptop knowledge layer.
//
// Grain: the SEO/marketing unit is a `LaptopFamily` (one page per family).
// The purchasable unit is a `Configuration` (a CPU/GPU/price SKU) — a family
// has one or more, rendered as a selector on the family page. This is the
// "family vs configuration" split: collapse 5080/5090 variants onto ONE page
// instead of shipping near-duplicate pages.
//
// Unknown policy: the source dataset preserves "Unknown" and never infers.
// We mirror that — optional fields are simply omitted when unknown, and the
// few tri-state spec fields use `Unknownable` so "Unknown" stays distinct
// from "No".

/** A value that may be explicitly unknown (distinct from absent or false). */
export type Unknownable<T> = T | 'unknown';

/** Coarse GPU bucket — drives "best RTX 50xx" category pages and filtering. */
export type GpuTier =
  | 'rtx-5050'
  | 'rtx-5060'
  | 'rtx-5070'
  | 'rtx-5070-ti'
  | 'rtx-5080'
  | 'rtx-5090'
  | 'igpu'
  | 'other';

/** Coarse panel bucket — drives "best OLED / Mini LED" category pages. */
export type PanelType = 'oled' | 'mini-led' | 'ips' | 'igpu-shared' | 'other';

/**
 * How complete a family's record is:
 *  - 'seed' = identity + configurations only (from the master index)
 *  - 'full' = all spec sub-objects enriched from the detailed segment tables
 * Pages branch on this to render gracefully and to drive enrichment backlog.
 */
export type DataCompleteness = 'seed' | 'full';

export interface Cpu {
  vendor: 'Intel' | 'AMD';
  model: string; // e.g. "Core Ultra 9 290HX Plus"
  architecture?: string;
  cores?: number;
  threads?: number;
  boostClock?: string;
}

export interface Gpu {
  vendor: 'NVIDIA' | 'AMD';
  model: string; // e.g. "GeForce RTX 5080 Laptop"
  tier: GpuTier;
  vramGb?: number;
  vramType?: string;
  /** Max TGP in watts (manual mode if a turbo/manual split exists). */
  tgpWatts?: number;
  tgpNote?: string;
}

/** One purchasable SKU within a family. `id` is the master_row_id (G26-xxx). */
export interface Configuration {
  id: string;
  label: string; // human label, e.g. "RTX 5080 · Core Ultra 9 290HX Plus"
  cpu: Cpu;
  gpu: Gpu;
  /** Starting / representative street price in USD, valid as of `lastVerified`. */
  priceUsd?: number;
  /** Qualifier shown next to the price, e.g. "from", "street", "~". */
  priceNote?: string;
  /** Amazon ASIN → direct affiliate link. Absent ⇒ generic laptops box. */
  asin?: string;
  statusNote?: string;
}

export interface Display {
  sizeInches?: number;
  resolution?: string;
  panelType: PanelType;
  refreshRateHz?: number | string;
  brightnessNits?: string;
  hdr?: string;
  colorGamut?: string;
  gsyncVrr?: string;
  options?: string; // e.g. "OLED or IPS"
}

export interface Memory {
  installed?: string;
  type?: string;
  maxGb?: number;
  upgradeable?: boolean;
  slots?: number;
  soldered?: boolean;
  ssdSlots?: number;
  storageUpgradeable?: string;
}

export interface Thermals {
  vaporChamber?: Unknownable<boolean>;
  fanCount?: number;
  liquidMetal?: Unknownable<boolean>;
  noiseGamingDb?: string;
  cpuTempNote?: string;
  gpuTempNote?: string;
  throttlingNote?: string;
}

export interface Battery {
  capacityWh?: number | string;
  officeHours?: string;
  gamingHours?: string;
  usbCharging?: string;
  fastCharging?: string;
}

export interface Connectivity {
  ethernet?: string;
  hdmi?: string;
  usbA?: string;
  usbC?: string;
  usb4?: string;
  thunderbolt?: string;
  sdReader?: string;
  wifi?: string;
  bluetooth?: string;
}

export interface Build {
  materials?: string;
  weightKg?: string;
  thickness?: string;
  keyboard?: string;
  rgb?: string;
  buildQuality?: string;
  repairability?: string;
  upgradeabilityScore?: string;
}

export type Severity = 'low' | 'moderate' | 'high';

export interface ReliabilityIssue {
  area: string; // e.g. "Coil whine", "Thermals", "Wi-Fi"
  detail: string;
  severity?: Severity;
}

export type SourceKind = 'manufacturer' | 'review' | 'benchmark' | 'reliability';

export interface SourceLink {
  label: string;
  url: string;
  kind?: SourceKind;
}

/** A recorded data conflict — surfaced on-page as a trust/E-E-A-T signal. */
export interface ConflictNote {
  field: string;
  detail: string;
}

export interface LaptopFamily {
  /** URL slug under /gaming-laptops/<slug>. Unique across the dataset. */
  slug: string;
  manufacturer: string; // "ASUS"
  productLine: string; // "ROG Strix"
  name: string; // "ASUS ROG Strix G16 (2026)"
  displaySizeInches?: number;
  releaseYear?: number;
  releaseDate?: string;
  targetMarket?: string;
  /** Sourcing segment this family came from (provenance, not user-facing). */
  segment: string;
  completeness: DataCompleteness;
  /** ISO date the data was last verified — shown on-page, drives freshness. */
  lastVerified: string;

  configurations: Configuration[];

  // Enriched spec sub-objects (present when completeness === 'full').
  display?: Display;
  memory?: Memory;
  thermals?: Thermals;
  battery?: Battery;
  connectivity?: Connectivity;
  build?: Build;
  reliability?: ReliabilityIssue[];
  sources?: SourceLink[];
  conflicts?: ConflictNote[];

  /** One-paragraph editorial synthesis (the part competitors can't clone). */
  summary?: string;
}
