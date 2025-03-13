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
        startTime: startTime,
        endTime: endTime,
        slotInterval: slotInterval,
        date: date,
        day: day,
      },
    });

    let currentTime = this.convertToDate(date, startTime);
    const endDate = this.convertToDate(date, endTime);

    while (currentTime <= endDate) {
      await this._appointmentsService.create(createScheduleDay.id, currentTime.toISOString());
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
