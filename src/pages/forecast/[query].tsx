import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { WeatherData } from '../../app/types/weather';
import { ArrowLeft, Wind, Droplets, MapPin } from 'lucide-react';

interface ForecastProps {
  weatherData?: WeatherData;
  error?: string;
}

const WeatherIcon = ({ code }: { code: string }) => {
  const getIconPath = (code: string) => {
    return `/weather-icons/${code}.svg`;
  };

  return (
    <div className="relative w-32 h-32">
      <img
        src={getIconPath(code)}
        alt="Weather condition"
        className="w-full h-full"
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ForecastProps> = async ({ params }) => {
  try {
    if (!params?.query) {
      return {
        props: { error: 'No search query provided. Please specify a location.' },
      };
    }

    const searchQuery = Array.isArray(params.query) ? params.query[0] : params.query;
    const encodedQuery = encodeURIComponent(searchQuery);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/weather?query=${encodedQuery}`;

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

    return {
      props: { weatherData: data },
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load weather data';
    return {
      props: { error: errorMessage },
    };
  }
};

export default function Forecast({ weatherData, error }: ForecastProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </Link>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : weatherData ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-800">{weatherData.location}</h1>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-center mb-6">
                <WeatherIcon code={weatherData.icon} />
              </div>
              
              <div className="text-center mb-6">
                <span className="text-6xl font-bold text-gray-800">
                  {weatherData.temperature}°
                </span>
                <p className="text-xl text-gray-600 capitalize mt-2">
                  {weatherData.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Wind className="w-5 h-5" />
                    <span className="font-medium">Wind Speed</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 ml-7">
                    {weatherData.windSpeed} m/s
                  </p>
                </div>
                
                <div className="bg-white/80 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Droplets className="w-5 h-5" />
                    <span className="font-medium">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 ml-7">
                    {weatherData.humidity}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>No weather data available</p>
          </div>
        )}
      </div>
    </div>
  );
}