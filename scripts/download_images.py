#!/usr/bin/env python3
"""
Download thumbnail images for the first N galaxy entries in data/galaxies.json
that do not already have a localImage. The script skips repeated source URLs and
updates data/galaxies.json in place.

Usage:
    python3 scripts/download_images.py --count 100
"""
import argparse
import json
import os
import sys
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from urllib.parse import urlparse
import re


def safe_filename(url):
    p = urlparse(url)
    name = os.path.basename(p.path)
    if not name:
        name = p.netloc.replace('.', '_')
    return name


def normalize_url(url):
    if not url:
        return ''

    parsed = urlparse(url)
    if not parsed.scheme and not parsed.netloc:
      return re.sub(r'\s+', ' ', str(url)).strip().lower()

    return f'{parsed.netloc.lower()}{parsed.path.rstrip("/")}'.lower()


def download(url, dest):
    req = Request(url, headers={'User-Agent': 'download_images/1.0'})
    try:
        with urlopen(req, timeout=60) as resp:
            with open(dest, 'wb') as fh:
                fh.write(resp.read())
        return True
    except (URLError, HTTPError, Exception) as e:
        return False


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--count', type=int, default=100)
    p.add_argument('--images-dir', default='data/images')
    args = p.parse_args()

    os.makedirs(args.images_dir, exist_ok=True)

    try:
        with open('data/galaxies.json', 'r', encoding='utf-8') as fh:
            data = json.load(fh)
    except Exception as e:
        print('Failed to read data/galaxies.json', e, file=sys.stderr)
        sys.exit(1)

    count = args.count
    downloaded = 0
    seen_urls = set()

    for entry in data:
        if entry.get('localImage'):
            for url in (entry.get('imageUrl'), entry.get('sourceUrl'), entry.get('localImage')):
                key = normalize_url(url)
                if key:
                    seen_urls.add(key)

    candidates = [entry for entry in data if not entry.get('localImage')]
    candidates.sort(key=lambda entry: (
        0 if entry.get('dataset') == 'nasa-galaxy-expansion' else 1,
        0 if entry.get('sourceQuery') else 1,
        normalize_url(entry.get('sourceUrl') or entry.get('imageUrl')),
        normalize_url(entry.get('name'))
    ))

    for entry in candidates:
        if downloaded >= count:
            break
        if entry.get('downloadFailed'):
            continue
        url = entry.get('imageUrl') or entry.get('sourceUrl')
        if not url:
            continue

        url_key = normalize_url(url)
        if url_key and url_key in seen_urls:
            continue

        filename = safe_filename(url)
        # make unique
        base, ext = os.path.splitext(filename)
        if not ext:
            ext = '.jpg'
        dest_name = f"{base}_{downloaded}{ext}"
        dest_path = os.path.join(args.images_dir, dest_name)

        ok = download(url, dest_path)
        if ok:
            entry['localImage'] = dest_path.replace('\\\\', '/')
            downloaded += 1
            if url_key:
                seen_urls.add(url_key)
            print('Downloaded', url, '->', dest_path)
        else:
            entry['downloadFailed'] = True
            print('Failed to download', url)

    # write back
    with open('data/galaxies.json', 'w', encoding='utf-8') as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)

    print(f'Downloaded {downloaded} images, updated data/galaxies.json')


if __name__ == '__main__':
    main()
