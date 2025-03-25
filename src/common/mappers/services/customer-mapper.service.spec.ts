import { Test, TestingModule } from '@nestjs/testing';
import { CustomerMapperService } from './customer-mapper.service';

describe('CustomerMapperService', () => {
  let service: CustomerMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerMapperService],
    }).compile();

    service = module.get<CustomerMapperService>(CustomerMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
