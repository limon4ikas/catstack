import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AuthPayload, JwtPayload } from '@catstack/catwatch/types';

import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(
    payload: JwtPayload
  ): Promise<Omit<JwtPayload, 'iat' | 'exp'>> {
    const { iat, exp, ...userPayload } = payload;

    return userPayload;
  }
}
