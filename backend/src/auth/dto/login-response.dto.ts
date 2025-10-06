import { AuthResponseDto } from './auth-response.dto';

export class LoginResponseDto {
  message: string;
  user: AuthResponseDto;
  accessToken: string;
}
