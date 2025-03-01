/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class BaseService {
  constructor(private prismaService: PrismaService) {}

  async getBaseUrl(url: string) {
    const urlEntry = await this.prismaService.url.findUnique({
      where: { url: `/${url}` },
    });
    if (!urlEntry) {
      throw new NotFoundException('URL not found');
    }
    await this.prismaService.url.update({
      where: { id: urlEntry.id },
      data: { clicks: urlEntry.clicks + 1 },
    });

    return urlEntry.base_url;
  }
}
