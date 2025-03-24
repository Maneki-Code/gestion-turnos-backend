import { Module } from '@nestjs/common';
import { ScheduleValidationService } from './services/schedule-validation.service';
import { CustomerValidationService } from './services/customer-validation.service';
import { AppointmentValidationService } from './services/appointment-validation.service';

@Module({
  providers: [ScheduleValidationService, CustomerValidationService, AppointmentValidationService],
  exports: [ScheduleValidationService, CustomerValidationService, AppointmentValidationService]
})
export class ValidationsModule {}
