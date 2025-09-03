export interface ReadingHistoryItem {
  id: string;
  category: string;
  spread: string;
  question: string;
  cards: string[];
  timestamp: number;
}

export type Coordinates = {
  x: number,
  y: number;
}

export interface TarotCard {
  name: string;
  position: string;
  meaning: string;
  reversed: boolean;
}

export type Pagination = {
  page?: number;
  per_page?: number;
}