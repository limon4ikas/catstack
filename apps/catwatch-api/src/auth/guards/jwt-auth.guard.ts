import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Strategies } from '../auth.types';

@Injectable()
export class JwtAuthGuard extends AuthGuard(Strategies.Jwt) {}
