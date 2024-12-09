//weatherapp/src/pages/forecast/[query].tsx

import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { WeatherData } from '../../app/types/weather';
import { ArrowLeft, Wind, Droplets, MapPin, Cloud, Calendar } from 'lucide-react';

interface ForecastProps {
  weatherData?: WeatherData;
  error?: string;
}

const WeatherIcon = ({ code }: { code: string }) => (
  <div className="relative w-32 h-32">
    <img
      src={`/weather-icons/${code}.svg`}
      alt="Weather condition"
      className="w-full h-full"
    />
  </div>
);

const ForecastIcon = ({ code }: { code: string }) => (
  <div className="relative w-16 h-16">
    <img
      src={`/weather-icons/${code}.svg`}
      alt="Weather condition"
      className="w-full h-full"
    />
  </div>
);

export const getServerSideProps: GetServerSideProps<ForecastProps> = async (context) => {
  try {
    const { query, params } = context;
    let apiUrl: string;

    if (query.zip) {
      // Busca por CEP
      const [postalCode, countryCode] = String(query.zip).split(',');
      if (!postalCode || !countryCode) {
        return {
          props: { error: 'Invalid postal code format. Please use "code,country" format.' },
        };
      }


      const formattedZip = postalCode.replace(/[\s-]/g, '');
      apiUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${formattedZip},${countryCode.toUpperCase()}&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else if (params?.query) {
      // Busca por cidade
      const searchQuery = Array.isArray(params.query) ? params.query[0] : params.query;
      const encodedQuery = encodeURIComponent(searchQuery);
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/weather?query=${encodedQuery}`;
    } else {
      return {
        props: { error: 'No search query provided. Please specify a location.' },
      };
    }

    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json();
    if ('error' in data) {
      return {
        props: { error: data.error },
      };
    }

    return { props: { weatherData: data } };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load weather data';
    return { props: { error: errorMessage } };
  }
};

export default function Forecast({ weatherData, error }: ForecastProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-6">
      {/* Background effect remains the same */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Card */}
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-gray-200/20 shadow-2xl w-full max-w-4xl p-8 text-white">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900/50 p-4 rounded-full backdrop-blur-sm border border-gray-700">
          <Cloud className="w-8 h-8 text-white/80" />
        </div>

        <Link 
          href="/" 
          className="inline-flex items-center text-gray-300 hover:text-white mb-8 group transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </Link>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : weatherData ? (
          <div className="space-y-8">
            {/* Current Weather */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-gray-300" />
                <h1 className="text-2xl font-bold text-gray-100">{weatherData.location}</h1>
              </div>
              
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 transition-all hover:bg-white/10">
                <div className="flex items-center justify-center mb-8">
                  <WeatherIcon code={weatherData.icon} />
                </div>
                
                <div className="text-center mb-8">
                  <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
                    {weatherData.temperature}°
                  </span>
                  <p className="text-xl text-gray-300 capitalize mt-2">
                    {weatherData.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Wind className="w-5 h-5" />
                      <span className="font-medium">Wind Speed</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-100 ml-7">
                      {weatherData.windSpeed} m/s
                    </p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Droplets className="w-5 h-5" />
                      <span className="font-medium">Humidity</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-100 ml-7">
                      {weatherData.humidity}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            {weatherData.forecast && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-6 h-6 text-gray-300" />
                  <h2 className="text-xl font-bold text-gray-100">5-Day Forecast</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day) => (
                    <div 
                      key={day.dt}
                      className="bg-white/5 backdrop-blur p-4 rounded-xl border border-white/10 transition-all hover:bg-white/10"
                    >
                      <p className="text-gray-300 text-sm mb-2">{formatDate(day.dt)}</p>
                      <div className="flex flex-col items-center">
                        <ForecastIcon code={day.icon} />
                        <p className="text-2xl font-bold mt-2">{day.temp}°</p>
                        <p className="text-sm text-gray-300 capitalize mt-1">{day.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Wind className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{day.windSpeed} m/s</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Droplets className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{day.humidity}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-300">
            <p>No weather data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
