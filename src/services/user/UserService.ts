import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchemaModel } from '../../schemas/User';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserSchemaModel.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      email,
    });

    if (user === null || user === undefined) {
      throw new Error('User does not exist');
    }

    return user as User;
  }

  async getOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (user === null || user === undefined) {
      throw new Error(`Cannot find user with id #${id}`);
    }

    return user as User;
  }

  async findOneById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);

    if (user === null || user === undefined) {
      return null;
    }

    return user as User;
  }

  async save(user: User): Promise<boolean> {
    const response = await this.userModel.create(user);

    if (!response) {
      return false;
    }

    return true;
  }

  async edit(user: User): Promise<boolean> {
    const response = await this.userModel.findByIdAndUpdate(user._id, user);

    if (!response) {
      return false;
    }

    return true;
  }
}
