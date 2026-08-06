import { ExpenseCategory } from '@prisma/client';


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
