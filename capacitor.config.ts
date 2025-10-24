import { CapacitorConfig } from '@capacitor/cli';

export const REDIRECT_URL = 'http://localhost:3000/successfully-login';

const config: CapacitorConfig = {
  appId: 'com.kaelisai.kaelis',
  appName: 'Kaelsi',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*']
  },
  android: {
    webContentsDebuggingEnabled: true
  },
  plugins: {
    CapgoSocialLogin: {
      google: {
        clientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || '',
        serverClientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || '',
        forceCodeForRefreshToken: true,
        forcePrompt: false,
        autoSelectEnabled: true,
        redirectUri: REDIRECT_URL
      }
    },
    ScreenOrientation: {
      orientation: 'portrait'
    }
  }
}

export default config;
