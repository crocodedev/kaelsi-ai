'use client';

import { useState, useEffect, PropsWithChildren } from 'react';

import { useAutoAuth } from '@/hooks/useAutoAuth';
import Loading from '@/app/loading';


export function AuthProvider({ children }: PropsWithChildren) {
    const { isAuthenticated, initializeAuth } = useAutoAuth()

    useEffect(() => {
        if (!isAuthenticated) {
            initializeAuth()
        }
    }, [initializeAuth, isAuthenticated])

    if (!isAuthenticated) {
        return <Loading />
    }

    return (
        <>
            {children}
        </>
    );
} 