import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { WeatherData } from '../../app/types/weather';

interface ForecastProps {
  weatherData?: WeatherData;
  error?: string;
}

export const getServerSideProps: GetServerSideProps<ForecastProps> = async ({ params }) => {
  try {
    if (!params?.query) {
      return {
        props: { error: 'No search query provided' }
      };
    }

    const query = Array.isArray(params.query) ? params.query[0] : params.query;
    const encodedQuery = encodeURIComponent(query);
    
    // Usando a URL completa para debug
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/weather?query=${encodedQuery}`;
    console.log('Requesting weather from:', apiUrl); // Para debug

    const res = await fetch(apiUrl);
    const data = await res.json();

    if ('error' in data) {
      return {
        props: { error: data.error }
      };
    }

    return {
      props: { weatherData: data }
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load weather data';
    return {
      props: { error: errorMessage }
    };
  }
};

export default function Forecast({ weatherData, error }: ForecastProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-4 block">
          ← Back to Search
        </Link>
        
        {error ? (
          <div className="text-red-500 text-center">
            <p>{error}</p>
          </div>
        ) : weatherData ? (
          <>
            <h1 className="text-2xl font-bold mb-6">{weatherData.location}</h1>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-20 h-20">
                <Image
                  src={`http://openweathermap.org/img/w/${weatherData.icon}.png`}
                  alt={weatherData.description}
                  fill
                  sizes="80px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span className="text-4xl ml-4">{weatherData.temperature}°C</span>
            </div>
            <div className="space-y-2">
              <p className="capitalize">{weatherData.description}</p>
              <p>Humidity: {weatherData.humidity}%</p>
              <p>Wind Speed: {weatherData.windSpeed} m/s</p>
            </div>
          </>
        ) : (
          <p className="text-center">No weather data available</p>
        )}
      </div>
    </div>
  );
}