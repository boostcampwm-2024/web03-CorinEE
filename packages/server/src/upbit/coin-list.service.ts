import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CoinListService {
  constructor(private readonly httpService: HttpService) {}

  async getCoinList() {
    const response = await firstValueFrom(
      this.httpService.get('https://api.upbit.com/v1/market/all?is_details=true')
    );
    return response.data;
  }
}