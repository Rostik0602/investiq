export interface IncomeItem {
  id: string;
  date: string; // ISO 8601, як повертає бекенд
  description: string;
  category: string;
  amount: number;
}

export const INCOME_CATEGORIES = ['Зарплата', 'Фріланс', 'Подарунок', 'Інвестиції', 'Інше'];