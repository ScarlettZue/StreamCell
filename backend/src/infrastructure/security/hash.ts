import bcrypt from 'bcryptjs';

export class HashService {
  private static readonly SALT_ROUNDS = 10;

  public static async hash(text: string): Promise<string> {
    return bcrypt.hash(text, this.SALT_ROUNDS);
  }

  public static async compare(text: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(text, hashed);
  }
}
