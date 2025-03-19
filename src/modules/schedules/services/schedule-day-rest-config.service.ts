import { BadRequestException, Injectable } from '@nestjs/common';
import { ScheduleDayRestConfig } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleDayRestConfigResponse } from '../dtos/scheduleDayRestConfig.response';
import { ScheduleDayRestForUpdateDto } from '../dtos/ScheduleDayRestForUpdateDto.dto';
import { start } from 'repl';

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
        endTime: endTime
      }
    })
    if(!createdRest) throw new BadRequestException(`Algo salió mal al crear uno de los descansos.`);
  }
  
  async findRestById(id:number):Promise<ScheduleDayRestConfig | null>{
    return this._prisma.scheduleDayRestConfig.findUnique({
      where:{
        id
      }
    })
  }

  async update(rest: ScheduleDayRestForUpdateDto) {
    if(rest.id){
      await this._prisma.scheduleDayRestConfig.update({
        where: {
          id: rest.id
        },
        data: {
          startTime: rest.startRest,
          endTime: rest.endRest
        }
      })
    }
  }

  async findAllRestsByScheduleDayConfigId(id: number): Promise<ScheduleDayRestConfig[]> {
    return await this._prisma.scheduleDayRestConfig.findMany({
      where: {
        scheduleDayId: id
      }
    })
  }

  validateRests(startTime: string, endTime: string, interval: number, rests: ScheduleDayRestForUpdateDto[]) {
    // Convertir el startTime, endTime y cada descanso a minutos
    const startMinutes = this._time.timeToMinutes(startTime);
    const endMinutes = this._time.timeToMinutes(endTime);
    const totalWorkMinutes = endMinutes - startMinutes;

    // Verificar que los descansos no se solapen
    for (let i = 0; i < rests.length; i++) {
        const restStartMinutes = this._time.timeToMinutes(rests[i].startRest);
        const restEndMinutes = this._time.timeToMinutes(rests[i].endRest);

        // Verificar que el descanso no se solape
        for (let j = i + 1; j < rests.length; j++) {
            const otherRestStartMinutes = this._time.timeToMinutes(rests[j].startRest);
            const otherRestEndMinutes = this._time.timeToMinutes(rests[j].endRest);

            if (
                (restStartMinutes < otherRestEndMinutes && restEndMinutes > otherRestStartMinutes) // Solapamiento de descansos
            ) {
                throw new BadRequestException('Los horarios de descanso se solapan');
            }
        }

        // Verificar que el descanso no sea más corto que el inicio
        if (restStartMinutes >= restEndMinutes) {
            throw new BadRequestException('El horario de inicio de descanso no puede ser posterior al horario de fin');
        }
    }

    // Calcular el tiempo total de descanso
    let totalRestMinutes = 0;
    for (const rest of rests) {
        const restStartMinutes = this._time.timeToMinutes(rest.startRest);
        const restEndMinutes = this._time.timeToMinutes(rest.endRest);
        totalRestMinutes += restEndMinutes - restStartMinutes;
    }

    // Verificar si el tiempo de trabajo se ajusta al intervalo
    const availableWorkMinutes = totalWorkMinutes - totalRestMinutes;

    if (availableWorkMinutes % interval !== 0) {
        throw new BadRequestException('El tiempo total de trabajo no se ajusta al intervalo de tiempo definido');
    }
  }

  restToFullResponse(rest: ScheduleDayRestConfig): ScheduleDayRestConfigResponse {
    return {
      id: rest.id,
      startTime: rest.startTime,
      endTime: rest.endTime
    }
  }
}
