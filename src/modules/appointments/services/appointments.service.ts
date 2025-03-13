import { Injectable } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly _prisma: PrismaService) {}

  async create(scheduleDayId:number, startTime:string, endCurrentTime:string){
    const createdAppointment = await this._prisma.appointment.create({
      data:{
        scheduleDayId: scheduleDayId,
        startTime:startTime,
        endTime: endCurrentTime,
        status: AppointmentStatus.AVAILABLE,
        description: 'Turno disponible'
      }
    })
  }
}
