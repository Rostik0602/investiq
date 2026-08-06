import { IncomeCategory } from '@prisma/client';

// See src/expenses/expense-category.ts for why this mapping table exists
// instead of storing the Ukrainian label directly in the enum.
export const INCOME_CATEGORY_LABELS: Record<IncomeCategory, string> = {
  [IncomeCategory.SALARY]: 'Зарплата',
  [IncomeCategory.FREELANCE]: 'Фріланс',
  [IncomeCategory.GIFT]: 'Подарунок',
  [IncomeCategory.INVESTMENTS]: 'Інвестиції',
  [IncomeCategory.OTHER]: 'Інше',
};

export const INCOME_CATEGORY_LABEL_VALUES = Object.values(INCOME_CATEGORY_LABELS);

const LABEL_TO_CATEGORY = new Map<string, IncomeCategory>(
  Object.entries(INCOME_CATEGORY_LABELS).map(([category, label]) => [
    label,
    category as IncomeCategory,
  ]),
);

export const incomeCategoryFromLabel = (label: string): IncomeCategory => {
  const category = LABEL_TO_CATEGORY.get(label);
  if (!category) {
    throw new Error(`Unknown income category label: ${label}`);
  }
  return category;
};

export const incomeCategoryToLabel = (category: IncomeCategory): string =>
  INCOME_CATEGORY_LABELS[category];
