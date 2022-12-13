import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey',
    });
  }

  /**
   * @description - JWT 토큰을 검증 및 유저 정보를 반환한다.
   */
  async validate(payload: any) {
    const user = await this.authService.validateUser(
      payload.email,
      payload.password,
    );

    if (user) {
      return { id: user.id, email: payload.email, role: user.role };
    }
    return null;
  }
}
