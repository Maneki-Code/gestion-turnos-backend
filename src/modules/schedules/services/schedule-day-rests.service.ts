import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleDayRest } from '@prisma/client';
import { ScheduleDayRestForCreationDto } from '../dtos/scheduleDayRestForCreationDto.dto';

@Injectable()
export class ScheduleDayRestsService {
  constructor(private readonly _prisma: PrismaService) {}

  async create(
    scheduleDayId: number,
    request: ScheduleDayRestForCreationDto,
  ): Promise<ScheduleDayRest> {
    return await this._prisma.scheduleDayRest.create({
      data: {
        restEndTime: request.endRest,
        restStartTime: request.startRest,
        scheduleDayId: scheduleDayId
      },
    });
  }
}
