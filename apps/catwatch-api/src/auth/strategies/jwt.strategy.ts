import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from '@catstack/catwatch/types';

import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const accessToken = req.cookies['accessToken'];

          if (!accessToken) return null;

          return accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessSecret,
    });
  }

  async validate(
    payload: JwtPayload
  ): Promise<Omit<JwtPayload, 'iat' | 'exp'>> {
    const { iat, exp, ...userPayload } = payload;

    return userPayload;
  }
}
