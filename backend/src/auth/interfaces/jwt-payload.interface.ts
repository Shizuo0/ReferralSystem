/**
 * Interface para o payload do JWT token
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  iat?: number; // Issued at (gerado automaticamente)
  exp?: number; // Expiration time (gerado automaticamente)
}
