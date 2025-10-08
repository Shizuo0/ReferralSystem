/**
 * Configuração e validação de variáveis de ambiente
 */

interface EnvironmentConfig {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Valida e retorna as variáveis de ambiente
 * @throws Error se variáveis obrigatórias estiverem faltando
 */
function validateEnvironment(): EnvironmentConfig {
  const apiUrl = import.meta.env.VITE_API_URL;
  const mode = import.meta.env.MODE;

  // Validar API_URL
  if (!apiUrl) {
    console.warn('⚠️ VITE_API_URL não está configurada, usando padrão: http://localhost:3000');
  }

  const config: EnvironmentConfig = {
    apiUrl: apiUrl || 'http://localhost:3000',
    isDevelopment: mode === 'development',
    isProduction: mode === 'production',
  };

  // Validar formato da URL
  try {
    new URL(config.apiUrl);
  } catch (e) {
    console.error(`❌ VITE_API_URL inválida: ${config.apiUrl}`);
    throw new Error('Configuração inválida: VITE_API_URL deve ser uma URL válida');
  }

  // Log de configuração em desenvolvimento
  if (config.isDevelopment) {
    console.log('🔧 Configuração de ambiente:');
    console.log(`   API URL: ${config.apiUrl}`);
    console.log(`   Mode: ${mode}`);
  }

  return config;
}

// Exportar configuração validada
export const env = validateEnvironment();
