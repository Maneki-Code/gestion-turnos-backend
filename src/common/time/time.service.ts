import { BadRequestException, Injectable } from '@nestjs/common';
import { EDayOfWeek } from '@prisma/client';
import { DateTime } from 'luxon'; // Importamos Luxon

@Injectable()
export class TimeService {
  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getDayOfWeek(date: Date | DateTime): EDayOfWeek {
    const dt = date instanceof DateTime ? date : DateTime.fromJSDate(date);
    const utcDate = dt.setZone('utc');
    const dayOfWeek = utcDate.weekday;
  
    switch (dayOfWeek) {
      case 1: return EDayOfWeek.LUNES;
      case 2: return EDayOfWeek.MARTES;
      case 3: return EDayOfWeek.MIÉRCOLES;
      case 4: return EDayOfWeek.JUEVES;
      case 5: return EDayOfWeek.VIERNES;
      case 6: return EDayOfWeek.SÁBADO;
      case 7: return EDayOfWeek.DOMINGO;
      default: throw new Error('Invalid day of the week');
    }
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

  convertStringToDate(date: string): DateTime {
    return DateTime.fromFormat(date, 'yyyy-MM-dd', { zone: 'utc' }); // Devuelve un objeto DateTime
  }
}
