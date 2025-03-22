import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {  EDayOfWeek, ScheduleDayConfig, ScheduleDayRestConfig } from '@prisma/client';
import { TimeService } from 'src/common/time/time.service';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleDayRestConfigService } from './schedule-day-rest-config.service';
import { ScheduleDayConfigResponse } from '../dtos/scheduleDayConfig.response';
import { ScheduleDayConfigForUpdateDto } from '../dtos/scheduleDayForUpdateDto.dto';
import { ScheduleDayRestForUpdateDto } from '../dtos/ScheduleDayRestForUpdateDto.dto';

@Injectable()
export class ScheduleDayConfigService {
  
  constructor(
      private readonly _prisma: PrismaService,
      private readonly _time: TimeService,
      private readonly _rest: ScheduleDayRestConfigService
    ) {}

  async create(scheduleId: number, day: EDayOfWeek) {
    const createdScheduleDay = await this._prisma.scheduleDayConfig.create({
      data:{
        scheduleId: scheduleId,
        day: day,
        startTime: '09:00',
        endTime: '18:00',
        slotInterval: 60,
        status: false
      }
    })

    if(!createdScheduleDay) throw new BadRequestException(`Algo salió mal al crear el día ${day} asociada a la agenda.`);
    await this._rest.create(createdScheduleDay.id, '12:00', '13:00');
  }

  async findAllSchedulesByScheduleId(id: number): Promise<ScheduleDayConfig[]> {
    return await this._prisma.scheduleDayConfig.findMany({
      where:{
        scheduleId: id
      }
    })
  }

  async findDayById(id: number):Promise<ScheduleDayConfig | null>{
    return await this._prisma.scheduleDayConfig.findUnique({
      where: {
        id
      }
    })
  }

  async updateDayConfig(day: ScheduleDayConfigForUpdateDto) {
    const dayFound = await this.findDayById(day.id);

    if(!dayFound) throw new NotFoundException(`Día con id: ${day.id} no encontrado`)

    /* Verificar si existen turnos en ese horario */

    this.validateScheduleDay(day, dayFound);

    const currentDbRests = await this._rest.findAllRestsByScheduleDayConfigId(dayFound.id);

    await this.deleteOrphans(day.rests, currentDbRests);

    for(const rest of day.rests){
      if(rest.id!=null){
        await this._rest.update(rest);
      }else{
        await this._rest.create(dayFound.id, rest.startRest, rest.endRest);
      }
    }

    const updatedDay = await this._prisma.$transaction(async (tx) => {
      const updatedScheduleDay = await tx.scheduleDayConfig.update({
        where: { id: day.id },
        data: {
          startTime: day.startTime ?? dayFound.startTime,
          endTime: day.endTime ?? dayFound.endTime,
          slotInterval: day.slotInterval ?? dayFound.slotInterval,
          status: day.status ?? dayFound.status,
        },
      });
      return updatedScheduleDay;
    });
  }

  async deleteOrphans(req: ScheduleDayRestForUpdateDto[], currentDbRests: ScheduleDayRestConfig[]): Promise<void>{
    for(const rest of currentDbRests){
      const existsInReq = req.some(r => r.id === rest.id);
      if(!existsInReq)
        await this._rest.deleteById(rest.id);
    }
  }

  validateScheduleDay(newDay: ScheduleDayConfigForUpdateDto, day: ScheduleDayConfig) {
    const startTime = newDay.startTime ?? day.startTime;
    const endTime = newDay.endTime ?? day.endTime;
    const slotInterval = newDay.slotInterval ?? day.slotInterval;
  
    this._rest.validateRests(startTime, endTime, slotInterval, newDay.rests)

    // Convertir a minutos usando timeToMinutes
    const startMinutes = this._time.timeToMinutes(startTime);
    const endMinutes = this._time.timeToMinutes(endTime);

    // Validación de horarios
    if (startMinutes > endMinutes) {
        throw new BadRequestException('El horario de inicio no puede ser posterior al horario de fin');
    }

    if (endMinutes < startMinutes) {
        throw new BadRequestException('El horario de fin no puede ser anterior al horario de inicio');
    }

  }

  async scheduleDayToFullResponse(day: ScheduleDayConfig): Promise<ScheduleDayConfigResponse> {
    const rests = await this._rest.findAllRestsByScheduleDayConfigId(day.id);
    
    return {
      id: day.id,
      day: day.day,
      startTime: day.startTime,
      endTime: day.endTime,
      slotInterval: day.slotInterval,
      status: day.status,
      rests: rests.map(rest => this._rest.restToFullResponse(rest))
    }
  }

  async scheduleDayToScheduleDayForUpdate(day: ScheduleDayConfig): Promise<ScheduleDayConfigForUpdateDto> {
    const rests = await this._rest.findAllRestsByScheduleDayConfigId(day.id);
    return {
      id: day.id,
      day: day.day,
      startTime: day.startTime,
      endTime: day.endTime,
      slotInterval: day.slotInterval,
      status: day.status,
      rests: rests.map(rest => this._rest.restToScheduleDayRestForUpdate(rest))
    }
  }

}
