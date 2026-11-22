'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, CreditCard, Feather, Link2, Map, MapPin, Minus, Plus, RotateCcw, ScanLine, Search, Timer, Watch, X } from 'lucide-react';

import AdSlot from '@/app/components/Section/AdSlot';
import { leonidaMap, mapLabels, mapRegions, type LocalizedMapLocation, type MapCategory, type MapPoint, type MapRegion } from '@/app/lib/gta6-map';
import styles from './gta6-map.module.css';

const categoryIcons = { cards: CreditCard, watches: Watch, flamingos: Feather, jumps: Timer, scans: ScanLine };
const categories = Object.keys(categoryIcons) as MapCategory[];
const storageKey = 'finalboss:gta6-map-found:v1';
const markerId = (id: string) => `pin-${id}`;
const searchable = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const keysCenter: MapPoint = [42.5, 83.8];
const overviewCenter: MapPoint = [50, 50];

type MarkerGroup = { point: MapPoint; items: LocalizedMapLocation[] };

function readCenter(viewport: HTMLDivElement, scene: HTMLDivElement): MapPoint {
  return [
    (viewport.scrollLeft - scene.offsetLeft + viewport.clientWidth / 2) * 100 / scene.offsetWidth,
    (viewport.scrollTop - scene.offsetTop + viewport.clientHeight / 2) * 100 / scene.offsetHeight,
  ];
}

function centerMap(viewport: HTMLDivElement, scene: HTMLDivElement, point: MapPoint) {
  viewport.scrollLeft = scene.offsetLeft + scene.offsetWidth * point[0] / 100 - viewport.clientWidth / 2;
  viewport.scrollTop = scene.offsetTop + scene.offsetHeight * point[1] / 100 - viewport.clientHeight / 2;
}

function groupMarkers(locations: LocalizedMapLocation[], width: number, height: number) {
  const groups: MarkerGroup[] = [];
  for (const item of locations) {
    const [x, y] = item.position;
    const group = groups.find(({ point }) =>
      Math.hypot((point[0] - x) * width / 100, (point[1] - y) * height / 100) < 39,
    );
    if (!group) {
      groups.push({ point: [x, y], items: [item] });
      continue;
    }
    const count = group.items.length;
    group.point = [(group.point[0] * count + x) / (count + 1), (group.point[1] * count + y) / (count + 1)];
    group.items.push(item);
  }
  return groups;
}

export default function Gta6MapExplorer({
  locale, locations,
}: {
  locale: keyof typeof mapLabels;
  locations: LocalizedMapLocation[];
}) {
  const t = mapLabels[locale];
  const [ready, setReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [openGroup, setOpenGroup] = useState<MarkerGroup>();
  const [found, setFound] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<MapCategory | 'all'>('all');
  const [region, setRegion] = useState<MapRegion | 'all'>('all');
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const viewport = useRef<HTMLDivElement>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const closeControl = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement>();
  const scene = useRef<HTMLDivElement>(null);
  const zoomCenter = useRef<MapPoint | undefined>(keysCenter);
  const drag = useRef<{ x: number; y: number; left: number; top: number }>();

  useEffect(() => {
    function readHash() {
      const id = window.location.hash.replace(/^#pin-/, '');
      const item = locations.find(item => item.id === id);
      setSelectedId(item?.id);
      setOpenGroup(undefined);
      setCopyStatus('');
      if (!item) {
        drawer.current?.close();
        return;
      }
      if (viewport.current && scene.current) centerMap(viewport.current, scene.current, item.position);
      else zoomCenter.current = item.position;
    }
    readHash();
    try {
      const items: unknown = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(items)) {
        setFound(locations.filter(item => items.includes(item.id)).map(item => item.id));
      }
    } catch {
      // Progress remains available during this visit if storage is disabled.
    }
    setReady(true);
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, [locations]);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      if (!zoomCenter.current && scene.current) {
        zoomCenter.current = readCenter(element, scene.current);
      }
      setSize({ width: element.clientWidth, height: element.clientHeight });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const fit = Math.min(size.width / leonidaMap.width, size.height / leonidaMap.height);
  const keysWidth = size.width <= 500 ? 0.41 : 0.46;
  const keysFit = Math.min(size.width / (leonidaMap.width * keysWidth), size.height / (leonidaMap.height * 0.17));
  const keysZoom = fit ? Math.max(1, keysFit / fit) : 1;
  const viewZoom = zoom ?? keysZoom;
  const maximumZoom = Math.max(24, keysZoom * 3);
  const width = Math.round(leonidaMap.width * fit * viewZoom);
  const height = Math.round(leonidaMap.height * fit * viewZoom);

  useEffect(() => {
    const center = zoomCenter.current;
    if (!center || !viewport.current || !scene.current) return;
    centerMap(viewport.current, scene.current, center);
    zoomCenter.current = undefined;
  }, [width, height, size]);

  useEffect(() => {
    const dialog = drawer.current;
    if (!dialog || !(selectedId || openGroup)) return;
    if (!dialog.open) dialog.showModal();
    closeControl.current?.focus({ preventScroll: true });
  }, [selectedId, openGroup]);

  const term = searchable(query);
  const visible = locations.filter(item =>
    (category === 'all' || item.category === category) &&
    (region === 'all' || item.region === region) &&
    (!onlyMissing || !found.includes(item.id)) &&
    (!term || searchable(`${item.name} ${item.region} ${t.categories[item.category]} ${item.directions}`).includes(term)),
  );
  const selected = locations.find(item => item.id === selectedId);
  const groups = groupMarkers(visible, width, height);

  function select(event: MouseEvent<HTMLAnchorElement>, item: LocalizedMapLocation, fromList = false) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener.current = event.currentTarget;
    showLocation(item);
    if (fromList && viewport.current && scene.current) {
      if (viewZoom < keysZoom) changeZoom(null, item.position);
      else centerMap(viewport.current, scene.current, item.position);
    }
  }

  function showLocation(item: LocalizedMapLocation) {
    setSelectedId(item.id);
    setCopyStatus('');
    window.history.replaceState(null, '', `#${markerId(item.id)}`);
  }

  function clearLocation() {
    setSelectedId(undefined);
    setCopyStatus('');
    if (selectedId && window.location.hash === `#${markerId(selectedId)}`) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  function closeDrawer() {
    clearLocation();
    setOpenGroup(undefined);
    const target = opener.current?.isConnected ? opener.current : viewport.current;
    target?.focus({ preventScroll: true });
    opener.current = undefined;
  }

  function toggleFound(id: string) {
    const next = found.includes(id) ? found.filter(item => item !== id) : [...found, id];
    setFound(next);
    setCopyStatus('');
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Keep this visit's progress when persistent storage is unavailable.
    }
  }

  async function copyLocation(id: string) {
    window.history.replaceState(null, '', `#${markerId(id)}`);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus(t.copied);
    } catch {
      setCopyStatus(t.copyFailed);
    }
  }

  function changeZoom(next: number | null, point?: MapPoint) {
    const element = viewport.current;
    const plane = scene.current;
    if (!element || !plane) return;
    const center = point ?? readCenter(element, plane);
    const nextZoom = next ?? keysZoom;
    if (nextZoom === viewZoom) centerMap(element, plane, center);
    else zoomCenter.current = center;
    setZoom(next);
  }

  function chooseRegion(next: MapRegion | 'all') {
    setRegion(next);
    setCopyStatus('');
    if (next === 'all') {
      changeZoom(null, keysCenter);
      return;
    }
    const points = locations.filter(item => item.region === next);
    if (!points.length) return;
    const sum = points.reduce<MapPoint>((total, { position: [x, y] }) => [total[0] + x, total[1] + y], [0, 0]);
    changeZoom(keysZoom, [sum[0] / points.length, sum[1] / points.length]);
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (viewZoom === 1 || event.button !== 0 || event.pointerType !== 'mouse' || (event.target as HTMLElement).closest('a, button')) return;
    const element = event.currentTarget;
    element.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, left: element.scrollLeft, top: element.scrollTop };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start) return;
    event.currentTarget.scrollLeft = start.left + start.x - event.clientX;
    event.currentTarget.scrollTop = start.top + start.y - event.clientY;
  }

  function clearFilters() {
    setQuery('');
    setCategory('all');
    setRegion('all');
    setOnlyMissing(false);
    setCopyStatus('');
  }

  return (
    <div className={styles.explorer}>
      {ready && (
        <div className={styles.toolbar}>
          <label className={styles.search}>
            <Search size={19} aria-hidden="true" />
            <span className="sr-only">{t.search}</span>
            <input type="search" value={query} placeholder={t.searchHint} onChange={event => { setQuery(event.target.value); setCopyStatus(''); }} />
          </label>
          <div className={styles.categories} aria-label={t.stops}>
            <button type="button" aria-pressed={category === 'all'} onClick={() => { setCategory('all'); setCopyStatus(''); }}>{t.all}</button>
            {categories.map(key => {
              const Icon = categoryIcons[key];
              return (
                <button key={key} className={styles[key]} type="button" aria-pressed={category === key} onClick={() => { setCategory(key); setCopyStatus(''); }}>
                  <Icon size={16} aria-hidden="true" /> {t.categories[key]}
                </button>
              );
            })}
          </div>
          <div className={styles.resultFilters}>
            <label>
              <span className="sr-only">{t.region}</span>
              <select value={region} onChange={event => chooseRegion(event.target.value as MapRegion | 'all')}>
                <option value="all">{t.allRegions}</option>
                {mapRegions.map(area => <option key={area} value={area}>{area}</option>)}
              </select>
            </label>
            <button type="button" aria-pressed={onlyMissing} onClick={() => { setOnlyMissing(value => !value); setCopyStatus(''); }}>{t.remaining}</button>
          </div>
        </div>
      )}

      <div className={styles.board}>
        <div className={styles.mapTop}>
          <div className={styles.mapMeta}>
            <span className={styles.mapArea}><MapPin size={17} aria-hidden="true" /> {region === 'all' ? 'Leonida' : region}</span>
            <div className={styles.progress}>
              <span aria-live="polite">{found.length} / {locations.length} {t.found.toLowerCase()}</span>
              <progress value={found.length} max={locations.length} aria-label={t.found} />
            </div>
          </div>
          {ready && !mapFailed && (
            <div className={styles.zoom}>
              <button type="button" aria-label={t.overview} title={t.overview} aria-pressed={viewZoom === 1} onClick={() => changeZoom(1, overviewCenter)}><Map size={17} /></button>
              <button type="button" aria-label={t.fit} title={t.fit} onClick={() => changeZoom(null, keysCenter)}><RotateCcw size={16} /></button>
              <button type="button" aria-label={t.minus} disabled={viewZoom <= 1} onClick={() => changeZoom(Math.max(1, viewZoom / 1.5))}><Minus size={18} /></button>
              <button type="button" aria-label={t.plus} disabled={viewZoom >= maximumZoom} onClick={() => changeZoom(Math.min(maximumZoom, viewZoom * 1.5))}><Plus size={18} /></button>
            </div>
          )}
        </div>
        <div className={styles.viewport} ref={viewport} tabIndex={0} role="region" aria-label={t.map}
          data-zoomed={viewZoom > 1} onPointerDown={startDrag} onPointerMove={moveDrag}
          onLostPointerCapture={() => { drag.current = undefined; }}>
          {mapFailed ? (
            <p className={styles.mapUnavailable}>{t.mapUnavailable}</p>
          ) : width > 0 && height > 0 ? (
            <div className={styles.canvas} style={{ minWidth: width, minHeight: height }}>
              <div className={styles.scene} ref={scene} style={{ width, height }}>
                <Image className={styles.mapImage} src={leonidaMap.src} alt="" draggable={false}
                  width={leonidaMap.width} height={leonidaMap.height} unoptimized onError={() => setMapFailed(true)} />
                {groups.map(({ point, items }) => {
                  const [item] = items;
                  const pinStyle = { left: `${point[0]}%`, top: `${point[1]}%` };
                  if (items.length > 1) {
                    const label = `${t.group} · ${items.map(location => location.name).join(', ')}`;
                    return (
                      <button key={item.id} type="button" className={styles.cluster} style={pinStyle}
                        aria-label={label} aria-haspopup="dialog"
                        onClick={event => { opener.current = event.currentTarget; setOpenGroup({ point, items }); }}>
                        {items.length}
                      </button>
                    );
                  }
                  const Icon = found.includes(item.id) ? Check : categoryIcons[item.category];
                  const label = [item.name, item.approximate && t.approximate, found.includes(item.id) && t.found].filter(Boolean).join(' · ');
                  return (
                    <a key={item.id} href={`#${markerId(item.id)}`} onClick={event => select(event, item)}
                      className={`${styles.marker} ${styles[item.category]}`}
                      style={pinStyle} data-approximate={item.approximate}
                      aria-haspopup="dialog"
                      aria-current={selected?.id === item.id ? 'location' : undefined} title={label} aria-label={label}>
                      <Icon size={17} aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            <Image className={styles.staticMap} src={leonidaMap.src} alt={t.mapCredit}
              width={leonidaMap.width} height={leonidaMap.height} unoptimized onError={() => setMapFailed(true)} />
          )}
        </div>
        <p className={styles.scaleNote}><a href={leonidaMap.source}>{t.mapCredit}</a></p>
      </div>

      <dialog ref={drawer} className={styles.drawer} aria-labelledby="gta6-location-title" onClose={closeDrawer}
        onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
        {(selected || openGroup) && (
          <div className={styles.selected}>
            {selected && openGroup && (
              <button type="button" className={styles.groupBack} onClick={clearLocation}>
                <ArrowLeft size={16} aria-hidden="true" /> {t.groupBack}
              </button>
            )}
            <header className={styles.drawerHeader}>
              <div>
                {selected && (
                  <p className={`${styles.place} ${styles[selected.category]}`}>
                    <MapPin size={14} aria-hidden="true" /> {selected.region} · {t.categories[selected.category]}{selected.approximate && ` · ${t.approximate}`}
                  </p>
                )}
                <h2 id="gta6-location-title">{selected?.name ?? `${openGroup?.items.length} ${t.stops.toLowerCase()}`}</h2>
              </div>
              <button ref={closeControl} type="button" className={styles.close} aria-label={t.close} onClick={() => drawer.current?.close()}>
                <X size={20} aria-hidden="true" />
              </button>
            </header>
            {selected ? (
              <>
                {selected.image && (
                  <Image className={styles.preview} src={selected.image.src} alt={selected.image.alt}
                    width={480} height={270} loading="eager" unoptimized />
                )}
                <p className={styles.directions}>{selected.directions}</p>
                <a className={styles.guide} href={selected.href}>{t.guide} <ArrowUpRight size={16} aria-hidden="true" /></a>
                <div className={styles.actions}>
                  <button type="button" aria-pressed={found.includes(selected.id)} onClick={() => toggleFound(selected.id)}>
                    <Check size={17} aria-hidden="true" /> {found.includes(selected.id) ? t.undoFound : t.markFound}
                  </button>
                  <button type="button" onClick={() => copyLocation(selected.id)}>
                    <Link2 size={17} aria-hidden="true" /> {t.copy}
                  </button>
                </div>
                {copyStatus && <p className={styles.status} role="status">{copyStatus}</p>}
              </>
            ) : openGroup && (
              <>
                <ul className={styles.groupList}>
                  {openGroup.items.map(item => {
                    const Icon = found.includes(item.id) ? Check : categoryIcons[item.category];
                    return (
                      <li key={item.id}>
                        <button type="button" className={styles[item.category]} onClick={() => showLocation(item)}>
                          <Icon size={18} aria-hidden="true" />
                          <span><strong>{item.name}</strong><small>{item.region} · {t.categories[item.category]}</small></span>
                          <ChevronRight size={16} aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <button type="button" disabled={viewZoom >= maximumZoom} onClick={() => {
                  changeZoom(Math.min(maximumZoom, Math.max(keysZoom, viewZoom * 1.7)), openGroup.point);
                  drawer.current?.close();
                }}>
                  <Plus size={17} aria-hidden="true" /> {t.groupZoom}
                </button>
              </>
            )}
          </div>
        )}
      </dialog>

      <div className={styles.adSpace}>
        <span>{t.ad}</span>
        <AdSlot id="gta6-map-after-map" />
      </div>

      <section className={styles.results} aria-labelledby="gta6-map-results">
        <div className={styles.resultsBar}>
          <h2 id="gta6-map-results">{t.stops} <span>{visible.length}</span></h2>
        </div>
        <ul className={styles.list}>
          {visible.map(item => {
            const isFound = found.includes(item.id);
            const Icon = isFound ? Check : categoryIcons[item.category];
            return (
              <li key={item.id} id={markerId(item.id)} className={styles[item.category]}>
                <a href={ready ? `#${markerId(item.id)}` : item.href} onClick={event => select(event, item, true)}
                  aria-haspopup={ready ? 'dialog' : undefined}
                  aria-current={selected?.id === item.id ? 'location' : undefined}>
                  <Icon size={20} aria-hidden="true" />
                  <span><strong>{item.name}</strong><small>{item.region} · {t.categories[item.category]}{isFound && ` · ${t.found}`}</small></span>
                </a>
                <p>{item.directions}</p>
              </li>
            );
          })}
        </ul>
        {visible.length === 0 && (
          <div className={styles.empty}>
            <p>{t.empty}</p>
            <button type="button" onClick={clearFilters}>{t.reset}</button>
          </div>
        )}
      </section>

      <div className={styles.adSpace} hidden={visible.length <= 6}>
        <span>{t.ad}</span>
        <AdSlot id="gta6-map-after-list" />
      </div>
    </div>
  );
}
