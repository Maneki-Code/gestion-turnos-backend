import { AppointmentStatus } from "@prisma/client";
import { CustomerResponse } from "src/modules/customers/dtos/customer.response";

export interface AppointmentResponse {
  id: number;
  startTime: String;
  endTime: String;
  date: String;
  status: AppointmentStatus;
  serviceTitle: String;
  servicePrice: number;
  serviceDescription?: String;
  customer?: CustomerResponse;
}