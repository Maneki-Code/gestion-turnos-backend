import { ScheduleDayConfigResponse } from "./scheduleDayConfig.response";

export interface ScheduleResponse {
  id: number;
  daysConfig: ScheduleDayConfigResponse[];
}
