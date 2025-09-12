import { useCallback } from 'react';

export const useTimezone = () => {
  const getTimezoneOffset = useCallback((latitude: number, longitude: number): number => {
    let baseOffset = Math.round(longitude / 15);


    let timezoneOffset = baseOffset;


    if (longitude >= -10 && longitude <= 40) {

      const now = new Date();
      const isDST = now.getMonth() >= 2 && now.getMonth() <= 9;
      timezoneOffset = isDST ? baseOffset + 1 : baseOffset;
    }


    else if (longitude >= 20 && longitude <= 190) {

      if (longitude >= 20 && longitude < 37.5) timezoneOffset = 3;
      else if (longitude >= 37.5 && longitude < 52.5) timezoneOffset = 4;
      else if (longitude >= 52.5 && longitude < 67.5) timezoneOffset = 5;
      else if (longitude >= 67.5 && longitude < 82.5) timezoneOffset = 6;
      else if (longitude >= 82.5 && longitude < 97.5) timezoneOffset = 7;
      else if (longitude >= 97.5 && longitude < 112.5) timezoneOffset = 8;
      else if (longitude >= 112.5 && longitude < 127.5) timezoneOffset = 9;
      else if (longitude >= 127.5 && longitude < 142.5) timezoneOffset = 10;
      else if (longitude >= 142.5 && longitude < 157.5) timezoneOffset = 11;
      else timezoneOffset = 12;
    }


    else if (longitude >= -125 && longitude <= -70) {
      if (longitude >= -125 && longitude < -110) timezoneOffset = -8;
      else if (longitude >= -110 && longitude < -95) timezoneOffset = -7;
      else if (longitude >= -95 && longitude < -80) timezoneOffset = -6;
      else timezoneOffset = -5;
    }


    else if (longitude >= 73 && longitude <= 135) {
      timezoneOffset = 8;
    }


    else if (longitude >= 68 && longitude <= 97) {
      timezoneOffset = 5.5;
    }

    else if (longitude >= 67 && longitude <= 75) {
      timezoneOffset = 5;
    }

    else if (longitude >= 129 && longitude <= 146) {
      timezoneOffset = 9;
    }

    else if (longitude >= 113 && longitude <= 154) {
      if (longitude >= 113 && longitude < 127.5) timezoneOffset = 8;
      else if (longitude >= 127.5 && longitude < 142.5) timezoneOffset = 9.5;
      else timezoneOffset = 10;
    }

    return timezoneOffset;
  }, []);

  const getTimezone = useCallback(async (latitude: number, longitude: number): Promise<string> => {
    try {
      const timezoneOffset = getTimezoneOffset(latitude, longitude);

      if (10 > timezoneOffset && timezoneOffset > 0) {
        return `+0${timezoneOffset}:00`;
      }

      if (timezoneOffset >= 0) {
        return `+${timezoneOffset}:00`;
      } else {
        return `${timezoneOffset}:00`;
      }

    } catch (error) {
      console.error('Failed to calculate timezone:', error);
      return '+00:00';
    }
  }, [getTimezoneOffset]);

  return { getTimezone, getTimezoneOffset };
}; 