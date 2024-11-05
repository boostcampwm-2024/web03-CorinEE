import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UserRepository]
})

export class AuthModule {}