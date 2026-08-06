import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { INCOME_CATEGORY_LABEL_VALUES } from '../income-category';

export class QueryIncomeDto {
  @ApiPropertyOptional({ minimum: 1, maximum: 12, description: '1-indexed month' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @ApiPropertyOptional({ minimum: 2000, maximum: 2100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  @ApiPropertyOptional({ enum: INCOME_CATEGORY_LABEL_VALUES })
  @IsOptional()
  @IsIn(INCOME_CATEGORY_LABEL_VALUES)
  category?: string;
}
