import { useCallback } from 'react';
import { useAppSelector } from '@/store';

export const useTimestamp = () => {
  const userTimezone = useAppSelector(state => state.user?.birthData?.timezone);
  const isAuthenticated = useAppSelector(state => state.auth?.isAuthenticated);

  const addTimestampToData = useCallback((data: any) => {
    if (!isAuthenticated) return data;
    
    const now = new Date();
    return {
      ...data,
      timestamp: Math.floor(now.getTime() / 1000),
      localTime: now.toISOString(),
      timezone: userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }, [isAuthenticated, userTimezone]);

  return { addTimestampToData };
}; 