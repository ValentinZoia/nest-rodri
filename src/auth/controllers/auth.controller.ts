import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

import { CreateAuthDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() createAuthDto: CreateAuthDto) {
    const { username, password } = createAuthDto;

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Data not valid');
    }

    const jwt = await this.authService.generateJWT(user);

    return jwt;
  }
}
