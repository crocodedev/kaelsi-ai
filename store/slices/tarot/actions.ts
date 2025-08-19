import { createAction } from '@reduxjs/toolkit';

import { ReadingHistoryItem } from './types';

export const actions = {
  setSelectedCategory: createAction<string | null>('tarot/setSelectedCategory'),
  setSelectedSpread: createAction<string | null>('tarot/setSelectedSpread'),
  setReaderStyle: createAction<string | null>('tarot/setReaderStyle'),
  setQuestion: createAction<string | null>('tarot/setQuestion'),
  setReadingHistory: createAction<ReadingHistoryItem[]>('tarot/setReadingHistory'),
  addReadingToHistory: createAction<ReadingHistoryItem>('tarot/addReadingToHistory'),
  clearReadingHistory: createAction<void>('tarot/clearReadingHistory'),
  getTarotCategories: createAction<void>('tarot/getTarotCategories'),
};

export default actions; 