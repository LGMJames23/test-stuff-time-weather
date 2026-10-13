// Minimal standalone Home/Weather/Time/Location module
// Usage: include this script in a page that has the DOM ids used below, then call HomeWeather.init()

(function (window, document) {
  const cityOptions = [
    { name: "New York, USA", latitude: 40.7128, longitude: -74.006, timeZone: "America/New_York" },
    { name: "Los Angeles, USA", latitude: 34.0522, longitude: -118.2437, timeZone: "America/Los_Angeles" },
    { name: "Chicago, USA", latitude: 41.8781, longitude: -87.6298, timeZone: "America/Chicago" },
    { name: "London, UK", latitude: 51.5072, longitude: -0.1276, timeZone: "Europe/London" },
    { name: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503, timeZone: "Asia/Tokyo" },
    { name: "Sydney, Australia", latitude: -33.8688, longitude: 151.2093, timeZone: "Australia/Sydney" }
  ];

  let activeLocation = cityOptions[0];
  let clockTimer = null;
  let userName = "Guest";

  let locationSelect;
  let randomLocationBtn;
  let useMyLocationBtn;
  let homeLocationLabel;
  let homeTimeLabel;
  let homeDateLabel;
  let homeWeatherLabel;
  let homeGreetingLabel;

  function el(id) { return document.getElementById(id); }

  function populateLocationSelect() {
    if (!locationSelect) return;
    locationSelect.innerHTML = "";
    cityOptions.forEach((city, idx) => {
      const option = document.createElement("option");
      option.value = String(idx);
      option.textContent = city.name;
      locationSelect.appendChild(option);
    });
  }

  function formatClock(date, timeZone) {
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }).format(date);
    const day = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
    return { time, day };
  }

  function greetingFromHour(hour) {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  function updateGreeting(timeZone) {
    if (!homeGreetingLabel) return;
    try {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hour12: false }).formatToParts(new Date());
      const hourPart = parts.find((p) => p.type === "hour");
      const hour = Number(hourPart?.value ?? "12");
      homeGreetingLabel.textContent = `${greetingFromHour(hour)}, ${userName}!`;
    } catch (e) {
      homeGreetingLabel.textContent = `Hello, ${userName}!`;
    }
  }

  function weatherTextFromCode(code) {
    const weatherCodes = {
      0: "Clear",
      1: "Mostly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Foggy",
      51: "Light Drizzle",
      53: "Drizzle",
      55: "Heavy Drizzle",
      61: "Light Rain",
      63: "Rain",
      65: "Heavy Rain",
      71: "Light Snow",
      73: "Snow",
      75: "Heavy Snow",
      80: "Rain Showers",
      81: "Rain Showers",
      82: "Heavy Rain Showers",
      95: "Thunderstorm"
    };
    return weatherCodes[code] || "Unknown";
  }

  async function updateWeather(location) {
    if (!homeWeatherLabel) return;
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}` +
      `&longitude=${location.longitude}&current_weather=true&timezone=auto`;
    homeWeatherLabel.textContent = "Weather: Loading...";
    try {
      const response = await fetch(weatherUrl);
      if (!response.ok) throw new Error("Weather request failed");
      const data = await response.json();
      const current = data.current_weather || data.current;
      const tempC = current?.temperature ?? current?.temperature_2m;
      const code = current?.weathercode ?? current?.weather_code;
      const weather = weatherTextFromCode(code);
      if (typeof tempC === "number") {
        const tempF = (tempC * 9) / 5 + 32;
        homeWeatherLabel.textContent = `Weather: ${weather}, ${tempF.toFixed(1)}°F (${tempC.toFixed(1)}°C)`;
      } else {
        homeWeatherLabel.textContent = `Weather: ${weather}`;
      }
    } catch (_err) {
      homeWeatherLabel.textContent = "Weather: Unable to load right now";
    }
  }

  function startClock(location) {
    if (clockTimer) clearInterval(clockTimer);
    const tick = () => {
      const now = new Date();
      const formatted = formatClock(now, location.timeZone);
      if (homeTimeLabel) homeTimeLabel.textContent = `Time: ${formatted.time}`;
      if (homeDateLabel) homeDateLabel.textContent = `Date: ${formatted.day}`;
      updateGreeting(location.timeZone);
    };
    tick();
    clockTimer = setInterval(tick, 1000);
  }

  function setActiveLocation(location) {
    if (!location) return;
    activeLocation = location;
    if (homeLocationLabel) homeLocationLabel.textContent = `Location: ${location.name}`;
    startClock(location);
    updateWeather(location);
  }

  async function useCurrentLocation() {
    if (!navigator.geolocation) {
      if (homeWeatherLabel) homeWeatherLabel.textContent = "Weather: Geolocation not supported";
      return;
    }
    if (homeLocationLabel) homeLocationLabel.textContent = "Location: Getting your location...";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = {
          name: `Your Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
          latitude,
          longitude,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        };
        setActiveLocation(location);
      },
      () => {
        if (homeLocationLabel) homeLocationLabel.textContent = "Location: Permission denied or unavailable";
        setActiveLocation(activeLocation);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function attachListeners() {
    if (locationSelect) {
      locationSelect.addEventListener("change", () => {
        const idx = Number(locationSelect.value);
        const selected = cityOptions[idx];
        if (selected) setActiveLocation(selected);
      });
    }
    if (randomLocationBtn) {
      randomLocationBtn.addEventListener("click", () => {
        const idx = Math.floor(Math.random() * cityOptions.length);
        if (locationSelect) locationSelect.value = String(idx);
        setActiveLocation(cityOptions[idx]);
      });
    }
    if (useMyLocationBtn) useMyLocationBtn.addEventListener("click", useCurrentLocation);
  }

  const HomeWeather = {
    init: function (opts = {}) {
      locationSelect = el(opts.locationSelectId || "locationSelect");
      randomLocationBtn = el(opts.randomLocationBtnId || "randomLocationBtn");
      useMyLocationBtn = el(opts.useMyLocationBtnId || "useMyLocationBtn");
      homeLocationLabel = el(opts.homeLocationLabelId || "homeLocationLabel");
      homeTimeLabel = el(opts.homeTimeLabelId || "homeTimeLabel");
      homeDateLabel = el(opts.homeDateLabelId || "homeDateLabel");
      homeWeatherLabel = el(opts.homeWeatherLabelId || "homeWeatherLabel");
      homeGreetingLabel = el(opts.homeGreetingLabelId || "homeGreetingLabel");

      const initialIndex = typeof opts.initialIndex === "number" ? opts.initialIndex : 0;
      populateLocationSelect();
      attachListeners();
      if (locationSelect) locationSelect.value = String(initialIndex);
      setActiveLocation(cityOptions[initialIndex] || cityOptions[0]);
    },
    setUserName: function (name) {
      userName = name || "Guest";
      updateGreeting(activeLocation.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  };

  window.HomeWeather = HomeWeather;
})(window, document);
