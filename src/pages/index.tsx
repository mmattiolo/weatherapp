import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGeolocation } from '../hooks/useGeolocation';
import { WeatherData } from '../app/types/weather';
import { Search, MapPin, Wind, Droplets } from 'lucide-react';

const WeatherIcon = ({ code }: { code: string }) => {
  // Custom weather icons based on condition codes
  const getIconPath = (code: string) => {
    // Replace OpenWeatherMap icons with SVG paths
    return `/weather-icons/${code}.svg`;
  };

  return (
    <div className="relative w-24 h-24">
      <img
        src={getIconPath(code)}
        alt="Weather condition"
        className="w-full h-full"
      />
    </div>
  );
};

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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Weather Dashboard
        </h1>
        
        {/* Local Weather Card */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-700">Your Location</h2>
          </div>
          
          {geoLoading && (
            <div className="animate-pulse bg-gray-200 h-32 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Detecting location...</p>
            </div>
          )}
          
          {geoError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600">{geoError}</p>
            </div>
          )}
          
          {loading && (
            <div className="animate-pulse bg-gray-200 h-32 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Loading weather data...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {localWeather && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-medium text-gray-700 mb-4">{localWeather.location}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <WeatherIcon code={localWeather.icon} />
                  <div>
                    <p className="text-4xl font-bold text-gray-800">
                      {localWeather.temperature}°
                    </p>
                    <p className="text-gray-600 capitalize">
                      {localWeather.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Wind className="w-4 h-4" />
                    <span>{localWeather.windSpeed} m/s</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Droplets className="w-4 h-4" />
                    <span>{localWeather.humidity}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-700">Search Location</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="searchQuery" 
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Enter City Name or ZIP Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="searchQuery"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                  placeholder="e.g., London or 10001"
                  required
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Get Weather
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}