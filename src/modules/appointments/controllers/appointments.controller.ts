import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { AppointmentForCreationDto } from '../dtos/appointmentForCreationDto.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly _appointment:AppointmentsService){}

  @Post()
  async create(@Body() request: AppointmentForCreationDto){
    await this._appointment.create(request);
  }
}
