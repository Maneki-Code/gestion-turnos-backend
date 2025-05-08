import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleHolidayForCreationDto } from '../dtos/scheduleHolidayForCreationDto.dto';
import { TimeService } from 'src/common/time/time.service';
import { DateTime } from 'luxon';
import { scheduled } from 'rxjs';
import { ScheduleMapperService } from 'src/common/mappers/services/schedule-mapper.service';

@Injectable()
export class ScheduleHolidaysService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _time: TimeService,
    private readonly _scheduleMapper:ScheduleMapperService
  ) {}

  async create(request: ScheduleHolidayForCreationDto) {
    const foundSchedule = await this._prisma.schedule.findUnique({
      where: { userId: request.userId },
    });

    if (!foundSchedule) {
      throw new NotFoundException(`No se encontró la agenda`);
    }

    const start = this._time.convertStringToDate(request.startDate);
    const end = this._time.convertStringToDate(request.endDate);

    if (end < start) {
      throw new BadRequestException(
        'La fecha final no puede ser anterior a la inicial',
      );
    }

    return await this._prisma.scheduleHoliday.create({
      data: {
        scheduleId: request.userId,
        reason: request.reason ?? '',
        startDate: start.toJSDate(),
        endDate: end.toJSDate(),
      },
    });
  }

  async findAllByScheduleId(scheduleId: number) {
    const foundSchedule = await this._prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        scheduleHolidays: true,
      },
    });

    if (!foundSchedule) {
      throw new NotFoundException(`No se encontró la agenda`);
    }

    return foundSchedule.scheduleHolidays.map(holiday => this._scheduleMapper.scheduleHolidayToResponse(holiday));
  }
}
