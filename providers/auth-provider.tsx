'use client';

import { useState, useEffect, PropsWithChildren } from 'react';
import { useAutoAuth } from '@/hooks/useAutoAuth';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import Loading from '@/app/loading';


export function AuthProvider({ children }: PropsWithChildren) {
    const { isAuthenticated, initializeAuth } = useAutoAuth()
    const { checkGoogleLoginStatus, loginWithGoogle, initializeGoogleAuth } = useSocialAuth()

    useEffect(() => {
        if (!isAuthenticated) {
            const initialize = async () => {
                try {
                    await initializeGoogleAuth();
                    const isLoggedIn = await checkGoogleLoginStatus();
                    if(!isLoggedIn){
                        const result = await loginWithGoogle();
                        console.log(result)
                    }
                    
                    initializeAuth();
                } catch (error) {
                    console.error('Social login initialization failed:', error);
                    initializeAuth();
                }
            }
            initialize()
        }
    }, [initializeAuth, isAuthenticated, checkGoogleLoginStatus, initializeGoogleAuth])

    if (!isAuthenticated) {
        return <Loading />
    }

    return (
        <>
            {children}
        </>
    );
} 