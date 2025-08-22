'use client';

import { useState, useEffect, PropsWithChildren } from 'react';

import { ReduxProvider } from './redux-provider';
import { I18nProvider } from './i18n-provider';
import { AnimationProvider } from './animation-provider';
import { AuthProvider } from './auth-provider';
import { NotifyProvider } from '@/providers/notify-provider';
import { AnalyticsProvider } from '@/providers/analytics-provider';
import { Loader } from '@/components/ui/loader';
import { useAutoLogin } from '@/hooks/useAutoLogin';


function LoadingScreen() {
  return (
    <Loader />
  );
}


export function Providers({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return <LoadingScreen />;
  }

  return (
    <ReduxProvider>
      <AuthProvider>
        <I18nProvider>
          <AnimationProvider>
            <NotifyProvider>
              <AnalyticsProvider>
                {children}
              </AnalyticsProvider>
            </NotifyProvider>
          </AnimationProvider>
        </I18nProvider>
      </AuthProvider>
    </ReduxProvider>
  );
} 