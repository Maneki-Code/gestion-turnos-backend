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

    
    const createdSchedule = await this._prisma.schedule.create({
      data: {
        userId: userFound.id,
        startDate: new Date(request.startDate), // Convertir a Date
        endDate: new Date(request.endDate),
        description: request.description,
      }
    });

    console.log('hola');
   /* await this.createScheduleDays(
      createdSchedule.id,
      request.startDate,
      request.endDate,
      request.days,
      request.startTime,
      request.endTime,
      request.slotInterval
    );  */
  }

  /* private async createScheduleDays(
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
      const currentDay: EDayOfWeek = this.getDayOfWeek(currentDate);
  
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
