import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleHolidaysController } from './schedule-holidays.controller';

describe('ScheduleHolidaysController', () => {
  let controller: ScheduleHolidaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleHolidaysController],
    }).compile();

    controller = module.get<ScheduleHolidaysController>(ScheduleHolidaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
