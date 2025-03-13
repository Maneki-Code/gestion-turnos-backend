import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleForCreationDto } from '../dtos/scheduleForCreationDto.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { ScheduleDaysService } from './schedule-days.service';
import { TimeService } from 'src/common/time/time.service';
import { ScheduleDayForCreationDto } from '../dtos/scheduleDayForCreationDto.dto';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _time: TimeService,
    private readonly _userService: UsersService,
    private readonly _schedulesDayService: ScheduleDaysService,
  ) {}

  async create(request: ScheduleForCreationDto) {
    //await this.validateNoOverlappingAppointments(request);
    this.validateScheduleDayForCreationDtos(request.scheduleDays);
    const userFound = await this._userService.findOneByEmail(request.userEmail);
    if (userFound === null)
      throw new NotFoundException(
        `El usuario con email '${request.userEmail} no existe`,
      );

    const createdSchedule = await this._prisma.schedule.create({
      data: {
        userId: userFound.id,
        startDate: new Date(request.startDate),
        endDate: new Date(request.endDate),
        description: request.description,
      },
    });

    await this.createScheduleDays(
      createdSchedule.id,
      new Date(request.startDate),
      new Date(request.endDate),
      request.scheduleDays,
    );

    return await this._prisma.schedule.findUnique({
      where: {
        id: createdSchedule.id,
      },
      include: {
        scheduleDays: {
          include: {
            appointments: true,
          },
        },
      },
    });
  }

  private async createScheduleDays(
    scheduleId: number,
    startDate: Date,
    endDate: Date,
    scheduleDays: ScheduleDayForCreationDto[],
  ) {
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      const dayOfWeek = this._time.getDayOfWeek(currentDate);
      const scheduleDay = scheduleDays.find((sd) => sd.day === dayOfWeek);

      if (scheduleDay) {
           await this._schedulesDayService.create(
            scheduleId,
            new Date(currentDate),
            scheduleDay
          );
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  private validateScheduleDayForCreationDtos(days: ScheduleDayForCreationDto[]) {
    for (const scheduleDay of days) {
      if (scheduleDay.startTime >= scheduleDay.endTime) {
        throw new BadRequestException(
          `El horario de inicio debe ser menor que el de fin para el día ${scheduleDay.day}.`,
        );
      }

      if (scheduleDay.startRest && scheduleDay.endRest) {
        if (
          scheduleDay.startRest < scheduleDay.startTime ||
          scheduleDay.endRest > scheduleDay.endTime
        ) {
          throw new BadRequestException(
            `El horario de descanso debe estar dentro del horario laboral para el día ${scheduleDay.day}.`,
          );
        }
  
        if (scheduleDay.startRest >= scheduleDay.endRest) {
          throw new BadRequestException(
            `El inicio del descanso debe ser menor que el fin del descanso para el día ${scheduleDay.day}.`,
          );
        }

        if (
          scheduleDay.startRest === scheduleDay.startTime &&
          scheduleDay.endRest === scheduleDay.endTime
        ) {
          throw new BadRequestException(
            `El descanso no puede cubrir toda la jornada laboral para el día ${scheduleDay.day}.`,
          );
        }
      }

      const availableMinutes = this._time.calculateAvailableMinutes(
        scheduleDay.startTime,
        scheduleDay.endTime,
        scheduleDay.startRest,
        scheduleDay.endRest
      );
  
      if (availableMinutes % scheduleDay.slotInterval !== 0) {
        throw new BadRequestException(
          `El slotInterval (${scheduleDay.slotInterval} min) no encaja exactamente en el horario disponible para el día ${scheduleDay.day}.`,
        );
      }
    }
  }
  
}
