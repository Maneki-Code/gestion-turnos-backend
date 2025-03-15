import { BadRequestException, Injectable } from '@nestjs/common';
import { EDayOfWeek } from '@prisma/client';
import { DateTime } from 'luxon'; // Importamos Luxon

@Injectable()
export class TimeService {
  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  parseStringToDate(date:string){
    try{
      const newDate = new Date(date);
      return newDate;
    }catch(error){
      throw new BadRequestException('Formato de fecha inválido');
    }
  }

  convertToDate(date: Date, time: string): DateTime {
    const [hours, minutes] = time.split(':').map((part) => parseInt(part, 10));

    return DateTime.fromJSDate(date)
      .set({ hour: hours, minute: minutes, second: 0, millisecond: 0 })
      .setZone('America/Argentina/Buenos_Aires', { keepLocalTime: true });
  }

  addInterval(currentTime: DateTime, interval: number): DateTime {
    return currentTime.plus({ minutes: interval });
  }

  getDayOfWeek(date: Date): EDayOfWeek {
    const dayOfWeek = date.getDay();
    switch (dayOfWeek) {
      case 0:
        return EDayOfWeek.SUNDAY;
      case 1:
        return EDayOfWeek.MONDAY;
      case 2:
        return EDayOfWeek.TUESDAY;
      case 3:
        return EDayOfWeek.WEDNESDAY;
      case 4:
        return EDayOfWeek.THURSDAY;
      case 5:
        return EDayOfWeek.FRIDAY;
      case 6:
        return EDayOfWeek.SATURDAY;
      default:
        throw new Error('Invalid day of the week');
    }
  }

  public calculateAvailableMinutes(
    startTime: string,
    endTime: string,
    startRest?: string,
    endRest?: string,
  ): number {
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);

    if (startRest && endRest) {
      const startRestMinutes = this.timeToMinutes(startRest);
      const endRestMinutes = this.timeToMinutes(endRest);

      return endMinutes - startMinutes - (endRestMinutes - startRestMinutes);
    }

    return endMinutes - startMinutes;
  }
}
