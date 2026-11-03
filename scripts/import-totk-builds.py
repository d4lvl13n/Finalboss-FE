#!/usr/bin/env python3
"""Import a ranked TOTK selection from public HTML and retain original QR images.

Requires: beautifulsoup4, Pillow; zxing-cpp with --verify-qr.
Resume by rerunning with the same cache folder.
No /jq/ requests or mutations are made. Source provenance stays in the private
import manifest; the browser receives only the catalogue's display fields.
"""

import argparse
import concurrent.futures
import hashlib
import io
import json
from pathlib import Path
import re
import ssl
import threading
import time
import unicodedata
from urllib.parse import parse_qs, urljoin, urlparse
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

from bs4 import BeautifulSoup
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://totk.wism.fr'
NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
gate = threading.Lock()
next_request = 0.0
TLS = ssl.create_default_context()
if Path('/etc/ssl/cert.pem').exists():
    # python.org's macOS build may not have its own certificate bundle installed.
    TLS.load_verify_locations(cafile='/etc/ssl/cert.pem')


def clean(value):
    return re.sub(r'\s+', ' ', value or '').strip()


def text(node):
    return clean(node.get_text(' ', strip=True)) if node else ''


def integer(value, default=0):
    found = re.search(r'-?\d[\d,]*', value or '')
    return int(found.group().replace(',', '')) if found else default


def slugify(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', value).strip('-')[:90].strip('-') or 'zonai-build'


def fetch(url, cache, delay):
    global next_request
    parsed = urlparse(url)
    if parsed.scheme != 'https' or parsed.netloc != 'totk.wism.fr' or '/jq/' in parsed.path:
        raise ValueError('Unexpected import URL: ' + url)
    key = hashlib.sha256(url.encode()).hexdigest()
    path = cache / key
    if path.exists():
        return path.read_bytes()
    for attempt in range(4):
        with gate:
            now = time.monotonic()
            time.sleep(max(0, next_request - now))
            next_request = time.monotonic() + delay
        try:
            req = Request(url, headers={'User-Agent': 'FinalBoss-CatalogueImport/1.0', 'Accept': '*/*'})
            with urlopen(req, timeout=35, context=TLS) as response:
                if urlparse(response.url).netloc != parsed.netloc:
                    raise ValueError('Unexpected cross-origin redirect')
                data = response.read(12 * 1024 * 1024 + 1)
                if len(data) > 12 * 1024 * 1024:
                    raise ValueError('Response exceeds import size limit')
            path.write_bytes(data)
            return data
        except Exception:
            if attempt == 3:
                raise
            time.sleep(2 ** (attempt + 1))


def listing(page, args, sort='top'):
    url = f'{BASE}/all-schema.html?sort={sort}&p={page}'
    soup = BeautifulSoup(fetch(url, args.cache, args.delay), 'html.parser')
    builds = []
    for card in soup.select('.list-grid article.card'):
        link = card.select_one('a.card-main')
        match = re.fullmatch(r'/show-(\d+)\.html', link.get('href', '')) if link else None
        if not match:
            continue
        builds.append({
            'id': int(match.group(1)),
            'name': text(card.select_one('.card-title')),
            'score': integer(text(card.select_one('.vote-score'))),
            'tested': card.select_one('.wk-ok') is not None,
            'broken': card.select_one('.wk-ko, .wk-bad') is not None,
            'rank': (page - 1) * 24 + len(builds),
        })
    if not builds:
        raise ValueError(f'No build cards on listing page {page}')
    return builds


def categories(name, tags, kind):
    # Classify using explicit types/tags and the name, never infer capabilities
    # from a generic description or from a QR image.
    s = ' '.join([name, kind, *tags]).lower()
    groups = []
    rules = [
        ('flying', r'fly|flight|hover|airbike|air bike|airship|helicopter|plane|wing|aerial|avion|volant|vtol'),
        ('combat', r'combat|weapon|battle|laser|cannon|tank|slayer|siege|bomber|mecha|turret|drone'),
        ('transport', r'transport|korok|korogu|taxi|cargo|carry|carrier|crystal'),
        ('water', r'boat|ship|water|amphib|sail|naval|bateau|voilier|submarine'),
        ('ground', r'ground|car\b|cart\b|truck|buggy|motor|cycle|bike|rover|wheel|tractor'),
        ('utility', r'utility|collect|apple|pomme|miner|mine\b|farming|picker|grabber|material|food|cook|elevator|lift'),
        ('glitches', r'glitch|modded|hacked|msgnotfound'),
    ]
    for group, pattern in rules:
        if re.search(pattern, s):
            if group == 'water' and 'flying' in groups and not re.search(r'boat|water|amphib|sail|naval|bateau|voilier|submarine', s):
                continue
            if group == 'ground' and ('flying' in groups or 'water' in groups) and not re.search(r'ground|land|amphib|wheel', s):
                continue
            groups.append(group)
    return groups or ['other']


def detail(candidate, modified, args):
    build_id = candidate['id']
    url = f'{BASE}/show-{build_id}.html'
    soup = BeautifulSoup(fetch(url, args.cache, args.delay), 'html.parser')
    article = soup.select_one('article.build')
    if article is None:
        raise ValueError('Build missing')
    name = text(article.select_one('h1'))
    if not name or re.fullmatch(r'(test(?:ing)?|untitled|asdf|qr(?: code)?|.)', name, re.I):
        raise ValueError('Placeholder title')
    facts = {text(row.th): text(row.td) for row in soup.select('.facts tr') if row.th and row.td}
    description = text(article.select_one('.build-desc'))
    tags = list(dict.fromkeys(text(t).lstrip('#').lower() for t in article.select('.build-tags .chip')))
    kind = facts.get('Type', '')
    score = integer(text(article.select_one('.vote-score')))
    if score < 0:
        raise ValueError('Negative community score')
    works = article.select_one('[data-works-badge]')
    warn = article.select_one('.works-warn')
    if warn is not None and not warn.has_attr('hidden'):
        raise ValueError('Reported non-working build')
    tested = works is not None and works.select_one('.wk-ok') is not None
    if works and works.select_one('.wk-ko, .wk-bad'):
        raise ValueError('Reported non-working build')
    download = article.select_one('a[download]')
    if not download:
        raise ValueError('QR image absent')
    qr_url = urljoin(BASE, download['href'])
    if not urlparse(qr_url).path.startswith('/images/user/qr/'):
        raise ValueError('Unexpected QR image path')
    original = fetch(qr_url, args.cache, args.delay)
    payload_hash = None
    if args.verify_qr:
        import zxingcpp
        # These are Nintendo blueprint links, not standalone 3D model files.
        # Decode offline; do not call Nintendo or claim a successful game import.
        with Image.open(io.BytesIO(original)) as qr_image:
            codes = zxingcpp.read_barcodes(qr_image, formats=zxingcpp.BarcodeFormat.QRCode)
        payloads = []
        for code in codes:
            parsed = urlparse(code.text)
            target = parse_qs(parsed.query).get('path', [''])[0]
            if parsed.scheme == 'https' and parsed.hostname == 's.nintendo.com' and target.startswith('/totk/schema-stones/'):
                payloads.append(target)
        if not payloads:
            raise ValueError('No readable Nintendo Autobuild QR')
        payload_hash = hashlib.sha256(payloads[0].encode()).hexdigest()
    with Image.open(io.BytesIO(original)) as im:
        im.verify()
    with Image.open(io.BytesIO(original)) as im:
        if min(im.size) < 240:
            raise ValueError('QR image resolution too low')
        formats = {'WEBP': 'webp', 'JPEG': 'jpg', 'PNG': 'png'}
        ext = formats.get(im.format)
        if not ext:
            raise ValueError('Unexpected QR image format')
        width, height = im.size
        digest = hashlib.sha256(original).hexdigest()
        asset_dir = ROOT / 'public' / 'totk-builds'
        asset_dir.mkdir(parents=True, exist_ok=True)
        filename = f'{build_id}-{digest[:12]}.{ext}'
        (asset_dir / filename).write_bytes(original)
        preview_name = f'{build_id}-{digest[:12]}-preview.webp'
        preview = ImageOps.exif_transpose(im).convert('RGB')
        preview.thumbnail((480, 480))
        preview.save(asset_dir / preview_name, 'WEBP', quality=78, method=4)
    cost = integer(facts.get('Build cost'), None)
    author = article.select_one('.build-by a')
    works_summary = text(article.select_one('.works-stats'))
    test_count = integer(works_summary.split('tested by')[-1]) if 'tested by' in works_summary else 0
    source = {
        'sourceId': build_id,
        'sourceUrl': url,
        'sourceImageUrl': qr_url,
        'creator': {'name': text(author), 'url': author.get('href')} if author else None,
        'sitemapLastmod': modified.get(build_id),
        'testSummary': works_summary,
        'originalSha256': digest,
        'originalBytes': len(original),
        'qrPayloadSha256': payload_hash,
    }
    build = {
        'id': build_id,
        'slug': f'{slugify(name)}-{build_id}',
        'name': name,
        'description': description,
        'tags': tags,
        'categories': categories(name, tags, kind),
        'type': kind,
        'zonaite': cost,
        'score': score,
        'views': integer(facts.get('Views')),
        'tested': tested,
        'testCount': test_count,
        'image': f'/totk-builds/{filename}',
        'preview': f'/totk-builds/{preview_name}',
        'imageWidth': width,
        'imageHeight': height,
    }
    return build, source


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--limit', type=int, default=600)
    parser.add_argument('--workers', type=int, default=2)
    parser.add_argument('--delay', type=float, default=0.4, help='Global interval between HTTP requests')
    parser.add_argument('--cache', type=Path, default=Path('/tmp/finalboss-totk-import'))
    parser.add_argument('--verify-qr', action='store_true', help='Require a decodable Nintendo Autobuild QR; needs zxing-cpp')
    args = parser.parse_args()
    if not 1 <= args.limit <= 1000 or not 1 <= args.workers <= 3 or args.delay < 0.3:
        parser.error('Use 1–1000 builds, 1–3 workers and a delay of at least 0.3 seconds')
    args.cache.mkdir(parents=True, exist_ok=True)
    # Sitemap determines discovery; never brute-force build IDs.
    sitemap_url = BASE + '/sitemap.xml?lang=en'
    root = ET.fromstring(fetch(sitemap_url, args.cache, args.delay))
    modified = {}
    for entry in root.findall('s:url', NS):
        loc = entry.find('s:loc', NS)
        match = re.fullmatch(re.escape(BASE) + r'/show-(\d+)\.html', loc.text or '') if loc is not None else None
        if match:
            date = entry.find('s:lastmod', NS)
            modified[int(match.group(1))] = date.text if date is not None else None
    if len(modified) < args.limit:
        raise ValueError('Sitemap has fewer builds than requested')
    page_count = (len(modified) + 23) // 24
    candidates = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for page, rows in enumerate(pool.map(lambda p: listing(p, args), range(1, page_count + 1)), 1):
            for row in rows:
                if row['id'] in modified:
                    candidates[row['id']] = row
            if page % 10 == 0 or page == page_count:
                print(f'Listings: {page}/{page_count}; {len(candidates)} unique builds', flush=True)
    if len(candidates) < args.limit:
        raise ValueError('Listing discovery incomplete')
    # Use popularity to break vote ties instead of letting a recent, unrated
    # submission displace an established build with the same community score.
    popularity = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for rows in pool.map(lambda p: listing(p, args, 'views'), range(1, page_count + 1)):
            for row in rows:
                popularity[row['id']] = row['rank']
    print(f'Popularity ranking: {len(popularity)} builds', flush=True)
    eligible = [c for c in candidates.values() if c['score'] >= 0 and not c['broken']]
    eligible.sort(key=lambda c: (-int(c['tested']), -c['score'], popularity.get(c['id'], 999999), c['rank']))
    records, sources, excluded, hashes = [], [], [], set()
    # Batch processing keeps concurrency low, persists the HTTP cache, and avoids
    # fetching hundreds of unneeded detail pages once the selection is complete.
    for start in range(0, len(eligible), 10):
        batch = eligible[start:start + 10]
        def load(candidate):
            try:
                return detail(candidate, modified, args)
            except Exception as exc:
                return {'id': candidate['id'], 'reason': str(exc)}
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
            for result in pool.map(load, batch):
                if isinstance(result, dict):
                    excluded.append(result)
                    continue
                build, source = result
                unique_key = source['qrPayloadSha256'] or source['originalSha256']
                if unique_key in hashes:
                    excluded.append({'id': build['id'], 'reason': 'Duplicate QR blueprint' if args.verify_qr else 'Duplicate QR image'})
                    continue
                if len(records) < args.limit:
                    hashes.add(unique_key)
                    records.append(build)
                    sources.append(source)
        print(f'Selected: {len(records)}/{args.limit}; excluded: {len(excluded)}', flush=True)
        if len(records) == args.limit:
            break
    if len(records) != args.limit:
        raise ValueError(f'Only {len(records)} valid unique builds; requested {args.limit}')
    records.sort(key=lambda b: (-int(b['tested']), -b['score'], -b['views'], b['id']))
    from datetime import datetime
    from zoneinfo import ZoneInfo
    date = datetime.now(ZoneInfo('Europe/Madrid')).date().isoformat()
    data_dir = ROOT / 'app' / 'lib' / 'totk-builds'
    data_dir.mkdir(parents=True, exist_ok=True)
    data = {'updatedAt': date, 'totalAvailable': len(modified), 'builds': records}
    (data_dir / 'catalogue.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
    report = {
        'importedAt': date, 'source': sitemap_url, 'totalAvailable': len(modified),
        'selection': 'Positive-tested badge first, then community score with popularity as tie-breaker; negative and reported broken builds excluded; duplicate QR blueprints excluded when verified, otherwise duplicate original image hashes',
        'qrDecodedOffline': args.verify_qr,
        'selected': len(records), 'excluded': excluded, 'sources': sources,
    }
    report_dir = ROOT / 'docs' / 'research'
    report_dir.mkdir(parents=True, exist_ok=True)
    (report_dir / 'totk-builds-import.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    # Remove assets generated for rejected duplicates or the last partial batch.
    keep = {Path(b[field]).name for b in records for field in ['image', 'preview']}
    asset_dir = ROOT / 'public' / 'totk-builds'
    for asset in asset_dir.iterdir():
        if asset.name not in keep:
            asset.unlink()
    print(json.dumps({'selected': len(records), 'tested': sum(b['tested'] for b in records),
                      'knownCost': sum(b['zonaite'] is not None for b in records),
                      'originalBytes': sum(s['originalBytes'] for s in sources),
                      'dataFile': str(data_dir / 'catalogue.json')}, indent=2), flush=True)


if __name__ == '__main__':
    main()
