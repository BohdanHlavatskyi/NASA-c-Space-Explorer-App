#!/usr/bin/env python3
"""
Fetch galaxy metadata from NASA Image and Video Library and create a local JSON database.

This script queries the NASA image archive for galaxy-related records, deduplicates
them against an existing database, and preserves previously downloaded local images.

Usage:
  python3 scripts/fetch_galaxies.py --limit 500 --output data/galaxies.json
"""
import argparse
import json
import math
import os
import re
import sys
from datetime import date, timedelta
try:
    from urllib.request import urlopen, Request
    from urllib.parse import urlencode
    from urllib.parse import urlparse
except Exception:
    print('urllib unavailable', file=sys.stderr)
    raise

BASE_SEARCH = 'https://images-api.nasa.gov/search'
ASSET_ENDPOINT = 'https://images-api.nasa.gov/asset/'
APOD_API = 'https://api.nasa.gov/planetary/apod'
APOD_ARCHIVE = 'https://apod.nasa.gov/apod/archivepix.html'
APOD_ARCHIVE_FULL = 'https://apod.nasa.gov/apod/archivepixFull.html'
APOD_BASE = 'https://apod.nasa.gov/apod/'
APOD_START_DATE = date(1995, 6, 24)
DEFAULT_QUERIES = [
    'galaxy',
    'spiral galaxy',
    'elliptical galaxy',
    'barred spiral galaxy',
    'interacting galaxies',
    'galaxy cluster',
    'deep field galaxy',
    'hubble galaxy',
    'jwst galaxy',
    'ngc galaxy',
    'galaxy evolution',
    'galaxy merger',
    'galaxy survey',
    'dwarf galaxy',
    'lenticular galaxy',
    'irregular galaxy',
    'starburst galaxy',
    'local group galaxy',
    'active galaxy nucleus',
    'andromeda galaxy',
    'milky way galaxy',
    'whirlpool galaxy',
    'sombrero galaxy',
    'pinwheel galaxy',
    'cartwheel galaxy',
    'messier galaxy',
    'ngc spiral galaxy',
    'eso galaxy',
    'galaxy field'
]

GALAXY_TERMS = re.compile(
    r'\b(galaxy|galaxies|spiral|elliptical|lenticular|dwarf|irregular|'
    r'barred|interacting|merger|merging|cluster|field|deep field|'
    r'andromeda|milky way|whirlpool|sombrero|pinwheel|cartwheel|messier)\b',
    re.I
)
NON_GALAXY_TERMS = re.compile(
    r'\b(planet|planets|people|person|astronaut|human|humans|earth|moon|'
    r'solar system|satellite|jupiter|saturn|mars|venus|mercury|neptune|'
    r'uranus|pluto|comet|asteroid|nebula|supernova|sun)\b',
    re.I
)


def normalize_text(value):
    if not value:
        return ''
    return re.sub(r'\s+', ' ', str(value)).strip().lower()


def normalize_url(value):
    if not value:
        return ''

    parsed = urlparse(value)
    if not parsed.scheme and not parsed.netloc:
        return normalize_text(value)

    path = parsed.path.rstrip('/')
    return f'{parsed.netloc.lower()}{path}'.lower()


def entry_key(entry):
    candidates = [
        entry.get('id'),
        entry.get('nasa_id'),
        entry.get('imageUrl'),
        entry.get('sourceUrl'),
        entry.get('localImage'),
        entry.get('name')
    ]

    for candidate in candidates:
        key = normalize_url(candidate) if candidate and '://' in str(candidate) else normalize_text(candidate)
        if key:
            return key

    return ''


def load_existing_entries(path):
    if not path or not os.path.exists(path):
        return []

    try:
        with open(path, 'r', encoding='utf-8') as fh:
            data = json.load(fh)
            return data if isinstance(data, list) else []
    except Exception:
        return []

def parse_redshift(text):
    if not text:
        return None
    m = re.search(r'(?:z|redshift)[=:]?\s*([0-9]+\.?[0-9]*)', text, re.I)
    if m:
        try:
            return float(m.group(1))
        except Exception:
            return None
    return None


def is_galaxy_record(title, desc, keywords):
    text = ' '.join([
        normalize_text(title),
        normalize_text(desc),
        normalize_text(' '.join(keywords or []))
    ])

    return bool(GALAXY_TERMS.search(text)) and not bool(NON_GALAXY_TERMS.search(text))

def redshift_to_age_gyr(z, steps=1000):
    # Same approximate cosmology as the frontend: H0=70, Om=0.3, Ol=0.7
    if z is None:
        return None
    H0 = 70.0
    Om = 0.3
    Ol = 0.7
    Mpc_m = 3.085677581e22
    H0_s = (H0 * 1000.0) / Mpc_m
    seconds_per_gyr = 3.15576e16
    tH0_Gyr = 1.0 / H0_s / seconds_per_gyr

    def E(zp):
        return math.sqrt(Om * (1 + zp) ** 3 + Ol)

    dz = z / steps
    s = 0.0
    for i in range(0, steps + 1):
        zp = i * dz
        w = 0.5 if i == 0 or i == steps else 1.0
        s += w * (1.0 / ((1 + zp) * E(zp)))
    integral = s * dz
    lookback = tH0_Gyr * integral
    age_universe = 13.8
    age = max(0.0, age_universe - lookback)
    return round(age, 2)

def fetch_search(query, page=1):
    qs = {'q': query, 'media_type': 'image', 'page': page}
    url = BASE_SEARCH + '?' + urlencode(qs)
    req = Request(url, headers={'User-Agent': 'fetch_galaxies/1.0'})
    with urlopen(req, timeout=30) as resp:
        return json.load(resp)

def fetch_asset(nasa_id):
    url = ASSET_ENDPOINT + nasa_id
    req = Request(url, headers={'User-Agent': 'fetch_galaxies/1.0'})
    with urlopen(req, timeout=30) as resp:
        return json.load(resp)


def fetch_apod_range(start_date, end_date):
    qs = {
        'api_key': 'DEMO_KEY',
        'start_date': start_date,
        'end_date': end_date
    }
    url = APOD_API + '?' + urlencode(qs)
    req = Request(url, headers={'User-Agent': 'fetch_galaxies/1.0'})
    with urlopen(req, timeout=60) as resp:
        data = json.load(resp)
        return data if isinstance(data, list) else [data]


def fetch_apod_archive(url=APOD_ARCHIVE):
    req = Request(url, headers={'User-Agent': 'fetch_galaxies/1.0'})
    with urlopen(req, timeout=60) as resp:
        return resp.read().decode('utf-8', 'ignore')


def extract_apod_entries(archive_html):
    pattern = re.compile(r'<a href="(ap\d+\.html)">([^<]+)</a><br>', re.I)
    entries = []
    for href, title in pattern.findall(archive_html):
        date_match = re.search(r'ap(\d{6})\.html', href, re.I)
        if not date_match:
            continue
        date_code = date_match.group(1)
        year = int(date_code[:2])
        year += 2000 if year < 70 else 1900
        month = int(date_code[2:4])
        day = int(date_code[4:6])
        entry_date = date(year, month, day).isoformat()
        entries.append({
            'href': href,
            'title': title,
            'date': entry_date
        })
    return entries


def extract_apod_media_and_text(page_html):
    if re.search(r'<video\b', page_html, re.I):
        return None, None, None

    image_match = re.search(r'<a href="(image/[^"]+\.(?:jpg|jpeg|png|gif|webp))"', page_html, re.I)
    if not image_match:
        image_match = re.search(r'<img[^>]+src="(image/[^"]+\.(?:jpg|jpeg|png|gif|webp))"', page_html, re.I)

    if not image_match:
        return None, None, None

    image_url = APOD_BASE + image_match.group(1)

    explanation_match = re.search(r'<b>\s*Explanation:\s*</b>(.*?)(?:<p>|</center>|</body>)', page_html, re.I | re.S)
    explanation_html = explanation_match.group(1) if explanation_match else ''
    explanation_text = re.sub(r'<[^>]+>', ' ', explanation_html)
    explanation_text = re.sub(r'\s+', ' ', explanation_text).strip()

    keywords_match = re.search(r'<meta name="keywords" content="([^"]+)"', page_html, re.I)
    keywords = []
    if keywords_match:
        keywords = [part.strip() for part in keywords_match.group(1).split(',') if part.strip()]

    return image_url, explanation_text, keywords


def fetch_apod_page(href):
    url = APOD_BASE + href
    req = Request(url, headers={'User-Agent': 'fetch_galaxies/1.0'})
    with urlopen(req, timeout=45) as resp:
        return resp.read().decode('utf-8', 'ignore')


def add_entry(results, seen, entry):
    key = entry_key(entry)
    if not key or key in seen:
        return False

    seen.add(key)
    results.append(entry)
    return True


def harvest_apod_galaxies(results, seen, limit):
    try:
        archive_html = fetch_apod_archive(APOD_ARCHIVE)
        archive_html_full = fetch_apod_archive(APOD_ARCHIVE_FULL)
        apod_entries = extract_apod_entries(archive_html) + extract_apod_entries(archive_html_full)
    except Exception as e:
        print('APOD archive failed:', e, file=sys.stderr)
        return

    seen_hrefs = set()
    for apod_entry in apod_entries:
        if len(results) >= limit:
            return

        href = apod_entry['href']
        if href in seen_hrefs:
            continue
        seen_hrefs.add(href)

        title = apod_entry['title']
        if not is_galaxy_record(title, '', []):
            continue

        try:
            page_html = fetch_apod_page(href)
        except Exception as e:
            print('APOD page failed:', href, e, file=sys.stderr)
            continue

        image_url, desc, keywords = extract_apod_media_and_text(page_html)
        if not image_url or not desc:
            continue

        if not is_galaxy_record(title, desc, keywords):
            continue

        redshift = parse_redshift(desc)
        entry = {
            'id': f"apod-{apod_entry['date']}",
            'name': title,
            'summary': desc,
            'date_created': apod_entry['date'],
            'keywords': keywords,
            'sourceQuery': 'apod archive galaxy titles',
            'dataset': 'nasa-apod-galaxy-archive',
            'redshift': redshift,
            'imageUrl': image_url,
            'sourceUrl': image_url
        }

        if redshift is not None:
            entry['ageGyr'] = redshift_to_age_gyr(redshift)

        add_entry(results, seen, entry)

def main():
    p = argparse.ArgumentParser()
    p.add_argument(
        '--query',
        action='append',
        dest='queries',
        help='Search query for NASA images. May be provided multiple times.'
    )
    p.add_argument('--limit', type=int, default=100, help='Maximum number of items to fetch')
    p.add_argument('--output', default='data/galaxies.json', help='Output JSON path')
    p.add_argument('--existing', default='data/galaxies.json', help='Existing galaxy database used to skip duplicates')
    p.add_argument('--page-limit', type=int, default=25, help='Maximum pages to scan per query')
    p.add_argument('--download-images', action='store_true', help='Download thumbnail images')
    p.add_argument('--images-dir', default='data/images', help='Directory to save downloaded images')
    args = p.parse_args()

    os.makedirs(os.path.dirname(args.output) or '.', exist_ok=True)
    if args.download_images:
        os.makedirs(args.images_dir, exist_ok=True)

    existing_entries = load_existing_entries(args.existing)
    results = []
    seen = set()

    for entry in existing_entries:
        key = entry_key(entry)
        if key:
            seen.add(key)

    harvest_apod_galaxies(results, seen, args.limit)

    queries = args.queries or DEFAULT_QUERIES
    pages_scanned = 0

    for query in queries:
        for page in range(1, args.page_limit + 1):
            if len(results) >= args.limit:
                break

            try:
                data = fetch_search(query, page=page)
            except Exception as e:
                print('Search failed:', query, page, e, file=sys.stderr)
                break

            pages_scanned += 1
            items = data.get('collection', {}).get('items', [])
            if not items:
                break

            for item in items:
                if len(results) >= args.limit:
                    break

                d = item.get('data', [{}])[0]
                links = item.get('links', []) or []
                nasa_id = d.get('nasa_id') or d.get('title')
                title = d.get('title')
                desc = d.get('description') or d.get('secondary_creator') or ''
                date_created = d.get('date_created')
                keywords = d.get('keywords') or []
                if not is_galaxy_record(title, desc, keywords):
                    continue
                redshift = parse_redshift(desc)

                thumb = None
                for link in links:
                    href = link.get('href')
                    if not href:
                        continue
                    if link.get('rel') in ('preview', 'thumbnail', 'canonical'):
                        thumb = href
                        break
                    if href.lower().endswith('.jpg') or href.lower().endswith('.jpeg') or href.lower().endswith('.png'):
                        thumb = thumb or href

                asset_url = None
                try:
                    asset = fetch_asset(nasa_id)
                    asset_items = asset.get('collection', {}).get('items', [])
                    for a in asset_items:
                        href = a.get('href')
                        if href and (href.endswith('~thumb.jpg') or href.endswith('~medium.jpg') or href.endswith('.jpg') or href.endswith('.jpeg') or href.endswith('.png')):
                            asset_url = href
                            break
                except Exception:
                    asset_url = asset_url or thumb

                image_url = asset_url or thumb
                entry = {
                    'id': str(nasa_id).replace(' ', '_'),
                    'name': title,
                    'summary': desc,
                    'date_created': date_created,
                    'keywords': keywords,
                    'sourceQuery': query,
                    'dataset': 'nasa-galaxy-expansion',
                    'redshift': redshift,
                    'imageUrl': image_url,
                    'sourceUrl': image_url
                }

                if redshift is not None:
                    entry['ageGyr'] = redshift_to_age_gyr(redshift)

                add_entry(results, seen, entry)

    merged = existing_entries[:]
    merged_seen = set()
    for entry in merged:
        key = entry_key(entry)
        if key:
            merged_seen.add(key)

    for entry in results:
        key = entry_key(entry)
        if key and key not in merged_seen:
            merged.append(entry)
            merged_seen.add(key)

    merged.sort(key=lambda item: (
        item.get('ageGyr') is None,
        item.get('ageGyr') if item.get('ageGyr') is not None else 0,
        normalize_text(item.get('name'))
    ))

    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)

    print(f'Saved {len(merged)} total items to {args.output} after scanning {pages_scanned} pages')

if __name__ == '__main__':
    main()
