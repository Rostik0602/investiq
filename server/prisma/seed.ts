import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { expenseCategoryFromLabel } from '../src/expenses/expense-category';
import { incomeCategoryFromLabel } from '../src/income/income-category';

const prisma = new PrismaClient();

const DEMO_EMAIL = 'demo@investiq.app';
const DEMO_PASSWORD = 'Demo12345!';

// Builds a UTC date for the given month offset (0 = current month, -1 =
// previous month, ...) and day-of-month, so seeded data spreads across
// several months regardless of when `prisma db seed` is run.
const dateInMonth = (monthOffset: number, day: number): Date => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + monthOffset, day));
};

const expenseSeeds = [
  { desc: 'Супермаркет', category: 'Продукти', amount: 1450.5, month: 0, day: 3 },
  { desc: "Кав'ярня", category: 'Продукти', amount: 120, month: 0, day: 5 },
  { desc: 'Таксі', category: 'Транспорт', amount: 250, month: 0, day: 7 },
  { desc: 'Кіно', category: 'Розваги', amount: 400, month: 0, day: 12 },
  { desc: 'Аптека', category: "Здоров'я", amount: 320.75, month: 0, day: 15 },
  { desc: 'Вино', category: 'Алкоголь', amount: 450, month: 0, day: 20 },
  { desc: 'Супермаркет', category: 'Продукти', amount: 1600, month: -1, day: 2 },
  { desc: 'Бензин', category: 'Транспорт', amount: 1200, month: -1, day: 6 },
  { desc: 'Спортзал', category: 'Спорт, хобі', amount: 800, month: -1, day: 10 },
  { desc: 'Комунальні послуги', category: "Комуналка, зв'язок", amount: 2100, month: -1, day: 14 },
  { desc: 'Курси англійської', category: 'Навчання', amount: 1500, month: -1, day: 18 },
  { desc: 'Навушники', category: 'Техніка', amount: 2200, month: -1, day: 22 },
  { desc: 'Супермаркет', category: 'Продукти', amount: 1380, month: -2, day: 4 },
  { desc: 'Меблі', category: 'Все для дому', amount: 3200, month: -2, day: 9 },
  { desc: 'Ресторан', category: 'Розваги', amount: 950, month: -2, day: 16 },
  { desc: 'Різне', category: 'Інше', amount: 300, month: -2, day: 25 },
];

const incomeSeeds = [
  { desc: 'Заробітна плата', category: 'Зарплата', amount: 32000, month: 0, day: 1 },
  { desc: 'Проєкт на фрілансі', category: 'Фріланс', amount: 6500, month: 0, day: 18 },
  { desc: 'Заробітна плата', category: 'Зарплата', amount: 32000, month: -1, day: 1 },
  { desc: 'Дивіденди', category: 'Інвестиції', amount: 1200, month: -1, day: 20 },
  { desc: 'Заробітна плата', category: 'Зарплата', amount: 31500, month: -2, day: 1 },
  { desc: 'День народження', category: 'Подарунок', amount: 2000, month: -2, day: 11 },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      passwordHash,
      name: 'Demo User',
      startingBalance: 15000,
      isBalanceConfirmed: true,
    },
  });

  await prisma.expense.deleteMany({ where: { userId: user.id } });
  await prisma.income.deleteMany({ where: { userId: user.id } });

  await prisma.expense.createMany({
    data: expenseSeeds.map((seed) => ({
      userId: user.id,
      description: seed.desc,
      category: expenseCategoryFromLabel(seed.category),
      amount: seed.amount,
      date: dateInMonth(seed.month, seed.day),
    })),
  });

  await prisma.income.createMany({
    data: incomeSeeds.map((seed) => ({
      userId: user.id,
      description: seed.desc,
      category: incomeCategoryFromLabel(seed.category),
      amount: seed.amount,
      date: dateInMonth(seed.month, seed.day),
    })),
  });

  console.log('Seed complete.');
  console.log(`  Demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  console.log(`  Expenses seeded: ${expenseSeeds.length}`);
  console.log(`  Incomes seeded: ${incomeSeeds.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
