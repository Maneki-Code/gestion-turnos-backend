import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() request: LoginDto) {
    return this.authService.login(request);
  }

  @Post('register')
  register(@Body() request: RegisterDto) {
    return this.authService.register(request);
  }
}
