import { HashUtil } from './hash.util';

describe('HashUtil', () => {
  describe('hashPassword', () => {
    it('deve gerar hash diferente da senha original', async () => {
      const password = 'senha123';
      const hash = await HashUtil.hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
    });

    it('deve gerar hashs diferentes para a mesma senha (salt)', async () => {
      const password = 'senha123';
      const hash1 = await HashUtil.hashPassword(password);
      const hash2 = await HashUtil.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('deve retornar true para senha correta', async () => {
      const password = 'senha123';
      const hash = await HashUtil.hashPassword(password);

      const isMatch = await HashUtil.comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    it('deve retornar false para senha incorreta', async () => {
      const password = 'senha123';
      const wrongPassword = 'senhaErrada';
      const hash = await HashUtil.hashPassword(password);

      const isMatch = await HashUtil.comparePassword(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });
  });
});
