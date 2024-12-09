// pages/api/weather.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { WeatherData, ForecastDay, OpenWeatherCurrentResponse,OpenWeatherForecastResponse,OpenWeatherForecastItem } from '../../app/types/weather';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherData | { error: string }>
) {
  if (!process.env.OPENWEATHER_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    let weatherUrl: string;
    let forecastUrl: string;
    const { lat, lon, query } = req.query;

    if (lat && lon) {
      // Search by coordinates
      const latitude = Array.isArray(lat) ? lat[0] : lat;
      const longitude = Array.isArray(lon) ? lon[0] : lon;
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else if (query) {
      // Search by city
      const searchQuery = Array.isArray(query) ? query[0] : query;
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchQuery)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
      
      // First get coordinates for the city
      const geoResponse = await fetch(weatherUrl);
      const geoData = await geoResponse.json() as OpenWeatherCurrentResponse;
      
      if (geoData.cod !== 200) {
        return res.status(400).json({ error: geoData.message || 'Location not found' });
      }
      
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${geoData.coord.lat}&lon=${geoData.coord.lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else {
      return res.status(400).json({ error: 'Missing search parameters' });
    }

    // Fetch current weather and forecast in parallel
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    const [weatherData, forecastData] = await Promise.all([
      weatherResponse.json(),
      forecastResponse.json()
    ]) as [OpenWeatherCurrentResponse, OpenWeatherForecastResponse];

    if (weatherData.cod !== 200) {
      return res.status(400).json({ error: weatherData.message || 'Location not found' });
    }

    // Process forecast data
    const forecast: ForecastDay[] = forecastData.list
      .filter((_, index: number) => index % 8 === 0) // Get one reading per day
      .map((item: OpenWeatherForecastItem) => ({
        dt: item.dt,
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed
      }));

    const combinedWeatherData: WeatherData = {
      location: weatherData.name,
      temperature: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      icon: weatherData.weather[0].icon,
      forecast
    };

    res.status(200).json(combinedWeatherData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
    res.status(500).json({ error: errorMessage });
  }
}