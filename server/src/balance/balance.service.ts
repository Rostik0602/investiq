import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { BalanceResponseDto } from './dto/balance-response.dto';
import { SetBalanceDto } from './dto/set-balance.dto';

@Injectable()
export class BalanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getBalance(userId: string): Promise<BalanceResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    const [expenseSum, incomeSum] = await Promise.all([
      this.prisma.expense.aggregate({ where: { userId }, _sum: { amount: true } }),
      this.prisma.income.aggregate({ where: { userId }, _sum: { amount: true } }),
    ]);

    const startingBalance = Number(user.startingBalance);
    const totalExpenses = Number(expenseSum._sum.amount ?? 0);
    const totalIncome = Number(incomeSum._sum.amount ?? 0);

    return {
      startingBalance,
      isConfirmed: user.isBalanceConfirmed,
      totalBalance: startingBalance + totalIncome - totalExpenses,
    };
  }

  // Also used to edit the starting balance later — the frontend exposes an
  // edit button next to the confirmed balance, not just the first-time
  // setup flow, so this intentionally allows overwriting an already
  // confirmed value rather than only working once.
  async setStartingBalance(userId: string, dto: SetBalanceDto): Promise<BalanceResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    await this.usersService.setStartingBalance(userId, dto.startingBalance);
    return this.getBalance(userId);
  }
}
