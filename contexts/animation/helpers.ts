export type AssetType = {
  alias: string;
  src: string;
};

const VERSION = `v=${process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}`;

export const atlasArray: AssetType[] = [
  {
    alias: 'shuffle_atlas',
    src: '/animations/shuffle/shuffle.atlas'
  },
];

export const skeletonArray: AssetType[] = [
  {
    alias: 'shuffle',
    src: '/animations/shuffle/shuffle.json'
  }
]; 

export const textureArray: AssetType[] = [
  {
    alias: 'shuffle_texture',
    src: '/animations/shuffle/shuffle.png'
  }
];

export enum ANIMATION_ALIASES {
  SHUFFLE = 'shuffle',
}