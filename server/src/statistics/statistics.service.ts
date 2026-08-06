import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { monthDateRange, yearDateRange } from '../common/utils/date-range.util';
import {
  EXPENSE_CATEGORY_LABELS,
  expenseCategoryFromLabel,
  expenseCategoryToLabel,
} from '../expenses/expense-category';
import {
  INCOME_CATEGORY_LABELS,
  incomeCategoryFromLabel,
  incomeCategoryToLabel,
} from '../income/income-category';
import { PrismaService } from '../prisma/prisma.service';
import { BreakdownStatDto, CategoryStatDto, MonthlyStatDto } from './dto/statistics-response.dto';
import { StatisticsType } from './statistics-type';

interface MonthSumRow {
  month: number;
  total: string | null;
}

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  // All aggregation below runs as SQL (raw grouped query or Prisma
  // groupBy) — never "fetch every row, sum in JS", which wouldn't scale
  // and would reintroduce float-accumulation error on money.
  async getMonthly(userId: string, year: number): Promise<MonthlyStatDto[]> {
    const { start, end } = yearDateRange(year);

    const [expenseRows, incomeRows] = await Promise.all([
      this.prisma.$queryRaw<MonthSumRow[]>(Prisma.sql`
        SELECT EXTRACT(MONTH FROM "date")::int AS month, SUM("amount") AS total
        FROM "expenses"
        WHERE "userId" = ${userId} AND "date" >= ${start} AND "date" < ${end}
        GROUP BY month
      `),
      this.prisma.$queryRaw<MonthSumRow[]>(Prisma.sql`
        SELECT EXTRACT(MONTH FROM "date")::int AS month, SUM("amount") AS total
        FROM "incomes"
        WHERE "userId" = ${userId} AND "date" >= ${start} AND "date" < ${end}
        GROUP BY month
      `),
    ]);

    const expenseByMonth = new Map(expenseRows.map((row) => [row.month, Number(row.total ?? 0)]));
    const incomeByMonth = new Map(incomeRows.map((row) => [row.month, Number(row.total ?? 0)]));

    return Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      return {
        month,
        totalExpenses: expenseByMonth.get(month) ?? 0,
        totalIncome: incomeByMonth.get(month) ?? 0,
      };
    });
  }

  async getCategories(
    userId: string,
    month: number,
    year: number,
    type: StatisticsType,
  ): Promise<CategoryStatDto[]> {
    const { start, end } = monthDateRange(month, year);

    if (type === 'expenses') {
      const rows = await this.prisma.expense.groupBy({
        by: ['category'],
        where: { userId, date: { gte: start, lt: end } },
        _sum: { amount: true },
      });
      const sums = new Map(rows.map((row) => [row.category, Number(row._sum.amount ?? 0)]));

      // Every category appears, even with 0 — the Розрахунки category grid
      // always renders the full fixed set of icons.
      return Object.values(EXPENSE_CATEGORY_LABELS)
        .map((label) => ({
          category: label,
          amount: sums.get(expenseCategoryFromLabel(label)) ?? 0,
        }))
        .sort((a, b) => b.amount - a.amount);
    }

    const rows = await this.prisma.income.groupBy({
      by: ['category'],
      where: { userId, date: { gte: start, lt: end } },
      _sum: { amount: true },
    });
    const sums = new Map(rows.map((row) => [row.category, Number(row._sum.amount ?? 0)]));

    return Object.values(INCOME_CATEGORY_LABELS)
      .map((label) => ({
        category: label,
        amount: sums.get(incomeCategoryFromLabel(label)) ?? 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  async getBreakdown(
    userId: string,
    month: number,
    year: number,
    type: StatisticsType,
    category?: string,
  ): Promise<BreakdownStatDto[]> {
    const { start, end } = monthDateRange(month, year);

    if (type === 'expenses') {
      const categoryFilter = category ? this.resolveExpenseCategory(category) : undefined;
      const rows = await this.prisma.expense.groupBy({
        by: ['description'],
        where: {
          userId,
          date: { gte: start, lt: end },
          ...(categoryFilter ? { category: categoryFilter } : {}),
        },
        _sum: { amount: true },
      });
      return this.toSortedBreakdown(rows);
    }

    const categoryFilter = category ? this.resolveIncomeCategory(category) : undefined;
    const rows = await this.prisma.income.groupBy({
      by: ['description'],
      where: {
        userId,
        date: { gte: start, lt: end },
        ...(categoryFilter ? { category: categoryFilter } : {}),
      },
      _sum: { amount: true },
    });
    return this.toSortedBreakdown(rows);
  }

  private toSortedBreakdown(
    rows: { description: string; _sum: { amount: Prisma.Decimal | null } }[],
  ): BreakdownStatDto[] {
    return rows
      .map((row) => ({ description: row.description, amount: Number(row._sum.amount ?? 0) }))
      .sort((a, b) => b.amount - a.amount);
  }

  private resolveExpenseCategory(label: string) {
    try {
      return expenseCategoryFromLabel(label);
    } catch {
      throw new BadRequestException(`Unknown expense category: ${label}`);
    }
  }

  private resolveIncomeCategory(label: string) {
    try {
      return incomeCategoryFromLabel(label);
    } catch {
      throw new BadRequestException(`Unknown income category: ${label}`);
    }
  }
}
