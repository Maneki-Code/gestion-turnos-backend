import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { TimeService } from 'src/common/time/time.service';
import { DateTime } from 'luxon';
import { ScheduleForUpdateDto } from '../dtos/scheduleForUpdateDto.dto';
import { ScheduleDayConfigService } from './schedule-day-config.service';
import { EDayOfWeek, Schedule} from '@prisma/client';
import { ScheduleResponse } from '../dtos/schedule.response';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _time: TimeService,
    private readonly _schedulesDayConfig: ScheduleDayConfigService
  ) {}

  async create(userId:number):Promise<void> {
    const createdSchedule = await this._prisma.schedule.create({
      data: {
        userId: userId
      }
    });
    if(!createdSchedule) throw new BadRequestException(`Algo salió mal al crear la agenda asociada al usuario.`);

    for (const day of Object.values(EDayOfWeek)) {
      await this._schedulesDayConfig.create(createdSchedule.id, day);
    }
  }

  async findFullResponseById(id:number):Promise<ScheduleResponse>{
    const scheduleFound = await this.findFullById(id);

    if (!scheduleFound)
      throw new NotFoundException(`Agenda con id ${id} no encontrada`);

    return this.scheduleToFullResponse(scheduleFound);
  }

  async updateConfig(request: ScheduleForUpdateDto) {
    const scheduleFound = await this.findFullById(request.id);

    if (!scheduleFound)
      throw new NotFoundException(`Agenda con id ${request.id} no encontrada`);

    for (const day of request.scheduleDays) {
      await this._schedulesDayConfig.updateDayConfig(day);
    }
  }

  async findFullById(id: number) {
    return await this._prisma.schedule.findUnique({
      where: {
        id,
      },
      include: {
        scheduleDays: {
          include: {
            rests: true
          },
        },
        appointments: true
      },
    });
  }

  async scheduleToFullResponse(schedule: Schedule):Promise<ScheduleResponse>{
    const scheduleDays = await this._schedulesDayConfig.findAllSchedulesByScheduleId(schedule.id);
    const daysConfig = await Promise.all(
      scheduleDays.map(day => this._schedulesDayConfig.scheduleDayToFullResponse(day))
    );
    return {
      id: schedule.id,
      appointments: [],
      daysConfig: daysConfig
    }
  }
}
