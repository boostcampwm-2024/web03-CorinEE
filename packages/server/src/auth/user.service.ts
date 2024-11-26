import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserNotFoundException } from './exceptions/user.exceptions';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  // validateUser도 여기로 이동
}
