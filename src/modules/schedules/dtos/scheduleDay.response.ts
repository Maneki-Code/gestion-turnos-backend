import { EDayOfWeek } from "@prisma/client";
import { AppointmentResponse } from "src/modules/appointments/dtos/appointment.response";

export interface ScheduleDayResponse{
  id: number,
  day: EDayOfWeek,
  date: string,
  startTime: string,
  endTime: string,
  slotInterval: number,
  appointments: AppointmentResponse[]
}