import { useState, useCallback } from 'react';

interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export const useLocationSearch = () => {
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocation = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getLocationByCoordinates = useCallback(async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }

      const data = await response.json();
      return data.display_name || 'Unknown location';
    } catch (error) {
      console.error('Failed to get location by coordinates:', error);
      return 'Unknown location';
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    searchLocation,
    getLocationByCoordinates,
    clearResults,
  };
}; 