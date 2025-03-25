import { Module } from '@nestjs/common';
import { SchedulesService } from './services/schedules.service';
import { SchedulesController } from './controllers/schedules.controller';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TimeService } from 'src/common/time/time.service';
import { ScheduleDayConfigService } from './services/schedule-day-config.service';
import { ScheduleDayRestConfigService } from './services/schedule-day-rest-config.service';
import { ScheduleMapper } from './mappers/schedule-mapper.mapper';
import { ValidationsModule } from 'src/common/validations/validations.module';

@Module({
  imports:[ValidationsModule],
  providers: [
    JwtService,
    PrismaService,
    ScheduleMapper,
    TimeService,
    SchedulesService,
    ScheduleDayConfigService,
    ScheduleDayRestConfigService,
  ],
  controllers: [SchedulesController],
  exports: [SchedulesService],
})
export class SchedulesModule {}
