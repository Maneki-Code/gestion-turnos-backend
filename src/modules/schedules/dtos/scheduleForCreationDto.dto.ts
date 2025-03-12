import { EDayOfWeek } from "@prisma/client";

export class ScheduleForCreationDto{
  userEmail: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  slotInterval: number;
  days: EDayOfWeek[]
}

