import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'AI Tarot Assistant',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GooglePlayGames: {
      android: {
        package: 'com.example.app'
      }
    }
  }
};

export default config;
