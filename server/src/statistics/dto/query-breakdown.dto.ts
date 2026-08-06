import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { STATISTICS_TYPES, StatisticsType } from '../statistics-type';

export class QueryBreakdownDto {
  @ApiProperty({ minimum: 1, maximum: 12, description: '1-indexed month' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @ApiProperty({ minimum: 2000, maximum: 2100 })
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year!: number;

  @ApiProperty({ enum: STATISTICS_TYPES })
  @IsIn(STATISTICS_TYPES)
  type!: StatisticsType;

  @ApiPropertyOptional({
    description:
      'Restrict to one category. Omit to aggregate description totals across every ' +
      'category for the period (what the Розрахунки bar chart uses).',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
