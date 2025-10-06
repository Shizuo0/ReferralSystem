import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator para marcar rotas como públicas (sem autenticação)
 * 
 * @example
 * @Public()
 * @Get('public-route')
 * getPublicData() {
 *   return 'Dados públicos';
 * }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
