import { AppointmentStatus, EDayOfWeek } from '@prisma/client';

export interface ScheduleResponse {
  id: number;
  daysConfig: ScheduleDayConfigResponse[];
  appointments: AppointmentResponse[];
}

export interface ScheduleDayConfigResponse {
  id: number;
  day: EDayOfWeek;
  startTime: string;
  endTime: string;
  slotInterval: number;
  status: Boolean;
  rests: ScheduleDayRestConfigResponse[];
}

export interface AppointmentResponse {
  id: number;
  startTime: String;
  endTime: String;
  date: String;
  status: AppointmentStatus;
  description?: string;
  customer?: CustomerResponse;
}

export interface ScheduleDayRestConfigResponse {
  id: number;
  startTime: String;
  endTime: String;
}

export interface CustomerResponse{
  id: number;
  firstName: string;
  lastName: string;
  phoneNumbeR: string;
  email?: string;
}