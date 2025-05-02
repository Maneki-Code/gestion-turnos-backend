import { Test, TestingModule } from '@nestjs/testing';
import { UserMapperService } from './user-mapper.service';

describe('UserMapperService', () => {
  let service: UserMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMapperService],
    }).compile();

    service = module.get<UserMapperService>(UserMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
