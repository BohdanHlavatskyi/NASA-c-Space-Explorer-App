#!/usr/bin/env python3
"""
Download thumbnail images for the first N entries in data/galaxies.json that have imageUrl/sourceUrl.
Writes a `localImage` key for each downloaded entry and updates data/galaxies.json.

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


def safe_filename(url):
    p = urlparse(url)
    name = os.path.basename(p.path)
    if not name:
        name = p.netloc.replace('.', '_')
    return name


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
    for entry in data:
        if downloaded >= count:
            break
        if entry.get('localImage'):
            continue
        url = entry.get('imageUrl') or entry.get('sourceUrl')
        if not url:
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
            print('Downloaded', url, '->', dest_path)
        else:
            print('Failed to download', url)

    # write back
    with open('data/galaxies.json', 'w', encoding='utf-8') as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)

    print(f'Downloaded {downloaded} images, updated data/galaxies.json')


if __name__ == '__main__':
    main()
