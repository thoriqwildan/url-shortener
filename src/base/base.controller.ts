import { Controller, Get, Param, Res } from '@nestjs/common';
import { BaseService } from './base.service';
import { Response } from 'express';

@Controller()
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @Get(':short_url')
  async getBaseUrl(@Param('short_url') url: string, @Res() res: Response) {
    const baseUrl = await this.baseService.getBaseUrl(url);
    if (!baseUrl) {
      return res.status(404).send('URL tidak ditemukan!');
    }
    res.redirect(baseUrl);
  }
}
