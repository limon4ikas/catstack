import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

import { jwtConstants } from '../constants';
import { JwtPayload } from '@catstack/catwatch/types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req.cookies['refreshToken'];

          if (!token) return null;

          return token;
        },
      ]),
      secretOrKey: jwtConstants.refreshSecret,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(
    payload: JwtPayload
  ): Promise<Omit<JwtPayload, 'iat' | 'exp'>> {
    const { iat, exp, ...userPayload } = payload;

    return userPayload;
  }
}
