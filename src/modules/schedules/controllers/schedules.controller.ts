import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { SchedulesService } from '../services/schedules.service';
import { ScheduleForCreationDto } from '../dtos/scheduleForCreationDto.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('schedules')
export class SchedulesController {
  constructor(private _scheduleService:SchedulesService){}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async createSchedule(@Body() request:ScheduleForCreationDto){
    return await this._scheduleService.create(request);
  }
  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('update')
  async updateSchedule(@Body() request: )
}
