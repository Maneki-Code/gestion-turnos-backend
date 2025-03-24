import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleValidationService } from './schedule-validation.service';

describe('ScheduleValidationService', () => {
  let service: ScheduleValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleValidationService],
    }).compile();

    service = module.get<ScheduleValidationService>(ScheduleValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
