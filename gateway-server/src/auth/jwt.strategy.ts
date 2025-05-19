import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';


const cookieExtractor = (req) => {
  return req?.cookies?.Authentication;
};



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
       jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // 디버깅을 위한 로그 추가
    console.log('JWT Strategy - Payload 검사:');
    console.log('Payload 값 :', payload);
    
    if (!payload) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    
    // 변경된 User 스키마에 맞게 사용자 정보 매핑
    return {
      userId: payload.U_ID,          // 고유 ID
      loginId: payload.U_LoginID,    // 로그인 ID
      role: payload.U_Role,          // 역할 (단일 값)
    };
  }
}