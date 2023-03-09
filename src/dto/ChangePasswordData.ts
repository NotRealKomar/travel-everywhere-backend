import { UserData } from '../dto/UserData';

export class ChangePasswordData extends UserData {
  readonly password: string;

  readonly newPassword: string;

  readonly confirmPassword: string;
}
