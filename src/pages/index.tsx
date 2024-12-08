import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGeolocation } from '../hooks/useGeolocation';
// import Image from 'next/image';
import { WeatherData } from '../app/types/weather';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [localWeather, setLocalWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { coordinates, error: geoError, loading: geoLoading } = useGeolocation();
  
    useEffect(() => {
      async function fetchLocalWeather() {
        if (coordinates) {
          setLoading(true);
          try {
            const res = await fetch(
              `/api/weather?lat=${coordinates.lat}&lon=${coordinates.lon}`
            );
            const data = await res.json();
            if ('error' in data) {
              setError(data.error);
            } else {
              setLocalWeather(data);
            }
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch local weather';
            setError(errorMessage);
          }
          setLoading(false);
        }
      }
  
      fetchLocalWeather();
    }, [coordinates]);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/forecast/${encodeURIComponent(searchQuery)}`);
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Weather Dashboard</h1>
          
          {/* Local Weather Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Location</h2>
            {geoLoading && <p>Detecting location...</p>}
            {geoError && <p className="text-red-500">{geoError}</p>}
            {loading && <p>Loading weather data...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {localWeather && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">{localWeather.location}</h3>
                <div className="flex items-center">
                  <div className="relative w-16 h-16">
                    {/* <Image
                      src={`http://openweathermap.org/img/w/${localWeather.icon}.png`}
                      alt={localWeather.description}
                      fill
                      sizes="64px"
                      style={{ objectFit: 'contain' }}
                    /> */}
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl">{localWeather.temperature}°C</p>
                    <p className="capitalize">{localWeather.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
  
          {/* Search Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Other Locations</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700">
                  Enter City Name or ZIP Code
                </label>
                <input
                  type="text"
                  id="searchQuery"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., London or 10001"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Get Weather
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }