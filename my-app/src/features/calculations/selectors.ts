import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const selectCalcMonth = (state: RootState) => state.calculations.month;
export const selectCalcYear = (state: RootState) => state.calculations.year;
export const selectCalcType = (state: RootState) => state.calculations.type;

export const selectCalcPeriod = createSelector(
  selectCalcMonth,
  selectCalcYear,
  (month, year) => ({ month: month + 1, year }),
);
