/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ShortenService } from './shorten.service';
import { CreateShorten } from './dto/create-shorten.dto';
import { AccessTokenGuard } from 'src/config/guards/access-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AlreadyLoginDto } from './dto/already-login.dto';
import { Request } from 'express';

@Controller()
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @Post()
  async createShorten(@Body() urlDto: CreateShorten) {
    return this.shortenService.createShorten(urlDto);
  }

  @Post('shorten')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async alreadyLogin(@Req() req: Request, @Body() urlDto: AlreadyLoginDto) {
    urlDto.id = req.user!['sub'];
    return this.shortenService.createShorten(urlDto);
  }
}
