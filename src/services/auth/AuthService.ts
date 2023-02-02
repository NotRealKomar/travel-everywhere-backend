import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash, genSalt } from 'bcrypt';
import { UserService } from '../user/UserService';
import { PasswordService } from './PasswordService';
import { User } from '../../schemas/User';
import { SignInResponse } from '../../models/SignInResponse';

type SignInArgs = {
  username: string;
  password: string;
};

type RegisterArgs = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ChangePasswordArgs = {
  userId: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
};

const SALT_ROUNDS = 16;

export type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  async signIn(args: SignInArgs): Promise<SignInResponse> {
    const user = await this.userService.getOneByEmail(args.username);

    const isPasswordEqual = await compare(args.password, user.password);

    if (isPasswordEqual === false) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      username: user.email,
    };

    const token = await this.jwtService.signAsync(payload, {
      algorithm: 'HS256',
    });

    return new SignInResponse(`Bearer ${token}`, user._id.toString());
  }

  async register(args: RegisterArgs): Promise<SignInResponse> {
    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords doesn't match");
    }

    this.passwordService.validatePassword(args.password);

    const salt = await genSalt(SALT_ROUNDS);
    const passwordHash = await hash(args.password, salt);

    await this.userService.save(
      new User({
        firstName: args.firstname,
        lastName: args.lastname,
        email: args.email,
        password: passwordHash,
      }),
    );

    return this.signIn({ username: args.email, password: args.password });
  }

  async changePassword(args: ChangePasswordArgs): Promise<boolean> {
    const user = await this.userService.getOneById(args.userId);

    if (!(await compare(args.password, user.password))) {
      throw new Error('Cannot update user password');
    }

    if (args.newPassword !== args.confirmPassword) {
      throw new Error('Cannot update user password');
    }

    this.passwordService.validatePassword(args.newPassword);

    const salt = await genSalt(SALT_ROUNDS);
    const passwordHash = await hash(args.newPassword, salt);

    return this.userService.edit(
      new User({
        password: passwordHash,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user._id,
      }),
    );
  }
}
