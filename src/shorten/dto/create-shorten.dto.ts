/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShorten {
  @ApiProperty({
    example: 'https://www.google.com',
    description: 'The URL to shorten',
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}
