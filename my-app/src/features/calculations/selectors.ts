import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export const selectCalcMonth = (state: RootState) => state.calculations.month;
export const selectCalcYear = (state: RootState) => state.calculations.year;
export const selectCalcType = (state: RootState) => state.calculations.type;

// Бекенд очікує 1-індексований місяць (1-12), а у сторі він 0-індексований
// (0-11, як Date.getMonth()) — цей селектор один раз робить конверсію для
// всіх статистичних запитів.
export const selectCalcPeriod = createSelector(
  selectCalcMonth,
  selectCalcYear,
  (month, year) => ({ month: month + 1, year })
);
