'use client';

import { useEffect, PropsWithChildren } from 'react';
import { useAutoAuth } from '@/hooks/useAutoAuth';
import Loading from '@/app/loading';
import { useAppSelector } from '@/store';
import { selectHasToken } from '@/store/selectors/auth';
import { useRouter } from 'next/navigation';


export function DataProvider({ children }: PropsWithChildren) {
  const hasToken = useAppSelector(selectHasToken);
  const { isAuthenticated, getUser } = useAutoAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hasToken) router.push('/auth');

  }, [isAuthenticated, getUser, hasToken]);

  if (!isAuthenticated && hasToken) {
    return <Loading />;
  }

  return <>{children}</>;
} 