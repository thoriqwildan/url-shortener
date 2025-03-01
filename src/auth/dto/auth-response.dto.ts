import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/config/domain/user';

export class AuthLoginResponseDto {
  refresh_token: string;

  @ApiProperty({ type: User })
  user: User;
}
