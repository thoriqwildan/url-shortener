/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateShorten } from './create-shorten.dto';

export class AlreadyLoginDto extends CreateShorten {
  @IsOptional()
  id?: number;

  @ApiPropertyOptional({
    example: 'Form Pendaftaran',
    description: 'The title of the URL',
  })
  @IsOptional()
  title?: string;
}
