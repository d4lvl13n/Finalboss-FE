#!/usr/bin/env python3
"""Import public cooking data and rename/compress its images for FinalBoss.

Requires Pillow. Downloads are cached, rate limited and recorded in the research
manifest. Run scripts/prepare-totk-recipes.cjs afterwards to verify recipe inputs.
"""
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from io import BytesIO
from pathlib import Path
import json
import ssl
import time
import urllib.request
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://totk.wism.fr'
CACHE = Path('/tmp/finalboss-totk-recipes-cache')
DEST = ROOT / 'app/lib/totk-recipes'
IMAGES = ROOT / 'public/totk-recipes'
for p in (CACHE, DEST, IMAGES):
    p.mkdir(parents=True, exist_ok=True)
CONTEXT = ssl.create_default_context(cafile='/etc/ssl/cert.pem')


def fetch(path):
    url = BASE + path
    cached = CACHE / sha256(url.encode()).hexdigest()
    if not cached.exists():
        time.sleep(.25)
        request = urllib.request.Request(url, headers={'User-Agent': 'FinalBoss catalogue import/1.0'})
        with urllib.request.urlopen(request, context=CONTEXT, timeout=40) as r:
            body = r.read()
        cached.write_bytes(body)
    return cached.read_bytes()


data_bytes = fetch('/js/cookdata.json')
data = json.loads(data_bytes)
(DEST / 'engine-data.json').write_text(json.dumps(data, separators=(',', ':')) + '\n')
engine = fetch('/js/cook.js').decode().replace('\r\n', '\n')
# Keep arithmetic and original code comments, replace only browser/CommonJS glue.
engine = engine.replace('(function (global) {', '')
engine = engine.replace('  global.TotKCookSim = TotKCookSim;\n', '')
engine = engine.replace("  if (typeof module !== 'undefined' && module.exports) module.exports = TotKCookSim;\n", '')
engine = engine.replace("})(typeof window !== 'undefined' ? window : globalThis);", 'export default TotKCookSim;')
(DEST / 'engine.js').write_text(engine)

jobs = []
for number, filename in data['mealIcons'].items():
    # Source incorrectly labels recipe 200's file as "gourmet"; keep the recipe
    # identity from the numbered card, not from the filename.
    actor = data['cards'][int(number) - 1]
    name = data['lang']['Meal'].get(actor + '_Name')
    if not name:
        effect = actor.removeprefix('Item_Cook_C_17_')
        name = data['lang']['Effect'][effect + '_Name'] + ' Elixir'
    import re
    import unicodedata
    slug = re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode().lower()).strip('-')
    jobs.append((f'/images/cooking/meal/{filename}', f'zelda-totk-{slug}-{number}.webp', 'meal', number))
for item in data['ingredients']:
    if item['img']:
        jobs.append((f"/images/cooking/ing/{item['img']}", f"zelda-totk-ingredient-{item['slug']}.webp", 'ingredient', item['actor']))


def download(job):
    path, filename, kind, identity = job
    body = fetch(path)
    with Image.open(BytesIO(body)) as original:
        image = original.convert('RGBA')
        image.thumbnail((256, 256), Image.Resampling.LANCZOS)
        image.save(IMAGES / filename, 'WEBP', quality=90, method=6)
        dimensions = image.size
    return {'kind': kind, 'id': identity, 'source': BASE + path,
            'path': '/totk-recipes/' + filename, 'width': dimensions[0], 'height': dimensions[1],
            'sourceSha256': sha256(body).hexdigest(), 'bytes': (IMAGES / filename).stat().st_size}


records = []
with ThreadPoolExecutor(max_workers=3) as pool:
    for result in pool.map(download, jobs):
        records.append(result)
        if len(records) % 50 == 0:
            print(f'Imported {len(records)}/{len(jobs)} images', flush=True)
manifest = {'importedAt': '2026-11-03', 'source': BASE + '/cooking.html',
            'dataSha256': sha256(data_bytes).hexdigest(), 'images': records,
            'missingMealImages': [201],
            'ingredientsWithoutSourceImage': [i['actor'] for i in data['ingredients'] if not i['img']]}
(ROOT / 'docs/research/totk-recipes-import.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Imported {len(records)} renamed images ({sum(r["bytes"] for r in records):,} bytes).')
