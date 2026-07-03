// The handheld dataset: segments concatenated and validated ONCE at module
// load. A malformed record throws here and fails the build. queries.ts is the
// only thing that should import this.

import { validateDataset } from '../validate';
import type { Handheld } from '../types';
import { VALVE_ASUS } from './valve-asus';
import { LENOVO_MSI } from './lenovo-msi';
import { ACER_ZOTAC } from './acer-zotac';
import { AYANEO_AYN } from './ayaneo-ayn';
import { GPD } from './gpd';
import { ONEX_AOKZOE } from './onex-aokzoe';

export const HANDHELDS: Handheld[] = validateDataset([
  ...VALVE_ASUS,
  ...LENOVO_MSI,
  ...ACER_ZOTAC,
  ...AYANEO_AYN,
  ...GPD,
  ...ONEX_AOKZOE,
]);
