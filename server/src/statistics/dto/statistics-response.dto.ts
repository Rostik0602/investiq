import { ApiProperty } from '@nestjs/swagger';

export class MonthlyStatDto {
  @ApiProperty({ minimum: 1, maximum: 12 })
  month!: number;

  @ApiProperty()
  totalExpenses!: number;

  @ApiProperty()
  totalIncome!: number;
}

export class CategoryStatDto {
  @ApiProperty()
  category!: string;

  @ApiProperty()
  amount!: number;
}

export class BreakdownStatDto {
  @ApiProperty()
  description!: string;

  @ApiProperty()
  amount!: number;
}
