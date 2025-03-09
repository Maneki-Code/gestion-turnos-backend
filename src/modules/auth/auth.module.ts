import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from './services/jwt/jwt.service';
import { HashService } from './services/hash/hash.service';

@Module({
  imports: [UsersModule],
  providers: [AuthService, HashService, JwtService],
  controllers: [AuthController]
})
export class AuthModule {}
