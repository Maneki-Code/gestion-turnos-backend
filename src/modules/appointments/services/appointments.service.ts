import { Injectable } from '@nestjs/common';
import { Appointment, AppointmentStatus } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { AppointmentResponse } from '../dtos/appointment.response';

@Injectable()
export class AppointmentsService {
  constructor(private readonly _prisma: PrismaService) {}

  async create(scheduleDayId:number, startTime:Date, endCurrentTime:Date){
    /* const createdAppointment = await this._prisma.appointment.create({
      data:{
        scheduleDayId: scheduleDayId,
        startTime:startTime.toString(),
        endTime: endCurrentTime.toString(),
        status: AppointmentStatus.AVAILABLE,
        description: 'Turno disponible'
      }
    }) */
  }

  /* parseAppointmentToResponse(appointment: Appointment): AppointmentResponse{
    return {
      id: appointment.id,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      description: appointment.description  ?? null , 
      status: appointment.status,
      customerId: appointment.customerId ?? null
    }
  } */
}
