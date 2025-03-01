/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test@example.com', type: String })
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @ApiProperty({ example: 'John Doe', type: String })
  name: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;
}
