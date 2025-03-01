/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private logger = new Logger('AuthController', { timestamp: true });

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const existingEmail = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const result = await this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: createUserDto.password,
      },
    });

    const tokens = await this.getTokens(result.id, result.email);
    await this.updateRefreshToken(result.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(loginDto: AuthLoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new BadRequestException('Email does not exist!');
    }

    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('Password is incorrect!');
    }

    this.logger.log(`User ${user.email} has logged in`);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signOut(email: string) {
    await this.prismaService.user.update({
      where: { email: email },
      data: { refresh_token: null },
    });
  }

  async refreshTokens(id: number, refresh_token: string) {
    const user = await this.prismaService.user.findFirst({
      where: { id: id },
    });
    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatch = await bcrypt.compare(
      refresh_token,
      user.refresh_token,
    );
    if (!refreshTokenMatch) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prismaService.user.update({
      where: { id: id },
      data: { refresh_token: hashedRefreshToken },
    });
  }

  async getTokens(id: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: id, email: email },
        {
          secret: this.configService.get<string>('JWT_SECRET_ACCESS'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: id, email: email },
        {
          secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
