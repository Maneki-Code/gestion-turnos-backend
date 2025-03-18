import { BadRequestException, Injectable } from '@nestjs/common';
import { EDayOfWeek, Schedule } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleDayRestConfigService } from './schedule-day-rest-config.service';

@Injectable()
export class ScheduleDayConfigService {
  constructor(
      private readonly _prisma: PrismaService,
      private readonly _time: TimeService,
      private readonly _rest: ScheduleDayRestConfigService
    ) {}

  async create(scheduleId: number, day: EDayOfWeek) {
    const createdScheduleDay = await this._prisma.scheduleDayConfig.create({
      data:{
        scheduleId: scheduleId,
        day: day,
        startTime: '09:00',
        endTime: '18:00',
        slotInterval: 60,
        status: false
      }
    })

    if(!createdScheduleDay) throw new BadRequestException(`Algo salió mal al crear el día ${day} asociada a la agenda.`);
    await this._rest.create(createdScheduleDay.id);
  }
}
