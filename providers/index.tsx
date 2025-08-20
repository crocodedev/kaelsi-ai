'use client';

import { useState, useEffect, PropsWithChildren } from 'react';

import { ReduxProvider } from './redux-provider';
import { I18nProvider } from './i18n-provider';
import { AnimationProvider } from './animation-provider';
import { AuthProvider } from './auth-provider';
import { NotifyProvider } from '@/providers/notify-provider';
import { Loader } from '@/components/ui/loader';
import { useAutoLogin } from '@/hooks/useAutoLogin';


function LoadingScreen() {
  return (
    <Loader />
  );
}

function AutoLoginWrapper({ children }: PropsWithChildren) {
  useAutoLogin();
  return <>{children}</>;
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
              <AutoLoginWrapper>
                {children}
              </AutoLoginWrapper>
            </NotifyProvider>
          </AuthProvider>
        </AnimationProvider>
      </I18nProvider>
    </ReduxProvider>
  );
} 