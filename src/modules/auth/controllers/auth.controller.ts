import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() request: LoginDto) {
    return this.authService.login(request);
  }

  @Post('register')
  @HttpCode(201)
  register(@Body() request: RegisterDto) {
    return this.authService.register(request);
  }
}
