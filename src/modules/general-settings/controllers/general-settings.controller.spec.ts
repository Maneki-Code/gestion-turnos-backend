import { Test, TestingModule } from '@nestjs/testing';
import { GeneralSettingsController } from './general-settings.controller';

describe('GeneralSettingsController', () => {
  let controller: GeneralSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralSettingsController],
    }).compile();

    controller = module.get<GeneralSettingsController>(GeneralSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
