import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from '../auth/types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateIncomeDto } from './dto/create-income.dto';
import { IncomeResponseDto } from './dto/income-response.dto';
import { QueryIncomeDto } from './dto/query-income.dto';
import { IncomeService } from './income.service';

@ApiTags('income')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get()
  @ApiOperation({ summary: 'List the current user\'s income entries, optionally filtered' })
  @ApiResponse({ status: 200, type: [IncomeResponseDto] })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryIncomeDto,
  ): Promise<IncomeResponseDto[]> {
    return this.incomeService.findAll(user.userId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Record a new income entry' })
  @ApiResponse({ status: 201, type: IncomeResponseDto })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateIncomeDto,
  ): Promise<IncomeResponseDto> {
    return this.incomeService.create(user.userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an income entry owned by the current user' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found (or not owned by the current user)' })
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Promise<void> {
    await this.incomeService.remove(user.userId, id);
  }
}
