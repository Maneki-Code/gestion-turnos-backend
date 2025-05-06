import { Injectable } from '@nestjs/common';
import { Appointment, Customer } from '@prisma/client';
import { AppointmentResponse } from 'src/modules/appointments/dtos/appointment.response';
import { CustomerMapperService } from './customer-mapper.service';

@Injectable()
export class AppointmentMapperService {
  constructor(private readonly _customerMapper: CustomerMapperService){}
  AppointmentToFullResponse(request: Appointment & {customer: Customer  | null }):AppointmentResponse{
      return {
        id: request.id,
        status: request.status,
        startTime: request.startTime,
        endTime: request.endTime,
        date: request.date.toISOString(),
        customer: request.customer ? this._customerMapper.customerToFullResponse(request.customer) : undefined, 
        servicePrice: parseFloat(request.servicePrice.toString()),
        serviceTitle: request.serviceTitle,
        serviceDescription: request.serviceDescription || ''
      }
    }
}
