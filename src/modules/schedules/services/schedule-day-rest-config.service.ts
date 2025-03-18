import { BadRequestException, Injectable } from '@nestjs/common';
import { ScheduleDayRestConfig } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleDayRestConfigResponse } from '../dtos/scheduleDayRestConfig.response';

@Injectable()
export class ScheduleDayRestConfigService {
  
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _time: TimeService,
  ) {}
  async create(id: number) {
    const createdRest = await this._prisma.scheduleDayRestConfig.create({
      data: {
        scheduleDayId: id,
        startTime: '12:00',
        endTime: '13:00'
      }
    })
    if(!createdRest) throw new BadRequestException(`Algo salió mal al crear uno de los descansos.`);
  }

  async findAllRestsByScheduleDayConfigId(id: number): Promise<ScheduleDayRestConfig[]> {
    return await this._prisma.scheduleDayRestConfig.findMany({
      where: {
        scheduleDayId: id
      }
    })
  }

  restToFullResponse(rest: ScheduleDayRestConfig): ScheduleDayRestConfigResponse {
    return {
      id: rest.id,
      startTime: rest.startTime,
      endTime: rest.endTime
    }
  }
}
