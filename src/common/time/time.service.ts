import { Injectable } from "@nestjs/common";
import { EDayOfWeek } from "@prisma/client";
import { DateTime } from 'luxon';  // Importamos Luxon

@Injectable()
export class TimeService {
  
  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

 /*  hasOverlap(startTimes: string[], endTimes: string[]): boolean {
    const intervals = startTimes.map((startTime, index) => ({
      start: this.timeToMinutes(startTime),
      end: this.timeToMinutes(endTimes[index]),
    }));

    intervals.sort((a, b) => a.start - b.start);

    for (let i = 0; i < intervals.length - 1; i++) {
      if (intervals[i].end > intervals[i + 1].start) {
        return true;
      }
    }
    return false;
  }

  hasOverlapSimple(startTime: string, endTime: string): boolean {
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    return start < end;
  }

  isValidSchedule(startTimes: string[], endTimes: string[]): boolean {
    for (let i = 0; i < startTimes.length; i++) {
      const start = this.timeToMinutes(startTimes[i]);
      const end = this.timeToMinutes(endTimes[i]);
      
      if (start >= end) {
        return false;
      }
    }
    return true;  
  } */

  convertToDate(date: Date, time: string): DateTime {
    console.log(`TIME RECIBIDO: "${time}"`);
    return DateTime.fromFormat(time, "HH:mm", { zone: "America/Argentina/Buenos_Aires" })
      .set({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      });
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
    endRest?: string
  ): number {

    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
  
    if (startRest && endRest) {
      const startRestMinutes = this.timeToMinutes(startRest);
      const endRestMinutes = this.timeToMinutes(endRest);
  
      return (endMinutes - startMinutes) - (endRestMinutes - startRestMinutes);
    }
  
    return endMinutes - startMinutes;
  }
}
