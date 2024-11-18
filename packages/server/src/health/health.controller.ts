import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200) // HTTP 상태 코드 200을 설정
  checkHealth(): string {
    return 'ok';
  }
}
