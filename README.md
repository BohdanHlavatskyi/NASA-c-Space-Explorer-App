# NASA-c-Space-Explorer-App
This is my vision for the app that may be used by NASA for promotions and public outreach

## NASA APOD Explorer

This project is a static, accessible APOD gallery that fetches 9 consecutive days of NASA Astronomy Picture of the Day data, shows an image/video gallery, and opens a modal with full details.

### Galaxy database
----------------

This project can augment its built-in small galaxy dataset from an external
JSON file located at `data/galaxies.json`. A helper script is provided to
query open NASA image archives and build a lightweight database:

```bash
python3 scripts/fetch_galaxies.py --query "galaxy" --limit 200 --output data/galaxies.json
```

By default the script will not download all images. Use `--download-images` to
fetch thumbnails selectively and avoid pulling large volumes at once.

The site provides age filters in the Galaxy Atlas to filter by approximate
galaxy age (Gyr). Ages may be estimated from redshift when available.
### Run locally

Use any local web server from the project root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### Features

- Fetches a 9-day consecutive APOD range from the NASA API.
- Dynamically renders gallery cards with image, title, and date.
- Opens an accessible modal with the full-size media, title, date, and explanation.
- Handles APOD video entries with an embed or working link.
- Shows a random space fact on load.
- Uses NASA-inspired styling and hover zoom effects.
