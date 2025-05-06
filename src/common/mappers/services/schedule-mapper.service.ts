import { Injectable } from '@nestjs/common';
import {
  Schedule,
  ScheduleDayConfig,
  ScheduleDayRestConfig,
  ScheduleHoliday,
} from '@prisma/client';
import { ScheduleResponse } from 'src/modules/schedules/dtos/schedule.response';
import { ScheduleConfigResponse } from 'src/modules/schedules/dtos/scheduleconfig.response';
import { ScheduleDayConfigResponse } from 'src/modules/schedules/dtos/scheduleDayConfig.response';
import { ScheduleDayRestConfigResponse } from 'src/modules/schedules/dtos/scheduleDayRestConfig.response';
import { ScheduleHolidayResponse } from 'src/modules/schedules/dtos/scheduleHoliday.response';


@Injectable()
export class ScheduleMapperService {
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
  ): Promise<ScheduleConfigResponse> {
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

  scheduleHolidayToResponse(request: ScheduleHoliday): ScheduleHolidayResponse{
    return {
      id: request.id,
      startDate: request.startDate.toISOString(),
      endDate: request.endDate.toISOString(),
      reason: request.reason ?? ''
    }
  }
}
