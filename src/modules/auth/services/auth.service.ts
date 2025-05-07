import {  BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { HashService } from './hash/hash.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ChangePasswordDto } from '../dtos/changePasswordDto.dto';
import { ResetPasswordDto } from '../dtos/resetPasswordDto.dto';

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
          message: 'Credenciales inválidas.',
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
      throw new HttpException('El email ya está en uso.', HttpStatus.CONFLICT);
    }
    
    return await this.userService.create({
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      password: await this.hashService.hashPassword(request.password),
    });
  }

  async createManager(request: RegisterDto){
    const existingUser = await this.userService.findOneByEmail(request.email);
    if (existingUser) {
      throw new HttpException('El email ya está en uso.', HttpStatus.CONFLICT);
    }
    
    return await this.userService.createManager({
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      password: await this.hashService.hashPassword(request.password),
    });
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

  async changePassword(request: ChangePasswordDto, email: string) {
    const userFound = await this.userService.findOneByEmail(email)
    if(!userFound) throw new NotFoundException(`El usuario con el email '${email}' no existe`);
    
    if(await this.hashService.comparePassword(request.oldPassword, userFound.password) === false) throw new ConflictException(`La password antigua no es correcta.`);
    if(await this.hashService.comparePassword(request.newPassword, userFound.password) === true) throw new BadRequestException(`La password nueva password no puede ser igual a la anterior.`);
    const hashedPassword = await this.hashService.hashPassword(request.newPassword);
    await this.userService.updatePassword(hashedPassword, email);
  }

  async resetPassword(request: ResetPasswordDto) {
    const userFound = await this.userService.findOneById(request.userId);
    if(!userFound) throw new NotFoundException(`El usuario con el email '${request.userId}' no existe`);

    const hashedPassword = await this.hashService.hashPassword(request.newPassword);
    await this.userService.updatePassword(hashedPassword, userFound.email);
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