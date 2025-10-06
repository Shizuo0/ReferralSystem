/**
 * Utilitário para geração de códigos de indicação únicos
 */
export class ReferralCodeUtil {
  private static readonly CODE_LENGTH = 8;
  private static readonly CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  /**
   * Gera um código de indicação aleatório
   * @returns Código alfanumérico de 8 caracteres (ex: "ABC12DEF")
   */
  static generateCode(): string {
    let code = '';
    for (let i = 0; i < this.CODE_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * this.CHARACTERS.length);
      code += this.CHARACTERS[randomIndex];
    }
    return code;
  }

  /**
   * Gera um código baseado no nome do usuário (mais amigável)
   * @param name Nome do usuário
   * @returns Código baseado no nome + números aleatórios (ex: "JOAO1234")
   */
  static generateFromName(name: string): string {
    // Normalizar nome: remover acentos e converter para maiúsculas
    const normalized = name
      .normalize('NFD') // Decompõe caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas (acentos)
      .toUpperCase()
      .replace(/[^A-Z]/g, ''); // Remove caracteres não-alfabéticos

    // Pegar primeiras 4 letras
    const namePart = normalized.substring(0, 4).padEnd(4, 'X');

    // Gerar 4 dígitos aleatórios
    const numberPart = Math.floor(1000 + Math.random() * 9000).toString();

    return namePart + numberPart;
  }
}
