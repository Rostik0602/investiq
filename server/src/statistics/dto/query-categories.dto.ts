import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, Max, Min } from 'class-validator';
import { STATISTICS_TYPES, StatisticsType } from '../statistics-type';

export class QueryCategoriesDto {
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
}
