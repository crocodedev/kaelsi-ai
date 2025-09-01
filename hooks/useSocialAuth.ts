import { useCallback, useState } from 'react';
import { GoogleLoginResponseOffline, SocialLogin } from '@capgo/capacitor-social-login';
import { configurationService } from '@/lib/services';
import { Configuration } from '@/lib/types/configurations';

export const useSocialAuth = () => {
  const [configuration, setConfiguration] = useState<Configuration | null>(null)

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: configuration?.google_auth.scopes.split(' ') || ['email', 'profile'],
          forceRefreshToken: true
        }
      });

      return result.result as GoogleLoginResponseOffline;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }, [configuration]);

  const logoutFromGoogle = useCallback(async () => {
    try {
      await SocialLogin.logout({ provider: 'google' });
    } catch (error) {
      console.error('Google logout failed:', error);
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
      const configuration = await configurationService.getConfiguration();
      setConfiguration(configuration.data);

      const googleConfig = {
        redirectUrl: configuration.data.google_auth.redirect_uri,
        webClientId: configuration.data.google_auth.key,
        mode: 'offline' as const
      };

      await SocialLogin.initialize({
        google: googleConfig
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