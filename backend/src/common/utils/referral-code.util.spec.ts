import { ReferralCodeUtil } from './referral-code.util';

describe('ReferralCodeUtil', () => {
  describe('generateCode', () => {
    it('deve gerar código com 8 caracteres', () => {
      const code = ReferralCodeUtil.generateCode();
      expect(code).toHaveLength(8);
    });

    it('deve gerar código com apenas letras maiúsculas e números', () => {
      const code = ReferralCodeUtil.generateCode();
      expect(code).toMatch(/^[A-Z0-9]+$/);
    });

    it('deve gerar códigos diferentes a cada chamada', () => {
      const code1 = ReferralCodeUtil.generateCode();
      const code2 = ReferralCodeUtil.generateCode();
      const code3 = ReferralCodeUtil.generateCode();

      // Há uma chance mínima de colisão, mas é extremamente improvável
      expect(code1).not.toBe(code2);
      expect(code2).not.toBe(code3);
      expect(code1).not.toBe(code3);
    });

    it('deve gerar múltiplos códigos únicos', () => {
      const codes = new Set();
      for (let i = 0; i < 100; i++) {
        codes.add(ReferralCodeUtil.generateCode());
      }
      // Todos os 100 códigos devem ser únicos
      expect(codes.size).toBe(100);
    });
  });

  describe('generateFromName', () => {
    it('deve gerar código baseado no nome', () => {
      const code = ReferralCodeUtil.generateFromName('João Silva');
      expect(code).toHaveLength(8);
      expect(code).toMatch(/^[A-Z0-9]+$/);
      expect(code.substring(0, 4)).toMatch(/^[A-Z]+$/); // Primeiros 4 são letras
      expect(code.substring(4)).toMatch(/^\d+$/); // Últimos 4 são números
    });

    it('deve usar primeiras letras do nome', () => {
      const code = ReferralCodeUtil.generateFromName('João Silva');
      expect(code.substring(0, 4)).toBe('JOAO');
    });

    it('deve preencher com X se nome for muito curto', () => {
      const code = ReferralCodeUtil.generateFromName('Jo');
      expect(code.substring(0, 2)).toBe('JO');
      expect(code.substring(2, 4)).toBe('XX');
    });

    it('deve remover caracteres especiais', () => {
      const code = ReferralCodeUtil.generateFromName('José-Maria');
      expect(code.substring(0, 4)).toBe('JOSE');
    });

    it('deve gerar números diferentes para mesmo nome', () => {
      const code1 = ReferralCodeUtil.generateFromName('João Silva');
      const code2 = ReferralCodeUtil.generateFromName('João Silva');

      expect(code1.substring(0, 4)).toBe(code2.substring(0, 4)); // Parte do nome igual
      expect(code1.substring(4)).not.toBe(code2.substring(4)); // Números diferentes
    });
  });
});
