import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthPayload } from '@catstack/catwatch/types';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<AuthPayload> {
    const user = await this.usersService.findByUsername(username);

    if (user && user.password === password) {
      const { password, createdAt, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: AuthPayload) {
    return { access_token: this.jwtService.sign(user) };
  }
}
