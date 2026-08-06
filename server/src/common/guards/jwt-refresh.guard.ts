import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Validates the refresh token (Authorization: Bearer <refreshToken>) via
// JwtRefreshStrategy ('jwt-refresh'). Only POST /auth/refresh uses this —
// every other protected route uses JwtAuthGuard against the access token.
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
