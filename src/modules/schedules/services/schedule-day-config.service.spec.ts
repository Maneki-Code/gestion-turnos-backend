import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleDayConfigService } from './schedule-day-config.service';

describe('ScheduleDayConfigService', () => {
  let service: ScheduleDayConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleDayConfigService],
    }).compile();

    service = module.get<ScheduleDayConfigService>(ScheduleDayConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
