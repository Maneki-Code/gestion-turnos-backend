import { Controller, Get, Query } from '@nestjs/common';
import { ScheduleDaysService } from '../services/schedule-days.service';

@Controller('schedule-days')
export class ScheduleDaysController {
  constructor(private readonly _scheduleDaysService: ScheduleDaysService) {}

  @Get('find-one')
  async findScheduleDayByUserEmail(@Query('date') date: string, @Query('email') email:string) {
    return this._scheduleDaysService.findOneByDateAndUserEmail(date, email);
  }
}
