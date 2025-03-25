import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentMapperService } from './appointment-mapper.service';

describe('AppointmentMapperService', () => {
  let service: AppointmentMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentMapperService],
    }).compile();

    service = module.get<AppointmentMapperService>(AppointmentMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
