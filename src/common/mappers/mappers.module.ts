import { Module } from '@nestjs/common';
import { AppointmentMapperService } from './services/appointment-mapper.service';
import { CustomerMapperService } from './services/customer-mapper.service';
import { ScheduleMapperService } from './services/schedule-mapper.service';
import { UserMapperService } from './services/user-mapper.service';

@Module({
  providers: [AppointmentMapperService, CustomerMapperService, ScheduleMapperService, UserMapperService],
  exports: [AppointmentMapperService, CustomerMapperService, ScheduleMapperService]
})
export class MappersModule {}
