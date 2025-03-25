import { BadRequestException, Injectable } from '@nestjs/common';
import { ScheduleDayRestConfig } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleDayRestForUpdateDto } from '../dtos/ScheduleDayRestForUpdateDto.dto';

@Injectable()
export class ScheduleDayRestConfigService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _time: TimeService,
  ) {}
  async create(id: number, starTime: string, endTime: string) {
    const createdRest = await this._prisma.scheduleDayRestConfig.create({
      data: {
        scheduleDayId: id,
        startTime: starTime,
        endTime: endTime,
      },
    });
    if (!createdRest)
      throw new BadRequestException(
        `Algo salió mal al crear uno de los descansos.`,
      );
  }

  async findAllRestsByScheduleDayConfigId(
    id: number,
  ): Promise<ScheduleDayRestConfig[]> {
    return await this._prisma.scheduleDayRestConfig.findMany({
      where: {
        scheduleDayId: id,
      },
    });
  }

  async findRestById(id: number): Promise<ScheduleDayRestConfig | null> {
    return this._prisma.scheduleDayRestConfig.findUnique({
      where: {
        id,
      },
    });
  }

  async update(rest: ScheduleDayRestForUpdateDto) {
    if (rest.id) {
      await this._prisma.scheduleDayRestConfig.update({
        where: {
          id: rest.id,
        },
        data: {
          startTime: rest.startRest,
          endTime: rest.endRest,
        },
      });
    }
  }

  async deleteById(id: number) {
    await this._prisma.scheduleDayRestConfig.delete({
      where: {
        id: id,
      },
    });
  }
}
