import type { NextApiRequest, NextApiResponse } from 'next';
import { WeatherData } from '../../app/types/weather';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<WeatherData | { error: string }>
  ) {
    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }
  
    try {
      let apiUrl: string;
      const { lat, lon, query, zip, country } = req.query;
  
      if (lat && lon) {
        // Busca por coordenadas
        const latitude = Array.isArray(lat) ? lat[0] : lat;
        const longitude = Array.isArray(lon) ? lon[0] : lon;
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
      } else if (query) {
        // Busca por cidade
        const searchQuery = Array.isArray(query) ? query[0] : query;
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchQuery)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
      } else {
        return res.status(400).json({ error: 'Missing search parameters' });
      }
  
      console.log('Fetching weather from:', apiUrl);
  
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.cod !== 200) {
        return res.status(400).json({ error: data.message || 'Location not found' });
      }
  
      const weatherData: WeatherData = {
        location: data.name,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon
      };
  
      res.status(200).json(weatherData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      res.status(500).json({ error: errorMessage });
    }
  }