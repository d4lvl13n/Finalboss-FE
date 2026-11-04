import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// A production build must read current CMS data instead of shipping an old
// development/build fetch snapshot. Preserve the compiler and webpack caches.
const fetchCache = fileURLToPath(new URL('../.next/cache/fetch-cache', import.meta.url));
rmSync(fetchCache, { recursive: true, force: true });
console.log('Cleared the Next.js fetch cache before reading current CMS content.');
