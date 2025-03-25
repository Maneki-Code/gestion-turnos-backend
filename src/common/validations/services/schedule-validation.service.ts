import { BadRequestException, Injectable } from '@nestjs/common';
import { ScheduleDayConfig } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { ScheduleDayConfigForUpdateDto } from 'src/modules/schedules/dtos/scheduleDayForUpdateDto.dto';
import { ScheduleDayRestForUpdateDto } from 'src/modules/schedules/dtos/ScheduleDayRestForUpdateDto.dto';

@Injectable()
export class ScheduleValidationService {
  constructor(private readonly _time: TimeService) {}

  validateScheduleDay(
    newDay: ScheduleDayConfigForUpdateDto,
    day: ScheduleDayConfig,
  ) {
    const startTime = newDay.startTime ?? day.startTime;
    const endTime = newDay.endTime ?? day.endTime;
    const slotInterval = newDay.slotInterval ?? day.slotInterval;

    this.validateRests(startTime, endTime, slotInterval, newDay.rests);

    const startMinutes = this._time.timeToMinutes(startTime);
    const endMinutes = this._time.timeToMinutes(endTime);

    if (startMinutes > endMinutes) {
      throw new BadRequestException(
        'El horario de inicio no puede ser posterior al horario de fin',
      );
    }

    if (endMinutes < startMinutes) {
      throw new BadRequestException(
        'El horario de fin no puede ser anterior al horario de inicio',
      );
    }
  }

  validateRests(
    startTime: string,
    endTime: string,
    interval: number,
    rests: ScheduleDayRestForUpdateDto[],
  ) {
    const startMinutes = this._time.timeToMinutes(startTime);
    const endMinutes = this._time.timeToMinutes(endTime);
    const totalWorkMinutes = endMinutes - startMinutes;

    for (let i = 0; i < rests.length; i++) {
      const restStartMinutes = this._time.timeToMinutes(rests[i].startRest);
      const restEndMinutes = this._time.timeToMinutes(rests[i].endRest);

      for (let j = i + 1; j < rests.length; j++) {
        const otherRestStartMinutes = this._time.timeToMinutes(
          rests[j].startRest,
        );
        const otherRestEndMinutes = this._time.timeToMinutes(rests[j].endRest);

        if (
          restStartMinutes < otherRestEndMinutes &&
          restEndMinutes > otherRestStartMinutes 
        ) {
          throw new BadRequestException('Los horarios de descanso se solapan');
        }
      }

      if (restStartMinutes >= restEndMinutes) {
        throw new BadRequestException(
          'El horario de inicio de descanso no puede ser posterior al horario de fin',
        );
      }
    }

    let totalRestMinutes = 0;
    for (const rest of rests) {
      const restStartMinutes = this._time.timeToMinutes(rest.startRest);
      const restEndMinutes = this._time.timeToMinutes(rest.endRest);
      totalRestMinutes += restEndMinutes - restStartMinutes;
    }

    const availableWorkMinutes = totalWorkMinutes - totalRestMinutes;

    if (availableWorkMinutes % interval !== 0) {
      throw new BadRequestException(
        'El tiempo total de trabajo no se ajusta al intervalo de tiempo definido',
      );
    }
  }
}
