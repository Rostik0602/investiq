export interface ExpenseItem {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

export const EXPENSE_CATEGORIES = [
  "Транспорт",
  "Продукти",
  "Здоров'я",
  "Алкоголь",
  "Розваги",
  "Все для дому",
  "Техніка",
  "Комуналка, зв'язок",
  "Спорт, хобі",
  "Навчання",
  "Інше",
];
