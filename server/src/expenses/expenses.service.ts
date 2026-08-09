import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Expense } from '@prisma/client';
import { BalanceService } from '../balance/balance.service';
import { monthDateRange } from '../common/utils/date-range.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
import { expenseCategoryFromLabel, expenseCategoryToLabel } from './expense-category';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly balanceService: BalanceService,
  ) {}

  async findAll(userId: string, query: QueryExpensesDto): Promise<ExpenseResponseDto[]> {
    const { month, year, category } = query;
    if ((month === undefined) !== (year === undefined)) {
      throw new BadRequestException('month and year must be provided together');
    }

    const dateFilter =
      month && year
        ? (() => {
            const { start, end } = monthDateRange(month, year);
            return { gte: start, lt: end };
          })()
        : undefined;

    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
        ...(category ? { category: expenseCategoryFromLabel(category) } : {}),
        ...(dateFilter ? { date: dateFilter } : {}),
      },
      orderBy: { date: 'desc' },
    });

    return expenses.map((expense) => this.toResponseDto(expense));
  }

  async create(userId: string, dto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    const { totalBalance } = await this.balanceService.getBalance(userId);
    if (dto.amount > totalBalance) {
      throw new BadRequestException('INSUFFICIENT_BALANCE');
    }

    const expense = await this.prisma.expense.create({
      data: {
        userId,
        description: dto.description,
        category: expenseCategoryFromLabel(dto.category),
        amount: dto.amount,
        date: new Date(dto.date),
      },
    });

    return this.toResponseDto(expense);
  }

  async remove(userId: string, id: string): Promise<void> {
    const expense = await this.prisma.expense.findUnique({ where: { id } });


    if (!expense || expense.userId !== userId) {
      throw new NotFoundException('Expense not found');
    }

    await this.prisma.expense.delete({ where: { id } });
  }

  private toResponseDto(expense: Expense): ExpenseResponseDto {
    return {
      id: expense.id,
      date: expense.date.toISOString(),
      description: expense.description,
      category: expenseCategoryToLabel(expense.category),
      amount: Number(expense.amount),
    };
  }
}
