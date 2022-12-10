import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserMapper, UserService],
  exports: [UserService, UserMapper],
})
export class UserModule {}
