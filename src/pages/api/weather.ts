import { WeatherData } from '@/app/types/weather';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<WeatherData | { error: string }>
  ) {
    const { zipCode } = req.query;
    
    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }
  
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.cod !== 200) {
        return res.status(400).json({ error: data.message });
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