import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { HashService } from './hash/hash.service';
import { JwtService } from './jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService:  HashService,
    private readonly jwtService: JwtService
  ) {}

  login(request: LoginDto) {
    return 'login';
  }

  async register(request: RegisterDto) {
    return await this.userService.create({
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      password: await this.hashService.hashPassword(request.password),
    });
  }
}
