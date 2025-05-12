import { Test, TestingModule } from '@nestjs/testing';
import { OfferedServicesMapperService } from './offered-services-mapper.service';

describe('OfferedServicesMapperService', () => {
  let service: OfferedServicesMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferedServicesMapperService],
    }).compile();

    service = module.get<OfferedServicesMapperService>(OfferedServicesMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
