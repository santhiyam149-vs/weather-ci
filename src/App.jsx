
import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function searchWeather(event) {
    event.preventDefault();

    if (!city.trim()) {
      setWeather(null);
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error('Unable to connect to the weather service.');
      }

      const geoData = await geoResponse.json();

      if (!geoData.results?.length) {
        throw new Error('City not found. Please try another city.');
      }

      const place = geoData.results[0];

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
      );

      if (!response.ok) {
        throw new Error('Unable to fetch weather data.');
      }

      const data = await response.json();
      const current = data.current;

      setWeather({
        city: place.name,
        country: place.country || '',
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        wind: current.wind_speed_10m,
        condition: getCondition(current.weather_code),
      });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function getCondition(code) {
    if (code === 0) return 'Clear sky';
    if ([1, 2, 3].includes(code)) return 'Partly cloudy';
    if ([45, 48].includes(code)) return 'Foggy';
    if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rainy';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowy';
    if ([95, 96, 99].includes(code)) return 'Thunderstorm';
    return 'Weather unavailable';
  }

  return (
    <main className="page">
      <section className="weather-card">
        <p className="eyebrow">YOUR DAILY WEATHER</p>
        <h1>Weather Dashboard</h1>
        <p className="subtitle">
          Find the current weather in any city.
        </p>

        <form className="search-form" onSubmit={searchWeather}>
          <input
            aria-label="Search city"
            placeholder="Enter a city, e.g. Mumbai"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        {loading && (
          <p role="status" className="loading-message">
            Fetching weather...
          </p>
        )}

        {weather && (
          <section className="weather-result" aria-label="Weather results">
            <h2>
              {weather.city}
              {weather.country ? `, ${weather.country}` : ''}
            </h2>
            <p className="condition">{weather.condition}</p>
            <p className="temperature">{weather.temperature}°C</p>

            <div className="details">
              <div className="detail">
                <span>Feels like</span>
                <strong>{weather.feelsLike}°C</strong>
              </div>
              <div className="detail">
                <span>Humidity</span>
                <strong>{weather.humidity}%</strong>
              </div>
              <div className="detail">
                <span>Wind speed</span>
                <strong>{weather.wind} km/h</strong>
              </div>
            </div>
          </section>
        )}

        
      </section>
    </main>
  );
}

export default App;
