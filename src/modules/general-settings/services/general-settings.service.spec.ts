import { Test, TestingModule } from '@nestjs/testing';
import { GeneralSettingsService } from './general-settings.service';

describe('GeneralSettingsService', () => {
  let service: GeneralSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralSettingsService],
    }).compile();

    service = module.get<GeneralSettingsService>(GeneralSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
