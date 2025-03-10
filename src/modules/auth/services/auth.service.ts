import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { HashService } from './hash/hash.service';
import { User } from '@prisma/client';
import { AuthResponse } from '../dtos/auth.response';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async login(request: LoginDto, response: Response): Promise<void> {
    const user = await this.validateUser(request.email, request.password);
    if (!user) throw new UnauthorizedException('Email o contraseña inválidos');

    const token = this.generateToken(user);

    this.setJwtCookie(response, token);

    response.status(200).send({
      message: 'Login successful',
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    });

    return;
  }

  async register(request: RegisterDto) {
    return await this.userService.create({
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      password: await this.hashService.hashPassword(request.password),
    });
  }

  async logout(response: Response): Promise<void> {
    // Eliminar la cookie del JWT
    response.clearCookie('Authentication', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    // Responder con un mensaje de éxito
    response.status(200).send({ message: 'Logged out successfully' });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (
      user &&
      (await this.hashService.comparePassword(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  generateToken(user: User): string {
    const payload = {
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    console.log('Generated Token:', token);
    return token;
  }

  setJwtCookie(response: Response, token: string) {
    response.cookie('Authentication', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    console.log('Cookie set:', token);
  }
}
