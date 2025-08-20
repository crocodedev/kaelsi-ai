import { ReadingHistoryItem, Coordinates } from './types';

export type InitialStateType = Readonly<{
  selectedCategory: string | null;
  selectedSpread: string | null;
  question: string | null;
  readingHistory: ReadingHistoryItem[];
  layout: Layout | null;
  isFirstAnimationDone:boolean;
}>;

export const initialState: InitialStateType = {
  selectedCategory: null,
  selectedSpread: null,
  question: null,
  readingHistory: [],
  layout: null,
  isFirstAnimationDone:false,
};

export type Layout = {
  description: string;
  name: string;
  matrix: Matrix;
}

export type Matrix = Coordinates[];