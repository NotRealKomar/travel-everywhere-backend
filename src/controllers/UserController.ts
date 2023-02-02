import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserData } from '../dto/UserData';
import { ReadonlyJwtAuthGuard } from '../guards/ReadonlyJwtAuthGuard';
import { UserService } from '../services/user/UserService';
import { UserModel } from '../models/UserModel';
import { UpdateProfileData } from '../dto/UpdateProfileData';
import { User } from 'src/schemas/User';

@Controller('/app/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(ReadonlyJwtAuthGuard)
  @Post('/info')
  async getUserInfo(@Body() body: UserData | undefined): Promise<UserModel> {
    if (body === undefined || body.userId === undefined) {
      throw new Error('User data is required');
    }

    return UserModel.createFromEntity(
      await this.userService.getOneById(body.userId),
    );
  }

  @UseGuards(ReadonlyJwtAuthGuard)
  @Post('/update-profile')
  async updateProfile(
    @Body() body: UpdateProfileData | undefined,
  ): Promise<boolean> {
    if (body === undefined || body.userId === undefined) {
      throw new Error('User data is required');
    }

    const user = await this.userService.getOneById(body.userId);

    return this.userService.edit(
      new User({
        firstName: body.firstName ?? user.firstName,
        lastName: body.lastName ?? user.lastName,
        email: body.email ?? user.email,
        password: user.password,
        id: user._id,
      }),
    );
  }
}
