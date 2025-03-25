import { Module } from '@nestjs/common';
import { ScheduleValidationService } from './services/schedule-validation.service';
import { CustomerValidationService } from './services/customer-validation.service';
import { AppointmentValidationService } from './services/appointment-validation.service';
import { TimeService } from '../time/time.service';
import { PrismaService } from 'src/config/database/prisma/prisma.service';

@Module({
  providers: [TimeService, PrismaService, ScheduleValidationService, CustomerValidationService, AppointmentValidationService],
  exports: [ScheduleValidationService, CustomerValidationService, AppointmentValidationService]
})
export class ValidationsModule {}
