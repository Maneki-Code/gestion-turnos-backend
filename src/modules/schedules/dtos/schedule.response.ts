import { ScheduleDayConfigResponse } from './scheduleDayConfig.response';
import { AppointmentResponse } from 'src/modules/appointments/dtos/appointment.response';

export interface ScheduleResponse {
  id: number;
  daysConfig: ScheduleDayConfigResponse[];
  appointments: AppointmentResponse[];
}
