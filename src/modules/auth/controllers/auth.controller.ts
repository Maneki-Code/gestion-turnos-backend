import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse } from '../dtos/auth.response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
    description:
      'This endpoint allows to login. Requires an email and password.',
  })
  @ApiResponse({ status: 200, description: 'Login successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() request: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(request);
  }

  @Post('register')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Register',
    description:
      'This endpoint allows to register an user. Requires an email, password, first name and last name.',
  })
  @ApiResponse({ status: 204, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'User email already exists' })
  async register(@Body() request: RegisterDto): Promise<void> {
    await this.authService.register(request);
  }
}
