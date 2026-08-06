export interface IncomeItem {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

export const INCOME_CATEGORIES = [
  "Зарплата",
  "Фріланс",
  "Подарунок",
  "Інвестиції",
  "Інше",
];
