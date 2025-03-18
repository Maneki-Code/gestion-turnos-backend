import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScheduleDaysService } from '../services/schedule-days.service';

@Controller('schedule-days')
export class ScheduleDaysController {
  constructor(private readonly _scheduleDaysService: ScheduleDaysService) {}

  @Get(':id')
  async findScheduleById(@Param('id') id:number) {
    /* return this._scheduleDaysService.findOneById(id); */
  }
}
