import { Injectable } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly _prisma: PrismaService) {}

  async create(scheduleDayId:number, startTime:Date, endCurrentTime:Date){
    const createdAppointment = await this._prisma.appointment.create({
      data:{
        scheduleDayId: scheduleDayId,
        startTime:startTime.toString(),
        endTime: endCurrentTime.toString(),
        status: AppointmentStatus.AVAILABLE,
        description: 'Turno disponible'
      }
    })
  }
}
