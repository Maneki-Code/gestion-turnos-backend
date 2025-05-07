import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from '../services/schedules.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ScheduleForUpdateDto } from '../dtos/scheduleForUpdateDto.dto';
import { ScheduleConfigResponse } from '../dtos/scheduleconfig.response';

@Controller('schedules')
export class SchedulesController {
  constructor(private _scheduleService: SchedulesService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('/:email')
  async findByEmailFullResponse(@Param('email') email: string) {
    return await this._scheduleService.findByEmailFullResponse(email);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('/config/:email')
  async findByEmailConfigResponse(@Param('email') email: string) {
    return await this._scheduleService.findByEmailConfigResponse(email);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('update-config')
  async updateScheduleConfig(
    @Body() request: ScheduleForUpdateDto,
  ): Promise<ScheduleConfigResponse> {
    
    return await this._scheduleService.updateConfig(request);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('/stats/:email')
  async getStatsByHour(
    @Param('email') email: string,
    @Query('months') months: number,
  ) {
    return await this._scheduleService.getStatsByHour(email, months);
  }

  
}
