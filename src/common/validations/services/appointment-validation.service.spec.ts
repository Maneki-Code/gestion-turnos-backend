import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentValidationService } from './appointment-validation.service';

describe('AppointmentValidationService', () => {
  let service: AppointmentValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentValidationService],
    }).compile();

    service = module.get<AppointmentValidationService>(AppointmentValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
