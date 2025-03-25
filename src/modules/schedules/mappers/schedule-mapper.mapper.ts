import { Injectable } from '@nestjs/common';
import {
  $Enums,
  Schedule,
  ScheduleDayConfig,
  ScheduleDayRestConfig,
} from '@prisma/client';
import { ScheduleResponse } from '../dtos/schedule.response';
import { ScheduleDayConfigResponse } from '../dtos/scheduleDayConfig.response';
import { ScheduleDayRestConfigResponse } from '../dtos/scheduleDayRestConfig.response';
import { ScheduleConfigResponse } from '../dtos/scheduleconfig.response';


@Injectable()
export class ScheduleMapper {
  async scheduleToFullResponse(
    schedule: Schedule,
    days: (ScheduleDayConfig & { rests: ScheduleDayRestConfig[] })[],
  ): Promise<ScheduleResponse> {
    const daysConfig = await Promise.all(
      days.map((day) => this.scheduleDayToFullResponse(day)),
    );
    return {
      id: schedule.id,
      appointments: [],
      daysConfig: daysConfig,
    };
  }

  async scheduleToConfigResponse(
    schedule: Schedule,
    days: (ScheduleDayConfig & { rests: ScheduleDayRestConfig[] })[],
  ): Promise<ScheduleConfigResponse>{
    const daysConfig = await Promise.all(
      days.map((day) => this.scheduleDayToFullResponse(day)),
    );
    return {
      id: schedule.id,
      daysConfig: daysConfig,
    };
  }

  async scheduleDayToFullResponse(
    day: ScheduleDayConfig & { rests: ScheduleDayRestConfig[] },
  ): Promise<ScheduleDayConfigResponse> {
    return {
      id: day.id,
      day: day.day,
      startTime: day.startTime,
      endTime: day.endTime,
      slotInterval: day.slotInterval,
      status: day.status,
      rests: day.rests.map((rest) => this.restToFullResponse(rest)),
    };
  }

  restToFullResponse(
    rest: ScheduleDayRestConfig,
  ): ScheduleDayRestConfigResponse {
    return {
      id: rest.id,
      startTime: rest.startTime,
      endTime: rest.endTime,
    };
  }
}
