import { Module } from '@nestjs/common';
import { AppointmentMapperService } from './services/appointment-mapper.service';
import { CustomerMapperService } from './services/customer-mapper.service';

@Module({
  providers: [AppointmentMapperService, CustomerMapperService],
  exports: [AppointmentMapperService, CustomerMapperService]
})
export class MappersModule {}
