import React, { useState } from 'react';
import './App.css';

const API_KEY = '4082e46ce8268bbbf65a7db6df1c0e0a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function App() {
  const [city, setCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


const fetchWeather = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
      {
        headers: { 'Accept': 'application/json' }
      }
    );
    
    const data = await response.json();
    
    if (data.cod === '200') {
      const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const forecasts = data.list.filter(item => {
        const forecastDate = new Date(item.dt * 1000);
        return Math.abs(forecastDate - selectedDateTime) < 3 * 60 * 60 * 1000;
      });

      if (forecasts.length > 0) {
        const forecast = forecasts[0];
        forecast.dt = selectedDateTime.getTime() / 1000; 
        setWeather({
          ...forecast,
          name: data.city.name,
          sys: { country: data.city.country }
        });
      } else {
        setError('No forecast available for selected date/time');
      }
    } else {
      setError(data.message || 'City not found. Please try again.');
    }
  } catch (err) {
    setError('Failed to fetch weather data. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="app-container">
      <div className="weather-card">
        <h1 className="app-title">Vikash Weather App</h1>

        <form onSubmit={fetchWeather} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="search-input"
            required
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            max={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            className="search-input"
            required
          />
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="search-input"
            required
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {weather && (
          <div className="weather-info">
            <h2 className="city-name">
              {weather.name}, {weather.sys.country}
            </h2>
            <div className="temperature">
              {Math.round(weather.main.temp)}°C
            </div>
            <div className="weather-condition">
              {weather.weather[0].main}
            </div>
            <div className="weather-grid">
              <div className="weather-item">
                Humidity: {weather.main.humidity}%
              </div>
              <div className="weather-item">
                Wind: {weather.wind.speed} m/s
              </div>
              <div className="weather-item">
                High: {Math.round(weather.main.temp_max)}°C
              </div>
              <div className="weather-item">
                Low: {Math.round(weather.main.temp_min)}°C
              </div>
            </div>
            <div className="forecast-time">
              Forecast for: {new Date(weather.dt * 1000).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
