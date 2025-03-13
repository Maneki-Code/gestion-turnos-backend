import { Injectable } from '@nestjs/common';
import { EDayOfWeek } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { AppointmentsService } from 'src/modules/appointments/services/appointments.service';
import { DateTime } from 'luxon';  // Importamos Luxon

@Injectable()
export class ScheduleDaysService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _appointmentsService: AppointmentsService,
  ) {}

  async create(scheduleId: number, day: EDayOfWeek, date: Date, startTime: string, endTime: string, slotInterval: number) {
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

    while (currentTime < endDate) {
      await this._appointmentsService.create(createScheduleDay.id, currentTime.toISO());
      currentTime = this.addInterval(currentTime, slotInterval);  
    }
  }

  private convertToDate(date: Date, time: string): DateTime {
    const [hours, minutes] = time.split(':').map(Number);

    return DateTime.fromJSDate(date)
      .set({ hour: hours, minute: minutes, second: 0, millisecond: 0 })
      .setZone('America/Argentina/Buenos_Aires');  
  }

  private addInterval(currentTime: DateTime, interval: number): DateTime {
    return currentTime.plus({ minutes: interval });
  }
}
