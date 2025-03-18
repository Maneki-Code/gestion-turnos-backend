import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointment, EDayOfWeek, } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { AppointmentsService } from 'src/modules/appointments/services/appointments.service';
import { ScheduleDayForCreationDto } from '../dtos/scheduleDayForCreationDto.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { ScheduleDayResponse } from '../dtos/scheduleDay.response';
import { ScheduleDayRestsService } from './schedule-day-rests.service';


@Injectable()
export class ScheduleDaysService {
  
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _time: TimeService,
    private readonly _usersService: UsersService,
    private readonly _restsServices: ScheduleDayRestsService,
    private readonly _appointmentsService: AppointmentsService,
  ) {}

  async create(scheduleId: number, date: Date, request: ScheduleDayForCreationDto) {
    /* const createdScheduleDay = await this._prisma.scheduleDay.create({
      data: {
        scheduleId: scheduleId,
        startTime: request.startTime,
        endTime: request.endTime,
        slotInterval: request.slotInterval,
        date: date,
        day: request.day
      },
    });
  
    const rests = await Promise.all(
      request.rests.map(rest => this._restsServices.create(createdScheduleDay.id, rest))
    );
  
    
    const scheduleDayRests = rests;  
  
    let currentTime = this._time.convertToDate(date, request.startTime);  
    let endCurrentTime = this._time.addInterval(currentTime, request.slotInterval);
    const endDate = this._time.convertToDate(date, request.endTime);
  
    if (scheduleDayRests.length > 0) {
      for (const rest of scheduleDayRests) {
        const startRest = this._time.convertToDate(date, rest.restStartTime);
        const endRest = this._time.convertToDate(date, rest.restEndTime);
  
        while (currentTime < endDate) {
          if (currentTime < startRest || currentTime >= endRest) {
            await this._appointmentsService.create(createdScheduleDay.id, currentTime.toISO(), endCurrentTime.toISO());
          }
          currentTime = this._time.addInterval(currentTime, request.slotInterval);
          endCurrentTime = this._time.addInterval(endCurrentTime, request.slotInterval);
        }
      }
    } else {
      while (currentTime < endDate) {
        await this._appointmentsService.create(createdScheduleDay.id, currentTime.toISO(), endCurrentTime.toISO());
        currentTime = this._time.addInterval(currentTime, request.slotInterval);
        endCurrentTime = this._time.addInterval(endCurrentTime, request.slotInterval);
      }
    } */
  }
  

/*   async findOneById(id:number):Promise<ScheduleDayResponse> {
    const response = await this._prisma.scheduleDay.findUnique({
      where:{
        id
      },
      include:{
        appointments: true
      }
    })

    if(!response) throw new NotFoundException('No se encontró la agenda del día');

    return this.parseScheduleDayToResponseFull(response, response.appointments);
  } */

  async findAllBetweenDatesByUser(email: string, startDate: Date, endDate: Date){
/*     return await this._prisma.scheduleDay.findMany({
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
    }); */
  }



/*   parseScheduleDayToResponseFull(scheduleDay: ScheduleDay, appointments:Appointment[]): ScheduleDayResponse{
    return {
        id: scheduleDay.id,
        day: scheduleDay.day,
        date: scheduleDay.date.toISOString(),
        startTime: scheduleDay.startTime,
        endTime: scheduleDay.endTime,
        slotInterval: scheduleDay.slotInterval,
        appointments: appointments.map( appointment => this._appointmentsService.parseAppointmentToResponse(appointment))
    }
  } */
}
