import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../../auth/types';

// Reads the user attached by JwtAuthGuard/JwtRefreshGuard (via the
// corresponding passport strategy's validate()). Use as a controller
// parameter: `@CurrentUser() user: AuthenticatedUser`.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
