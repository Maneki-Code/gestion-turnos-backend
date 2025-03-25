import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { CustomersService } from 'src/modules/customers/services/customers.service';
import { AppointmentForCreationDto } from '../dtos/appointmentForCreationDto.dto';
import { Appointment, AppointmentStatus } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _customer: CustomersService,
    private readonly _time: TimeService
  ) {}

  async create(request: AppointmentForCreationDto): Promise<void> {
    let customerFound = await this._customer.findByPhoneNumber(
      request.customer.phoneNumber,
    );

    if (!customerFound) {
      customerFound = await this._customer.create(request.customer);
    }

    /*Validar disponibilidad de turno */
    const appointmentDate = this._time.convertStringToDate(request.date);

    const appointmentCreated = await this._prisma.appointment.create({
      data: {
        status: AppointmentStatus.RESERVADO,
        description: request.description ?? null,
        startTime: request.startTime,
        endTime: request.endTime,
        date: appointmentDate,
        customerId: customerFound.id,
        scheduleId: request.scheduleId,
      },
    }); 

    if (!appointmentCreated)
      throw new BadRequestException(`Algo salió mal al crear la reserva.`); 
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

  /* async validateAppointmentAvailability(request: AppointmentForCreationDto) {
    const appointmentFound =
      await this.findByScheduleIdAndDateAndStartTimeAndEndTime(
        request.scheduleId,
        request.date,
        request.startTime,
        request.endTime,
      );
    if(appointmentFound) throw new BadRequestException(`Ya existe un turno para el día ${request.date.toISOString} a las ${request.startTime}`);

    const dayOfWeek = this._time.getDayOfWeek(request.date);

    const scheduleDayRestConfigs = await this._prisma.scheduleDayRestConfig.findMany({
      where: {
        scheduleDay: {
          scheduleId: request.scheduleId,
          day: dayOfWeek,
        },
      },
    });

    for (const restConfig of scheduleDayRestConfigs) {
      if (
        this.isTimeBetween(request.startTime, restConfig.startTime, restConfig.endTime) ||
        this.isTimeBetween(request.endTime, restConfig.startTime, restConfig.endTime)
      ) {
        throw new BadRequestException(
          `El horario de inicio o fin está dentro del horario de descanso (de ${restConfig.startTime} a ${restConfig.endTime})`,
        );
      }
    }
    
  }

  private isTimeBetween(time: string, startTime: string, endTime: string): boolean {
    return time >= startTime && time <= endTime;
  } */
}
