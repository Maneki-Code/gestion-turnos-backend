import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ScheduleHolidaysService } from '../services/schedule-holidays.service';
import { ScheduleHolidayForCreationDto } from '../dtos/scheduleHolidayForCreationDto.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('schedule-holidays')
export class ScheduleHolidaysController {
  constructor(private _scheduleHolidays:ScheduleHolidaysService){}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() request:ScheduleHolidayForCreationDto){
    return await this._scheduleHolidays.create(request);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Get()
  async findAllByScheduleId(@Query(':scheduleId') scheduleId:number){
    return await this._scheduleHolidays.findAllByScheduleId(scheduleId);
  }
}
