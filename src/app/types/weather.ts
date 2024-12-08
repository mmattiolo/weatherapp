export interface WeatherData {
    location: string;
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  }
  
  export interface Coordinates {
    lat: number;
    lon: number;
  }