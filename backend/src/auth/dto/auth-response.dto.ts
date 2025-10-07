export class AuthResponseDto {
  id: string;
  name: string;
  email: string;
  score: number;
  referralCode: string;
  createdAt: Date;
}

export class RegisterResponseDto {
  message: string;
  user: AuthResponseDto;
  accessToken: string;
}
