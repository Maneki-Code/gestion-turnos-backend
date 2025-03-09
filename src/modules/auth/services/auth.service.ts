import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { HashService } from './hash/hash.service';
import { User } from '@prisma/client';
import { AuthResponse } from '../dtos/auth.response';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async login(request: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(request.email, request.password);
    if (!user) throw new UnauthorizedException('Email o contraseña inválidos');

    return {
      token: this.generateToken(user),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    };
  }

  async register(request: RegisterDto) {
    return await this.userService.create({
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

  generateToken(user: User): string {
    const payload = {
      email: user.email,
      role: user.role
    };

    return this.jwtService.sign(payload);
  }
}
