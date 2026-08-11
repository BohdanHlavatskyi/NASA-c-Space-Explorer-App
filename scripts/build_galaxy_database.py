#!/usr/bin/env python3
"""
Build a normalized galaxy database from data/galaxies.json.

The output is sorted by age and deduplicated by normalized record identity.
Failed downloads are excluded from the final curated database.
"""

import argparse
import json
import math
import os
import re
import hashlib
from urllib.parse import urlparse


DEFAULT_INPUT = 'data/galaxies.json'
DEFAULT_OUTPUT = 'data/galaxy-database.json'
GALAXY_TERMS = re.compile(
    r'\b(galaxy|galaxies|spiral|elliptical|lenticular|dwarf|cluster|interacting|'
    r'merging|whirlpool|barred|andromeda|milky way|deep field)\b',
    re.IGNORECASE
)
NON_GALAXY_TERMS = re.compile(
    r'\b(planet|planets|people|person|astronaut|human|humans|earth|moon|'
    r'solar system|satellite|jupiter|saturn|mars|venus|mercury|neptune|'
    r'uranus|pluto)\b',
    re.IGNORECASE
)
GALAXY_CATEGORY_RULES = {
    'spiral': re.compile(
        r'\bspiral\b|\bbarred\b|\bdisk\b|\bwhirlpool\b|\bandromeda\b|\bmilky way\b|\bpinwheel\b|\bcartwheel\b|\bgrand-design\b',
        re.IGNORECASE
    ),
    'elliptical': re.compile(
        r'\belliptical\b|\bellipsoid\b|\bspheroid\b|\bgiant elliptical\b|\broughly spherical\b',
        re.IGNORECASE
    ),
    'spherical': re.compile(
        r'\bspherical\b|\broughly spherical\b|\bglobular\b',
        re.IGNORECASE
    ),
    'interacting': re.compile(
        r'\binteracting\b|\bmerging\b|\bmerger\b|\btidal\b|\bcollision\b|\bcompanion\b|\bpair\b|\bdistorted\b|\bantennae\b|\binteraction\b',
        re.IGNORECASE
    )
}


def normalize_text(value):
    if value is None:
        return ''
    return re.sub(r'\s+', ' ', str(value)).strip().lower()


def normalize_url(value):
    if not value:
        return ''

    parsed = urlparse(str(value))
    if not parsed.scheme and not parsed.netloc:
        return normalize_text(value)

    return f'{parsed.netloc.lower()}{parsed.path.rstrip("/")}'.lower()


def galaxy_text(entry):
    return ' '.join(
        normalize_text(entry.get(field))
        for field in ['name', 'summary', 'fullSummary', 'sourceQuery', 'dataset', 'morphology', 'environment']
        if entry.get(field)
    )


def infer_galaxy_categories(entry):
    text = galaxy_text(entry)
    categories = []

    for key, pattern in GALAXY_CATEGORY_RULES.items():
        if pattern.search(text):
            categories.append(key)

    return categories


def record_keys(entry):
    keys = []
    for candidate in [
        entry.get('id'),
        entry.get('imageUrl'),
        entry.get('sourceUrl'),
        entry.get('localImage')
    ]:
        if not candidate:
            continue

        key = normalize_url(candidate) if '://' in str(candidate) else normalize_text(candidate)
        if key:
            keys.append(key)

    return keys


def ensure_age(entry):
    age = entry.get('ageGyr')
    if isinstance(age, (int, float)) and not math.isnan(age):
        return float(age)

    redshift = entry.get('redshift')
    if isinstance(redshift, (int, float)) and not math.isnan(redshift):
        # Match the frontend approximation closely enough for filtering.
        h0 = 70.0
        om = 0.3
        ol = 0.7
        mpc_m = 3.085677581e22
        h0_s = (h0 * 1000.0) / mpc_m
        seconds_per_gyr = 3.15576e16
        t_h0_gyr = 1.0 / h0_s / seconds_per_gyr

        def e(zp):
            return math.sqrt(om * (1 + zp) ** 3 + ol)

        steps = 1000
        dz = redshift / steps if steps else redshift
        total = 0.0
        for index in range(steps + 1):
            zp = index * dz
            weight = 0.5 if index == 0 or index == steps else 1.0
            total += weight * (1.0 / ((1 + zp) * e(zp)))

        lookback = t_h0_gyr * total * dz
        return round(max(0.0, 13.8 - lookback), 2)

    return estimate_age_from_metadata(entry)


def estimate_age_from_metadata(entry):
    text = ' '.join(
        normalize_text(entry.get(field))
        for field in ['name', 'summary', 'sourceQuery', 'dataset']
        if entry.get(field)
    )

    bucket = None
    if any(token in text for token in ['farthest', 'deep field', 'deep-field', 'distant', 'early universe', 'high-redshift', 'z=']):
        bucket = (0.5, 3.0)
    elif any(token in text for token in ['starburst', 'young', 'forming', 'proto', 'merging', 'interaction', 'interacting']):
        bucket = (2.0, 7.0)
    elif any(token in text for token in ['elliptical', 'spherical', 'cluster', 'giant', 'bulge']):
        bucket = (8.0, 13.7)
    elif any(token in text for token in ['spiral', 'disk', 'barred', 'whirlpool', 'andromeda', 'milky way']):
        bucket = (6.0, 12.0)
    elif any(token in text for token in ['dwarf', 'irregular', 'ring']):
        bucket = (3.0, 10.0)

    if bucket is None:
        bucket = (1.0, 13.7)

    digest = hashlib.sha1(normalize_text(entry.get('id') or entry.get('name')).encode('utf-8')).hexdigest()
    fraction = int(digest[:8], 16) / 0xFFFFFFFF
    age = bucket[0] + (bucket[1] - bucket[0]) * fraction
    return round(age, 2)


def truncate_words(value, max_words=100):
    if not value:
        return ''

    words = re.findall(r'\S+', str(value))
    if len(words) <= max_words:
        return ' '.join(words)

    return ' '.join(words[:max_words]) + '...'


def is_galaxy_record(entry):
    text = ' '.join(
        normalize_text(entry.get(field))
        for field in ['name', 'summary', 'sourceQuery', 'dataset']
        if entry.get(field)
    )

    return bool(GALAXY_TERMS.search(text)) and not bool(NON_GALAXY_TERMS.search(text))


def clean_entry(entry):
    cleaned = dict(entry)
    cleaned.pop('downloadFailed', None)

    full_summary = cleaned.get('summary') or ''
    cleaned['name'] = cleaned.get('name') or cleaned.get('id') or 'Unknown galaxy'
    cleaned['fullSummary'] = full_summary
    cleaned['summary'] = truncate_words(full_summary, 100)
    cleaned['sourceQuery'] = cleaned.get('sourceQuery') or 'galaxy'
    cleaned['dataset'] = cleaned.get('dataset') or 'nasa-galaxy-archive'
    cleaned['ageGyr'] = ensure_age(cleaned)
    cleaned['categoryTags'] = infer_galaxy_categories(cleaned)
    cleaned['galaxyType'] = cleaned.get('galaxyType') or (cleaned['categoryTags'][0] if cleaned['categoryTags'] else None)

    if cleaned.get('localImage'):
        cleaned['localImage'] = str(cleaned['localImage']).replace('\\\\', '/')

    return cleaned


def build_minimal_record(entry):
    text = galaxy_text(entry)
    age = ensure_age(entry)
    is_elliptical = bool(re.search(r'\belliptical\b|\bgiant elliptical\b|\bellipsoid\b|\bspheroid\b|\broughly spherical\b', text, re.IGNORECASE))
    is_spiral = bool(re.search(r'\bspiral\b|\bbarred\b|\bdisk\b|\bwhirlpool\b|\bandromeda\b|\bmilky way\b|\bpinwheel\b|\bcartwheel\b|\bgrand-design\b', text, re.IGNORECASE))
    is_interacting = bool(re.search(r'\binteracting\b|\bmerging\b|\bmerger\b|\btidal\b|\bcollision\b|\bcompanion\b|\bpair\b|\bdistorted\b|\bantennae\b|\binteraction\b', text, re.IGNORECASE))

    return {
        'id': entry.get('id') or entry.get('name') or 'unknown-galaxy',
        'name': entry.get('name') or 'Unknown galaxy',
        'ageGyr': round(float(age), 2) if isinstance(age, (int, float)) and not math.isnan(age) else 0.0,
        'isElliptical': is_elliptical,
        'isSpiral': is_spiral,
        'isInteracting': is_interacting,
    }


def build_minimal_database(items):
    minimal = []
    seen = set()

    for entry in items:
        if not isinstance(entry, dict):
            continue
        if entry.get('downloadFailed'):
            continue
        if not is_galaxy_record(entry):
            continue

        record = build_minimal_record(entry)
        key = str(record['id']).lower().strip()
        if not key or key in seen:
            continue
        seen.add(key)
        minimal.append(record)

    minimal.sort(key=lambda item: (
        item.get('ageGyr') is None,
        float(item.get('ageGyr') or 0),
        normalize_text(item.get('name'))
    ))
    return minimal


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', default=DEFAULT_INPUT)
    parser.add_argument('--output', default=DEFAULT_OUTPUT)
    parser.add_argument('--minimal-output', default='data/galaxy-database-minimal.json', help='Compact JSON output with only age and type booleans.')
    args = parser.parse_args()

    with open(args.input, 'r', encoding='utf-8') as handle:
        items = json.load(handle)

    if not isinstance(items, list):
        raise SystemExit('Input database must be a JSON array.')

    curated = []
    seen = set()

    for entry in items:
        if not isinstance(entry, dict):
            continue

        if entry.get('downloadFailed'):
            continue

        if not is_galaxy_record(entry):
            continue

        cleaned = clean_entry(entry)
        keys = record_keys(cleaned)
        if not keys or any(key in seen for key in keys):
            continue

        seen.update(keys)
        curated.append(cleaned)

    curated.sort(key=lambda item: (
        item.get('ageGyr') is None,
        item.get('ageGyr') if item.get('ageGyr') is not None else 0,
        normalize_text(item.get('name'))
    ))

    with open(args.output, 'w', encoding='utf-8') as handle:
        json.dump(curated, handle, indent=2, ensure_ascii=False)

    minimal = build_minimal_database(curated)
    with open(args.minimal_output, 'w', encoding='utf-8') as handle:
        json.dump(minimal, handle, separators=(',', ':'), ensure_ascii=False)

    print(f'Wrote {len(curated)} curated galaxy records to {args.output}')
    print(f'Wrote {len(minimal)} compact galaxy records to {args.minimal_output}')


if __name__ == '__main__':
    main()
