export type AssetType = {
  alias: string;
  src: string;
};

const VERSION = `v=${process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}`;

export const atlasArray: AssetType[] = [];

export const skeletonArray: AssetType[] = []; 