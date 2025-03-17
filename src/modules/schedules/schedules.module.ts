import { Module } from '@nestjs/common';
import { SchedulesService } from './services/schedules.service';
import { SchedulesController } from './controllers/schedules.controller';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ScheduleDaysService } from './services/schedule-days.service';
import { ScheduleDaysController } from './controllers/schedule-days.controller';
import { AppointmentsModule } from '../appointments/appointments.module';
import { TimeService } from 'src/common/time/time.service';
import { ScheduleDayRestsService } from './services/schedule-day-rests.service';

@Module({
  imports: [UsersModule, AppointmentsModule],
  providers: [JwtService, PrismaService, TimeService, SchedulesService, ScheduleDaysService, ScheduleDayRestsService],
  controllers: [SchedulesController, ScheduleDaysController]
})
export class SchedulesModule {}
