import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/user/user.mapper';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @description - 로그인 API
   * @param user - { "email": "email", "password": "password" }와 같이 이메일과 비밀번호를 넘겨 줘야 함
   * @returns { "access-token": "token" }와 같이 토큰을 반환 함
   */
  @Post('login')
  async login(@Body() user: User) {
    const data = await this.authService.login(user);
    if (data) {
      return data;
    }
    return { message: 'Invalid credentials' };
  }

  /**
   * @description - 인증된 사용자인지 확인하는 API
   * @param req 헤더로 "Authorization: Bearer Token" 값을 넘겨주면 됨
   * @returns { "id": "user_pk", "email": "email", "role": "role" }와 같이 이메일과 권한정보를 반환 함
   */
  @UseGuards(JwtAuthGuard)
  @Get('isAuth')
  async isAuthenticated(@Req() req) {
    return req.user;
  }
}
