import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { CustomersService } from 'src/modules/customers/services/customers.service';
import { AppointmentForCreationDto } from '../dtos/appointmentForCreationDto.dto';
import { Appointment, AppointmentStatus } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { AppointmentValidationService } from 'src/common/validations/services/appointment-validation.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _customer: CustomersService,
    private readonly _time: TimeService,
    private readonly _appointmentValidation:AppointmentValidationService
  ) {}

  async create(request: AppointmentForCreationDto): Promise<void> {
    const appointmentDate = this._time.convertStringToDate(request.date);
    await this._appointmentValidation.validateAppointmentTimes(request);
    await this._appointmentValidation.validateAppointmentAvailability(request, appointmentDate);
    await this._appointmentValidation.validateAppointmentNotOverlapRest(request, appointmentDate);
    
    let customerFound = await this._customer.findByPhoneNumber(
      request.customer.phoneNumber,
    );

    if (!customerFound) {
      customerFound = await this._customer.create(request.customer);
    }

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

}
