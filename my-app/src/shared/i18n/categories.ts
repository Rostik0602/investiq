import type { TFunction } from 'i18next';

// Категорії зберігаються й надсилаються на бекенд як українські рядки —
// це сталий контракт API (EXPENSE_CATEGORIES/INCOME_CATEGORIES на фронті
// = точні значення, які бекенд приймає/віддає, жодного мапінгу на бекенді
// немає). Тут перекладаємо лише ВІДОБРАЖЕННЯ: value полів форм і дані з
// сервера завжди лишаються українською, перекладений текст — тільки те,
// що бачить користувач (option label у Select, текст у таблиці/гріді).
export const EXPENSE_CATEGORY_KEYS: Record<string, string> = {
  Транспорт: 'categories.expense.transport',
  Продукти: 'categories.expense.products',
  "Здоров'я": 'categories.expense.health',
  Алкоголь: 'categories.expense.alcohol',
  Розваги: 'categories.expense.entertainment',
  'Все для дому': 'categories.expense.home',
  Техніка: 'categories.expense.electronics',
  "Комуналка, зв'язок": 'categories.expense.utilities',
  'Спорт, хобі': 'categories.expense.sportHobby',
  Навчання: 'categories.expense.education',
  Інше: 'categories.expense.other',
};

export const INCOME_CATEGORY_KEYS: Record<string, string> = {
  Зарплата: 'categories.income.salary',
  Фріланс: 'categories.income.freelance',
  Подарунок: 'categories.income.gift',
  Інвестиції: 'categories.income.investments',
  Інше: 'categories.income.other',
};

export const translateExpenseCategory = (t: TFunction, category: string): string =>
  EXPENSE_CATEGORY_KEYS[category] ? t(EXPENSE_CATEGORY_KEYS[category]) : category;

export const translateIncomeCategory = (t: TFunction, category: string): string =>
  INCOME_CATEGORY_KEYS[category] ? t(INCOME_CATEGORY_KEYS[category]) : category;
