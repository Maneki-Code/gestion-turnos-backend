import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { ScheduleForUpdateDto } from '../dtos/scheduleForUpdateDto.dto';
import { ScheduleDayConfigService } from './schedule-day-config.service';
import { EDayOfWeek } from '@prisma/client';
import { ScheduleResponse } from '../dtos/schedule.response';
import { ScheduleMapperService } from 'src/common/mappers/services/schedule-mapper.service';
import { ScheduleDayConfigResponse } from '../dtos/scheduleDayConfig.response';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _schedulesDayConfig: ScheduleDayConfigService,
    private readonly _mapper: ScheduleMapperService,
  ) { }

  async create(userId: number): Promise<void> {
    const createdSchedule = await this._prisma.schedule.create({
      data: {
        userId: userId,
      },
    });
    if (!createdSchedule)
      throw new BadRequestException(
        `Algo salió mal al crear la agenda asociada al usuario.`,
      );

    for (const day of Object.values(EDayOfWeek)) {
      await this._schedulesDayConfig.create(createdSchedule.id, day);
    }
  }

  async findByEmailConfigResponse(email: string) {
    const schedule = await this._prisma.schedule.findFirst({
      where: {
        user: {
          email,
        },
      },
      include: {
        scheduleDays: {
          include: {
            rests: true,
          },
        },
        appointments: true,
      },
    });

    if (!schedule)
      throw new NotFoundException(
        `Agenda no encontrada para el usuario con email ${email}`,
      );

    return await this._mapper.scheduleToConfigResponse(
      schedule,
      schedule.scheduleDays,
    );
  }

  async findByEmailFullResponse(email: string): Promise<ScheduleResponse> {
    const schedule = await this._prisma.schedule.findFirst({
      where: {
        user: {
          email,
        },
      },
      include: {
        scheduleDays: {
          include: {
            rests: true,
          },
        },
        appointments: true,
      },
    });
    if (!schedule)
      throw new NotFoundException(
        `Agenda no encontrada para el usuario con email ${email}`,
      );
    return await this._mapper.scheduleToFullResponse(
      schedule,
      schedule.scheduleDays,
    );
  }

  async updateConfig(request: ScheduleForUpdateDto) {
    const scheduleFound = await this.findFullById(request.id);

    if (!scheduleFound)
      throw new NotFoundException(`Agenda con id ${request.id} no encontrada`);

    for (const day of request.scheduleDays) {
      await this._schedulesDayConfig.updateDayConfig(day);
    }
    return await this._mapper.scheduleToConfigResponse(
      scheduleFound,
      scheduleFound.scheduleDays,
    );
  }

  async findFullById(id: number) {
    return await this._prisma.schedule.findUnique({
      where: {
        id,
      },
      include: {
        scheduleDays: {
          include: {
            rests: true,
          },
        },
        appointments: true,
      },
    });
  }


  async getStatsByHour(email: string, months: number): Promise<{ hour: string; count: number }[]> {
    const user = await this._prisma.user.findFirst({ where: { email } });
  
    if (!user) throw new NotFoundException(`Usuario no encontrado con email ${email}`);
  
    let fromDate: Date;
    
    if (months === 99) {
      // Histórico: desde que se creó el usuario hasta hoy
      fromDate = new Date(user.createdAt);
    } else {
      // Desde hoy hacia atrás X meses
      fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - months);
    }
  
    const toDate = new Date(); // Siempre hasta hoy
    const schedule = await this._prisma.schedule.findFirst({
      where: { user: { email } },
      include: {
        scheduleDays: true,
        appointments: {
          where: {
            date: {
              gte: fromDate,
              lte: toDate,
            },
            status: 'TERMINADO',
          },
        },
      },
    });
    console.log('Desde:', fromDate.toISOString(), 'Hasta:', toDate.toISOString());

    if (!schedule) throw new NotFoundException(`Agenda no encontrada para ${email}`);
  
    const minInterval = Math.min(...schedule.scheduleDays.map(day => day.slotInterval));
  
    const activeDays = schedule.scheduleDays.filter(d => d.status);
  
    const fromMinutes = Math.min(...activeDays.map(day => {
      const [h, m] = day.startTime.split(':').map(Number);
      return h * 60 + m;
    }));
  
    const toMinutes = Math.max(...activeDays.map(day => {
      const [h, m] = day.endTime.split(':').map(Number);
      return h * 60 + m;
    }));
  
    const slotMap: Record<string, number> = {};
  
    for (let minutes = fromMinutes; minutes < toMinutes; minutes += minInterval) {
      const h = Math.floor(minutes / 60).toString().padStart(2, '0');
      const m = (minutes % 60).toString().padStart(2, '0');
      const key = `${h}:${m}`;
      slotMap[key] = 0;
    }
  
    for (const appointment of schedule.appointments) {
      const date = new Date(`${appointment.date.toISOString().split('T')[0]}T${appointment.startTime}`);
      const totalMinutes = date.getHours() * 60 + date.getMinutes();
      const rounded = Math.floor(totalMinutes / minInterval) * minInterval;
      const h = Math.floor(rounded / 60).toString().padStart(2, '0');
      const m = (rounded % 60).toString().padStart(2, '0');
      const key = `${h}:${m}`;
  
      if (slotMap[key] !== undefined) {
        slotMap[key]++;
      }
    }
  
    return Object.entries(slotMap)
      .sort(([a], [b]) => {
        const [ha, ma] = a.split(':').map(Number);
        const [hb, mb] = b.split(':').map(Number);
        return ha * 60 + ma - (hb * 60 + mb);
      })
      .map(([hour, count]) => ({ hour, count }));
  }
  

}
