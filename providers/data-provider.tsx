'use client';

import { authActions, useAppDispatch, userActions } from '@/store';
import { PropsWithChildren, useEffect, useState } from 'react';


let IS_USER_PREFETCHED = false;

export function DataProvider({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();

  const getUser = async () => {
    if (IS_USER_PREFETCHED) return;
    await dispatch(authActions.getUser())
    IS_USER_PREFETCHED = true;
  }

  useEffect(() => {
    getUser();
  }, [])

  return <>{children}</>;
} 