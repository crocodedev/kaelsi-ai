'use client';

import { useState, useEffect, PropsWithChildren } from 'react';

import { ReduxProvider } from './redux-provider';
import { I18nProvider } from './i18n-provider';
import { AnimationProvider } from './animation-provider';
import { AuthProvider } from './auth-provider';
import { DataProvider } from './data-provider';
import { NotifyProvider } from '@/providers/notify-provider';
import { AnalyticsProvider } from '@/providers/analytics-provider';
import { Loader } from '@/components/ui/loader';
import { ErrorProvider } from './error-provider';


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
        <DataProvider>
          <I18nProvider>
            <AnimationProvider>
              <NotifyProvider>
                <AnalyticsProvider>
                  <ErrorProvider>
                    {children}
                  </ErrorProvider>
                </AnalyticsProvider>
              </NotifyProvider>
            </AnimationProvider>
          </I18nProvider>
        </DataProvider>
      </AuthProvider>
    </ReduxProvider>
  );
} 