import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';
import { INCOME_CATEGORY_LABEL_VALUES } from '../income-category';

export class CreateIncomeDto {
  @ApiProperty({ example: 'Заробітна плата' })
  @IsString()
  @MaxLength(200)
  description!: string;

  @ApiProperty({ enum: INCOME_CATEGORY_LABEL_VALUES, example: 'Зарплата' })
  @IsIn(INCOME_CATEGORY_LABEL_VALUES)
  category!: string;

  @ApiProperty({ example: 32000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @ApiProperty({ example: '2026-08-01', description: 'ISO 8601 date string' })
  @IsDateString()
  date!: string;
}
