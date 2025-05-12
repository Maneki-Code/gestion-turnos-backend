import { EUserRole } from "@prisma/client";
import { OfferedServiceResponse } from "src/modules/offered-services/dtos/offeredService.response";

export interface UserResponse{
  id: number,
  firstName: string,
  lastname: string,
  email:string,
  role: EUserRole,
  offeredServices: OfferedServiceResponse[]
}