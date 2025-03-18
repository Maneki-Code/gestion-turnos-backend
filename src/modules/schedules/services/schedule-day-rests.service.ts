import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleDayRestForCreationDto } from '../dtos/scheduleDayRestForCreationDto.dto';
import { ScheduleDayRestConfig } from '@prisma/client';

@Injectable()
export class ScheduleDayRestsService {
  constructor(private readonly _prisma: PrismaService) {}

  async create(
    scheduleDayId: number,
    request: ScheduleDayRestForCreationDto,
  ){
    /* return await this._prisma.scheduleDayRest.create({
      data: {
        restEndTime: request.endRest,
        restStartTime: request.startRest,
        scheduleDayId: scheduleDayId
      },
    }) */;
  }
}
