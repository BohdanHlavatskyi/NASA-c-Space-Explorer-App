#!/usr/bin/env python3
"""
Fetch galaxy metadata from NASA Image and Video Library and create a local JSON database.

This script queries https://images-api.nasa.gov/search?q=<query>&media_type=image
and extracts basic metadata. It will not download large images by default; use
`--download-images` to fetch thumbnails selectively.

Usage:
  python3 scripts/fetch_galaxies.py --query "NGC" --limit 100 --output data/galaxies.json
"""
import argparse
import json
import math
import os
import re
import sys
try:
    from urllib.request import urlopen, Request
    from urllib.parse import urlencode
except Exception:
    print('urllib unavailable', file=sys.stderr)
    raise

BASE_SEARCH = 'https://images-api.nasa.gov/search'
ASSET_ENDPOINT = 'https://images-api.nasa.gov/asset/'

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

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--query', default='galaxy', help='Search query for NASA images')
    p.add_argument('--limit', type=int, default=100, help='Maximum number of items to fetch')
    p.add_argument('--output', default='data/galaxies.json', help='Output JSON path')
    p.add_argument('--download-images', action='store_true', help='Download thumbnail images')
    p.add_argument('--images-dir', default='data/images', help='Directory to save downloaded images')
    args = p.parse_args()

    os.makedirs(os.path.dirname(args.output) or '.', exist_ok=True)
    if args.download_images:
        os.makedirs(args.images_dir, exist_ok=True)

    results = []
    page = 1
    fetched = 0
    while fetched < args.limit:
        try:
            data = fetch_search(args.query, page=page)
        except Exception as e:
            print('Search failed:', e, file=sys.stderr)
            break

        items = data.get('collection', {}).get('items', [])
        if not items:
            break

        for item in items:
            if fetched >= args.limit:
                break
            d = item.get('data', [{}])[0]
            links = item.get('links', []) or []
            nasa_id = d.get('nasa_id') or d.get('title')
            title = d.get('title')
            desc = d.get('description') or d.get('secondary_creator') or ''
            date_created = d.get('date_created')
            redshift = parse_redshift(desc)

            thumb = None
            for link in links:
                href = link.get('href')
                if not href:
                    continue
                if link.get('rel') in ('preview', 'thumbnail', 'canonical'):
                    thumb = href
                    break
                if href.lower().endswith('.jpg') or href.lower().endswith('.png'):
                    thumb = thumb or href

            asset_url = None
            try:
                asset = fetch_asset(nasa_id)
                asset_items = asset.get('collection', {}).get('items', [])
                # prefer small preview images
                for a in asset_items:
                    href = a.get('href')
                    if href and (href.endswith('~thumb.jpg') or href.endswith('~medium.jpg') or href.endswith('.jpg')):
                        asset_url = href
                        break
            except Exception:
                asset_url = asset_url or thumb

            entry = {
                'id': str(nasa_id).replace(' ', '_'),
                'name': title,
                'summary': desc,
                'date_created': date_created,
                'redshift': redshift,
                'imageUrl': asset_url or thumb,
                'sourceUrl': asset_url or thumb
            }

            if redshift is not None:
                entry['ageGyr'] = redshift_to_age_gyr(redshift)

            results.append(entry)
            fetched += 1

        page += 1

    # Save results
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f'Saved {len(results)} items to {args.output}')

if __name__ == '__main__':
    main()
