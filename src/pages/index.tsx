import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [zipCode, setZipCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/forecast/${zipCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Weather Dashboard</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              Enter ZIP Code
            </label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              pattern="[0-9]{5}"
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
  );
}