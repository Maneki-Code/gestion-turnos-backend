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
import { EDayOfWeek, Prisma } from '@prisma/client';

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

  async findUniqueFullById(id: number) {
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

  async updateConfig(request: ScheduleForUpdateDto) {
    const scheduleFound = await this.findUniqueFullById(request.id);

    if (!scheduleFound)
      throw new NotFoundException(`Agenda con id ${request.id} no encontrada`);

    const selectedDaysOfWeek = scheduleFound.scheduleDays.map(
      (scheduleDay) => scheduleDay.day,
    );
    const uniqueDaysOfWeek = [...new Set(selectedDaysOfWeek)];
  }
}
