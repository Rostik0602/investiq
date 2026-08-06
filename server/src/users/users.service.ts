import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SafeUserDto } from './dto/safe-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}


  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: { email: string; passwordHash: string; name: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  updateRefreshTokenHash(userId: string, refreshTokenHash: string | null): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  setStartingBalance(userId: string, startingBalance: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { startingBalance, isBalanceConfirmed: true },
    });
  }

  toSafeUser(user: User): SafeUserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      startingBalance: Number(user.startingBalance),
      isBalanceConfirmed: user.isBalanceConfirmed,
      createdAt: user.createdAt,
    };
  }
}
