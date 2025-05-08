
import { Body, Controller, Get, HttpCode, Patch, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ChangePasswordDto } from '../dtos/changePasswordDto.dto';
import { RequestWithUser } from 'src/common/interfaces/requestWithUser.interface';
import { ResetPasswordDto } from '../dtos/resetPasswordDto.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
    description:
      'This endpoint allows to login. Requires an email and password.',
  })
  @ApiResponse({ status: 200, description: 'Login successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() request: LoginDto,
    @Res() response: Response,
  ): Promise<void> {
    await this.authService.login(request, response);
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

  @ApiBearerAuth() 
  @Post('/create-manager')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createManager(@Body() request:RegisterDto){
    return await this.authService.createManager(request);
  }


  // auth.controller.ts
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Logout',
    description:
      'This endpoint allows a user to log out by clearing the JWT cookie.',
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res() response: Response): Promise<void> {
    await this.authService.logout(response);
  }

  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.Authentication;
  
    if (!token) {
      throw new UnauthorizedException('No autenticado');
    }
  
    try {
      const decoded = this.jwtService.verify(token); 
      return res.json({ id: decoded.sub, email: decoded.email, role: decoded.role, name: decoded.name });
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Patch('change-password')
  @HttpCode(201)
  async changePassword(@Body() request:ChangePasswordDto, @Req() req: RequestWithUser){
    const email = req.user.email;
    console.log('Email del usuario:', email);
    await this.authService.changePassword(request, email);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('reset-password')
  async resetPassword(@Body() request: ResetPasswordDto){
    await this.authService.resetPassword(request);
  }
}
