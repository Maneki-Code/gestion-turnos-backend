import { Body, Controller, Post } from '@nestjs/common';
import { SchedulesService } from '../services/schedules.service';
import { ScheduleForCreationDto } from '../dtos/scheduleForCreationDto.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private _scheduleService:SchedulesService){}

  @Post()
  async createSchedule(@Body() request:ScheduleForCreationDto){
    await this._scheduleService.create(request);
  }
}
