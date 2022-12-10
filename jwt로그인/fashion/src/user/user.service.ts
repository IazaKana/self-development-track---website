import { Injectable } from '@nestjs/common';
import { User, UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(private readonly userMapper: UserMapper) {}

  async getUser(email: string): Promise<User> {
    return this.userMapper.findUserByEmail(email);
  }

  async createUser(user: User): Promise<User> {
    return this.userMapper.insertUser(user);
  }
}
