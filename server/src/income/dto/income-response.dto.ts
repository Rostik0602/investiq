import { ApiProperty } from '@nestjs/swagger';
import { INCOME_CATEGORY_LABEL_VALUES } from '../income-category';

export class IncomeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: 'ISO 8601 date string' })
  date!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: INCOME_CATEGORY_LABEL_VALUES })
  category!: string;

  @ApiProperty()
  amount!: number;
}
