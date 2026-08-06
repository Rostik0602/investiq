import { ApiProperty } from '@nestjs/swagger';


export class SafeUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ description: 'Starting balance set on the Dashboard, as a plain number' })
  startingBalance!: number;

  @ApiProperty()
  isBalanceConfirmed!: boolean;

  @ApiProperty()
  createdAt!: Date;
}
