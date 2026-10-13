# Time & Weather Home Module

This repository contains a lightweight, standalone JavaScript module for:
- selecting a city or using the user's current geolocation
- showing the local date and time in that location's timezone
- fetching and displaying weather from Open-Meteo
- greeting the user based on the time of day

## Files
- `home-weather.js` — the standalone module
- `index.html` — example usage page

## Quick start
Open `index.html` in a browser.

## API
```html
<script src="./home-weather.js"></script>
<script>
  HomeWeather.init({ initialIndex: 0 });
  HomeWeather.setUserName("Alex");
</script>
```

## Notes
- Uses `navigator.geolocation` if the user chooses "Use My Location".
- Uses the Open-Meteo free API for weather.
- Works with minimal HTML elements using the expected IDs.
