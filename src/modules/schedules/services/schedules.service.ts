import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleForCreationDto } from '../dtos/scheduleForCreationDto.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { ScheduleDaysService } from './schedule-days.service';
import { EDayOfWeek } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { ScheduleDayForCreationDto } from '../dtos/scheduleDayForCreationDto.dto';
import { createReadStream } from 'fs';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _time: TimeService,
    private readonly _userService: UsersService,
    private readonly _schedulesDayService: ScheduleDaysService,
  ) {}

  async create(request: ScheduleForCreationDto) {
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

    // Ahora generamos los ScheduleDays para cada intervalo en cada día
    await this.createScheduleDays(
      createdSchedule.id,
      new Date(request.startDate),
      new Date(request.endDate),
      request.scheduleDays,
    );

    return await this._prisma.schedule.findUnique({
      where: {
        id: createdSchedule.id
      },
      include: {
        scheduleDays: {
          include: {
            appointments: true,  // Incluir los appointments dentro de cada scheduleDay
          }
        },
      }
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
            console.log("ENTRO A CREAR LOS TURNOS");
            for (let i = 0; i < scheduleDay.startTimes.length; i++) {
                await this._schedulesDayService.create(
                    scheduleId,
                    dayOfWeek,
                    new Date(currentDate),
                    scheduleDay.startTimes[i],
                    scheduleDay.endTimes[i],
                    scheduleDay.slotInterval,
                );
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
}


  /*  private async createScheduleDays(
    scheduleId: number,
    startDate: Date,
    endDate: Date,
    days: EDayOfWeek[],
    startTime: string,
    endTime: string,
    slotInterval: number
  ) {
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0); 
    const endDateObj = new Date(endDate);
    endDateObj.setHours(0, 0, 0, 0); 
    while (currentDate <= endDateObj) {
      const currentDay: EDayOfWeek = this._time.getDayOfWeek(currentDate);
  
      if (days.includes(currentDay)) {
        await this._schedulesDayService.create(
          scheduleId,
          currentDay,
          new Date(currentDate), 
          startTime,
          endTime,
          slotInterval
        );
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } */

  private validateScheduleDayForCreationDtos(
    days: ScheduleDayForCreationDto[],
  ) {
    for (const scheduleDay of days) {
      if (scheduleDay.startTimes.length !== scheduleDay.endTimes.length)
        throw new BadRequestException(
          `La cantidad de horarios debe coincidir para el día ${scheduleDay.day}.`,
        );

      if (
        !this._time.isValidSchedule(
          scheduleDay.startTimes,
          scheduleDay.endTimes,
        )
      )
        throw new BadRequestException(
          `El horario de inicio no puede ser posterior al horario de fin para el día ${scheduleDay.day}.`,
        );

      if (this._time.hasOverlap(scheduleDay.startTimes, scheduleDay.endTimes))
        throw new BadRequestException(
          `Los horarios no se pueden solapar para el día ${scheduleDay.day}.`,
        );
    }
  }
}
