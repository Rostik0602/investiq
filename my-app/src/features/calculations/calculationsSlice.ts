import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TransactionType } from './types';

interface CalculationsState {
  month: number; // 0-11
  year: number;
  type: TransactionType;
}

const now = new Date();

const initialState: CalculationsState = {
  month: now.getMonth(),
  year: now.getFullYear(),
  type: 'expenses',
};

const calculationsSlice = createSlice({
  name: 'calculations',
  initialState,
  reducers: {
    goToPrevMonth: (state) => {
      if (state.month === 0) {
        state.month = 11;
        state.year -= 1;
      } else {
        state.month -= 1;
      }
    },
    goToNextMonth: (state) => {
      if (state.month === 11) {
        state.month = 0;
        state.year += 1;
      } else {
        state.month += 1;
      }
    },
    setType: (state, action: PayloadAction<TransactionType>) => {
      state.type = action.payload;
    },
  },
});

export const { goToPrevMonth, goToNextMonth, setType } = calculationsSlice.actions;
export default calculationsSlice.reducer;
