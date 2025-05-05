import { EUserRole } from "@prisma/client";

export interface UserResponse{
  id: number,
  firstName: string,
  lastname: string,
  email:string,
  role: EUserRole
}