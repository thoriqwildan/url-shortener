/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/config/guards/access-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshTokenGuard } from 'src/config/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createDto: CreateUserDto) {
    return this.authService.signUp(createDto);
  }

  @Post('signin')
  signin(@Body() loginDto: AuthLoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Get('logout')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  logout(@Req() req: Request) {
    console.log(req.user!['sub']);
    return this.authService.signOut(req.user!['email']);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const id = req.user!['sub'];
    const refreshToken = req.user!['refreshToken'];
    return this.authService.refreshTokens(id, refreshToken);
  }
}
