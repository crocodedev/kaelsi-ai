import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

export interface SocialAuthResult {
  provider: 'google' | 'apple' | 'facebook';
  accessToken: string;
  user: {
    id: string;
    email: string | null;
    name: string | null;
    firstName?: string | null;
    lastName?: string | null;
    picture?: string | null;
  };
}

export class SocialAuthService {
  private static instance: SocialAuthService;

  static getInstance(): SocialAuthService {
    if (!SocialAuthService.instance) {
      SocialAuthService.instance = new SocialAuthService();
    }
    return SocialAuthService.instance;
  }

  async initialize(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await SocialLogin.initialize({});
      } catch (error) {
        console.error('Failed to initialize social login:', error);
      }
    }
  }

  async loginWithGoogle(): Promise<SocialAuthResult> {
    try {
      const result = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
          forcePrompt: false,
          autoSelectEnabled: true
        }
      });

      const response = result.result as any;
      
      return {
        provider: 'google',
        accessToken: response.accessToken || '',
        user: {
          id: response.user?.id || '',
          email: response.user?.email || null,
          name: response.user?.name || null,
          firstName: response.user?.givenName || null,
          lastName: response.user?.familyName || null,
          picture: response.user?.picture?.data?.url || null
        }
      };
    } catch (error) {
      console.error('Google login failed:', error);
      throw new Error('Google login failed');
    }
  }

  async loginWithApple(): Promise<SocialAuthResult> {
    try {
      const result = await SocialLogin.login({
        provider: 'apple',
        options: {
          scopes: ['email', 'name']
        }
      });

      const response = result.result as any;
      
      return {
        provider: 'apple',
        accessToken: response.accessToken || '',
        user: {
          id: response.user?.id || '',
          email: response.user?.email || null,
          name: response.user?.name || null,
          firstName: response.user?.givenName || null,
          lastName: response.user?.familyName || null
        }
      };
    } catch (error) {
      console.error('Apple login failed:', error);
      throw new Error('Apple login failed');
    }
  }

  async loginWithFacebook(): Promise<SocialAuthResult> {
    try {
      const result = await SocialLogin.login({
        provider: 'facebook',
        options: {
          permissions: ['email', 'public_profile'],
          limitedLogin: false
        }
      });

      const response = result.result as any;
      const profileData = response.user as any;

      return {
        provider: 'facebook',
        accessToken: response.accessToken || '',
        user: {
          id: profileData.id || '',
          email: profileData.email || null,
          name: profileData.name || null,
          firstName: profileData.first_name || null,
          lastName: profileData.last_name || null,
          picture: profileData.picture?.data?.url || null
        }
      };
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw new Error('Facebook login failed');
    }
  }

  async logout(provider: 'google' | 'apple' | 'facebook'): Promise<void> {
    try {
      await SocialLogin.logout({ provider });
    } catch (error) {
      console.error(`${provider} logout failed:`, error);
    }
  }

  async isLoggedIn(provider: 'google' | 'apple' | 'facebook'): Promise<boolean> {
    try {
      const result = await SocialLogin.isLoggedIn({ provider });
      return result.isLoggedIn;
    } catch (error) {
      console.error(`Check ${provider} login status failed:`, error);
      return false;
    }
  }

  async getCurrentUser(provider: 'google' | 'apple' | 'facebook'): Promise<SocialAuthResult | null> {
    try {
      const isLoggedIn = await this.isLoggedIn(provider);
      if (!isLoggedIn) return null;

      return {
        provider,
        accessToken: '',
        user: {
          id: '',
          email: null,
          name: null,
          firstName: null,
          lastName: null,
          picture: null
        }
      };
    } catch (error) {
      console.error(`Get ${provider} current user failed:`, error);
      return null;
    }
  }
}

export const socialAuthService = SocialAuthService.getInstance(); 