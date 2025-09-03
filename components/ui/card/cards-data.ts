// Major Arcana
import major_00_fool from '@/assets/cards/major-arcana/00_fool.jpg';


export type CardData = {
  name: string;
  src: any;
  type: 'major' | 'pentacles' | 'swords' | 'cups';
  number?: number;
}

export const CARDS_DATA: CardData[] = [
  // Major Arcana
  { name: 'The Fool', src: major_00_fool, type: 'major', number: 0 },

];

export const getCardByName = (name: string): CardData | undefined => {
  return CARDS_DATA.find(card => card.name === name);
};

export const getCardsByType = (type: CardData['type']): CardData[] => {
  return CARDS_DATA.filter(card => card.type === type);
};

export const getMajorArcana = (): CardData[] => {
  return getCardsByType('major');
};

export const getMinorArcana = (): CardData[] => {
  return CARDS_DATA.filter(card => card.type !== 'major');
}; 