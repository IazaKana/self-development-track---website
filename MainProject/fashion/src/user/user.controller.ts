import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './user.mapper';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @Description - 유저를 생성하는 API
   * @param user - { "email": "email", "password": "password", "name": "name", "role": "role" }형식에 맞게 유저정보를 받는다.
   */
  @Post()
  async createUser(@Body() user: User) {
    return this.userService.createUser(user);
  }

  /**
   * @description - 유저 정보를 조회하는 API
   * @param req - 마찬가지로 Bearer Token을 통해 유저 정보를 가져온다.
   * @returns - { "id": id, "email": "email", "password": "password", "name": "name", "role": "role" }형식에 맞게 유저정보를 반환한다.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req) {
    const user = this.userService.getUser(req.user.email);
    if (user) {
      return user;
    }
    return { message: 'User not found' };
  }
}
