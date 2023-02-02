import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';

const ROUNDS = 16;
const PASSWORD_MAX_LENGTH = 6;

@Injectable()
export class PasswordService {
  async generatePassword(initialString: string): Promise<string> {
    const salt = await genSalt(ROUNDS);

    return hash(initialString, salt);
  }

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
