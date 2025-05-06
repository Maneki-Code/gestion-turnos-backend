import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleHolidaysService } from './schedule-holidays.service';

describe('ScheduleHolidaysService', () => {
  let service: ScheduleHolidaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleHolidaysService],
    }).compile();

    service = module.get<ScheduleHolidaysService>(ScheduleHolidaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
