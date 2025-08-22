import { CapacitorConfig } from '@capacitor/cli';

export const REDIRECT_URL = 'http://localhost:3000/successfully-login';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'AIAA',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SocialLogin: {
      google: {
        clientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || '',
        serverClientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || '',
        forceCodeForRefreshToken: true,
        forcePrompt: false,
        autoSelectEnabled: true,
        redirectUri:REDIRECT_URL
      }
    }
  }
};

export default config;
