import { ApiProperty } from '@nestjs/swagger';

// What the API ever returns for a user — passwordHash and
// refreshTokenHash never leave the service layer.
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
