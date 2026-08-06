import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Expense, ExpenseCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ExpensesService } from './expenses.service';

const buildExpense = (overrides: Partial<Expense> = {}): Expense => ({
  id: 'expense-1',
  userId: 'user-1',
  description: 'Супермаркет',
  category: ExpenseCategory.PRODUCTS,
  amount: 150 as any,
  date: new Date('2026-08-01T00:00:00.000Z'),
  createdAt: new Date('2026-08-01T00:00:00.000Z'),
  ...overrides,
});

describe('ExpensesService', () => {
  let expensesService: ExpensesService;
  let prisma: {
    expense: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      expense: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [ExpensesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    expensesService = moduleRef.get(ExpensesService);
  });

  describe('findAll', () => {
    it('always scopes the query to the requesting user', async () => {
      prisma.expense.findMany.mockResolvedValue([]);

      await expensesService.findAll('user-1', {});

      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ userId: 'user-1' }) }),
      );
    });

    it('rejects a month filter without a matching year', async () => {
      await expect(expensesService.findAll('user-1', { month: 8 })).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.expense.findMany).not.toHaveBeenCalled();
    });
  });

  describe('remove — data isolation', () => {
    it('deletes the record when it belongs to the requesting user', async () => {
      prisma.expense.findUnique.mockResolvedValue(buildExpense({ userId: 'user-1' }));

      await expensesService.remove('user-1', 'expense-1');

      expect(prisma.expense.delete).toHaveBeenCalledWith({ where: { id: 'expense-1' } });
    });

    it('refuses to delete a record owned by a different user, even with a valid id', async () => {
      prisma.expense.findUnique.mockResolvedValue(buildExpense({ userId: 'someone-else' }));

      await expect(expensesService.remove('user-1', 'expense-1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.expense.delete).not.toHaveBeenCalled();
    });

    it('returns NotFound (not a crash) when the record does not exist at all', async () => {
      prisma.expense.findUnique.mockResolvedValue(null);

      await expect(expensesService.remove('user-1', 'missing-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.expense.delete).not.toHaveBeenCalled();
    });
  });
});
