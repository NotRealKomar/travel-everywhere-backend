import { User } from '../schemas/User';

type CreateArgs = {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
};

export class UserModel {
  readonly firstName: string;

  readonly lastName: string;

  readonly email: string;

  constructor({ email, firstName, lastName }: CreateArgs) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  static createFromEntity(user: User): UserModel {
    return new this({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }
}
