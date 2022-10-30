import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Strategies } from '@catstack/catwatch/types';

@Injectable()
export class LocalAuthGuard extends AuthGuard(Strategies.Local) {}
