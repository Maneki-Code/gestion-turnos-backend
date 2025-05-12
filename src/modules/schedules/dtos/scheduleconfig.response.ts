import { ScheduleDayConfigResponse } from "./scheduleDayConfig.response";
import { ScheduleHolidayResponse } from "./scheduleHoliday.response";

export interface ScheduleConfigResponse {
  id: number;
  daysConfig: ScheduleDayConfigResponse[];
  holidays: ScheduleHolidayResponse[];
}
