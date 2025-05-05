import { BadRequestException, Injectable } from '@nestjs/common';
import { ScheduleDayConfig } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { ScheduleDayConfigForUpdateDto } from 'src/modules/schedules/dtos/scheduleDayForUpdateDto.dto';
import { ScheduleDayRestForUpdateDto } from 'src/modules/schedules/dtos/ScheduleDayRestForUpdateDto.dto';

interface Interval { start: number; end: number; }

@Injectable()
export class ScheduleValidationService {
  constructor(private readonly _time: TimeService) {}

  validateScheduleDay(
    newDay: ScheduleDayConfigForUpdateDto,
    day: ScheduleDayConfig,
  ) {
    const startTime = newDay.startTime ?? day.startTime;
    const endTime   = newDay.endTime   ?? day.endTime;
    const slot      = newDay.slotInterval ?? day.slotInterval;
    const rests     = newDay.rests;

    const startMin = this._time.timeToMinutes(startTime);
    const endMin   = this._time.timeToMinutes(endTime);

    this._assertValidRange(startMin, endMin);

    const sortedRests = this._getSortedRests(rests);
    this._assertNoRestOverlap(sortedRests);

    const workIntervals = this._computeWorkIntervals(startMin, endMin, sortedRests);
    this._assertDivisible(workIntervals, slot);
  }

  // 1) Asegura que start < end
  private _assertValidRange(start: number, end: number) {
    if (start > end) {
      throw new BadRequestException('El horario de inicio no puede ser posterior al de fin');
    }
    if (start === end) {
      throw new BadRequestException('El horario de inicio no puede ser igual al de fin');
    }
  }

  // 2) Mapea y ordena los descansos en minutos
  private _getSortedRests(
    rests: ScheduleDayRestForUpdateDto[],
  ): Interval[] {
    return rests
      .map(r => ({
        start: this._time.timeToMinutes(r.startRest),
        end:   this._time.timeToMinutes(r.endRest),
      }))
      .sort((a, b) => a.start - b.start);
  }

  // 3) Valida consistencia y solapamientos de descansos
  private _assertNoRestOverlap(rests: Interval[]) {
    for (let i = 0; i < rests.length; i++) {
      const { start, end } = rests[i];
      if (start >= end) {
        throw new BadRequestException(
          'El inicio del descanso no puede ser posterior o igual al fin',
        );
      }
      if (i > 0 && start < rests[i - 1].end) {
        throw new BadRequestException('Los horarios de descanso se solapan');
      }
    }
  }

  // 4) Genera los intervalos de trabajo efectivo entre descansos
  private _computeWorkIntervals(
    start: number,
    end: number,
    rests: Interval[],
  ): Interval[] {
    const intervals: Interval[] = [];
    let cursor = start;

    for (const { start: rStart, end: rEnd } of rests) {
      if (cursor < rStart) {
        intervals.push({ start: cursor, end: rStart });
      }
      cursor = rEnd;
    }

    if (cursor < end) {
      intervals.push({ start: cursor, end });
    }

    return intervals;
  }

  // 5) Valida que cada intervalo sea divisible por el slot
  private _assertDivisible(intervals: Interval[], slot: number) {
    for (const { start, end } of intervals) {
      const dur = end - start;
      if (dur % slot !== 0) {
        const from = this._time.minutesToTime(start);
        const to   = this._time.minutesToTime(end);
        throw new BadRequestException(
          `El intervalo de trabajo ${from}–${to} no es divisible por ${slot} minutos`,
        );
      }
    }
  }
}
