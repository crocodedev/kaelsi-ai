// Major Arcana
import major_00_fool from '@/assets/cards/major-arcana/00_fool.jpg';
import major_01_magician from '@/assets/cards/major-arcana/01_magician.jpg';
import major_02_high_priestess from '@/assets/cards/major-arcana/02_high_priestess.jpg';
import major_03_empress from '@/assets/cards/major-arcana/03_empress.jpg';
import major_04_emperor from '@/assets/cards/major-arcana/04_emperor.jpg';
import major_05_hierophant from '@/assets/cards/major-arcana/05_hierophant.jpg';
import major_06_lovers from '@/assets/cards/major-arcana/06_lovers.jpg';
import major_07_chariot from '@/assets/cards/major-arcana/07_chariot.jpg';
import major_08_strength from '@/assets/cards/major-arcana/08_strength.jpg';
import major_09_hermit from '@/assets/cards/major-arcana/09_hermit.jpg';
import major_10_wheel_of_fortune from '@/assets/cards/major-arcana/10_wheel_of_fortune.jpg';
import major_11_justice from '@/assets/cards/major-arcana/11_justice.jpg';
import major_12_hanged_man from '@/assets/cards/major-arcana/12_hanged_man.jpg';
import major_13_death from '@/assets/cards/major-arcana/13_death.jpg';
import major_14_temperance from '@/assets/cards/major-arcana/14_temperance.jpg';
import major_15_devil from '@/assets/cards/major-arcana/15_devil.jpg';
import major_16_tower from '@/assets/cards/major-arcana/16_tower.jpg';
import major_17_star from '@/assets/cards/major-arcana/17_star.jpg';
import major_18_moon from '@/assets/cards/major-arcana/18_moon.jpg';
import major_19_sun from '@/assets/cards/major-arcana/19_sun.jpg';
import major_20_judgement from '@/assets/cards/major-arcana/20_judgement.jpg';
import major_21_world from '@/assets/cards/major-arcana/21_world.jpg';

// Minor Arcana - Pentacles
import pentacles_ace from '@/assets/cards/minor-arcana-pentacles/ace_of_pentacles.jpg';
import pentacles_two from '@/assets/cards/minor-arcana-pentacles/two_of_pentacles.jpg';
import pentacles_three from '@/assets/cards/minor-arcana-pentacles/three_of_pentacles.jpg';
import pentacles_four from '@/assets/cards/minor-arcana-pentacles/four_of_pentacles.jpg';
import pentacles_five from '@/assets/cards/minor-arcana-pentacles/five_of_pentacles.jpg';
import pentacles_six from '@/assets/cards/minor-arcana-pentacles/six_of_pentacles.jpg';
import pentacles_seven from '@/assets/cards/minor-arcana-pentacles/seven_of_pentacles.jpg';
import pentacles_eight from '@/assets/cards/minor-arcana-pentacles/eight_of_pentacles.jpg';
import pentacles_nine from '@/assets/cards/minor-arcana-pentacles/nine_of_pentacles.jpg';
import pentacles_ten from '@/assets/cards/minor-arcana-pentacles/ten_of_pentacles.jpg';
import pentacles_page from '@/assets/cards/minor-arcana-pentacles/page_of_pentacles.jpg';
import pentacles_knight from '@/assets/cards/minor-arcana-pentacles/knight_of_pentacles.jpg';
import pentacles_queen from '@/assets/cards/minor-arcana-pentacles/queen_of_pentacles.jpg';
import pentacles_king from '@/assets/cards/minor-arcana-pentacles/king_of_pentacles.jpg';

// Minor Arcana - Swords
import swords_ace from '@/assets/cards/minor-arcana-swords/ace_of_swords.jpg';
import swords_two from '@/assets/cards/minor-arcana-swords/two_of_swords.jpg';
import swords_three from '@/assets/cards/minor-arcana-swords/three_of_swords.jpg';
import swords_four from '@/assets/cards/minor-arcana-swords/four_of_swords.jpg';
import swords_five from '@/assets/cards/minor-arcana-swords/five_of_swords.jpg';
import swords_six from '@/assets/cards/minor-arcana-swords/six_of_swords.jpg';
import swords_seven from '@/assets/cards/minor-arcana-swords/seven_of_swords.jpg';
import swords_eight from '@/assets/cards/minor-arcana-swords/eight_of_swords.jpg';
import swords_nine from '@/assets/cards/minor-arcana-swords/nine_of_swords.jpg';
import swords_ten from '@/assets/cards/minor-arcana-swords/ten_of_swords.jpg';
import swords_page from '@/assets/cards/minor-arcana-swords/page_of_swords.jpg';
import swords_knight from '@/assets/cards/minor-arcana-swords/knight_of_swords.jpg';
import swords_queen from '@/assets/cards/minor-arcana-swords/queen_of_swords.jpg';
import swords_king from '@/assets/cards/minor-arcana-swords/king_of_swords.jpg';

// Minor Arcana - Cups
import cups_ace from '@/assets/cards/minor-arcana-cups/ace_of_cups.jpg';
import cups_two from '@/assets/cards/minor-arcana-cups/two_of_cups.jpg';
import cups_three from '@/assets/cards/minor-arcana-cups/three_of_cups.jpg';
import cups_four from '@/assets/cards/minor-arcana-cups/four_of_cups.jpg';
import cups_five from '@/assets/cards/minor-arcana-cups/five_of_cups.jpg';
import cups_six from '@/assets/cards/minor-arcana-cups/six_of_cups.jpg';
import cups_seven from '@/assets/cards/minor-arcana-cups/seven_of_cups.jpg';
import cups_eight from '@/assets/cards/minor-arcana-cups/eight_of_cups.jpg';
import cups_nine from '@/assets/cards/minor-arcana-cups/nine_of_cups.jpg';
import cups_ten from '@/assets/cards/minor-arcana-cups/ten_of_cups.jpg';
import cups_page from '@/assets/cards/minor-arcana-cups/page_of_cups.jpg';
import cups_knight from '@/assets/cards/minor-arcana-cups/knight_of_cups.jpg';
import cups_queen from '@/assets/cards/minor-arcana-cups/queen_of_cups.jpg';
import cups_king from '@/assets/cards/minor-arcana-cups/king_of_cups.jpg';

export interface CardData {
  name: string;
  src: any;
  type: 'major' | 'pentacles' | 'swords' | 'cups';
  number?: number;
}

export const CARDS_DATA: CardData[] = [
  // Major Arcana
  { name: 'The Fool', src: major_00_fool, type: 'major', number: 0 },
  { name: 'The Magician', src: major_01_magician, type: 'major', number: 1 },
  { name: 'The High Priestess', src: major_02_high_priestess, type: 'major', number: 2 },
  { name: 'The Empress', src: major_03_empress, type: 'major', number: 3 },
  { name: 'The Emperor', src: major_04_emperor, type: 'major', number: 4 },
  { name: 'The Hierophant', src: major_05_hierophant, type: 'major', number: 5 },
  { name: 'The Lovers', src: major_06_lovers, type: 'major', number: 6 },
  { name: 'The Chariot', src: major_07_chariot, type: 'major', number: 7 },
  { name: 'Strength', src: major_08_strength, type: 'major', number: 8 },
  { name: 'The Hermit', src: major_09_hermit, type: 'major', number: 9 },
  { name: 'Wheel of Fortune', src: major_10_wheel_of_fortune, type: 'major', number: 10 },
  { name: 'Justice', src: major_11_justice, type: 'major', number: 11 },
  { name: 'The Hanged Man', src: major_12_hanged_man, type: 'major', number: 12 },
  { name: 'Death', src: major_13_death, type: 'major', number: 13 },
  { name: 'Temperance', src: major_14_temperance, type: 'major', number: 14 },
  { name: 'The Devil', src: major_15_devil, type: 'major', number: 15 },
  { name: 'The Tower', src: major_16_tower, type: 'major', number: 16 },
  { name: 'The Star', src: major_17_star, type: 'major', number: 17 },
  { name: 'The Moon', src: major_18_moon, type: 'major', number: 18 },
  { name: 'The Sun', src: major_19_sun, type: 'major', number: 19 },
  { name: 'Judgement', src: major_20_judgement, type: 'major', number: 20 },
  { name: 'The World', src: major_21_world, type: 'major', number: 21 },

  // Minor Arcana - Pentacles
  { name: 'Ace of Pentacles', src: pentacles_ace, type: 'pentacles', number: 1 },
  { name: 'Two of Pentacles', src: pentacles_two, type: 'pentacles', number: 2 },
  { name: 'Three of Pentacles', src: pentacles_three, type: 'pentacles', number: 3 },
  { name: 'Four of Pentacles', src: pentacles_four, type: 'pentacles', number: 4 },
  { name: 'Five of Pentacles', src: pentacles_five, type: 'pentacles', number: 5 },
  { name: 'Six of Pentacles', src: pentacles_six, type: 'pentacles', number: 6 },
  { name: 'Seven of Pentacles', src: pentacles_seven, type: 'pentacles', number: 7 },
  { name: 'Eight of Pentacles', src: pentacles_eight, type: 'pentacles', number: 8 },
  { name: 'Nine of Pentacles', src: pentacles_nine, type: 'pentacles', number: 9 },
  { name: 'Ten of Pentacles', src: pentacles_ten, type: 'pentacles', number: 10 },
  { name: 'Page of Pentacles', src: pentacles_page, type: 'pentacles' },
  { name: 'Knight of Pentacles', src: pentacles_knight, type: 'pentacles' },
  { name: 'Queen of Pentacles', src: pentacles_queen, type: 'pentacles' },
  { name: 'King of Pentacles', src: pentacles_king, type: 'pentacles' },

  // Minor Arcana - Swords
  { name: 'Ace of Swords', src: swords_ace, type: 'swords', number: 1 },
  { name: 'Two of Swords', src: swords_two, type: 'swords', number: 2 },
  { name: 'Three of Swords', src: swords_three, type: 'swords', number: 3 },
  { name: 'Four of Swords', src: swords_four, type: 'swords', number: 4 },
  { name: 'Five of Swords', src: swords_five, type: 'swords', number: 5 },
  { name: 'Six of Swords', src: swords_six, type: 'swords', number: 6 },
  { name: 'Seven of Swords', src: swords_seven, type: 'swords', number: 7 },
  { name: 'Eight of Swords', src: swords_eight, type: 'swords', number: 8 },
  { name: 'Nine of Swords', src: swords_nine, type: 'swords', number: 9 },
  { name: 'Ten of Swords', src: swords_ten, type: 'swords', number: 10 },
  { name: 'Page of Swords', src: swords_page, type: 'swords' },
  { name: 'Knight of Swords', src: swords_knight, type: 'swords' },
  { name: 'Queen of Swords', src: swords_queen, type: 'swords' },
  { name: 'King of Swords', src: swords_king, type: 'swords' },

  // Minor Arcana - Cups
  { name: 'Ace of Cups', src: cups_ace, type: 'cups', number: 1 },
  { name: 'Two of Cups', src: cups_two, type: 'cups', number: 2 },
  { name: 'Three of Cups', src: cups_three, type: 'cups', number: 3 },
  { name: 'Four of Cups', src: cups_four, type: 'cups', number: 4 },
  { name: 'Five of Cups', src: cups_five, type: 'cups', number: 5 },
  { name: 'Six of Cups', src: cups_six, type: 'cups', number: 6 },
  { name: 'Seven of Cups', src: cups_seven, type: 'cups', number: 7 },
  { name: 'Eight of Cups', src: cups_eight, type: 'cups', number: 8 },
  { name: 'Nine of Cups', src: cups_nine, type: 'cups', number: 9 },
  { name: 'Ten of Cups', src: cups_ten, type: 'cups', number: 10 },
  { name: 'Page of Cups', src: cups_page, type: 'cups' },
  { name: 'Knight of Cups', src: cups_knight, type: 'cups' },
  { name: 'Queen of Cups', src: cups_queen, type: 'cups' },
  { name: 'King of Cups', src: cups_king, type: 'cups' },
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