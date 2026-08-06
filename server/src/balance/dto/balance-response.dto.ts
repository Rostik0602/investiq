import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponseDto {
  @ApiProperty()
  startingBalance!: number;

  @ApiProperty()
  isConfirmed!: boolean;

  @ApiProperty({ description: 'startingBalance + sum(income) - sum(expenses)' })
  totalBalance!: number;
}
