import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Appointment, AppointmentStatus, EDayOfWeek } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { AppointmentForCreationDto } from 'src/modules/appointments/dtos/appointmentForCreationDto.dto';
import { DateTime } from 'luxon'; // Importamos Luxon

@Injectable()
export class AppointmentValidationService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _time: TimeService,
  ) {}

  async validateAppointmentAvailability(
    request: AppointmentForCreationDto,
    date: DateTime,
  ) {
    const appointmentFound =
      await this.findByScheduleIdAndDateAndStartTimeAndEndTime(
        request.scheduleId,
        date,
        request.startTime,
        request.endTime,
      );
    if (appointmentFound)
      throw new BadRequestException(
        `Ya existe un turno para el día ${date} a las ${request.startTime}`,
      );
  }

  private isTimeBetween(
    time: string,
    startTime: string,
    endTime: string,
  ): boolean {
    return time >= startTime && time < endTime;
  }

  async findByScheduleIdAndDateAndStartTimeAndEndTime(
    scheduleId: number,
    date: Date,
    startTime: string,
    endTime: string,
  ): Promise<Appointment | null> {
    return await this._prisma.appointment.findFirst({
      where: {
        scheduleId: scheduleId,
        date: date,
        startTime: startTime,
        endTime: endTime,
      },
    });
  }

  async validateAppointmentNotOverlapRest(
    request: AppointmentForCreationDto,
    date: DateTime,
  ) {
    const dayOfWeek = this._time.getDayOfWeek(date);
    const scheduleDayRestConfigs =
      await this._prisma.scheduleDayRestConfig.findMany({
        where: {
          scheduleDay: {
            scheduleId: request.scheduleId,
            day: dayOfWeek,
          },
        },
      });

    for (const restConfig of scheduleDayRestConfigs) {
      if (
        this.isTimeBetween(
          request.startTime,
          restConfig.startTime,
          restConfig.endTime,
        ) ||
        this.isTimeBetween(
          request.endTime,
          restConfig.startTime,
          restConfig.endTime,
        )
      ) {
        throw new BadRequestException(
          `El horario de inicio o fin está dentro del horario de descanso (de ${restConfig.startTime} a ${restConfig.endTime})`,
        );
      }
    }
  }

  async validateAppointmentTimes(request: AppointmentForCreationDto) {
    const format = 'HH:mm';

    const startTime = DateTime.fromFormat(request.startTime, format);
    const endTime = DateTime.fromFormat(request.endTime, format);
    console.log('DIA A VALIDAR:', request.date);
    const dayOfWeek = this._time.getDayOfWeek(this._time.convertStringToDate(request.date));
    console.table({
      startTime: startTime.toFormat(format),
      endTime: endTime.toFormat(format),
      dayOfWeek: dayOfWeek,
    });
    const scheduleDayConfig = await this._prisma.scheduleDayConfig.findFirst({
      where:{
        scheduleId: request.scheduleId,
        day: dayOfWeek
      }
    }) 

    if (!startTime.isValid || !endTime.isValid) {
      throw new BadRequestException('Formato de hora inválido. Use HH:mm.');
    }

    if (startTime >= endTime) {
      throw new BadRequestException(
        'El horario de inicio no puede ser igual o superior al horario de fin',
      );
    }

    const durationInMinutes = endTime.diff(startTime, 'minutes').minutes;

    if (durationInMinutes !== scheduleDayConfig?.slotInterval) {
      throw new BadRequestException(
        `El turno debe durar exactamente ${scheduleDayConfig?.slotInterval} minutos.`,
      );
    }
  }

  validateStatusOrThrow(status: string): AppointmentStatus {
    if (!Object.values(AppointmentStatus).includes(status as AppointmentStatus)) {
      throw new BadRequestException(`Status inválido: ${status}`);
    }
    return status as AppointmentStatus;
  }

  async validateAppointmentExistsByDayAfterDate(day: EDayOfWeek, date: DateTime){
    const appointmentsFound = await this._prisma.appointment.findMany({
      where:{
        date: {
          gt: date.toJSDate()
        }
      }
    });
    const exists = appointmentsFound.some(appointment =>this._time.getDayOfWeek(DateTime.fromJSDate(appointment.date).setZone('utc')) === day);
    if (exists) {
      throw new ConflictException(`Existe al menos un turno en un ${day} antes de la fecha proporcionada.`);
    }
  }
}
