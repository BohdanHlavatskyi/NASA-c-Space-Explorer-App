# NASA-c-Space-Explorer-App
This is my vision for the app that may be used by NASA for promotions and public outreach

## NASA APOD Explorer

This project is a static, accessible APOD gallery that loads recent NASA Astronomy Picture of the Day entries from a locally cached archive, shows an image/video gallery, and opens a modal with full details.

### Galaxy database
----------------

This project now uses a curated galaxy database at `data/galaxy-database.json`.
It is built from the raw archive data in `data/galaxies.json` and is sorted by
age so the website can filter everything by age range.

A helper script is provided to rebuild the curated database from the raw source:

```bash
python3 scripts/build_galaxy_database.py --input data/galaxies.json --output data/galaxy-database.json
```

To expand the raw source, you can use:

```bash
python3 scripts/fetch_galaxies.py --limit 500 --output data/galaxies.json --existing data/galaxies.json
python3 scripts/download_images.py --count 500
```

The download step skips repeated source URLs and broken records, then stores
local image paths in the database.

The site provides age filters in the Galaxy Atlas to filter by approximate
galaxy age (Gyr). Ages may be estimated from redshift when available.
### Run locally

Use any local web server from the project root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

If you want to refresh the APOD cache from NASA's archive pages, run:

```bash
python3 scripts/fetch_apod_cache.py --days 60 --output data/apod-cache.json
```

### Features

- Loads recent APOD entries from a local cache generated from NASA's archive pages.
- Dynamically renders gallery cards with image, title, and date.
- Opens an accessible modal with the full-size media, title, date, and explanation.
- Handles APOD video entries with an embed or working link.
- Shows a random space fact on load.
- Uses NASA-inspired styling and hover zoom effects.
