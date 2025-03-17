import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleDayRestsService } from './schedule-day-rests.service';

describe('ScheduleDayRestsService', () => {
  let service: ScheduleDayRestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleDayRestsService],
    }).compile();

    service = module.get<ScheduleDayRestsService>(ScheduleDayRestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
