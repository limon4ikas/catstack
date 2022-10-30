import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { AuthPayload, JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<AuthPayload> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === pass) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: AuthPayload) {
    const payload: JwtPayload = { username: user.username, sub: user.userId };

    return { access_token: this.jwtService.sign(payload) };
  }
}
