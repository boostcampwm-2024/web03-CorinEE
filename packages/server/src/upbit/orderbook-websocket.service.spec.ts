import { Test, TestingModule } from '@nestjs/testing';
import { OrderbookService } from './orderbook-websocket.service';

describe('OrderbookService', () => {
  let service: OrderbookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderbookService],
    }).compile();

    service = module.get<OrderbookService>(OrderbookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
