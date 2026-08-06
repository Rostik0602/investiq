import type { TransactionType } from '../calculations/types';

export interface MonthlyStat {
  month: number; // 1-12
  totalExpenses: number;
  totalIncome: number;
}

export interface CategoryStat {
  category: string;
  amount: number;
}

export interface BreakdownStat {
  description: string;
  amount: number;
}

export type StatisticsType = TransactionType;
