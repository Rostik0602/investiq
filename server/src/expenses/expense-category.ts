import { ExpenseCategory } from '@prisma/client';

// Maps the Prisma enum identifier to the exact Ukrainian label the frontend
// already uses (see my-app/src/features/expenses/types.ts EXPENSE_CATEGORIES).
// Keeping this as an explicit table (rather than @map in schema.prisma)
// means the wire format stays human-readable Ukrainian while the DB column
// stays a real, constrained enum.
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.TRANSPORT]: 'Транспорт',
  [ExpenseCategory.PRODUCTS]: 'Продукти',
  [ExpenseCategory.HEALTH]: "Здоров'я",
  [ExpenseCategory.ALCOHOL]: 'Алкоголь',
  [ExpenseCategory.ENTERTAINMENT]: 'Розваги',
  [ExpenseCategory.HOME]: 'Все для дому',
  [ExpenseCategory.ELECTRONICS]: 'Техніка',
  [ExpenseCategory.UTILITIES]: "Комуналка, зв'язок",
  [ExpenseCategory.SPORT_HOBBY]: 'Спорт, хобі',
  [ExpenseCategory.EDUCATION]: 'Навчання',
  [ExpenseCategory.OTHER]: 'Інше',
};

export const EXPENSE_CATEGORY_LABEL_VALUES = Object.values(EXPENSE_CATEGORY_LABELS);

const LABEL_TO_CATEGORY = new Map<string, ExpenseCategory>(
  Object.entries(EXPENSE_CATEGORY_LABELS).map(([category, label]) => [
    label,
    category as ExpenseCategory,
  ]),
);

export const expenseCategoryFromLabel = (label: string): ExpenseCategory => {
  const category = LABEL_TO_CATEGORY.get(label);
  if (!category) {
    throw new Error(`Unknown expense category label: ${label}`);
  }
  return category;
};

export const expenseCategoryToLabel = (category: ExpenseCategory): string =>
  EXPENSE_CATEGORY_LABELS[category];
