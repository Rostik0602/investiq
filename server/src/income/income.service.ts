import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Income } from '@prisma/client';
import { monthDateRange } from '../common/utils/date-range.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { IncomeResponseDto } from './dto/income-response.dto';
import { QueryIncomeDto } from './dto/query-income.dto';
import { incomeCategoryFromLabel, incomeCategoryToLabel } from './income-category';

@Injectable()
export class IncomeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: QueryIncomeDto): Promise<IncomeResponseDto[]> {
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

    const incomes = await this.prisma.income.findMany({
      where: {
        userId,
        ...(category ? { category: incomeCategoryFromLabel(category) } : {}),
        ...(dateFilter ? { date: dateFilter } : {}),
      },
      orderBy: { date: 'desc' },
    });

    return incomes.map((income) => this.toResponseDto(income));
  }

  async create(userId: string, dto: CreateIncomeDto): Promise<IncomeResponseDto> {
    const income = await this.prisma.income.create({
      data: {
        userId,
        description: dto.description,
        category: incomeCategoryFromLabel(dto.category),
        amount: dto.amount,
        date: new Date(dto.date),
      },
    });

    return this.toResponseDto(income);
  }

  async remove(userId: string, id: string): Promise<void> {
    const income = await this.prisma.income.findUnique({ where: { id } });

    if (!income || income.userId !== userId) {
      throw new NotFoundException('Income not found');
    }

    await this.prisma.income.delete({ where: { id } });
  }

  private toResponseDto(income: Income): IncomeResponseDto {
    return {
      id: income.id,
      date: income.date.toISOString(),
      description: income.description,
      category: incomeCategoryToLabel(income.category),
      amount: Number(income.amount),
    };
  }
}
