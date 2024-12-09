export interface WeatherData {
    location: string;
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    forecast?: ForecastDay[];
  }
  
  export interface Coordinates {
    lat: number;
    lon: number;
  }
 
  export interface ForecastDay {
    dt: number;
    temp: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  }
  
  export interface OpenWeatherForecastItem {
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }
  
  export interface OpenWeatherForecastResponse {
    list: OpenWeatherForecastItem[];
    cod: string | number;
    message?: string;
  }
  
  export interface OpenWeatherCurrentResponse {
    name: string;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    cod: number;
    message?: string;
    coord: {
      lat: number;
      lon: number;
    };
  }
  
  