export interface TimestampData {
  timestamp: number; 
  localTime: string; 
  timezone: string; 
}


export const getUserLocalTime = (timezone?: string): TimestampData => {
  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000); 
  
  let localTime: string;
  let userTimezone: string;
  
  if (timezone) {
    try {
      
      const utcTime = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
      const userTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
      
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      localTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      userTimezone = timezone;
    } catch (error) {
      console.warn('Failed to parse timezone, using local time:', error);
      localTime = now.toISOString();
      userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  } else {
    localTime = now.toISOString();
    userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
  return {
    timestamp,
    localTime,
    timezone: userTimezone
  };
};

export const addTimestamp = <T extends Record<string, any>>(
  data: T, 
  timezone?: string
): T & TimestampData => {
  const timestampData = getUserLocalTime(timezone);
  return {
    ...data,
    ...timestampData
  };
};

export const formatTimestamp = (timestamp: number, timezone?: string): string => {
  const date = new Date(timestamp * 1000);
  
  if (timezone) {
    try {
      return date.toLocaleString("en-US", { timeZone: timezone });
    } catch (error) {
      console.warn('Failed to format with timezone, using local:', error);
    }
  }
  
  return date.toLocaleString();
};

export const getTimezoneOffset = (longitude: number): number => {
  
  return Math.round(longitude / 15);
};

export const formatTimezoneOffset = (offset: number): string => {
  if (offset >= 0) {
    return `+${offset}`;
  }
  return `${offset}`;
}; 