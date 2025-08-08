import { ReadingHistoryItem } from './types';

export type InitialStateType = Readonly<{
  selectedCategory: string | null;
  selectedSpread: string | null;
  question: string | null;
  readingHistory: ReadingHistoryItem[];
}>;

export const initialState: InitialStateType = {
  selectedCategory: null,
  selectedSpread: null,
  question: null,
  readingHistory: [],
}; 