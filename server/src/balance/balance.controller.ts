import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from '../auth/types';
import { BalanceService } from './balance.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BalanceResponseDto } from './dto/balance-response.dto';
import { SetBalanceDto } from './dto/set-balance.dto';

@ApiTags('balance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get starting balance, confirmation state, and computed total' })
  @ApiResponse({ status: 200, type: BalanceResponseDto })
  getBalance(@CurrentUser() user: AuthenticatedUser): Promise<BalanceResponseDto> {
    return this.balanceService.getBalance(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Set or update the starting balance' })
  @ApiResponse({ status: 200, type: BalanceResponseDto })
  setStartingBalance(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SetBalanceDto,
  ): Promise<BalanceResponseDto> {
    return this.balanceService.setStartingBalance(user.userId, dto);
  }
}
