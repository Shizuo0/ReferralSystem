import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import type { JwtPayload } from './auth/interfaces/jwt-payload.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  getProtected(@CurrentUser() user: JwtPayload) {
    return {
      message: 'Esta é uma rota protegida',
      user: {
        id: user.sub,
        email: user.email,
      },
    };
  }
}
