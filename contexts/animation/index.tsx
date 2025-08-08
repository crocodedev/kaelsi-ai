'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { AssetType, atlasArray, skeletonArray } from './helpers';

type PreloadingContextType = {
  isPreloadingFinish: boolean;
  atlasArray: AssetType[];
  skeletonArray: AssetType[];
};

const Context = createContext<PreloadingContextType>({} as PreloadingContextType);

interface PreloadingContextProps {
  children: React.ReactNode;
}

const PreloadingContext: React.FC<PreloadingContextProps> = ({ children }) => {
  const [isPreloadingFinish, setIsPreloadingFinish] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setIsPreloadingFinish(true);
    }
  }, [isClient]);

  if (!isClient) {
    return <div className="min-h-screen bg-mystical-bg flex items-center justify-center">
      <div className="text-mystical-text text-lg">Initializing...</div>
    </div>;
  }

  return (
    <Context.Provider value={{ isPreloadingFinish, atlasArray, skeletonArray }}>
      {children}
    </Context.Provider>
  );
};

export const usePreloadingContext = () => useContext(Context);
export default PreloadingContext; 