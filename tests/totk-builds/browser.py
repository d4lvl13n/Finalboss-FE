"""Run against a local Next server. Requires Python Playwright + Chromium.

Example: TOTK_TEST_BASE_URL=http://127.0.0.1:3188 python tests/totk-builds/browser.py
All non-local browser requests are blocked, including ads and analytics.
"""

import hashlib
import json
import os
from pathlib import Path
import re
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[2]
DATA = json.loads((ROOT / 'app/lib/totk-builds/catalogue.json').read_text())
BUILDS = DATA['builds']
GAME = 'the-legend-of-zelda-tears-of-the-kingdom'
PATH = f'/game/{GAME}/builds'
BASE = os.environ.get('TOTK_TEST_BASE_URL', 'http://127.0.0.1:3188')
SHOTS = Path('/tmp/finalboss-totk-screenshots')
SHOTS.mkdir(exist_ok=True)


def local_only(route):
    host = urlparse(route.request.url).hostname
    if host in ('127.0.0.1', 'localhost') or route.request.url.startswith(('data:', 'blob:')):
        route.continue_()
    else:
        route.abort()


def navigate(page, path):
    response = page.goto(BASE + path, wait_until='networkidle')
    return response


def no_overflow(page):
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), 'Horizontal overflow'


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, accept_downloads=True)
    context.route('**/*', local_only)
    page = context.new_page()
    page.set_default_timeout(20000)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    response = navigate(page, PATH)
    assert response.status == 200
    expect(page.get_by_role('heading', level=1)).to_contain_text('Zelda TOTK Builds')
    expect(page.locator('#browse-builds article')).to_have_count(24)
    no_overflow(page)
    page.screenshot(path=str(SHOTS / 'catalogue-desktop.png'), full_page=True)
    print('Desktop catalogue rendered with 24 cards', flush=True)

    # Budget + category + test status are combined; URL survives a reload.
    tested = next(build for build in BUILDS if build['tested'] and build['zonaite'] is not None)
    category = tested['categories'][0]
    navigate(page, PATH + f'?category={category}&tested=1&budget=60')
    expect(page.get_by_label('Community tested only')).to_be_checked()
    expect(page.get_by_label('Zonaite budget')).to_have_value('60')
    expected = [b for b in BUILDS if b['tested'] and category in b['categories'] and b['zonaite'] is not None and b['zonaite'] <= 60]
    expect(page.get_by_role('status')).to_contain_text(f'{len(expected)} ')
    page.reload(wait_until='networkidle')
    expect(page.get_by_label('Community tested only')).to_be_checked()
    print('Combined deep-link filters and reload verified', flush=True)

    page.get_by_role('button', name='Clear filters').click()
    page.get_by_role('searchbox', name='Search builds').fill('zzzz-no-such-build-zzzz')
    expect(page.get_by_role('heading', name='No blueprints found')).to_be_visible()
    page.get_by_role('button', name='Show all builds').click()
    expect(page.locator('#browse-builds article')).to_have_count(24)
    page.get_by_label('Sort by').select_option('cost')
    cheapest = min(b['zonaite'] for b in BUILDS if b['zonaite'] is not None)
    expect(page.locator('#browse-builds article').first).to_contain_text(f'{cheapest} Zonaite')
    page.get_by_role('link', name='Next', exact=True).click()
    expect(page).to_have_url(re.compile(r'/page/2'))
    page.go_back(wait_until='networkidle')
    expect(page.locator('nav[aria-label="Build catalogue pagination"] [aria-disabled="true"]').first).to_have_text(re.compile('Previous'))
    print('Search, empty state, sorting, pagination and browser history verified', flush=True)

    # Check a real detail page and the actual downloaded bytes.
    sample = BUILDS[0]
    response = navigate(page, PATH + '/' + sample['slug'])
    assert response.status == 200
    expect(page.get_by_role('heading', level=1)).to_have_text(sample['name'])
    original = page.locator('img[alt*="original Zelda Notes"]')
    expect(original).to_be_visible()
    assert original.evaluate('(image) => image.complete && image.naturalWidth > 0')
    page.screenshot(path=str(SHOTS / 'build-desktop.png'), full_page=True)
    with page.expect_download() as download_info:
        page.get_by_role('link', name='Download QR code', exact=True).click()
    downloaded = download_info.value
    assert downloaded.failure() is None
    path = SHOTS / downloaded.suggested_filename
    downloaded.save_as(path)
    expected_bytes = (ROOT / 'public' / sample['image'].lstrip('/')).read_bytes()
    assert hashlib.sha256(path.read_bytes()).digest() == hashlib.sha256(expected_bytes).digest()
    print('Detail page and original QR download checksum verified', flush=True)

    # A tag link opens the catalogue with a working filter.
    if sample['tags']:
        page.get_by_role('link', name='#' + sample['tags'][0], exact=True).click()
        expect(page.get_by_role('button', name=re.compile('Remove tag filter'))).to_be_visible()
        expect(page.locator('#browse-builds article')).not_to_have_count(0)
    assert navigate(page, PATH + '/no-such-build').status == 404
    assert navigate(page, '/game/diablo-4/builds').status == 404
    print('Tag filter and unknown-route 404s verified', flush=True)

    mobile = browser.new_page(viewport={'width': 390, 'height': 844})
    mobile.route('**/*', local_only)
    mobile.set_default_timeout(20000)
    navigate(mobile, PATH)
    expect(mobile.get_by_role('searchbox', name='Search builds')).to_be_visible()
    no_overflow(mobile)
    mobile.screenshot(path=str(SHOTS / 'catalogue-mobile.png'), full_page=True)
    mobile.get_by_role('searchbox', name='Search builds').fill('hover')
    expect(mobile.locator('#browse-builds article')).not_to_have_count(0)
    mobile.get_by_label('Zonaite budget').select_option('15')
    no_overflow(mobile)
    navigate(mobile, PATH + '/' + sample['slug'])
    no_overflow(mobile)
    expect(mobile.get_by_role('link', name='Download QR code', exact=True)).to_be_visible()
    mobile.screenshot(path=str(SHOTS / 'build-mobile.png'), full_page=True)
    print('Mobile search, budget, layout and detail page verified', flush=True)
    assert not errors, errors
    browser.close()
    print('All browser checks passed. Screenshots: ' + str(SHOTS), flush=True)
