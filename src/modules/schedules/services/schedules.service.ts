import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleForCreationDto } from '../dtos/scheduleForCreationDto.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { ScheduleDaysService } from './schedule-days.service';
import { EDayOfWeek } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _userService: UsersService,
    private readonly _schedulesDayService: ScheduleDaysService,
  ) {}

  async create(request: ScheduleForCreationDto) {
    const userFound = await this._userService.findOneByEmail(request.userEmail);
    if (userFound === null)
      throw new NotFoundException(
        `El usuario con email '${request.userEmail} no existe`,
      );
    /* VALIDACIONES DE QUE NO SE PISEN LOS TURNOS */

    console.log("hola")
    const createdSchedule = await this._prisma.schedule.create({
      data: {
        userId: userFound.id,
        startDate: request.startDate,
        endDate: request.endDate,
        startTime: request.startTime,
        endTime: request.endTime,
        slotInterval: request.slotInterval,
        description: request.description,
      }
    });

   await this.createScheduleDays(
      createdSchedule.id,
      request.startDate,
      request.endDate,
      request.days,
      request.startTime,
      request.endTime,
      request.slotInterval
    ); 
  }

  private async createScheduleDays(
    scheduleId: number,
    startDate: Date,
    endDate: Date,
    days: EDayOfWeek[],
    startTime: string,
    endTime: string,
    slotInterval: number
  ) {
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0); // Asegúrate de que la hora sea 00:00:00 para evitar problemas con la comparación de fechas
  
    const endDateObj = new Date(endDate);
    endDateObj.setHours(0, 0, 0, 0); // Igual para la fecha de fin
  
    while (currentDate <= endDateObj) {
      const currentDay: EDayOfWeek = this.getDayOfWeek(currentDate);
  
      if (days.includes(currentDay)) {
        await this._schedulesDayService.create(
          scheduleId,
          currentDay,
          new Date(currentDate), // Para evitar cualquier posible referencia errónea
          startTime,
          endTime,
          slotInterval
        );
      }
  
      // Incrementa un día
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  

  private getDayOfWeek(date: Date): EDayOfWeek {
    const dayOfWeek = date.getDay(); 
    switch (dayOfWeek) {
      case 0:
        return EDayOfWeek.SUNDAY;
      case 1:
        return EDayOfWeek.MONDAY;
      case 2:
        return EDayOfWeek.TUESDAY;
      case 3:
        return EDayOfWeek.WEDNESDAY;
      case 4:
        return EDayOfWeek.THURSDAY;
      case 5:
        return EDayOfWeek.FRIDAY;
      case 6:
        return EDayOfWeek.SATURDAY;
      default:
        throw new Error('Invalid day of the week');
    }
  }

}
