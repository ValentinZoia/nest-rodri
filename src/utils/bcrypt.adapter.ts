import { compareSync, hashSync } from 'bcrypt';

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

export class BcryptAdapter {
  static hash(password: string): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return hashSync(password, SALT_ROUNDS);
  }

  static compare(password: string, hashed: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return compareSync(password, hashed);
  }
}
