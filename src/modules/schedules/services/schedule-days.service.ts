import { Injectable } from '@nestjs/common';
import { EDayOfWeek, ScheduleDay } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { AppointmentsService } from 'src/modules/appointments/services/appointments.service';
import { ScheduleDayForCreationDto } from '../dtos/scheduleDayForCreationDto.dto';


@Injectable()
export class ScheduleDaysService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _time: TimeService,
    private readonly _appointmentsService: AppointmentsService,
  ) {}

  async create(scheduleId: number, date: Date, request:ScheduleDayForCreationDto) {
    const createScheduleDay = await this._prisma.scheduleDay.create({
      data: {
        scheduleId: scheduleId,
        startTime: request.startTime,
        endTime: request.endTime,
        slotInterval: request.slotInterval,
        date: date,
        day: request.day,
        ...(request.startRest && { restStartTime: request.startRest }),
        ...(request.endRest && { restEndTime: request.endRest }),
      },
    });

    let currentTime = this._time.convertToDate(date, request.startTime);  
    let endCurrentTime = this._time.addInterval(currentTime, request.slotInterval);
    const endDate = this._time.convertToDate(date, request.endTime);

    if(request.startRest!==undefined && request.endRest !== undefined){
      const startRest = this._time.convertToDate(date, request.startRest);
      const endRest = this._time.convertToDate(date, request.endRest);

      while (currentTime < endDate) {
        if(currentTime<startRest || currentTime>=endRest){
          await this._appointmentsService.create(createScheduleDay.id, currentTime.toISO(), endCurrentTime.toISO());
        }
        currentTime = this._time.addInterval(currentTime, request.slotInterval);
        endCurrentTime = this._time.addInterval(endCurrentTime, request.slotInterval);
      }
    }else{ 
      while (currentTime < endDate) {
        await this._appointmentsService.create(createScheduleDay.id, currentTime.toISO(), endCurrentTime.toISO());
        currentTime = this._time.addInterval(currentTime, request.slotInterval);
        endCurrentTime = this._time.addInterval(endCurrentTime, request.slotInterval);
      }
    } 
  }


  async findAllBetweenDatesByUser(email: string, startDate: Date, endDate: Date){
    return await this._prisma.scheduleDay.findMany({
      where: {
        date: {
          gte: startDate, 
          lte: endDate,    
        },
        schedule: {
          user: {
            email: email,  
          },
        },
      },
      include:{
        appointments:true
      }
    });
  }
}
