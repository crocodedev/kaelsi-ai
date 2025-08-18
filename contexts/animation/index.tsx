'use client';
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Application, Assets } from 'pixi.js';

import { AssetType, atlasArray, skeletonArray, textureArray } from './helpers';

type PreloadingContextType = {
  isPreloadingFinish: boolean;
  atlasArray: AssetType[];
  skeletonArray: AssetType[];
  textureArray: AssetType[];
};

const Context = createContext<PreloadingContextType>({} as PreloadingContextType);

const PreloadingContext = ({ children }: PropsWithChildren) => {
  const [isPreloadingFinish, setIsPreloadingFinish] = useState(false);
  const appRef = useRef<Application | null>(null);

  const loadAssets = useCallback(async () => {
    const allAssets = [...atlasArray, ...skeletonArray];
    const assetsToLoad = allAssets.filter(asset => !Assets.get(asset.alias));

    if (assetsToLoad.length === 0) {
      setIsPreloadingFinish(true);
      return;
    }

    if (isPreloadingFinish) {
      return;
    }

    try {
      Assets.add(assetsToLoad);
      const aliases = assetsToLoad.map(asset => asset.alias);
      
      await Assets.load(aliases);
      setIsPreloadingFinish(true);
    } catch (error) {
      console.error('Error loading assets:', error);
      setIsPreloadingFinish(true);
    }
  }, [isPreloadingFinish]);

  const initApplication = useCallback(async () => {
    if (appRef.current) return;
    
    const app = new Application();
    await app.init({
      width: 500,
      height: 500,
      backgroundAlpha: 0,
      roundPixels: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    appRef.current = app;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !appRef.current) {
      initApplication();
    }
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [initApplication]);

  useEffect(() => {
    const allAssets = [...atlasArray, ...skeletonArray];
    const assetsToLoad = allAssets.filter(asset => !Assets.get(asset.alias));
    
    if (assetsToLoad.length === 0) {
      setIsPreloadingFinish(true);
    } else {
      loadAssets();
    }
  }, [loadAssets]);

  const contextValue = useMemo(() => ({ 
    isPreloadingFinish, 
    atlasArray, 
    skeletonArray, 
    textureArray 
  }), [isPreloadingFinish]);

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export const usePreloadingContext = () => {
  const context = useContext(Context);
  return context;
};

export default PreloadingContext;
