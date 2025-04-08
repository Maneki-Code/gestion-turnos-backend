import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { AppointmentForCreationDto } from '../dtos/appointmentForCreationDto.dto';
import { AppointmentResponse } from '../dtos/appointment.response';
import { AppointmentStatus } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly _appointment: AppointmentsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() request: AppointmentForCreationDto) {
    return await this._appointment.create(request);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('bulk')
  async createBulk(@Body() request: AppointmentForCreationDto[]) {
    return await this._appointment.createBulk(request);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('between-dates')
  async findAllBetweenDates(
    @Query('id') id: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ):Promise<AppointmentResponse[]> {
    return await this._appointment.findAllBetweenDates(id, startDate, endDate);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('/find-one')
  async findOneById(@Query(':id') id: number){
    return await this._appointment.findOneById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('update-status')
  async updateStatus(@Query(':id') id: number, @Query(':status') status:AppointmentStatus ){
    return await this._appointment.updateStatus(id, status);
  }
}
