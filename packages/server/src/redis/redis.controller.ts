import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisRepository: RedisRepository) {}

  @Get(':key')
  async getValue(@Param('key') key: string): Promise<string | null> {
    return await this.redisRepository.get(key);
  }

  @Post()
  async setValue(
    @Body() body: { key: string; value: string; ttl?: number },
  ): Promise<string> {
    const { key, value, ttl } = body;
    return await this.redisRepository.set(key, value, ttl);
  }
  @Delete(':key')
  async deleteKey(@Param('key') key: string): Promise<number> {
    return await this.redisRepository.delete(key);
  }

  @Get(':key/exists')
  async checkExists(@Param('key') key: string): Promise<boolean> {
    const result = await this.redisRepository.exists(key);
    return result === 1;
  }
}
