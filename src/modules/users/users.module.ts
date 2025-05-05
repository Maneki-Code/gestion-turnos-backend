import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { JwtService } from '@nestjs/jwt';
import { SchedulesModule } from '../schedules/schedules.module';
import { MappersModule } from 'src/common/mappers/mappers.module';
import { UserMapperService } from 'src/common/mappers/services/user-mapper.service';

@Module({
  imports: [SchedulesModule, MappersModule],
  providers: [JwtService, UserMapperService, PrismaService, UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
