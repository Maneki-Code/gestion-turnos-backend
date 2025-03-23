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
import { EDayOfWeek, Schedule } from '@prisma/client';
import { ScheduleResponse } from '../dtos/schedule.response';
import { ScheduleMapper } from '../mappers/schedule-mapper.mapper';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _time: TimeService,
    private readonly _schedulesDayConfig: ScheduleDayConfigService,
    private readonly _mapper: ScheduleMapper,
  ) {}

  async create(userId: number): Promise<void> {
    const createdSchedule = await this._prisma.schedule.create({
      data: {
        userId: userId,
      },
    });
    if (!createdSchedule)
      throw new BadRequestException(
        `Algo salió mal al crear la agenda asociada al usuario.`,
      );

    for (const day of Object.values(EDayOfWeek)) {
      await this._schedulesDayConfig.create(createdSchedule.id, day);
    }
  }

  async findByEmailConfigResponse(email: string) {
    const schedule = await this._prisma.schedule.findFirst({
      where: {
        user: {
          email,
        },
      },
      include: {
        scheduleDays: {
          include: {
            rests: true,
          },
        },
        appointments: true,
      },
    });

    if (!schedule)
      throw new NotFoundException(
        `Agenda no encontrada para el usuario con email ${email}`,
      );

    return await this._mapper.scheduleToConfigResponse(
      schedule,
      schedule.scheduleDays,
    );
  }

  async findByEmailFullResponse(email: string): Promise<ScheduleResponse> {
    const schedule = await this._prisma.schedule.findFirst({
      where: {
        user: {
          email,
        },
      },
      include: {
        scheduleDays: {
          include: {
            rests: true,
          },
        },
        appointments: true,
      },
    });
    if (!schedule)
      throw new NotFoundException(
        `Agenda no encontrada para el usuario con email ${email}`,
      );
    return await this._mapper.scheduleToFullResponse(
      schedule,
      schedule.scheduleDays,
    );
  }

  async updateConfig(request: ScheduleForUpdateDto) {
    console.log(request.id);
    console.log(request.scheduleDays);
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
            rests: true,
          },
        },
        appointments: true,
      },
    });
  }
}
