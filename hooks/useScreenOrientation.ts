import { useEffect } from 'react';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';

export const useScreenOrientation = () => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const lockOrientation = async () => {
        try {
          await ScreenOrientation.lock({ orientation: 'portrait' });
        } catch (error) {
          console.error('Error locking screen orientation:', error);
        }
      };

      lockOrientation();

      return () => {
        ScreenOrientation.unlock().catch(console.error);
      };
    }
  }, []);
};
