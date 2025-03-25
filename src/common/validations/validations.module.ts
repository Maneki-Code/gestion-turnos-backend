import { Module } from '@nestjs/common';
import { ScheduleValidationService } from './services/schedule-validation.service';
import { CustomerValidationService } from './services/customer-validation.service';
import { AppointmentValidationService } from './services/appointment-validation.service';
import { TimeService } from '../time/time.service';

@Module({
  providers: [TimeService, ScheduleValidationService, CustomerValidationService, AppointmentValidationService],
  exports: [ScheduleValidationService, CustomerValidationService, AppointmentValidationService]
})
export class ValidationsModule {}
