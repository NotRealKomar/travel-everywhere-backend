import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from '../services/user/UserService';
import { JwtPayload } from '../services/auth/AuthService';

const AUTHORIZATION_HEADER_NAME = 'Authorization';
const JWT_TOKEN_PREFIX = 'Bearer';

@Injectable()
export class ReadonlyJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const header = request.header(AUTHORIZATION_HEADER_NAME);

    if (header === undefined || header === '') {
      throw new Error(`${AUTHORIZATION_HEADER_NAME} header is empty`);
    }

    const payload = this.jwtService.verify<JwtPayload>(
      header.replace(JWT_TOKEN_PREFIX, '').trim(),
    );

    return this.userService.findOneById(payload.sub) !== null;
  }
}
