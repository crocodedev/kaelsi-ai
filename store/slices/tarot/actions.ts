import { createAction } from '@reduxjs/toolkit';

import { ReadingHistoryItem } from './types';

export const actions = {
  setSelectedCategory: createAction<string>('tarot/setSelectedCategory'),
  setSelectedSpread: createAction<string>('tarot/setSelectedSpread'),
  setQuestion: createAction<string>('tarot/setQuestion'),
  setReadingHistory: createAction<ReadingHistoryItem[]>('tarot/setReadingHistory'),
  addReadingToHistory: createAction<ReadingHistoryItem>('tarot/addReadingToHistory'),
  clearReadingHistory: createAction<void>('tarot/clearReadingHistory'),
};

export default actions; 