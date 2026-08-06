import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Validates the access token (Authorization: Bearer <accessToken>) via
// JwtStrategy ('jwt'). Attaches AuthenticatedUser to request.user.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
