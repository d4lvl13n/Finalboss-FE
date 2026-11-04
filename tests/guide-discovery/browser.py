"""Actual discovery flows, cursor progression, retry and mobile layout checks."""
import json
import os
import re
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[2]
BASE = os.environ.get('DISCOVERY_BASE_URL', 'http://127.0.0.1:3199')
SLUG = 'the-legend-of-zelda-tears-of-the-kingdom'
ARCHIVE = '/guides/zelda-tears-of-the-kingdom-guide'
EXPECTED = {'/' + s for s in json.loads((Path(__file__).parent / 'published-totk-slugs.json').read_text())}
OUT = ROOT / 'output/playwright/guide-discovery'
OUT.mkdir(parents=True, exist_ok=True)


def links(page, selector):
    return set(page.locator(selector + ' a[href]').evaluate_all('(els) => els.map(a => new URL(a.href).pathname)'))


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1100})
    calls = []
    category_calls = []
    fail_next = {'enabled': BASE.startswith('http://127.0.0.1')}

    def route_request(route):
        req = route.request
        host = urlparse(req.url).hostname
        if host not in {urlparse(BASE).hostname, 'localhost', '127.0.0.1', 'backend.finalboss.io', 'images.igdb.com'}:
            route.abort()
            return
        if req.method == 'POST' and ('/graphql' in req.url or '/wordpress-proxy' in req.url):
            data = req.post_data_json
            query = data.get('query', '')
            if re.search(r'query\s+GetSubcategoryArticles\b', query):
                category_calls.append(data['variables'])
            if re.search(r'query\s+GetGuidePosts\b', query):
                calls.append(data['variables'])
                if fail_next['enabled']:
                    fail_next['enabled'] = False
                    route.fulfill(status=200, content_type='application/json', headers={'Access-Control-Allow-Origin': '*'}, body=json.dumps({'errors': [{'message': 'Deliberate browser retry check'}]}))
                    return
        route.continue_()

    context.route('**/*', route_request)
    page = context.new_page()
    page.set_default_timeout(120000)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))

    assert page.goto(BASE + '/guides', wait_until='domcontentloaded', timeout=120000).status == 200
    expect(page.locator('[data-guide-articles]')).to_be_visible()
    assert len(links(page, '[data-guide-articles]')) == 24
    assert page.locator('header').count() == 1
    page.screenshot(path=str(OUT / 'guides-desktop.png'))
    button = page.get_by_role('button', name=re.compile('load more guides', re.I))
    if fail_next['enabled']:
        button.click()
        expect(page.get_by_role('alert').filter(has_text='Could not load')).to_contain_text('Please try again')
        assert len(links(page, '[data-guide-articles]')) == 24
        # Two fast clicks must still produce only one successful next-page request.
        button.evaluate('(el) => { el.click(); el.click(); }')
        page.wait_for_function("new Set([...document.querySelectorAll('[data-guide-articles] a[href]')].map(a => a.pathname)).size > 24")
        assert len(links(page, '[data-guide-articles]')) == 48
        assert len(calls) == 2 and calls[0]['after'] and calls[0]['after'] == calls[1]['after']
        expect(page.get_by_role('alert').filter(has_text='Could not load')).to_have_count(0)
    for _ in range(8):
        previous = links(page, '[data-guide-articles]')
        if EXPECTED <= previous:
            break
        button.click()
        page.wait_for_function('(n) => new Set([...document.querySelectorAll("[data-guide-articles] a[href]")].map(a => a.pathname)).size > n', arg=len(previous))
    assert EXPECTED <= links(page, '[data-guide-articles]')
    print('General guides: all 90 published guides discoverable; SSR cursor, retry and rapid clicks pass.', flush=True)

    assert page.goto(BASE + ARCHIVE, wait_until='domcontentloaded', timeout=120000).status == 200
    assert page.url == BASE + ARCHIVE, 'The guide archive must not redirect to the generic guides page'
    expect(page.locator('h1')).to_contain_text('Zelda')
    for _ in range(5):
        old = links(page, '[data-guide-articles]')
        more = page.get_by_role('button', name='Load More Guides', exact=True)
        if more.count() == 0:
            break
        more.click()
        page.wait_for_function('(n) => new Set([...document.querySelectorAll("[data-guide-articles] a[href]")].map(a => a.pathname)).size > n', arg=len(old))
        print('Category progress', len(links(page, '[data-guide-articles]')), category_calls[-1:] , flush=True)
    assert EXPECTED <= links(page, '[data-guide-articles]')
    expect(page.get_by_role('button', name='Load More Guides', exact=True)).to_have_count(0)
    print('TOTK guide archive: complete collection reachable and pagination terminates.', flush=True)
    legacy = context.request.get(BASE + '/guides/zelda-totk-how-to-get-the-master-sword', max_redirects=0)
    assert legacy.status in {301, 308}, (legacy.status, legacy.text()[:200])
    assert legacy.headers['location'].endswith('/zelda-totk-how-to-get-the-master-sword')
    print('Legacy /guides/article URLs retain their permanent HTTP redirect.', flush=True)

    assert page.goto(BASE + '/game/' + SLUG, wait_until='domcontentloaded', timeout=120000).status == 200
    expect(page.locator('h1')).to_have_text('The Legend of Zelda: Tears of the Kingdom')
    expect(page.get_by_role('link', name='Browse all TOTK guides', exact=True)).to_have_attribute('href', ARCHIVE)
    assert page.locator('a[href="/game/' + SLUG + '/builds"]').count() > 0
    assert page.locator('a[href="/game/' + SLUG + '/recipes"]').count() > 0
    page.screenshot(path=str(OUT / 'hub-desktop.png'))
    for _ in range(8):
        old = links(page, '[data-game-articles]')
        more = page.get_by_role('button', name='Load more articles', exact=True)
        if more.count() == 0:
            break
        more.click()
        page.wait_for_function('(n) => new Set([...document.querySelectorAll("[data-game-articles] a[href]")].map(a => a.pathname)).size > n', arg=len(old))
        print('Hub progress', len(links(page, '[data-game-articles]')), flush=True)
    assert EXPECTED <= links(page, '[data-game-articles]')
    expect(page.get_by_role('button', name='Load more articles', exact=True)).to_have_count(0)
    print('Game hub: all 90 guides reachable with existing coverage; correct game identity and section links.', flush=True)

    page.set_viewport_size({'width': 390, 'height': 844})
    page.goto(BASE + '/guides', wait_until='domcontentloaded', timeout=120000)
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
    page.screenshot(path=str(OUT / 'guides-mobile.png'))
    page.get_by_role('button', name=re.compile('load more guides', re.I)).click()
    page.wait_for_function("new Set([...document.querySelectorAll('[data-guide-articles] a[href]')].map(a => a.pathname)).size > 24")
    page.goto(BASE + '/game/' + SLUG, wait_until='domcontentloaded', timeout=120000)
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
    page.get_by_role('link', name='Browse all TOTK guides', exact=True).scroll_into_view_if_needed()
    page.screenshot(path=str(OUT / 'hub-mobile.png'))
    page.get_by_role('link', name='Browse all TOTK guides', exact=True).click()
    page.wait_for_url(BASE + ARCHIVE)
    assert len(links(page, '[data-guide-articles]')) >= 24
    assert not errors, errors
    print('Mobile: no horizontal overflow; pagination and hub-to-guides navigation pass.', flush=True)
    browser.close()
