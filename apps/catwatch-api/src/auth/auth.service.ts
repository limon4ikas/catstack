import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserProfile } from '@catstack/catwatch/types';

import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<UserProfile> {
    const user = await this.usersService.findByUsername(username);

    if (user && user.password === password) {
      const { password, createdAt, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: UserProfile) {
    return this.getTokens(user);
  }

  async getTokens(user: UserProfile) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(user, {
        secret: jwtConstants.accessSecret,
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(user, {
        secret: jwtConstants.accessSecret,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    // if (!user || !user.refreshToken) {
    //   throw new ForbiddenException('Access Denied');
    // }

    // const refreshTokenMatches = await argon2.verify(
    //   user.refreshToken,
    //   refreshToken
    // );
    // if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    // const tokens = await this.getTokens({ id, username });

    // await this.updateRefreshToken(user.id, tokens.refreshToken);

    // return tokens;
  }
}
