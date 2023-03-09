import { Injectable } from '@nestjs/common';

const PASSWORD_MAX_LENGTH = 6;

@Injectable()
export class PasswordService {
  validatePassword(value: string | null | undefined): void {
    if (value === '' || value === null || value === undefined) {
      throw Error('Password cannot be empty');
    }

    if (typeof value !== 'string') {
      throw Error('Password must be a string');
    }

    if (value.length < PASSWORD_MAX_LENGTH) {
      throw Error(
        `Password must be at least ${PASSWORD_MAX_LENGTH} characters`,
      );
    }
  }
}
