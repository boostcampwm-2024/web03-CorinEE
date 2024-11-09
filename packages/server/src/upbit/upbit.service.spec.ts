import { Test, TestingModule } from '@nestjs/testing';
import { UpbitService } from './upbit.service';

describe('UpbitService', () => {
  let service: UpbitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpbitService],
    }).compile();

    service = module.get<UpbitService>(UpbitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
