import { Injectable } from '@nestjs/common';
import { EDayOfWeek } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { AppointmentsService } from 'src/modules/appointments/services/appointments.service';

@Injectable()
export class ScheduleDaysService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _appointmentsService: AppointmentsService,
  ) {}

  async create(scheduleId: number, day: EDayOfWeek, date:Date, startTime:string, endTime:string, slotInterval:number) {
    const createScheduleDay = await this._prisma.scheduleDay.create({
      data: {
        scheduleId: scheduleId,
        date: date,
        day: day,
      },
    });

    // Convertir las horas de inicio y fin en objetos Date
    let currentTime = this.convertToDate(date, startTime);
    const endDate = this.convertToDate(date, endTime);

    // Generamos los turnos en el intervalo especificado
    while (currentTime <= endDate) {
      // Crear el turno (appointment)
      await this._appointmentsService.create(createScheduleDay.id, currentTime.toISOString());

      // Aumentamos el tiempo por el intervalo
      currentTime = this.addInterval(currentTime, slotInterval);
    }
  }

  private convertToDate(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0); 
    return newDate;
  }

  private addInterval(currentTime: Date, interval: number): Date {
    const newTime = new Date(currentTime);
    newTime.setMinutes(currentTime.getMinutes() + interval); 
    return newTime;
  }
}
