import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { AppointmentForCreationDto } from '../dtos/appointmentForCreationDto.dto';
import { AppointmentResponse } from '../dtos/appointment.response';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly _appointment: AppointmentsService) {}

  @Post()
  async create(@Body() request: AppointmentForCreationDto) {
    return await this._appointment.create(request);
  }

  @Post('bulk')
  async createBulk(@Body() request: AppointmentForCreationDto[]) {
    return await this._appointment.createBulk(request);
  }


  @Get('between-dates')
  async findAllBetweenDates(
    @Query('id') id: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ):Promise<AppointmentResponse[]> {
    return await this._appointment.findAllBetweenDates(id, startDate, endDate);
  }
}
