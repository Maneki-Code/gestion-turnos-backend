import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from '../services/schedules.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ScheduleForUpdateDto } from '../dtos/scheduleForUpdateDto.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private _scheduleService: SchedulesService) {}

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
  ): Promise<void> {
    await this._scheduleService.updateConfig(request);
  }
}
