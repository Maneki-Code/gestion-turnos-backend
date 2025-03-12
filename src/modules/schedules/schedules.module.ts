import { Module } from '@nestjs/common';
import { SchedulesService } from './services/schedules.service';
import { SchedulesController } from './controllers/schedules.controller';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ScheduleDaysService } from './services/schedule-days.service';
import { ScheduleDaysController } from './controllers/schedule-days.controller';

@Module({
  imports: [UsersModule],
  providers: [JwtService, PrismaService, SchedulesService, ScheduleDaysService],
  controllers: [SchedulesController, ScheduleDaysController]
})
export class SchedulesModule {}
