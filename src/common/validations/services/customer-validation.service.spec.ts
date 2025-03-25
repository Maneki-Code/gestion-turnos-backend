import { Test, TestingModule } from '@nestjs/testing';
import { CustomerValidationService } from './customer-validation.service';

describe('CustomerValidationService', () => {
  let service: CustomerValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerValidationService],
    }).compile();

    service = module.get<CustomerValidationService>(CustomerValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
