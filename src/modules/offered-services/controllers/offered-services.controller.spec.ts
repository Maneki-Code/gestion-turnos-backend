import { Test, TestingModule } from '@nestjs/testing';
import { OfferedServicesController } from './offered-services.controller';

describe('OfferedServicesController', () => {
  let controller: OfferedServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferedServicesController],
    }).compile();

    controller = module.get<OfferedServicesController>(OfferedServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
