import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../PasswordService';
import { AuthService } from '../AuthService';
import { UserService } from '../../user/UserService';
import { User } from '../../../schemas/User';
import { Types } from 'mongoose';
import { randomBytes } from 'crypto';
import { SignInResponse } from '../../../models/SignInResponse';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;
  let passwordService: PasswordService;

  const mockUserId = new Types.ObjectId(randomBytes(12));

  const mockUser: User = new User({
    email: 'mock-email',
    firstName: 'mock-firstname',
    lastName: 'mock-lastname',
    password: 'mock-password',
    id: mockUserId,
  });

  beforeEach(() => {
    jwtService = Object.create(JwtService.prototype);
    userService = Object.create(UserService.prototype);
    passwordService = Object.create(PasswordService.prototype);

    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('auth-token');
    jest.spyOn(userService, 'getOneByEmail').mockResolvedValue(mockUser);
    jest.spyOn(passwordService, 'validatePassword').mockImplementation(() => {
      return;
    });

    authService = new AuthService(jwtService, userService, passwordService);
  });

  describe('signIn', () => {
    it('Should return valid response', async () => {
      jest.spyOn(authService, 'getIsPasswordEqual').mockResolvedValue(true);

      const response = await authService.signIn({
        username: 'mock-email',
        password: 'mock-password',
      });

      expect(authService.getIsPasswordEqual).toBeCalledTimes(1);
      expect(userService.getOneByEmail).toBeCalledTimes(1);
      expect(jwtService.signAsync).toBeCalledTimes(1);

      expect(response).toStrictEqual(
        new SignInResponse('Bearer auth-token', mockUserId.toString()),
      );
    });

    it('Should throw incorrect credentials error', async () => {
      await expect(
        authService.signIn({
          username: 'mock-email',
          password: 'mock-password',
        }),
      ).rejects.toThrowError('Incorrect username or password');
    });
  });
});
