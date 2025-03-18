import { AppointmentStatus } from "@prisma/client";
import { CustomerResponse } from "src/modules/customers/dtos/customer.response";

export interface AppointmentResponse {
  id: number;
  startTime: String;
  endTime: String;
  date: String;
  status: AppointmentStatus;
  description?: string;
  customer?: CustomerResponse;
}