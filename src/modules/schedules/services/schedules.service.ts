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
import { DateTime } from 'luxon';

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
    await this.validateNoOverlappingAppointments(request);

    const createdSchedule = await this._prisma.schedule.create({
      data: {
        userId: userFound.id,
        startDate: request.startDate,
        endDate: request.endDate,
        description: request.description,
      },
    });

    await this.createScheduleDays(
      createdSchedule.id,
      request.startDate,
      request.endDate,
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

    while (currentDate <= endDate) {
      const dayOfWeek = this._time.getDayOfWeek(currentDate);
      const scheduleDay = scheduleDays.find((sd) => sd.day === dayOfWeek);

      if (scheduleDay) {
           await this._schedulesDayService.create(
            scheduleId,
            currentDate,
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
  
  async validateNoOverlappingAppointments(request: ScheduleForCreationDto) {
    const startDate = request.startDate;
    const endDate = request.endDate;
  
    const scheduleDays = await this._schedulesDayService.findAllBetweenDatesByUser(
      request.userEmail,
      startDate,
      endDate
    );
  
    scheduleDays.forEach((scheduleDay) => {
      let currentDate = new Date(startDate); 
      while (currentDate < endDate) {
        const dayOfWeek = this._time.getDayOfWeek(currentDate);
        
        if (scheduleDay.day === dayOfWeek) {
          request.scheduleDays.forEach((scheduleDayDto) => {
            const interval = scheduleDayDto.slotInterval;
            let startTime = this._time.convertToDate(currentDate, scheduleDayDto.startTime);
            let endTime = this._time.convertToDate(currentDate, scheduleDayDto.startTime).plus({minutes: interval});
            
            scheduleDay.appointments.forEach(appointment => {
              const AppointmentStartTime = DateTime.fromISO(appointment.startTime, { zone: 'America/Argentina/Buenos_Aires' });
              const AppointmentEndTime = DateTime.fromISO(appointment.endTime, { zone: 'America/Argentina/Buenos_Aires' });
              if (startTime < AppointmentEndTime && endTime > AppointmentStartTime) {
                throw new BadRequestException('El horario se solapa con una cita existente.');
              }
              startTime = startTime.plus({ minutes: interval }); 
              endTime = startTime.plus({ minutes: interval });
            });
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  }
}
