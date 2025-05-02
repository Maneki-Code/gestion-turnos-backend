import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleMapperService } from './schedule-mapper.service';

describe('ScheduleMapperService', () => {
  let service: ScheduleMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleMapperService],
    }).compile();

    service = module.get<ScheduleMapperService>(ScheduleMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
