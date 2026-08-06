import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from '../auth/types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { QueryBreakdownDto } from './dto/query-breakdown.dto';
import { QueryCategoriesDto } from './dto/query-categories.dto';
import { QueryMonthlyDto } from './dto/query-monthly.dto';
import { BreakdownStatDto, CategoryStatDto, MonthlyStatDto } from './dto/statistics-response.dto';
import { StatisticsService } from './statistics.service';

@ApiTags('statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('monthly')
  @ApiOperation({ summary: 'Per-month expense/income totals for a year (Зведення)' })
  @ApiResponse({ status: 200, type: [MonthlyStatDto] })
  getMonthly(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryMonthlyDto,
  ): Promise<MonthlyStatDto[]> {
    return this.statisticsService.getMonthly(user.userId, query.year);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Per-category totals for a period (Розрахунки category grid)' })
  @ApiResponse({ status: 200, type: [CategoryStatDto] })
  getCategories(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryCategoriesDto,
  ): Promise<CategoryStatDto[]> {
    return this.statisticsService.getCategories(user.userId, query.month, query.year, query.type);
  }

  @Get('breakdown')
  @ApiOperation({
    summary: 'Per-description totals for a period (Розрахунки bar chart)',
  })
  @ApiResponse({ status: 200, type: [BreakdownStatDto] })
  getBreakdown(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryBreakdownDto,
  ): Promise<BreakdownStatDto[]> {
    return this.statisticsService.getBreakdown(
      user.userId,
      query.month,
      query.year,
      query.type,
      query.category,
    );
  }
}
