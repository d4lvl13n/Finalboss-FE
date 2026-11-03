"""Local functional, SEO, image and responsive checks. No third-party traffic."""
import json
import os
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[2]
RECIPES = json.loads((ROOT / 'app/lib/totk-recipes/catalogue.json').read_text())['recipes']
BASE = os.environ.get('TOTK_TEST_BASE_URL', 'http://127.0.0.1:3188')
PATH = '/game/the-legend-of-zelda-tears-of-the-kingdom/recipes'
SHOTS = Path('/tmp/finalboss-recipes-screenshots')
SHOTS.mkdir(exist_ok=True)


def local_only(route):
    if urlparse(route.request.url).hostname in ['127.0.0.1', 'localhost', urlparse(BASE).hostname] or route.request.url.startswith(('data:', 'blob:')):
        route.continue_()
    else:
        route.abort()


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1100})
    context.route('**/*', local_only)
    page = context.new_page()
    page.set_default_timeout(30000)
    errors, bad_images = [], []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('response', lambda r: bad_images.append(r.url) if '/totk-recipes/' in r.url and r.status >= 400 else None)
    assert page.goto(BASE + PATH, wait_until='networkidle', timeout=120000).status == 200
    expect(page.locator('[data-recipe-card]')).to_have_count(24)
    expect(page.locator('[data-recipe-ad-after]')).to_have_count(2)
    assert page.locator('h1').count() == 1
    page.screenshot(path=str(SHOTS / 'catalogue-desktop.png'))
    page.get_by_role('searchbox', name='Search recipes', exact=True).fill('apple pie')
    expect(page.locator('[data-recipe-card]')).to_have_count(1)
    expect(page.locator('[data-recipe-ad-after]')).to_have_count(0)
    page.get_by_role('searchbox', name='Search recipes', exact=True).fill('there-is-no-such-dish')
    expect(page.get_by_role('heading', name='No recipes found')).to_be_visible()
    page.get_by_role('button', name='Clear filters').first.click()
    page.get_by_role('button', name='Frozen', exact=True).click()
    expect(page.locator('[data-recipe-card]')).to_have_count(16)
    assert all(199 <= int(v) <= 214 for v in page.locator('[data-recipe-card]').evaluate_all('(cards) => cards.map(c => c.dataset.recipeCard)'))
    page.get_by_role('button', name='Clear filters').first.click()
    page.get_by_label('Example ingredient', exact=True).select_option('Item_Fruit_A')
    assert page.locator('[data-recipe-card]').count() > 0
    page.goto(BASE + PATH + '/effect/attack-up', wait_until='networkidle')
    assert 'Attack up' in page.locator('h1').inner_text()
    expect(page.locator('[data-recipe-card]')).to_have_count(24)
    # Effect navigation carries the selected bonus into the individual recipe.
    page.locator('[data-recipe-card]').first.click()
    page.wait_for_load_state('networkidle')
    expect(page.get_by_label('Choose a combination').locator('option:checked')).to_contain_text('Attack up')
    page.goto(BASE + PATH + '/apple-pie', wait_until='networkidle')
    expect(page.get_by_role('heading', name='Apple Pie', exact=True)).to_be_visible()
    page.screenshot(path=str(SHOTS / 'recipe-desktop.png'))
    page.get_by_role('link', name='Try this combination').click()
    page.wait_for_load_state('networkidle')
    expect(page.get_by_role('button', name='Cook recipe', exact=True)).to_be_enabled()
    page.get_by_role('button', name='Cook recipe', exact=True).click()
    expect(page.locator('[data-cooking-result]')).to_contain_text('Apple Pie')
    page.get_by_role('button', name='Empty cooking pot').click()
    page.get_by_role('button', name='Attack boost', exact=True).click()
    assert page.get_by_role('button', name='Remove Mighty Bananas', exact=False).count() == 5
    page.get_by_role('button', name='Cook recipe', exact=True).click()
    expect(page.locator('[data-cooking-result]')).to_contain_text('Mighty Simmered Fruit')
    expect(page.locator('[data-cooking-result]')).to_contain_text('04:10')
    page.screenshot(path=str(SHOTS / 'simulator-desktop.png'))
    page.get_by_role('button', name='Empty cooking pot').click()
    page.get_by_role('searchbox', name='Search ingredients', exact=True).fill('apple')
    for _ in range(5):
        page.get_by_role('button', name='Add Apple', exact=True).click()
    expect(page.get_by_role('button', name='Add Apple', exact=True)).to_be_disabled()
    page.get_by_role('button', name='Remove Apple from slot 3', exact=True).click()
    expect(page.get_by_role('button', name='Add Apple', exact=True)).to_be_enabled()
    assert not errors, errors
    assert not bad_images, bad_images
    print('Desktop search, methods, ingredients, effects, detail presets, simulator and five-slot limit passed', flush=True)

    crawler_context = browser.new_context(java_script_enabled=False)
    crawler_context.route('**/*', local_only)
    crawler = crawler_context.new_page()
    seen = set()
    for number in range(1, 11):
        suffix = '' if number == 1 else f'/page/{number}'
        response = crawler.goto(BASE + PATH + suffix, wait_until='domcontentloaded', timeout=120000)
        assert response.status == 200
        assert crawler.locator('link[rel="canonical"]').get_attribute('href') == 'https://finalboss.io' + PATH + suffix
        cards = crawler.locator('[data-recipe-card]')
        seen.update(int(v) for v in cards.evaluate_all('(cards) => cards.map(c => c.dataset.recipeCard)'))
        assert crawler.locator('h1').count() == 1
        schema = next(n['@graph'] for n in [json.loads(text) for text in crawler.locator('script[type="application/ld+json"]').all_text_contents()] if '@graph' in n)
        listing = next(n for n in schema if n['@type'] == 'CollectionPage')
        assert listing['mainEntity']['numberOfItems'] == cards.count()
        assert listing['mainEntity']['itemListElement'][0]['position'] == (number - 1) * 24 + 1
    assert seen == set(range(1, 229)), seen
    assert crawler.goto(BASE + PATH + '/effect/flame-guard').status == 200
    expect(crawler.locator('[data-recipe-card]')).to_have_count(1)
    assert crawler.goto(BASE + PATH + '/page/999').status == 404
    assert crawler.goto(BASE + PATH + '/effect/unknown-effect').status == 404
    assert crawler.goto(BASE + '/game/not-zelda/recipes').status == 404
    if os.environ.get('TOTK_TEST_PRODUCTION'):
        for source, target in [('/page/1', PATH), ('/effect/attack-up/page/1', PATH + '/effect/attack-up')]:
            response = context.request.get(BASE + PATH + source, max_redirects=0)
            assert response.status == 308 and urlparse(response.headers['location']).path == target
        for suffix in ['?q=apple', '?method=freeze', '/cooking-simulator?ingredients=Item_Fruit_A']:
            assert context.request.get(BASE + PATH + suffix).headers.get('x-robots-tag') == 'noindex, follow'
        sitemap = context.request.get(BASE + '/game/sitemap.xml').text()
        for recipe in RECIPES:
            assert 'https://finalboss.io' + PATH + '/' + recipe['slug'] + '</loc>' in sitemap
    print('All 228 recipes discoverable without JavaScript; pagination, canonical URLs, structured data and invalid routes passed', flush=True)

    for width in [390, 768]:
        page.set_viewport_size({'width': width, 'height': 844})
        for suffix, name in [('', 'catalogue'), ('/icy-gourmet-meat', 'frozen'), ('/cooking-simulator', 'simulator')]:
            page.goto(BASE + PATH + suffix, wait_until='networkidle')
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), (width, suffix)
            page.screenshot(path=str(SHOTS / f'{name}-{width}.png'))
        page.get_by_role('button', name='Gloom recovery', exact=True).click()
        page.evaluate("document.querySelector('#pantry-search').scrollIntoView({block:'start'})")
        expect(page.locator('[data-mobile-cooking-controls]')).to_be_visible()
        page.get_by_role('button', name='Cook recipe', exact=True).last.click()
        expect(page.locator('[data-cooking-result]')).to_contain_text('Gloom Recovery')
    assert not errors, errors
    assert not bad_images, bad_images
    print('Mobile/tablet geometry, ingredient image fallback and mobile cooking controls passed', flush=True)
    browser.close()
