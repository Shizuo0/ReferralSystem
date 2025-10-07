/**
 * Script para limpar o banco de dados SQLite
 * Uso: node clear-database.js
 */

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'referral-system.db');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✓ Banco de dados removido com sucesso!');
  console.log('  O TypeORM criará um novo banco na próxima execução.');
} else {
  console.log('ℹ Banco de dados não encontrado. Nada para remover.');
}

console.log('\nPróximos passos:');
console.log('1. Inicie o backend: npm run start:dev');
console.log('2. O banco será criado automaticamente');
console.log('3. Teste criando uma nova conta no frontend\n');