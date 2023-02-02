import { Body, Controller, Post } from '@nestjs/common';
import { SignInResponse } from '../models/SignInResponse';
import { SignInData } from '../dto/SignInData';
import { AuthService } from '../services/auth/AuthService';
import { RegisterData } from '../dto/RegisterData';
import { ChangePasswordData } from '../dto/ChangePasswordData';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body() data: SignInData): Promise<SignInResponse> {
    return this.authService.signIn({
      username: data.username,
      password: data.password,
    });
  }

  @Post('/register')
  async register(@Body() data: RegisterData): Promise<SignInResponse> {
    return this.authService.register({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  }

  @Post('/change-password')
  async changePassword(
    @Body() data: ChangePasswordData | undefined,
  ): Promise<boolean> {
    if (data === undefined) {
      throw new Error('Change password data is required');
    }

    return this.authService.changePassword({
      userId: data.userId,
      password: data.password,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  }
}
