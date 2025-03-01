import { Module } from '@nestjs/common';
import { ShortenModule } from './shorten/shorten.module';
import { ConfigModule } from './config/config.module';
import { BaseModule } from './base/base.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ShortenModule, ConfigModule, BaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
