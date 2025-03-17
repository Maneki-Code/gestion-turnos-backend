import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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
  ) { }

  async login(request: LoginDto, response: Response): Promise<Response> {
    try {
      const user = await this.validateUser(request.email, request.password);

      if (!user) {
        return response.status(401).json({
          status: 401,
          message: 'Invalid email or password',
          user: null,
        });
      }

      const token = this.generateToken(user);
      this.setJwtCookie(response, token);


      return response.status(200).json({
        status: 200,
        message: 'Login successful',
        user: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        }
      });

    } catch (error) {
      console.error('Error during login:', error);
      return response.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    }
  }
  
  async register(request: RegisterDto) {
    const existingUser = await this.userService.findOneByEmail(request.email);
    if (existingUser) {
      throw new HttpException('User email already exists', HttpStatus.CONFLICT);
    }
    
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
      secure: false,
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

  async logout(response: Response): Promise<void> {
    // Eliminar la cookie del JWT
    response.clearCookie('Authentication', {
      httpOnly: true,
      secure:false,
      //secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    // Responder con un mensaje de éxito
    response.status(200).send({ message: 'Logged out successfully' });
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
      secure: false,
      //secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    console.log('Cookie set:', token);
  }
}