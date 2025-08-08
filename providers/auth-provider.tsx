'use client';

import { useState, useEffect, PropsWithChildren } from 'react';

import { useAuth } from '@/hooks/useAuth';
import Loading from '@/app/loading';


export function AuthProvider({ children }: PropsWithChildren) {
    const { isAuthenticated, initializeAuth } = useAuth()

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