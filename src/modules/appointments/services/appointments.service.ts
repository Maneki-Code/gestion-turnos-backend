import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { CustomersService } from 'src/modules/customers/services/customers.service';
import { AppointmentForCreationDto } from '../dtos/appointmentForCreationDto.dto';
import { Appointment, AppointmentStatus, OfferedService } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { AppointmentValidationService } from 'src/common/validations/services/appointment-validation.service';
import { AppointmentResponse } from '../dtos/appointment.response';
import { AppointmentMapperService } from 'src/common/mappers/services/appointment-mapper.service';
import { NotFoundError } from 'rxjs';
import { OfferedServicesService } from 'src/modules/offered-services/services/offered-services.service';

@Injectable()
export class AppointmentsService {
  
  
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _customer: CustomersService,
    private readonly _time: TimeService,
    private readonly _offeredService: OfferedServicesService,
    private readonly _appointmentValidation:AppointmentValidationService,
    private readonly _appointmentMapper: AppointmentMapperService
  ) {}

  async createBulk(request: AppointmentForCreationDto[]): Promise<AppointmentResponse[]> {
    const appointmentResponses: AppointmentResponse[] = [];
    for (const appointment of request) {
      const offeredService = await this._offeredService.findById(appointment.serviceId);
      const appointmentDate = this._time.convertStringToDate(appointment.date);
  
      await this._appointmentValidation.validateAppointmentTimes(appointment);
      await this._appointmentValidation.validateAppointmentAvailability(appointment, appointmentDate);
      await this._appointmentValidation.validateAppointmentNotOverlapRest(appointment, appointmentDate);
  
      let customerFound = await this._customer.findByPhoneNumber(appointment.customer.phoneNumber);
  
      if (!customerFound) {
        customerFound = await this._customer.create(appointment.customer);
      }
  
      const appointmentCreated = await this._prisma.appointment.create({
        data: {
          status: AppointmentStatus.RESERVADO,
          servicePrice: offeredService.price,
          serviceTitle: offeredService.title,
          serviceDescription: offeredService.description ?? null,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          date: appointmentDate,
          customerId: customerFound.id,
          scheduleId: appointment.scheduleId,
        },
        include: {
          customer: true, 
        },
      });
  
      if (!appointmentCreated) {
        throw new BadRequestException('Algo salió mal al crear la reserva.');
      }
  
      appointmentResponses.push(this._appointmentMapper.AppointmentToFullResponse(appointmentCreated));
    }
    return appointmentResponses;
  }


  async create(request: AppointmentForCreationDto): Promise<AppointmentResponse> {
    const offeredService = await this._offeredService.findById(request.serviceId);
    const appointmentDate = this._time.convertStringToDate(request.date);
  
    await this._appointmentValidation.validateAppointmentTimes(request);
    await this._appointmentValidation.validateAppointmentAvailability(request, appointmentDate);
    await this._appointmentValidation.validateAppointmentNotOverlapRest(request, appointmentDate);
  
    let customerFound = await this._customer.findByPhoneNumber(request.customer.phoneNumber);
  
    if (!customerFound) {
      customerFound = await this._customer.create(request.customer);
    }
  
    const appointmentCreated = await this._prisma.appointment.create({
      data: {
        status: AppointmentStatus.RESERVADO,
        servicePrice: offeredService.price,
        serviceTitle: offeredService.title,
        serviceDescription: offeredService.description ?? null,
        startTime: request.startTime,
        endTime: request.endTime,
        date: appointmentDate,
        customerId: customerFound.id,
        scheduleId: request.scheduleId,
      },
      include: {
        customer: true, 
      },
    });
  
    if (!appointmentCreated) {
      throw new BadRequestException('Algo salió mal al crear la reserva.');
    }
  
    return this._appointmentMapper.AppointmentToFullResponse(appointmentCreated);
  }
  
  async findAllBetweenDates(id: number, startDate: string, endDate: string): Promise<AppointmentResponse[]> {
    const start = this._time.convertStringToDate(startDate);
    const end = this._time.convertStringToDate(endDate);

    if (!start.isValid || !end.isValid) {
      throw new BadRequestException("Fechas inválidas, usa el formato YYYY-MM-DD");
    }

    const appointments = await this._prisma.appointment.findMany({
      where: {
        scheduleId: id,
        date: {
          gte: start.toISO(),
          lte: end.toISO(),
        },
      },
      orderBy: {
        date: "asc", 
      },
      include:{
        customer: true
      }
    });

    return appointments.map(appointment=> this._appointmentMapper.AppointmentToFullResponse(appointment))
  }

  async findOneById(id: number): Promise<Appointment | null>{
    return this._prisma.appointment.findUnique({
      where:{
        id
      }
    })
  }

  async updateStatus(id: number, status: AppointmentStatus) {
    const newStatus = this._appointmentValidation.validateStatusOrThrow(status);
    const appointmentFound = await this.findOneById(id);

    if(appointmentFound === null) throw new NotFoundException(`Turno no encontrado.`);
    
    await this._prisma.appointment.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  async deleteById(id: number) {
    const appointmentFound = await this.findOneById(id);

    if(appointmentFound === null) throw new NotFoundException(`Turno no encontrado.`);

    await this._prisma.appointment.delete({where:{id}});
  }
}
