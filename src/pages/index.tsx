import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGeolocation } from '../hooks/useGeolocation';
import { WeatherData } from '../app/types/weather';
import { MapPin, Wind, Droplets, Search, Cloud } from 'lucide-react';


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [localWeather, setLocalWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { coordinates} = useGeolocation();

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


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-6">
      {/* Efeito de glassmorphism no background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Card Principal */}
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-gray-200/20 shadow-2xl w-full max-w-md p-8 text-white">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900/50 p-4 rounded-full backdrop-blur-sm border border-gray-700">
          <Cloud className="w-8 h-8 text-white/80" />
        </div>

        <h1 className="text-3xl font-bold text-center mt-4 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
          Weather Dashboard
        </h1>

        {/* Seção do Clima Local */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Your Location</h2>
          </div>

          {localWeather && (
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 transition-all hover:bg-white/10">
              <h3 className="text-xl font-medium mb-4">{localWeather.location}</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-4xl font-bold mb-2">{localWeather.temperature}°C</p>
                  <p className="text-gray-300 capitalize">{localWeather.description}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Wind className="w-4 h-4" />
                    <span>{localWeather.windSpeed} m/s</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Droplets className="w-4 h-4" />
                    <span>{localWeather.humidity}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="animate-pulse bg-white/5 rounded-2xl h-40 flex items-center justify-center">
              <p className="text-gray-400">Loading weather data...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Seção de Busca */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Search className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Search Location</h2>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              router.push(`/forecast/${encodeURIComponent(searchQuery)}`);
            }
          }}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                placeholder="e.g., London or 10001"
                required
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Get Weather
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}