import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../index';

const selectTarotState = (state: AppState) => state.tarot;

export const selectSelectedCategory = createSelector(
  [selectTarotState],
  (tarot) => tarot.selectedCategory
);

export const selectSelectedSpread = createSelector(
  [selectTarotState],
  (tarot) => tarot.selectedSpread
);

export const selectQuestion = createSelector(
  [selectTarotState],
  (tarot) => tarot.question
);

export const selectMaxCoordinates = createSelector([selectTarotState], (tarot) => {
  return {
    maxX: Math.max(...Object.values(tarot?.response?.tarot?.matrix || {}).map(item => item[0]) || [0]),
    maxY: Math.max(...Object.values(tarot?.response?.tarot?.matrix || {}).map(item => item[1]) || [0])
  }
})
