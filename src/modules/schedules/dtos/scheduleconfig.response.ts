import { ScheduleDayConfigResponse } from "./scheduleDayConfig.response";

export interface ScheduleConfigResponse {
  id: number;
  daysConfig: ScheduleDayConfigResponse[];
}
