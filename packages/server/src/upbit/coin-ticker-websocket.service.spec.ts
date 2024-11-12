import { Test, TestingModule } from '@nestjs/testing';
import { CoinTickerService } from './coin-ticker-websocket.service';

describe('CoinTickerService', () => {
  let service: CoinTickerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoinTickerService],
    }).compile();

    service = module.get<CoinTickerService>(CoinTickerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
