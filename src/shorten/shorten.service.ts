/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import * as crypto from 'crypto';
import { AlreadyLoginDto } from './dto/already-login.dto';

@Injectable()
export class ShortenService {
  constructor(private prismaService: PrismaService) {}

  async createShorten(url: AlreadyLoginDto) {
    let newurl = url.title
      ? this.formatString(url.title)
      : this.generateShortUrl();

    if (url.title) {
      const isTitleExists = await this.prismaService.url.count({
        where: { url: newurl },
      });
      if (isTitleExists > 0) {
        throw new ConflictException('Title already exists');
      }
    }

    let attempt = 0;
    const MAX_ATTEMPTS = 5;

    while (attempt < MAX_ATTEMPTS) {
      const isUrlExists = await this.prismaService.url.count({
        where: { url: newurl },
      });

      if (isUrlExists === 0) break;

      newurl = this.generateShortUrl();
      attempt++;
    }

    if (attempt === MAX_ATTEMPTS) {
      throw new ConflictException('Failed to generate unique short URL');
    }

    const data = await this.prismaService.url.create({
      data: { url: `/${newurl}`, base_url: url.url },
    });
    let dataNew;
    if (url.id) {
      dataNew = await this.prismaService.url.update({
        where: { id: data.id },
        data: { user_id: url.id },
      });
    }
    return dataNew ? dataNew : data;
  }

  formatString(input: string): string {
    return input.toLowerCase().replace(/\s+/g, '-').replace(/\.+$/, '');
  }

  generateShortUrl(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.randomBytes(8))
      .map((byte) => chars[byte % chars.length])
      .join('');
  }
}
