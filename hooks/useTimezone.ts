import { useCallback } from 'react';

export const useTimezone = () => {
  const getTimezone = useCallback(async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch timezone');
      }

      const data = await response.json();
      
      if (data.address && data.address.timezone) {
        return data.address.timezone;
      }
      
      return 'UTC';
    } catch (error) {
      console.error('Failed to get timezone:', error);
      return 'UTC';
    }
  }, []);

  return { getTimezone };
}; 