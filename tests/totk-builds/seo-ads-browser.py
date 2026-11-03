"""SEO + ad layout checks. Third-party requests are blocked; injected test boxes
verify geometry and React isolation only, never real ad fill or revenue.
"""
import json
import os
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[2]
DATA = json.loads((ROOT / 'app/lib/totk-builds/catalogue.json').read_text())['builds']
PATH = '/game/the-legend-of-zelda-tears-of-the-kingdom/builds'
BASE = os.environ.get('TOTK_TEST_BASE_URL', 'http://127.0.0.1:3188')
SHOTS = Path('/tmp/finalboss-totk-screenshots')


def local_only(route):
    if urlparse(route.request.url).hostname in ['127.0.0.1', 'localhost', urlparse(BASE).hostname] or route.request.url.startswith(('data:', 'blob:')):
        route.continue_()
    else:
        route.abort()


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    context.route('**/*', local_only)
    # Test only the public registration lifecycle; all real auction traffic is blocked.
    context.add_init_script('''window.__journeyScans = 0; window.$adManagementConfig = {web: {fillHints() { window.__journeyScans++; }}};''')
    page = context.new_page()
    page.set_default_timeout(30000)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    response = page.goto(BASE + PATH, wait_until='networkidle', timeout=120000)
    assert response.status == 200
    expect(page.locator('[data-build-ad-after]')).to_have_count(2)
    assert page.locator('.content_hint').count() == 0, 'Journey content hints must not disable automatic content rendering'
    assert page.locator('.mv_slot_target[data-slot="content"]').count() == 2
    assert page.evaluate('window.__journeyScans') == 1, 'Ad islands should share a single registration scan'
    expect(page.locator('a[rel=next]')).to_have_attribute('href', PATH + '/page/2')
    expect(page.get_by_role('link', name='Page 25', exact=True)).to_have_attribute('href', PATH + '/page/25')

    # Native category/pagination paths have meaningful SSR content without JS.
    nojs = browser.new_context(java_script_enabled=False, viewport={'width': 1440, 'height': 1000})
    nojs.route('**/*', local_only)
    crawler = nojs.new_page()
    response = crawler.goto(BASE + PATH + '/category/flying/page/2', wait_until='networkidle')
    assert response.status == 200
    expect(crawler.get_by_role('heading', level=1)).to_contain_text('Flying Builds')
    expect(crawler.locator('link[rel=canonical]')).to_have_attribute('href', 'https://finalboss.io' + PATH + '/category/flying/page/2')
    assert 'Page 2' in crawler.title()
    actual = crawler.locator('#browse-builds article h3').all_text_contents()
    expected = [b['name'] for b in DATA if 'flying' in b['categories']][24:48]
    assert actual == expected
    nodes = [node for block in crawler.locator('script[type="application/ld+json"]').all_text_contents() for node in json.loads(block).get('@graph', [])]
    listing = next(node for node in nodes if node.get('@type') == 'CollectionPage')
    assert len(listing['mainEntity']['itemListElement']) == len(actual)
    assert listing['mainEntity']['itemListElement'][0]['position'] == 25
    assert crawler.locator('a[rel=prev]').get_attribute('href') == PATH + '/category/flying'
    for source, target in [('/page/1', PATH), ('/category/flying/page/1', PATH + '/category/flying')]:
        redirect = context.request.get(BASE + PATH + source, max_redirects=0)
        assert redirect.status == 308
        assert redirect.headers.get('location')
        assert urlparse(redirect.headers['location']).path == target
    assert crawler.goto(BASE + PATH + '/page/1').url.endswith(PATH)
    assert crawler.goto(BASE + PATH + '/category/flying/page/1').url.endswith('/category/flying')
    assert crawler.goto(BASE + PATH + '/page/999').status == 404
    assert crawler.goto(BASE + PATH + '/category/no-such-category').status == 404
    response = crawler.goto(BASE + PATH + '?q=hoverbike')
    assert response.headers.get('x-robots-tag') == 'noindex, follow'
    response = crawler.goto(BASE + PATH + '/category/flying')
    assert 'noindex' not in response.headers.get('x-robots-tag', '')
    print('No-JS categories, deep pagination, canonicals, schema, redirects and facet indexing verified', flush=True)

    # A layout-only ad stand-in occupies a complete row and survives card sorting.
    page.evaluate('''() => {
      for (const island of document.querySelectorAll('[data-build-ad-after]')) {
        const box = document.createElement('div');
        box.dataset.layoutTestAd = 'true';
        box.style.cssText = 'height:250px;display:flex;align-items:center;justify-content:center;border:1px dashed #4b5563;color:#9ca3af;background:#111827';
        box.textContent = 'Advertisement — layout test';
        const frame = document.createElement('iframe'); frame.title = 'Ad layout test'; frame.style.cssText = 'width:1px;height:1px;border:0';
        box.appendChild(frame); island.appendChild(box);
      }
    }''')
    grid = page.locator('#totk-build-results').bounding_box()
    for island in page.locator('[data-build-ad-after]').all():
        after = int(island.get_attribute('data-build-ad-after'))
        rect = island.bounding_box()
        assert abs(rect['width'] - grid['width']) < 2
        before = page.locator('#browse-builds article').nth(after - 1).bounding_box()
        following = page.locator('#browse-builds article').nth(after).bounding_box()
        assert rect['y'] >= before['y'] + before['height']
        assert following['y'] >= rect['y'] + rect['height']
    page.get_by_label('Sort by').select_option('cost')
    expect(page.locator('[data-layout-test-ad]')).to_have_count(2)
    page.screenshot(path=str(SHOTS / 'ads-desktop-layout-test.png'), full_page=True)
    page.get_by_role('searchbox', name='Search builds').fill('zz-no-matches-zz')
    expect(page.locator('[data-build-ad-after]')).to_have_count(0)
    page.get_by_role('button', name='Show all builds').click()
    expect(page.locator('[data-build-ad-after]')).to_have_count(2)
    page.wait_for_function('window.__journeyScans === 2')
    print('Two desktop ad breaks, row width, stable ad DOM and short-list removal verified', flush=True)

    page.set_viewport_size({'width': 390, 'height': 844})
    expect(page.locator('[data-build-ad-after]')).to_have_count(3)
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
    assert [int(x) for x in page.locator('[data-build-ad-after]').evaluate_all('(els) => els.map(e => e.dataset.buildAdAfter)')] == [6, 12, 18]
    page.screenshot(path=str(SHOTS / 'seo-catalogue-mobile.png'), full_page=True)
    page.goto(BASE + PATH + '/category/flying', wait_until='networkidle')
    page.get_by_role('searchbox', name='Search builds').fill('zz-no-matches-zz')
    page.get_by_role('button', name='Show all builds').click()
    expect(page.get_by_role('heading', level=1)).to_contain_text('Flying Builds')
    expect(page).to_have_url(BASE + PATH + '/category/flying')
    expect(page.get_by_role('status')).to_contain_text(str(sum('flying' in item['categories'] for item in DATA)))
    assert not errors, errors
    print('Three mobile breaks and responsive layout verified; live fill is outside this local test', flush=True)
    browser.close()
