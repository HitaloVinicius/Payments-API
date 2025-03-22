import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  private static readonly saltRounds = 10;

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}