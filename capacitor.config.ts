import { CapacitorConfig } from '@capacitor/cli';

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
        webClientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || '',
        redirectUrl: 'http://localhost:3000'
      }
    }
  }
};

export default config;
