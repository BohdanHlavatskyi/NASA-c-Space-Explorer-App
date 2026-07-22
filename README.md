# NASA-c-Space-Explorer-App
This is my vision for the app that may be used by NASA for promotions and public outreach

## NASA APOD Explorer

This project is a static, accessible APOD gallery that fetches 9 consecutive days of NASA Astronomy Picture of the Day data, shows an image/video gallery, and opens a modal with full details.

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
