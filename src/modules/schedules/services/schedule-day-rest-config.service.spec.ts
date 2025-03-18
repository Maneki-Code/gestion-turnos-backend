import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleDayRestConfigService } from './schedule-day-rest-config.service';

describe('ScheduleDayRestConfigService', () => {
  let service: ScheduleDayRestConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleDayRestConfigService],
    }).compile();

    service = module.get<ScheduleDayRestConfigService>(ScheduleDayRestConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
