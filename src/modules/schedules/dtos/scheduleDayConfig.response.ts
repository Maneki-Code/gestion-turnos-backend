import { EDayOfWeek } from "@prisma/client";
import { ScheduleDayRestConfigResponse } from "./scheduleDayRestConfig.response";

export interface ScheduleDayConfigResponse {
  id: number;
  day: EDayOfWeek;
  startTime: string;
  endTime: string;
  slotInterval: number;
  status: boolean;
  rests: ScheduleDayRestConfigResponse[];
}