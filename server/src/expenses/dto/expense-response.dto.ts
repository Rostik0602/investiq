import { ApiProperty } from '@nestjs/swagger';
import { EXPENSE_CATEGORY_LABEL_VALUES } from '../expense-category';

export class ExpenseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: 'ISO 8601 date string' })
  date!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: EXPENSE_CATEGORY_LABEL_VALUES })
  category!: string;

  @ApiProperty()
  amount!: number;
}
