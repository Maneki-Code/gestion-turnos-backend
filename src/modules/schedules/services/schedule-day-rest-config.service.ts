import { BadRequestException, Injectable } from '@nestjs/common';
import { TimeService } from 'src/common/time/time.service';
import { PrismaService } from 'src/config/database/prisma/prisma.service';

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
}
