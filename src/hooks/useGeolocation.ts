import { useState, useEffect } from 'react';
import { Coordinates } from '../app/types/weather';


export function useGeolocation() {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setLoading(false);
        },
        (geoError) => {
          setError(geoError.message || 'Unable to retrieve your location');
          setLoading(false);
        }
      );
    }, []);
  
    return { coordinates, error, loading };
  }