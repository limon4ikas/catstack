import { Controller, Req, Post, UseGuards, Get, Res } from '@nestjs/common';
import { CookieOptions, Response } from 'express';

import { RequestWithAuth } from '@catstack/catwatch/types';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  };

  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: RequestWithAuth,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user
    );
    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.status(200);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', this.cookieOptions);
    res.clearCookie('refreshToken', this.cookieOptions);
    res.status(200);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req: RequestWithAuth) {
    // this.authService.refreshTokens(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithAuth) {
    return req.user;
  }
}
