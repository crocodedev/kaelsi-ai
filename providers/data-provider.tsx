'use client';

import { useState, useEffect, PropsWithChildren } from 'react';
import { useAutoAuth } from '@/hooks/useAutoAuth';
import { useAstro } from '@/hooks/useAstro';
import Loading from '@/app/loading';

export function DataProvider({ children }: PropsWithChildren) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  const { isAuthenticated, getUser } = useAutoAuth();
  const { getCardDay, getLanguages, getPlans } = useAstro();

  useEffect(() => {
    if (isAuthenticated && !isDataLoaded && !isDataLoading) {
      const loadAllData = async () => {
        setIsDataLoading(true);
        try {
          await Promise.allSettled([
            getUser(),
            getCardDay(),
            getLanguages(),
            getPlans()
          ]);
          setIsDataLoaded(true);
        } catch (error) {
          console.error('Failed to load initial data:', error);
        } finally {
          setIsDataLoading(false);
        }
      };
      
      loadAllData();
    }
  }, [isAuthenticated, isDataLoaded, isDataLoading, getUser, getCardDay, getLanguages, getPlans]);

  if (!isAuthenticated || !isDataLoaded || isDataLoading) {
    return <Loading />;
  }

  return <>{children}</>;
} 