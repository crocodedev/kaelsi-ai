import { useCallback } from 'react';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { Capacitor } from '@capacitor/core';

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
          forcePrompt: false,

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
      if (Capacitor.isNativePlatform()) {
        await SocialLogin.initialize({});
      } else {
        await SocialLogin.initialize({
          google: {
            webClientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || '',
            redirectUrl: window.location.origin,
          }
        });
      }
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