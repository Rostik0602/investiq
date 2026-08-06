import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';
import { EXPENSE_CATEGORY_LABEL_VALUES } from '../expense-category';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Супермаркет' })
  @IsString()
  @MaxLength(200)
  description!: string;

  @ApiProperty({ enum: EXPENSE_CATEGORY_LABEL_VALUES, example: 'Продукти' })
  @IsIn(EXPENSE_CATEGORY_LABEL_VALUES)
  category!: string;

  @ApiProperty({ example: 450.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @ApiProperty({ example: '2026-08-04', description: 'ISO 8601 date string' })
  @IsDateString()
  date!: string;
}
