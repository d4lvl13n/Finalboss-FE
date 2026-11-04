"""Real CMS collection: full-set search, six filters, pagination and mobile UI."""
import json
import os
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[2]
BASE = os.environ.get('DISCOVERY_BASE_URL', 'http://127.0.0.1:3201')
HUB = '/game/the-legend-of-zelda-tears-of-the-kingdom'
REPORT = json.loads((ROOT / 'docs/releases/2026-11-04-guide-search/wordpress-guide-types.json').read_text())
EXPECTED = {'/' + slug for slug in REPORT['posts']}
OUT = ROOT / 'output/playwright/guide-search'
OUT.mkdir(parents=True, exist_ok=True)

def links(page):
    return set(page.locator('[data-totk-guide-results] a[href]').evaluate_all('(els) => els.map(a => new URL(a.href).pathname)'))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1100})
    def route(route):
        if urlparse(route.request.url).hostname in {urlparse(BASE).hostname, 'localhost', '127.0.0.1', 'backend.finalboss.io', 'images.finalboss.io', 'images.igdb.com'}:
            route.continue_()
        else:
            route.abort()
    context.route('**/*', route)
    page = context.new_page()
    page.set_default_timeout(120000)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    assert page.goto(BASE + HUB, wait_until='domcontentloaded', timeout=120000).status == 200
    explorer = page.locator('[data-totk-guide-explorer]')
    expect(explorer).to_have_attribute('data-total-guides', '90')
    assert page.locator('h1').count() == 1
    expect(page.get_by_role('searchbox', name='Search TOTK guides')).to_be_visible()
    assert len(links(page)) == 12
    initial = links(page)
    for kind, count in REPORT['counts'].items():
        page.locator(f'[data-guide-type="{kind}"]').click()
        expect(page.locator('[data-guide-result-count]')).to_contain_text(f'{count} guides found')
        expect(page.locator(f'[data-guide-type="{kind}"]')).to_have_attribute('aria-pressed', 'true')
        expected = {'/' + slug for slug, post in REPORT['posts'].items() if kind in post['types']}
        assert links(page) <= expected
        while page.get_by_role('button', name='Show more guides', exact=True).count():
            page.get_by_role('button', name='Show more guides', exact=True).click()
        assert links(page) == expected, (kind, links(page) ^ expected)
    print('All six type filters return every classified guide, with no unrelated cards.', flush=True)
    search = page.get_by_role('searchbox', name='Search TOTK guides')
    page.locator('[data-guide-type="all"]').click()
    search.fill('skyview towers')
    expect(page.locator('[data-guide-result-count]')).to_contain_text('1 guide found')
    assert any('skyview' in link for link in links(page))
    assert not links(page) & initial, 'Regression check must search beyond the initial page'
    page.locator('[data-guide-type="weapons"]').click()
    expect(page.get_by_role('heading', name='No guides found')).to_be_visible()
    page.get_by_role('button', name='Clear filters', exact=True).first.click()
    search.fill('hylian shield')
    page.locator('[data-guide-type="weapons"]').click()
    expect(page.locator('[data-guide-result-count]')).to_contain_text('2 guides found')
    assert links(page) == {'/zelda-totk-how-to-get-the-hylian-shield', '/zelda-totk-hyrule-castle-equipment-and-treasure-route'}
    search.fill('lynel')
    page.locator('[data-guide-type="bosses"]').click()
    expect(page.locator('[data-guide-result-count]')).to_contain_text('1 guide found')
    assert all('lynel' in link for link in links(page))
    page.get_by_role('button', name='Clear search', exact=True).click()
    expect(search).to_have_value('')
    page.get_by_role('button', name='Clear filters', exact=True).first.click()
    while page.get_by_role('button', name='Show more guides', exact=True).count():
        old = len(links(page))
        page.get_by_role('button', name='Show more guides', exact=True).click()
        assert len(links(page)) == min(old + 12, 90)
    assert links(page) == EXPECTED
    other = set(page.locator('[data-game-articles] a[href]').evaluate_all('(els) => els.map(a => new URL(a.href).pathname)'))
    assert not other & EXPECTED
    print('Search covers all 90 guides; combined filters, empty state, reset and complete pagination pass.', flush=True)
    page.locator('[data-guide-type="temples"]').click()
    expect(page.locator('[data-guide-type="temples"]')).to_have_attribute('aria-pressed', 'true')
    explorer.scroll_into_view_if_needed()
    page.wait_for_function("[...document.querySelectorAll('[data-totk-guide-results] > div > div:last-child > div')].every(el => +getComputedStyle(el).opacity === 1)")
    page.wait_for_function("[...document.querySelectorAll('[data-totk-guide-results] img')].filter(el => el.getBoundingClientRect().width > 0).every(el => el.complete && el.naturalWidth > 0)")
    page.screenshot(path=str(OUT / 'desktop-temples.png'), animations='disabled')
    assert page.locator('link[rel="canonical"]').get_attribute('href') == 'https://finalboss.io' + HUB
    for suffix in ['builds', 'recipes']:
        assert page.locator(f'a[href="{HUB}/{suffix}"]').count() > 0
    page.set_viewport_size({'width': 390, 'height': 844})
    page.get_by_role('button', name='Clear filters', exact=True).first.click()
    search.fill('lynel')
    page.locator('[data-guide-type="bosses"]').click()
    expect(page.locator('[data-guide-result-count]')).to_contain_text('1 guide found')
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    explorer.scroll_into_view_if_needed()
    page.wait_for_function("[...document.querySelectorAll('[data-totk-guide-results] img')].filter(el => el.getBoundingClientRect().width > 0).every(el => el.complete && el.naturalWidth > 0)")
    page.screenshot(path=str(OUT / 'mobile-search.png'), animations='disabled')
    page.get_by_role('link', name='All guides →', exact=True).click()
    page.wait_for_url(BASE + '/guides/zelda-tears-of-the-kingdom-guide')
    expect(page.locator('h1')).to_contain_text('Zelda')
    assert not errors, errors
    print('Mobile search/filter/navigation, canonical, section links, overflow and JavaScript checks pass.', flush=True)
    browser.close()
