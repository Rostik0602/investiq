import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  passwordHash: 'hashed-password',
  name: 'Test User',
  startingBalance: 0 as any,
  isBalanceConfirmed: false,
  refreshTokenHash: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            updateRefreshTokenHash: jest.fn(),
            toSafeUser: jest.fn((user: User) => ({
              id: user.id,
              email: user.email,
              name: user.name,
              startingBalance: Number(user.startingBalance),
              isBalanceConfirmed: user.isBalanceConfirmed,
              createdAt: user.createdAt,
            })),
          },
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('signed.jwt.token') },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, fallback?: unknown) => fallback),
            getOrThrow: jest.fn((key: string) => `value-for-${key}`),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    jwtService = moduleRef.get(JwtService);

    jest.mocked(bcrypt.hash).mockResolvedValue('hashed-refresh-token' as never);
    usersService.updateRefreshTokenHash.mockResolvedValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('creates a user and returns a token pair when the email is free', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);

      const result = await authService.register({
        email: mockUser.email,
        password: 'Str0ngPass!',
        name: mockUser.name,
      });

      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: mockUser.email, name: mockUser.name }),
      );
      expect(result.accessToken).toBe('signed.jwt.token');
      expect(result.refreshToken).toBe('signed.jwt.token');
      expect(result.user.email).toBe(mockUser.email);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });

    it('rejects registration when the email is already taken', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.register({ email: mockUser.email, password: 'Str0ngPass!', name: 'X' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns a token pair for correct credentials', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result = await authService.login({ email: mockUser.email, password: 'correct' });

      expect(result.user.email).toBe(mockUser.email);
      expect(result.accessToken).toBe('signed.jwt.token');
    });

    it('rejects login when the user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'nobody@example.com', password: 'whatever' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects login when the password is wrong', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        authService.login({ email: mockUser.email, password: 'wrong-password' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(usersService.updateRefreshTokenHash).not.toHaveBeenCalled();
    });
  });
});
