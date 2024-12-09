# Weather Dashboard

A modern, responsive weather application built with Next.js that provides real-time weather information and 5-day forecasts. The application features a sleek, glass-morphic UI design and supports both city name and postal code searches.

![Weather Dashboard Preview](/api/placeholder/800/400)

## Features

- **Real-time Weather Data**: Get current weather conditions including temperature, wind speed, and humidity
- **5-Day Forecast**: View weather predictions for the next five days
- **Location-based Weather**: Automatically detect and display weather for user's current location
- **Flexible Search Options**: 
  - Search by city name
  - Search by postal code (supports US ZIP codes and Canadian postal codes)
- **Responsive Design**: Fully responsive interface with glass-morphic UI elements
- **Dynamic Weather Icons**: Visual representation of weather conditions
- **Error Handling**: Comprehensive error messages for better user experience

## Technologies Used

- **Frontend Framework**: Next.js 15.0
- **UI Framework**: React 19.0
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **API**: OpenWeather API
- **Type Safety**: TypeScript

## Prerequisites

Before you begin, ensure you have:
- Node.js (Latest LTS version recommended)
- OpenWeather API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weatherapp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenWeather API key:
```env
OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
weatherapp/
├── src/
│   ├── app/
│   │   └── types/
│   │       └── weather.ts
│   ├── pages/
│   │   ├── api/
│   │   │   └── weather.ts
│   │   ├── forecast/
│   │   │   └── [query].tsx
│   │   └── index.tsx
│   └── hooks/
│       └── useGeolocation.ts
├── public/
│   └── weather-icons/
└── package.json
```

## API Routes

### GET /api/weather
Accepts the following query parameters:
- `lat` & `lon`: Coordinates for location-based weather
- `query`: City name for city-based weather search

Returns weather data including:
- Current temperature
- Weather description
- Wind speed
- Humidity
- 5-day forecast

## Development

To run the development server with Turbopack:
```bash
npm run dev
```

For production build:
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [OpenWeather API](https://openweathermap.org/api)
- Icons by [Lucide](https://lucide.dev/)
