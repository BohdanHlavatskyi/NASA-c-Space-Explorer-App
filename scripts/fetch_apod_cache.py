#!/usr/bin/env python3

"""Fetch recent APOD entries from NASA's archive and build a local cache."""

import argparse
import json
import re
from datetime import date
from urllib.parse import urljoin
from urllib.request import Request, urlopen


APOD_BASE = 'https://apod.nasa.gov/apod/'
APOD_ARCHIVE = urljoin(APOD_BASE, 'archivepix.html')


def fetch_url(url, timeout=45):
    req = Request(url, headers={'User-Agent': 'fetch_apod_cache/1.0'})
    with urlopen(req, timeout=timeout) as response:
        return response.read().decode('utf-8', 'ignore')


def normalize_whitespace(value):
    return re.sub(r'\s+', ' ', value).strip()


def strip_tags(value):
    return re.sub(r'<[^>]+>', ' ', value)


def extract_archive_entries(archive_html):
    pattern = re.compile(r'<a href="(ap\d{6}\.html)">([^<]+)</a><br>', re.I)
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

        entries.append({
            'href': href,
            'title': normalize_whitespace(title),
            'date': date(year, month, day).isoformat()
        })

    return entries


def extract_title(page_html):
    match = re.search(r'<title>\s*(.*?)\s*</title>', page_html, re.I | re.S)
    if not match:
        return 'Astronomy Picture of the Day'

    title = normalize_whitespace(match.group(1))
    title = re.sub(r'^APOD:\s*', '', title, flags=re.I)
    title = re.sub(r'^\d{4}\s+[A-Za-z]+\s+\d{1,2}\s*[–-]\s*', '', title)
    title = re.sub(r'^\d{4}\s+[A-Za-z]+\s+\d{1,2}\s+', '', title)
    return title or 'Astronomy Picture of the Day'


def extract_explanation(page_html):
    match = re.search(
        r'<b>\s*Explanation:\s*</b>(.*?)(?:<p>\s*<center>|<p>\s*<hr>|<hr>|</body>)',
        page_html,
        re.I | re.S
    )
    if not match:
        return ''

    text = strip_tags(match.group(1))
    return normalize_whitespace(text)


def extract_media(page_html):
    iframe_match = re.search(r'<iframe[^>]+src="([^"]+)"', page_html, re.I)
    if iframe_match:
      media_url = iframe_match.group(1)
      if media_url.startswith('//'):
          media_url = 'https:' + media_url
      return {
          'media_type': 'video',
          'url': media_url,
          'hdurl': None,
          'imageUrl': None
      }

    image_match = re.search(
        r'<a href="(image/[^\"]+\.(?:jpg|jpeg|png|gif|webp))"[^>]*>\s*<img[^>]+src="(image/[^\"]+\.(?:jpg|jpeg|png|gif|webp))"',
        page_html,
        re.I | re.S
    )

    if not image_match:
        image_match = re.search(
            r'<img[^>]+src="(image/[^\"]+\.(?:jpg|jpeg|png|gif|webp))"',
            page_html,
            re.I | re.S
        )

    if not image_match:
        return None

    if image_match.lastindex and image_match.lastindex >= 2:
        hd_path = image_match.group(1)
        image_path = image_match.group(2)
    else:
        hd_path = image_match.group(1)
        image_path = hd_path

    return {
        'media_type': 'image',
        'url': urljoin(APOD_BASE, image_path),
        'hdurl': urljoin(APOD_BASE, hd_path),
        'imageUrl': urljoin(APOD_BASE, image_path)
    }


def build_apod_entry(archive_entry):
    page_url = urljoin(APOD_BASE, archive_entry['href'])
    page_html = fetch_url(page_url)

    title = extract_title(page_html)
    explanation = extract_explanation(page_html)
    media = extract_media(page_html)

    if not media or not explanation:
        return None

    summary = explanation
    if len(summary.split()) > 100:
        summary = ' '.join(summary.split()[:100]) + '...'

    entry = {
        'id': f"apod-{archive_entry['date']}",
        'name': title,
        'title': title,
        'summary': summary,
        'fullSummary': explanation,
        'explanation': explanation,
        'date': archive_entry['date'],
        'date_created': archive_entry['date'],
        'sourceUrl': page_url,
        'sourceQuery': 'apod archive',
        'dataset': 'nasa-apod-archive',
        'keywords': [],
        **media
    }

    return entry


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--days', type=int, default=60, help='Number of recent APOD entries to cache')
    parser.add_argument('--output', default='data/apod-cache.json', help='Output JSON path')
    args = parser.parse_args()

    archive_html = fetch_url(APOD_ARCHIVE)
    archive_entries = extract_archive_entries(archive_html)

    results = []
    for archive_entry in archive_entries:
        if len(results) >= args.days:
            break

        try:
          entry = build_apod_entry(archive_entry)
        except Exception:
          continue

        if entry:
            results.append(entry)

    results.sort(key=lambda item: item['date'])

    with open(args.output, 'w', encoding='utf-8') as handle:
        json.dump(results, handle, indent=2, ensure_ascii=False)

    print(f'Wrote {len(results)} APOD records to {args.output}')


if __name__ == '__main__':
    main()