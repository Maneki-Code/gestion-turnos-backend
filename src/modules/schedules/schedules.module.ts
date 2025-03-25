import { Module } from '@nestjs/common';
import { SchedulesService } from './services/schedules.service';
import { SchedulesController } from './controllers/schedules.controller';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TimeService } from 'src/common/time/time.service';
import { ScheduleDayConfigService } from './services/schedule-day-config.service';
import { ScheduleDayRestConfigService } from './services/schedule-day-rest-config.service';
import { ValidationsModule } from 'src/common/validations/validations.module';
import { MappersModule } from 'src/common/mappers/mappers.module';

@Module({
  imports:[MappersModule, ValidationsModule],
  providers: [
    JwtService,
    PrismaService,
    TimeService,
    SchedulesService,
    ScheduleDayConfigService,
    ScheduleDayRestConfigService,
  ],
  controllers: [SchedulesController],
  exports: [SchedulesService],
})
export class SchedulesModule {}
