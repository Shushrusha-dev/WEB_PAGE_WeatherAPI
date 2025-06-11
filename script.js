const API_KEY = '86936b1b4334da29101365767a7f5752';
const resultDiv = document.getElementById('weatherResult');

// Fetch weather by city name
async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  resultDiv.innerHTML = '';

  if (!city) {
    resultDiv.innerHTML = '<p>Please enter a city name.</p>';
    return;
  }

  fetchWeatherByCity(city);
}

// Fetch weather by geolocation
function fetchWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
          if (!response.ok) throw new Error('Failed to fetch location weather');
          const data = await response.json();
          displayWeather(data);
        } catch (error) {
          resultDiv.innerHTML = `<p>${error.message}</p>`;
        }
      },
      (error) => {
        resultDiv.innerHTML = '<p>Location access denied. Please search by city.</p>';
      }
    );
  } else {
    resultDiv.innerHTML = '<p>Geolocation not supported by your browser.</p>';
  }
}

// Reusable: fetch weather by city
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Display weather data
function displayWeather(data) {
  const { name, main, weather, wind, sys } = data;
  const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  resultDiv.innerHTML = `
    <h2>${name}, ${sys.country}</h2>
    <img src="${iconUrl}" alt="Weather icon" class="weather-icon" />
    <p><strong>${weather[0].main}</strong> - ${weather[0].description}</p>
    <div class="weather-detail">
      <p><span>🌡️</span> <strong>Temperature:</strong> ${main.temp} °C</p>
      <p><span>💧</span> <strong>Humidity:</strong> ${main.humidity}%</p>
      <p><span>💨</span> <strong>Wind Speed:</strong> ${wind.speed} m/s</p>
      <p><span>🌅</span> <strong>Sunrise:</strong> ${formatTime(sys.sunrise)}</p>
      <p><span>🌇</span> <strong>Sunset:</strong> ${formatTime(sys.sunset)}</p>
    </div>
  `;
}

// Convert timestamp to HH:MM format
function formatTime(unixTime) {
  const date = new Date(unixTime * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Auto-fetch location weather
window.onload = fetchWeatherByLocation;
