'use client';

import { useState, useEffect, PropsWithChildren } from 'react';

import { ReduxProvider } from './redux-provider';
import { I18nProvider } from './i18n-provider';
import { AnimationProvider } from './animation-provider';
import { AuthProvider } from './auth-provider';
import { NotifyProvider } from '@/providers/notify-provider';


function LoadingScreen() {
  return (
    <div className="min-h-screen bg-mystical-bg flex items-center justify-center">
      <div className="text-mystical-text text-lg">Loading...</div>
    </div>
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
      <I18nProvider>
        <AnimationProvider>
          <AuthProvider>
            <NotifyProvider>
              {children}
            </NotifyProvider>
          </AuthProvider>
        </AnimationProvider>
      </I18nProvider>
    </ReduxProvider>
  );
} 