import { useCallback } from 'react';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { Capacitor } from '@capacitor/core';
import { REDIRECT_URL } from '@/capacitor.config';

export const useSocialAuth = () => {
  const loginWithGoogle = useCallback(async () => {
    try {
      // if (!Capacitor.isNativePlatform()) {
      //   throw new Error('Social login is only available on native platforms');
      // }

      const result = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
          forceRefreshToken: true,
          autoSelectEnabled: true
        }
      });

      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const logoutFromGoogle = useCallback(async () => {
    try {
      await SocialLogin.logout({ provider: 'google' });
    } catch (error) {
    }
  }, []);

  const checkGoogleLoginStatus = useCallback(async () => {
    try {
      const result = await SocialLogin.isLoggedIn({ provider: 'google' });
      return result.isLoggedIn;
    } catch (error) {
      return false;
    }
  }, []);

  const initializeGoogleAuth = useCallback(async () => {
    try {
      await SocialLogin.initialize({
        google: {
          redirectUrl: REDIRECT_URL,
          webClientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || '',
        }
      });
    } catch (error) {
      console.error('Google auth initialization failed:', error);
    }
  }, []);

  return {
    loginWithGoogle,
    logoutFromGoogle,
    checkGoogleLoginStatus,
    initializeGoogleAuth
  };
}; 