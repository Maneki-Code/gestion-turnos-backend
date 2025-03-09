import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule],
  providers: [ConfigService, JwtService, PrismaService, UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
