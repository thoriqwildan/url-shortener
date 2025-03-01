import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 'test@example.com', type: String })
  email: string;

  @ApiProperty({ example: 'John Doe', type: String })
  name: string;

  @ApiProperty({ example: '2021-10-10T00:00:00.000Z', type: Date })
  created_at: Date;

  @ApiProperty({ example: '2021-10-10T00:00:00.000Z', type: Date })
  updated_at: Date;
}
