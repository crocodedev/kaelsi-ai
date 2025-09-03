'use client';

import { useEffect, PropsWithChildren } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/app/loading';
import { useAppSelector } from '@/store';
import { selectHasToken } from '@/store/selectors/auth';
import { usePathname, useRouter } from 'next/navigation';


export function DataProvider({ children }: PropsWithChildren) {
  const hasToken = useAppSelector(selectHasToken);
  const { isAuthenticated, getUser } = useAuth();
  const pathname = usePathname();
  const SUCCESS_AUTH_URL = '/successfully-login';
  const router = useRouter();

  useEffect(() => {
    if (!hasToken && pathname !== SUCCESS_AUTH_URL) router.push('/auth');

  }, [isAuthenticated, getUser, hasToken]);

  if (!isAuthenticated && hasToken) {
    return <Loading />;
  }

  return <>{children}</>;
} 