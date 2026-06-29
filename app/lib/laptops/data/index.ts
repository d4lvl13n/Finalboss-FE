// The dataset: all segments concatenated and validated ONCE at module load.
// If any record violates the invariants, the import throws and the build fails
// loudly — a broken dataset never ships.
//
// `queries.ts` is the only thing that should import this; pages go through
// queries so the storage backend (today: this file) can change later.

import { validateDataset } from '../validate';
import type { LaptopFamily } from '../types';
import { ASUS_LENOVO } from './asus-lenovo';
import { MSI_GIGABYTE } from './msi-gigabyte';
import { DELL_HP_RAZER } from './dell-hp-razer';
import { ACER_EU } from './acer-eu';
import { ADDITIONAL } from './additional';

export const LAPTOPS: LaptopFamily[] = validateDataset([
  ...ASUS_LENOVO,
  ...MSI_GIGABYTE,
  ...DELL_HP_RAZER,
  ...ACER_EU,
  ...ADDITIONAL,
]);
