import { AppointmentStatus } from "@prisma/client";

export interface AppointmentResponse{
  id: number,
  startTime: string,
  endTime: string,
  description: string | null,
  status: AppointmentStatus,
  customerId: number | null,
}