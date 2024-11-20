import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    try {
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&language=en&count=1`;
      const geoResponse = await axios.get(geocodingUrl);
      const { latitude, longitude } = geoResponse.data.results[0];

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation,snowfall,weathercode`;
      const weatherResponse = await axios.get(weatherUrl);

      const currentWeather = weatherResponse.data.current_weather;
      const hourlyData = weatherResponse.data.hourly;
      
      // Extract rain, snow, and shower information
      const precipitation = hourlyData.precipitation[0] || 0;
      const snowfall = hourlyData.snowfall[0] || 0;
      const weatherCode = currentWeather.weathercode;
      const isDay = currentWeather.is_day === 1;

      setWeatherData({
        ...currentWeather,
        precipitation,
        snowfall,
        weatherCode,
        isDay,
      });

      setError('');
    } catch (err) {
      setError('City not found or there was an issue fetching the weather data.');
      setWeatherData(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeather(city);
    }
  };

  const weatherDescription = (code) => {
    const weatherCodeMapping = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Cloudy',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Heavy drizzle',
      56: 'Light freezing drizzle',
      57: 'Heavy freezing drizzle',
      61: 'Light rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Light snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Light shower rain',
      81: 'Moderate shower rain',
      82: 'Heavy shower rain',
      85: 'Light snow showers',
      86: 'Heavy snow showers',
    };

    return weatherCodeMapping[code] || 'Unknown weather';
  };

  return (
    <div className='form-container'>
      <h1>Weather Now</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>Weather in {city}</h2>
          <p><strong>Temprature:</strong> {weatherData.temperature}°C</p>
          <p><strong>Wind Speed:</strong> {weatherData.windspeed} km/h</p>
          <p><strong>Wind Direction:</strong> {weatherData.winddirection}°</p>
          <p><strong>Weather:</strong> {weatherDescription(weatherData.weatherCode)}</p>
          <p><strong>Precipitation:</strong> {weatherData.precipitation} mm</p>
          <p><strong>Snowfall:</strong> {weatherData.snowfall} mm</p>
          <p className="day-night">{weatherData.isDay ? "Day" : "Night"}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
