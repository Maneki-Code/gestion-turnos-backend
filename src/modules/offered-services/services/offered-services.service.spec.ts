import { Test, TestingModule } from '@nestjs/testing';
import { OfferedServicesService } from './offered-services.service';

describe('OfferedServicesService', () => {
  let service: OfferedServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferedServicesService],
    }).compile();

    service = module.get<OfferedServicesService>(OfferedServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
