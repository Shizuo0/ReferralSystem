import * as bcrypt from 'bcrypt';

/**
 * Utilitários para hash de senhas usando bcrypt
 */
export class HashUtil {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Gera hash da senha usando bcrypt
   * @param password Senha em texto plano
   * @returns Promise com hash da senha
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compara senha em texto plano com hash
   * @param password Senha em texto plano
   * @param hash Hash armazenado no banco
   * @returns Promise<boolean> true se a senha corresponde ao hash
   */
  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
