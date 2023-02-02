import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from '../services/user/UserService';
import { JwtPayload } from '../services/auth/AuthService';

const AUTHORIZATION_HEADER_NAME = 'Authorization';
const JWT_TOKEN_PREFIX = 'Bearer';
const USER_ID_FIELD_NAME = 'userId';

@Injectable()
export class JwtWithBodyAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const header = request.header(AUTHORIZATION_HEADER_NAME);

    const userIdFromBody: string | undefined = request.body[USER_ID_FIELD_NAME];

    if (header === undefined || header === '') {
      throw new Error(`${AUTHORIZATION_HEADER_NAME} header is empty`);
    }

    if (userIdFromBody === undefined || userIdFromBody === '') {
      throw new Error('User field from request body is required');
    }

    const payload = this.jwtService.verify<JwtPayload>(
      header.replace(JWT_TOKEN_PREFIX, '').trim(),
    );

    const userIdFromPayload = payload.sub;

    return (
      userIdFromPayload === userIdFromBody &&
      this.userService.findOneById(userIdFromPayload) !== null
    );
  }
}
