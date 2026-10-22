// Minimal standalone Home/Weather/Time/Location module
// Usage: include this script in a page that has the DOM ids used below, then call HomeWeather.init()

(function (window, document) {
  const STORAGE_KEY = "homeWeather.activeLocation";
  const cityOptions = [
    { name: "New York, USA", latitude: 40.7128, longitude: -74.006, timeZone: "America/New_York" },
    { name: "Los Angeles, USA", latitude: 34.0522, longitude: -118.2437, timeZone: "America/Los_Angeles" },
    { name: "Chicago, USA", latitude: 41.8781, longitude: -87.6298, timeZone: "America/Chicago" },
    { name: "Erie, PA, USA", latitude: 42.1292, longitude: -80.0851, timeZone: "America/New_York" },
    { name: "London, UK", latitude: 51.5072, longitude: -0.1276, timeZone: "Europe/London" },
    { name: "Paris, France", latitude: 48.8566, longitude: 2.3522, timeZone: "Europe/Paris" },
    { name: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503, timeZone: "Asia/Tokyo" },
    { name: "Sydney, Australia", latitude: -33.8688, longitude: 151.2093, timeZone: "Australia/Sydney" },
    { name: "Sao Paulo, Brazil", latitude: -23.5505, longitude: -46.6333, timeZone: "America/Sao_Paulo" },
    { name: "Toronto, Canada", latitude: 43.6532, longitude: -79.3832, timeZone: "America/Toronto" },
    { name: "Cape Town, South Africa", latitude: -33.9249, longitude: 18.4241, timeZone: "Africa/Johannesburg" },
    { name: "Shanghai, China", latitude: 31.2243, longitude: 121.4692, timeZone: "Asia/Shanghai" },
    { name: "Delhi, India", latitude: 28.6139, longitude: 77.209, timeZone: "Asia/Kolkata" },
    { name: "Dhaka, Bangladesh", latitude: 23.8103, longitude: 90.4125, timeZone: "Asia/Dhaka" },
    { name: "Cairo, Egypt", latitude: 30.0444, longitude: 31.2357, timeZone: "Africa/Cairo" },
    { name: "Mumbai, India", latitude: 19.076, longitude: 72.8777, timeZone: "Asia/Kolkata" },
    { name: "Beijing, China", latitude: 39.9042, longitude: 116.4074, timeZone: "Asia/Shanghai" },
    { name: "Mexico City, Mexico", latitude: 19.4326, longitude: -99.1332, timeZone: "America/Mexico_City" },
    { name: "Osaka, Japan", latitude: 34.6937, longitude: 135.5023, timeZone: "Asia/Tokyo" },
    { name: "Karachi, Pakistan", latitude: 24.8607, longitude: 67.0011, timeZone: "Asia/Karachi" },
    { name: "Chongqing, China", latitude: 29.563, longitude: 106.5516, timeZone: "Asia/Shanghai" },
    { name: "Istanbul, Turkey", latitude: 41.0082, longitude: 28.9784, timeZone: "Europe/Istanbul" },
    { name: "Kolkata, India", latitude: 22.5726, longitude: 88.3639, timeZone: "Asia/Kolkata" },
    { name: "Manila, Philippines", latitude: 14.5995, longitude: 120.9842, timeZone: "Asia/Manila" },
    { name: "Lagos, Nigeria", latitude: 6.5244, longitude: 3.3792, timeZone: "Africa/Lagos" },
    { name: "Rio de Janeiro, Brazil", latitude: -22.9068, longitude: -43.1729, timeZone: "America/Sao_Paulo" },
    { name: "Tianjin, China", latitude: 39.3434, longitude: 117.3616, timeZone: "Asia/Shanghai" },
    { name: "Kinshasa, DR Congo", latitude: -4.4419, longitude: 15.2663, timeZone: "Africa/Kinshasa" },
    { name: "Guangzhou, China", latitude: 23.1291, longitude: 113.2644, timeZone: "Asia/Shanghai" },
    { name: "Lahore, Pakistan", latitude: 31.5204, longitude: 74.3587, timeZone: "Asia/Lahore" },
    { name: "Shenzhen, China", latitude: 22.5431, longitude: 114.0579, timeZone: "Asia/Shanghai" },
    { name: "Bangalore, India", latitude: 12.9716, longitude: 77.5946, timeZone: "Asia/Kolkata" },
    { name: "Moscow, Russia", latitude: 55.7558, longitude: 37.6173, timeZone: "Europe/Moscow" },
    { name: "Chennai, India", latitude: 13.0827, longitude: 80.2707, timeZone: "Asia/Kolkata" },
    { name: "Bogota, Colombia", latitude: 4.711, longitude: -74.0721, timeZone: "America/Bogota" },
    { name: "Jakarta, Indonesia", latitude: -6.2088, longitude: 106.8456, timeZone: "Asia/Jakarta" },
    { name: "Lima, Peru", latitude: -12.0464, longitude: -77.0428, timeZone: "America/Lima" },
    { name: "Bangkok, Thailand", latitude: 13.7563, longitude: 100.5018, timeZone: "Asia/Bangkok" },
    { name: "Hyderabad, India", latitude: 17.385, longitude: 78.4867, timeZone: "Asia/Kolkata" },
    { name: "Seoul, South Korea", latitude: 37.5665, longitude: 126.978, timeZone: "Asia/Seoul" },
    { name: "Nagoya, Japan", latitude: 35.1815, longitude: 136.9066, timeZone: "Asia/Tokyo" },
    { name: "Wuhan, China", latitude: 30.5928, longitude: 114.3055, timeZone: "Asia/Shanghai" },
    { name: "Chengdu, China", latitude: 30.5728, longitude: 104.0668, timeZone: "Asia/Shanghai" },
    { name: "Tehran, Iran", latitude: 35.6892, longitude: 51.389, timeZone: "Asia/Tehran" },
    { name: "Ahmedabad, India", latitude: 23.0225, longitude: 72.5714, timeZone: "Asia/Kolkata" },
    { name: "Ho Chi Minh City, Vietnam", latitude: 10.8231, longitude: 106.6297, timeZone: "Asia/Ho_Chi_Minh" },
    { name: "Luanda, Angola", latitude: -8.839, longitude: 13.2894, timeZone: "Africa/Luanda" },
    { name: "Xi'an, China", latitude: 34.3416, longitude: 108.9398, timeZone: "Asia/Shanghai" },
    { name: "Kuala Lumpur, Malaysia", latitude: 3.139, longitude: 101.6869, timeZone: "Asia/Kuala_Lumpur" },
    { name: "Hong Kong, Hong Kong", latitude: 22.3193, longitude: 114.1694, timeZone: "Asia/Hong_Kong" },
    { name: "Dongguan, China", latitude: 23.0205, longitude: 113.7518, timeZone: "Asia/Shanghai" },
    { name: "Hangzhou, China", latitude: 30.2741, longitude: 120.1551, timeZone: "Asia/Shanghai" },
    { name: "Foshan, China", latitude: 23.0215, longitude: 113.1214, timeZone: "Asia/Shanghai" },
    { name: "Shenyang, China", latitude: 41.8057, longitude: 123.4315, timeZone: "Asia/Shanghai" },
    { name: "Riyadh, Saudi Arabia", latitude: 24.7136, longitude: 46.6753, timeZone: "Asia/Riyadh" },
    { name: "Baghdad, Iraq", latitude: 33.3152, longitude: 44.3661, timeZone: "Asia/Baghdad" },
    { name: "Santiago, Chile", latitude: -33.4489, longitude: -70.6693, timeZone: "America/Santiago" },
    { name: "Surat, India", latitude: 21.1702, longitude: 72.8311, timeZone: "Asia/Kolkata" },
    { name: "Madrid, Spain", latitude: 40.4168, longitude: -3.7038, timeZone: "Europe/Madrid" },
    { name: "Suzhou, China", latitude: 31.299, longitude: 120.5853, timeZone: "Asia/Shanghai" },
    { name: "Pune, India", latitude: 18.5204, longitude: 73.8567, timeZone: "Asia/Kolkata" },
    { name: "Harbin, China", latitude: 45.8038, longitude: 126.5350, timeZone: "Asia/Shanghai" },
    { name: "Houston, USA", latitude: 29.7604, longitude: -95.3698, timeZone: "America/Chicago" },
    { name: "Dallas, USA", latitude: 32.7767, longitude: -96.797, timeZone: "America/Chicago" },
    { name: "Dar es Salaam, Tanzania", latitude: -6.7924, longitude: 39.2083, timeZone: "Africa/Dar_es_Salaam" },
    { name: "Miami, USA", latitude: 25.7617, longitude: -80.1918, timeZone: "America/New_York" },
    { name: "Belo Horizonte, Brazil", latitude: -19.9167, longitude: -43.9345, timeZone: "America/Sao_Paulo" },
    { name: "Singapore, Singapore", latitude: 1.3521, longitude: 103.8198, timeZone: "Asia/Singapore" },
    { name: "Alexandria, Egypt", latitude: 31.2001, longitude: 29.9187, timeZone: "Africa/Cairo" },
    { name: "Khartoum, Sudan", latitude: 15.5007, longitude: 32.5599, timeZone: "Africa/Khartoum" },
    { name: "Abidjan, Ivory Coast", latitude: 5.36, longitude: -4.0083, timeZone: "Africa/Abidjan" },
    { name: "Guadalajara, Mexico", latitude: 20.6597, longitude: -103.3496, timeZone: "America/Mexico_City" },
    { name: "Addis Ababa, Ethiopia", latitude: 9.0192, longitude: 38.7468, timeZone: "Africa/Addis_Ababa" },
    { name: "Nairobi, Kenya", latitude: -1.2921, longitude: 36.8219, timeZone: "Africa/Nairobi" },
    { name: "Accra, Ghana", latitude: 5.6037, longitude: -0.187, timeZone: "Africa/Accra" },
    { name: "Kano, Nigeria", latitude: 12.0022, longitude: 8.592, timeZone: "Africa/Lagos" },
    { name: "Jeddah, Saudi Arabia", latitude: 21.3256, longitude: 39.1776, timeZone: "Asia/Riyadh" },
    { name: "Kabul, Afghanistan", latitude: 34.5553, longitude: 69.2075, timeZone: "Asia/Kabul" },
    { name: "Algiers, Algeria", latitude: 36.7538, longitude: 3.0588, timeZone: "Africa/Algiers" },
    { name: "Casablanca, Morocco", latitude: 33.5731, longitude: -7.5898, timeZone: "Africa/Casablanca" },
    { name: "Brasilia, Brazil", latitude: -15.7942, longitude: -47.8822, timeZone: "America/Sao_Paulo" },
    { name: "Medan, Indonesia", latitude: 3.5952, longitude: 98.6722, timeZone: "Asia/Jakarta" },
    { name: "Jaipur, India", latitude: 26.9124, longitude: 75.7873, timeZone: "Asia/Kolkata" },
    { name: "Lucknow, India", latitude: 26.8467, longitude: 80.9462, timeZone: "Asia/Kolkata" },
    { name: "Faisalabad, Pakistan", latitude: 31.4504, longitude: 73.135, timeZone: "Asia/Karachi" },
    { name: "Izmir, Turkey", latitude: 38.4237, longitude: 27.1428, timeZone: "Europe/Istanbul" },
    { name: "Surabaya, Indonesia", latitude: -7.2575, longitude: 112.7521, timeZone: "Asia/Jakarta" },
    { name: "Nanjing, China", latitude: 32.0603, longitude: 118.7969, timeZone: "Asia/Shanghai" },
    { name: "Durban, South Africa", latitude: -29.8587, longitude: 31.0218, timeZone: "Africa/Johannesburg" },
    { name: "Berlin, Germany", latitude: 52.52, longitude: 13.405, timeZone: "Europe/Berlin" },
    { name: "Rome, Italy", latitude: 41.9028, longitude: 12.4964, timeZone: "Europe/Rome" },
    { name: "Kyiv, Ukraine", latitude: 50.4501, longitude: 30.5234, timeZone: "Europe/Kyiv" },
    { name: "Tashkent, Uzbekistan", latitude: 41.2995, longitude: 69.2401, timeZone: "Asia/Tashkent" },
    { name: "Sanaa, Yemen", latitude: 15.3694, longitude: 44.191, timeZone: "Asia/Sanaa" },
    { name: "Pyongyang, North Korea", latitude: 39.0392, longitude: 125.7625, timeZone: "Asia/Pyongyang" },
    { name: "Taipei, Taiwan", latitude: 25.033, longitude: 121.5654, timeZone: "Asia/Taipei" },
    { name: "Incheon, South Korea", latitude: 37.4563, longitude: 126.7052, timeZone: "Asia/Seoul" },
    { name: "Quezon City, Philippines", latitude: 14.676, longitude: 121.0437, timeZone: "Asia/Manila" },
    { name: "Caracas, Venezuela", latitude: 10.4806, longitude: -66.9036, timeZone: "America/Caracas" },
    { name: "Santo Domingo, Dominican Republic", latitude: 18.4861, longitude: -69.9312, timeZone: "America/Santo_Domingo" },
    { name: "Havana, Cuba", latitude: 23.1136, longitude: -82.3666, timeZone: "America/Havana" },
    { name: "Guayaquil, Ecuador", latitude: -2.1894, longitude: -79.889, timeZone: "America/Guayaquil" },
    { name: "Campinas, Brazil", latitude: -22.9056, longitude: -47.0608, timeZone: "America/Sao_Paulo" },
    { name: "Curitiba, Brazil", latitude: -25.429, longitude: -49.2671, timeZone: "America/Sao_Paulo" },
    { name: "Montreal, Canada", latitude: 45.5019, longitude: -73.5674, timeZone: "America/Toronto" },
    { name: "Vancouver, Canada", latitude: 49.2827, longitude: -123.1207, timeZone: "America/Vancouver" },
    { name: "Melbourne, Australia", latitude: -37.8136, longitude: 144.9631, timeZone: "Australia/Melbourne" },
    { name: "Brisbane, Australia", latitude: -27.4698, longitude: 153.0251, timeZone: "Australia/Brisbane" },
    { name: "Perth, Australia", latitude: -31.9505, longitude: 115.8605, timeZone: "Australia/Perth" },
    { name: "Johannesburg, South Africa", latitude: -26.2041, longitude: 28.0473, timeZone: "Africa/Johannesburg" }
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

  function normalizeLocation(location) {
  if (!location || typeof location !== "object") return null;
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return {
    name: String(location.name || "Custom Location"),
    latitude,
    longitude,
    timeZone: String(location.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC")
  };
}


function readSavedLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeLocation(JSON.parse(raw));
  } catch {
    return null;
  }
}

function saveLocation(location) {
  const normalized = normalizeLocation(location);
  if (!normalized) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }
    catch {
    // ignore storage failures
  }
}


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
    } catch (_err) {
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
  const normalized = normalizeLocation(location);
  if (!normalized) return;

  activeLocation = normalized;
  saveLocation(normalized);
  startClock(normalized);
  updateWeather(normalized);
  homeLocationLabel.textContent = `Location: ${normalized};
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
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          isCurrentLocation: true
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

      populateLocationSelect();
      attachListeners();

      const savedLocation = readSavedLocation();
      const initialIndex = typeof opts.initialIndex === "number" ? opts.initialIndex : 0;
      const initialLocation = savedLocation || cityOptions[initialIndex] || cityOptions[0];

      if (locationSelect) {
        const savedIndex = cityOptions.findIndex((city) => city.name === initialLocation.name && Number(city.latitude) === Number(initialLocation.latitude) && Number(city.longitude) === Number(initialLocation.longitude));
        if (savedIndex >= 0) {
          locationSelect.value = String(savedIndex);
        } else {
          locationSelect.value = String(initialIndex);
        }
      }

      setActiveLocation(initialLocation);
    },
    setUserName: function (name) {
      userName = name || "Guest";
      updateGreeting(activeLocation?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    },
    setActiveLocation: function (location) {
      setActiveLocation(location);
    }
  };

  window.HomeWeather = HomeWeather;
})(window, document);
  window.addEventListenet("DOMContentLoaded", function(){
    HomeWeather.init({
    });
  });
