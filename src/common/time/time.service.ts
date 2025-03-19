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
        return EDayOfWeek.LUNES;
      case 1:
        return EDayOfWeek.MARTES;
      case 2:
        return EDayOfWeek.MIÉRCOLES;
      case 3:
        return EDayOfWeek.JUEVES;
      case 4:
        return EDayOfWeek.VIERNES;
      case 5:
        return EDayOfWeek.SÁBADO;
      case 6:
        return EDayOfWeek.DOMINGO;
      default:
        throw new Error('Invalid day of the week');
    }
  }

  public calculateAvailableMinutes(
    startTime: string,
    endTime: string,
    rests: { start: string; end: string }[] = []
  ): number {
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    
    let totalRestMinutes = 0;
  
    for (const rest of rests) {
      if (rest.start && rest.end) {
        const startRestMinutes = this.timeToMinutes(rest.start);
        const endRestMinutes = this.timeToMinutes(rest.end);
        totalRestMinutes += (endRestMinutes - startRestMinutes);
      }
    }
  
    return endMinutes - startMinutes - totalRestMinutes;
  }
  
  // método que convierte un time string en un DateTime de Luxon
  convertTimeToLuxonDate(time: string): DateTime {
    const isValidTime = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(time);
    if (!isValidTime) {
      throw new BadRequestException('El formato de hora no es válido. Debe ser HH:mm');
    }
    
    const [hours, minutes] = time.split(':').map(Number);
    
    return DateTime.fromObject({ hour: hours, minute: minutes }).setZone('America/Argentina/Buenos_Aires');
  }
}
