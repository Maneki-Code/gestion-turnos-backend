import { BadRequestException, Injectable } from '@nestjs/common';
import { $Enums, EDayOfWeek, Schedule, ScheduleDayConfig } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleDayRestConfigService } from './schedule-day-rest-config.service';
import { ScheduleDayConfigResponse } from '../dtos/scheduleDayConfig.response';

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

  async findAllSchedulesByScheduleId(id: number): Promise<ScheduleDayConfig[]> {
    return await this._prisma.scheduleDayConfig.findMany({
      where:{
        scheduleId: id
      }
    })
  }

  async scheduleDayToFullResponse(day: ScheduleDayConfig): Promise<ScheduleDayConfigResponse> {
    const rests = await this._rest.findAllRestsByScheduleDayConfigId(day.id);
    
    return {
      id: day.id,
      day: day.day,
      startTime: day.startTime,
      endTime: day.endTime,
      slotInterval: day.slotInterval,
      status: day.status,
      rests: rests.map(rest => this._rest.restToFullResponse(rest))
    }
  }
}
