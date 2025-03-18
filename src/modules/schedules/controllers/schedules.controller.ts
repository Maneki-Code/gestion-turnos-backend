import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SchedulesService } from '../services/schedules.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ScheduleForUpdateDto } from '../dtos/scheduleForUpdateDto.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private _scheduleService:SchedulesService){}

  /* @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async createSchedule(@Body() request:ScheduleForCreationDto){
    return await this._scheduleService.create(request);
  } */
  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('update-config')
  async updateScheduleConfig(@Body() request: ScheduleForUpdateDto):Promise<void>{
    await this._scheduleService.updateConfig(request);
  }

  /* @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('delete/:id')
  async deleteSchedule(@Param('id') id: number):Promise<void>{
    await this._scheduleService.delete(id);
  } */
}
